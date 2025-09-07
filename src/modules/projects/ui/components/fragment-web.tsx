import React, {useState} from 'react'
import {ExternalLinkIcon, RefreshCcwIcon} from "lucide-react";
import {Fragment} from "@/generated/prisma";
import {Button} from "@/components/ui/button";
import {Hind} from "next/dist/compiled/@next/font/dist/google";
import Hint from "@/components/Hint";
import {toast} from "sonner";

interface Props {
    data: Fragment
}

const FragmentWeb = ({data}: Props) => {
    const [fragmentKey, setFragmentKey] = useState(0)
    const [copied, setCopied] = useState(false)

    const onRefresh = () => {
        setFragmentKey((prev) => prev +1)
    }
    const handleCopy = () => {
        navigator.clipboard.writeText(data.sandboxUrl)
        setCopied(true)
        toast.success('Вы успешно скопировали ссылку!')
        setTimeout(() => setCopied(false), 2000)
    }

    return (
        <div className='flex flex-col w-full h-full'>
            <div className='p-2 border-b bg-sidebar flex items-center gap-x-2'>
                <Hint text='Перезагрузить страницу' >
                    <Button size='sm' variant='outline' onClick={onRefresh}>
                        <RefreshCcwIcon/>
                    </Button>
                </Hint>
             <Hint text='Копировать ссылку' side='left' >
                 <Button className='flex-1 justify-start text-start font-normal' disabled={!data.sandboxUrl} size='sm' variant='outline' onClick={handleCopy} >
                    <span className='truncate'>
                        {data.sandboxUrl}
                        </span>
                 </Button>
             </Hint>

                <Hint text='Открыть в новом окне' side='bottom' align='start' >


                    <Button size='sm' disabled={!data.sandboxUrl}
                            variant='outline'
                            onClick={() => {
                                if (!data.sandboxUrl) return

                                window.open(data.sandboxUrl, "_blank")
                            }}

                    >
                        <ExternalLinkIcon/>

                    </Button>
                </Hint>
            </div>

            <iframe key={fragmentKey}
                loading='lazy'
                src={data.sandboxUrl}
                className='h-full w-full'
                sandbox='allow-forms allow-scripts allow-same-origin'>

            </iframe>

        </div>
    )
}
export default FragmentWeb
