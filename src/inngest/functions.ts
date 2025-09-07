import {inngest} from "@/inngest/client";
import {Sandbox} from "@e2b/code-interpreter";
import {createAgent, createNetwork, createState, createTool, gemini, Tool} from "@inngest/agent-kit";
import {z, ZodObject} from 'zod'
import {FRAGMENT_TITLE_PROMPT, PROMPT, RESPONSE_PROMPT} from "@/prompt";
import {getSandbox, lastAssistantTextMessageContent} from "@/inngest/utils";
import prisma from "@/lib/db";
import {Message} from "@/generated/prisma";
import {SANDBOX_TIMEOUT} from "@/inngest/types";
import {canCreateWebsite, incrementWebsitesCreated} from "@/lib/track-website-creation";
import {getCurrentUser} from "@/lib/currentUser";

interface AgentState {
    summary: string,
    files: {
        [path: string]: string
    }
}

export const WebSiteBuilder = inngest.createFunction(
    {id: 'website-builder'},
    {event: 'website-builder/run'},
    async ({event, step}) => {

        const userId = event.data.userId

        console.log(userId)

        await canCreateWebsite(userId)

        await incrementWebsitesCreated(userId);


        const sandboxId = await step.run('get-sandbox-id', async () => {
            const sandbox = await Sandbox.create('code-maker-test-2');
            await sandbox.setTimeout(SANDBOX_TIMEOUT)
            return sandbox.sandboxId
        })

        const previousMessages = await step.run('get-previous-messages', async () => {
            const formattedMessages: Message[] = [];
            const messages = await prisma.message.findMany({
                where: {
                    projectId: event.data.projectId,
                },
                orderBy: {
                    createdAt: 'desc'
                },
                take: 7,
            })

            for (const message of messages) {
                formattedMessages.push({
                    type: 'text',
                    role: message.role === 'ASSISTANT' ? 'assistant' : 'user',
                    content: message.content
                })
            }
            console.log(formattedMessages)

            return formattedMessages.reverse();
        })
        const state  =  createState<AgentState>({
            summary: '',
            files: {},

        },
            {
                messages: previousMessages
            }

        )

        const codeAgent = createAgent<AgentState>({
            name: 'code-agent',
            description: 'An expert coding agent',
            system: PROMPT,
            model: gemini({model: 'gemini-2.5-flash'}),
            tools: [

                createTool({
                    name: 'terminal',
                    description: 'Use the terminal to run commands',
                    parameters: z.object({
                        command: z.string()
                    }),
                    handler: async ({ command }, { step }) => {
                        console.log('Running terminal command with:', { command });

                        const buffers = { stdout: '', stderr: '' };

                        try {
                            const sandbox = await getSandbox(sandboxId);
                            console.log('Connected to sandbox:', sandboxId);
                            const result = await sandbox.commands.run(command, {
                                onStdout: (data: string) => {
                                    buffers.stdout += data;
                                },
                                onStderr: (data: string) => {
                                    buffers.stderr += data;
                                },
                            });
                            console.log('Command output:', buffers.stdout);
                            return result.stdout;
                        } catch (error) {
                            console.error('Error executing command:', error);
                            console.error('Stdout:', buffers.stdout);
                            console.error('Stderr:', buffers.stderr);
                            throw new Error(`Command failed: ${error}`);
                        }
                    },
                }),
                createTool({ name: 'createOrUpdateFiles',
                    description: 'Create or update files in the sandbox',
                    parameters: z.object({
                        files: z.array(z.object({ path: z.string(), content: z.string() }))
                    }),
                        handler: async ({ files }, { step, network }: Tool.Options<AgentState>) => {
                            console.log('Running createOrUpdateFiles with files:', files);
                            const newFiles = await step?.run('createOrUpdateFiles', async () => {
                                try {
                                    const updatedFiles = network.state.data.files || {};
                                    const sandbox = await getSandbox(sandboxId);
                                    for (const file of files) {
                                        console.log(`Writing file: ${file.path}`);
                                        await sandbox.files.write(file.path, file.content);
                                        updatedFiles[file.path] = file.content;
                                    }
                                    console.log('Updated files:', updatedFiles);
                                    return updatedFiles;
                                } catch (e) {
                                    console.error('Error creating/updating files:', e);
                                    return 'Error: ' + e;
                                }
                            });
                            if (typeof newFiles === 'object') {
                                network.state.data.files = newFiles;
                            }
                            console.log('Files after update:', network.state.data.files);
                        }
                }),
            createTool({
                    name: 'readFiles',
                    description: 'Read files from the sandbox',
                    parameters: z.object({
                        files: z.array(z.string())
                    }),
                    handler: async ({files}, {step}) => {
                        return await step?.run('readFiles', async () => {
                            try {
                                const sandbox = await getSandbox(sandboxId)
                                const contents = [];

                                for (const file of files) {
                                    const content = await sandbox.files.read(file);
                                    contents.push({path: file, content})

                                }
                                return JSON.stringify(contents)
                            }catch (error) {
                                return  'Error' + error
                            }
                        })
                    }
                })
            ],
            lifecycle: {
                onResponse: async ({ result, network }) => {
                    console.log('Network state before update:', network.state.data);
                    const lastAssistantMessageText = lastAssistantTextMessageContent(result);
                    console.log('Assistant response:', lastAssistantMessageText);

                    if (lastAssistantMessageText && network) {
                        if (lastAssistantMessageText.includes('<task_summary>')) {
                            network.state.data.summary = lastAssistantMessageText;
                        }
                    }

                    console.log('Network state after update:', network.state.data);
                    return result;
                },
            },
        });

        const network = createNetwork<AgentState>({
            name: 'coding-agent-network',
            agents: [codeAgent],
            maxIter: 15,
            defaultState: state,
            router: async ({ network }) => {
                console.log('Network state at router:', network.state.data); // Логирование состояния сети
                const summary = network.state.data.summary;
                if (summary) {
                    console.log('Summary exists, skipping further steps.');
                    return;
                }
                return codeAgent;
            },
        });


        const result  = await network.run(event.data.value, {state: state})

        const fragmentTitleGenerator = createAgent<AgentState>({
            name: 'fragment-title-generator',
            description: 'a fragment title generator',
            system: FRAGMENT_TITLE_PROMPT,
            model: gemini({
                model: 'gemini-2.5-flash'
            })
        })

        const responseGenerator = createAgent<AgentState>({
            name: 'response-generator',
            description: 'a response generator',
            system:RESPONSE_PROMPT,
            model: gemini({
                model: 'gemini-2.5-flash'
            })
        })

        const {output: fragmentTitleOutput} = await fragmentTitleGenerator.run(result.state.data.summary)
        const {output: responseOutput} = await responseGenerator.run(result.state.data.summary)

        const generateFragmentTitle = () => {
            if (fragmentTitleOutput[0].type !== 'text') {
                return 'Fragment'
            }
            if (Array.isArray(fragmentTitleOutput[0].content)) {
                return fragmentTitleOutput[0].content.map((txt) => txt).join('')
            } else {
                return fragmentTitleOutput[0].content
            }
        }
        const generateResponse = () => {
            if (responseOutput[0].type !== 'text') {
                return 'Fragment'
            }
            if (Array.isArray(responseOutput[0].content)) {
                return responseOutput[0].content.map((txt) => txt).join('')
            } else {
                return responseOutput[0].content
            }
        }

        const isError = !result.state.data.summary || Object.keys(result.state.data.files || {}).length === 0




        const sandboxUrl = await step.run('get-sandbox-url', async () => {
            const sandbox = await getSandbox(sandboxId)
            const host = sandbox.getHost(3000)
            return `https://${host}`
        })


        await step.run('save-result', async () => {

            if (isError) {
               return  await  prisma.message.create({
                    data: {
                        projectId: event.data.projectId,
                        content: 'Что-то пошло не так! Попробуйте снова',
                        role: 'ASSISTANT',
                        type:'ERROR'
                    }
                })
            }

            return await  prisma.message.create({
                data: {
                    projectId: event.data.projectId,
                    content: generateResponse(),
                    role: "ASSISTANT",
                    type: 'RESULT',
                    fragment: {
                        create: {
                            sandboxUrl: sandboxUrl,
                            title: generateFragmentTitle(),
                            files: result.state.data.files
                        },
                    },
                },
            })
        })

        return {
            url:sandboxUrl,
            title: 'Fragment',
            files: result.state.data.files,
            summary: result.state.data.summary
        }
    }
)