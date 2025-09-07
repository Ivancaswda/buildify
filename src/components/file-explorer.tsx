import React, {Fragment, useState, useEffect, useMemo, useCallback} from 'react'
import {Button} from "@/components/ui/button";
import CodeView from "@/components/code-view";
import {Breadcrumb, BreadcrumbEllipsis, BreadcrumbItem, BreadcrumbLink, BreadcrumbList,BreadcrumbPage,BreadcrumbSeparator} from "@/components/ui/breadcrumb";
import {ResizableHandle, ResizablePanel, ResizablePanelGroup} from "@/components/ui/resizable";
import Hint from "@/components/Hint";
import {CopyCheck, CopyIcon} from "lucide-react";
import {convertFilesToTreeItems} from "@/lib/utils";
import {TreeView} from "@/components/tree-view";
import {toast} from "sonner";

type FileCollection = {[path: string]: string}

function getLanguageFromExtension(filename: string): string {
    const extension = filename.split('.').pop()?.toLowerCase()
    return  extension || 'text'
}

interface FileBreadcrumbProps {
    filePath: string;
}
const FileBreadCrumb = ({filePath}: FileBreadcrumbProps) => {
    const pathSegments = filePath.split('/')
    const maxSegments = 3;
    const renderBreadcrumbItems = () => {
        if (pathSegments?.length <= maxSegments) {

            return pathSegments.map((segment, index) => {
                const isLast = index === pathSegments?.length - 1;
                return (
                    <Fragment key={index}>
                        <BreadcrumbItem>
                            {isLast ? (
                                <BreadcrumbPage className='font-medium'>
                                    {segment}
                                </BreadcrumbPage>
                            ) : (
                                <span className='text-muted-foreground'>
                                    {segment}
                                </span>
                            )}
                        </BreadcrumbItem>

                        {!isLast && <BreadcrumbSeparator/>}
                    </Fragment>
                )
            })
        } else {
            const firstSegment = pathSegments[0]
            const lastSegment = pathSegments[pathSegments.length -1]

            return (
                <>
                    <BreadcrumbItem>
                            <span className='text-muted-foreground'>
                                {firstSegment}
                            </span>
                        <BreadcrumbSeparator/>
                        <BreadcrumbItem>
                            <BreadcrumbEllipsis/>
                        </BreadcrumbItem>
                        <BreadcrumbSeparator/>
                        <BreadcrumbItem>
                            <BreadcrumbPage className='font-medium'>
                                {lastSegment}
                            </BreadcrumbPage>
                        </BreadcrumbItem>
                    </BreadcrumbItem>
                </>

            )
        }
    }
    return (
        <Breadcrumb>
            <BreadcrumbList>
                {renderBreadcrumbItems()}
            </BreadcrumbList>
        </Breadcrumb>
    )
}
interface FileExplorerProps {
    files: FileCollection,

}
const FileExplorer = ({files}: FileExplorerProps) => {
    const [copied, setCopied] = useState(false)
    const [selectedFile, setSelectedFile] = useState<string | null>(() => {
        const fileKeys = Object.keys(files)

        return fileKeys.length > 0 ? fileKeys[0] : null
    })

    const  treeData = useMemo(() => {
        return convertFilesToTreeItems(files)
    }, [files])

    const handleFileSelect = useCallback((filePath: string) => {
            if (files[filePath]) {
                setSelectedFile(filePath)
            }
    }, [files])

    const handleCopy = useCallback(() => {
        if (selectedFile) {
            navigator.clipboard.writeText(files[selectedFile])
            setCopied(true)
            toast.success('Copied!')
            setTimeout(() => {
                setCopied(false)
            }, 2000)
        }
    }, [selectedFile, files])

    return (
        <ResizablePanelGroup direction='horizontal'>
            <ResizablePanel defaultSize={30} minSize={30} className='bg-sidebar'>
                <TreeView
                    value={selectedFile}
                    onSelect={handleFileSelect}
                    data={treeData}/>
            </ResizablePanel>
            <ResizableHandle className='hover:bg-primary transition-colors'/>
            <ResizablePanel defaultSize={30} minSize={30}>
                {selectedFile && files[selectedFile] ? (
                    <div className='h-full w-full flex flex-col'>
                        <div className='border-b bg-sidebar px-4 py-2 flex justify-between items-center gap-x-2'>

                           <FileBreadCrumb filePath={selectedFile} />
                            <Hint text='copy to clipboard' >
                                <Button variant='outline' size='icon' className='ml-auto' onClick={handleCopy}  disabled={copied}
                                >
                                    {copied ? <CopyCheck/> :  <CopyIcon/>}

                                </Button>
                            </Hint>
                        </div>
                        <div className='flex-1 overflow-auto'>
                            <CodeView code={files[selectedFile]} lang={getLanguageFromExtension(selectedFile)} />
                        </div>
                    </div>
                ) : <div className='flex h-full items-center justify-center text-muted-foreground'>

                </div>}
            </ResizablePanel>
        </ResizablePanelGroup>
    )
}
export default FileExplorer
