import { Button, Textarea, TextareaProps, Tooltip } from '@mui/joy'
import React, { ReactNode } from 'react'
import { Row, Spacer } from '../containers/flex-layout.tsx'
import { useTranslation } from 'react-i18next'

interface Props {
    onSubmit: () => void
    additionEndDecorator?: ReactNode
}

/**
 * Makes a Textarea submit on Ctrl + Enter and adds a submit button at the right border of the end decorator
 *
 * @param onSubmit action to be performed on Ctrl + Enter or on submit button clicked
 * @param additionEndDecorator react node to be rendered at the left border of the endDecorator
 * @param props of the Textarea
 */
export function SubmitTextarea({ onSubmit, additionEndDecorator, ...props }: TextareaProps & Props) {
    const { t } = useTranslation()

    function handleInput(e: React.KeyboardEvent<HTMLTextAreaElement>) {
        if (e.ctrlKey && e.key === 'Enter') {
            e.preventDefault()
            onSubmit()
        }
    }

    return (
        <Textarea
            {...props}
            onKeyDown={handleInput}
            endDecorator={
                <Row alignItems='center'>
                    {additionEndDecorator}
                    <Spacer />
                    <Tooltip title={t('Ctrl + Enter')} variant='solid'>
                        <Button onClick={onSubmit}>{t('Send')}</Button>
                    </Tooltip>
                </Row>

            }
        />
    )
}