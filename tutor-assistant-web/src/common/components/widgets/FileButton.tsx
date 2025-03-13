import { Button, ButtonProps, styled } from '@mui/joy'
import React, { ChangeEvent, useRef } from 'react'
import { isNotPresent } from '../../utils/utils.ts'

interface Props {
    addFile: (file: File) => void
}

/**
 * Button for selecting files
 *
 * @param addFile callback to be called if a file is selected
 * @param props of the Button
 */
export function FileButton({ addFile, ...props }: Props & ButtonProps) {

    const fileInputRef = useRef<HTMLInputElement>(null)

    function handleFileSelected(event: ChangeEvent<HTMLInputElement>) {
        const file = event.target.files?.[0]
        if (isNotPresent(file)) return

        addFile(file)
    }

    return (
        <>
            <Button
                component='label'
                role={undefined}
                tabIndex={-1}
                {...props}
            >
                {props.children}
                <VisuallyHiddenInput onInput={handleFileSelected} type='file' ref={fileInputRef} />
            </Button>
        </>
    )
}

const VisuallyHiddenInput = styled('input')`
    clip: rect(0 0 0 0);
    clip-path: inset(50%);
    height: 1px;
    overflow: hidden;
    position: absolute;
    bottom: 0;
    left: 0;
    white-space: nowrap;
    width: 1px;
`
