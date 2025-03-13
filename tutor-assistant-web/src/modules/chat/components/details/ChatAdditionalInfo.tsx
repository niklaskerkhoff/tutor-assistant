import { Chat } from '../../chat-model.ts'
import React, { useMemo, useState } from 'react'
import { Bar } from '../../../../common/components/containers/Bar.tsx'
import { isNotPresent, isPresent } from '../../../../common/utils/utils.ts'
import { Header } from '../../../../common/components/containers/Header.tsx'
import { useTranslation } from 'react-i18next'
import { Button, ToggleButtonGroup } from '@mui/joy'
import { empty } from '../../../../common/utils/array-utils.ts'
import { ChatSummary } from './ChatSummary.tsx'
import { ChatContexts } from './ChatContexts.tsx'

interface Props {
    chat: Chat
    selectedMessageId?: string
}

/**
 * Right sidebar for displaying either the contexts (sources) or the summary of the selected message.
 */
export function ChatAdditionalInfo({ chat, selectedMessageId }: Props) {
    const { t } = useTranslation()
    const [additionalInfo, setAdditionalInfo] = useState<'summary' | 'contexts' | null>('contexts')
    const contexts = useMemo(() => {
        if (isNotPresent(selectedMessageId) && empty(chat.messages)) return undefined
        return chat.messages.find(message => message.id === selectedMessageId)?.contexts
    }, [selectedMessageId])

    function handleTabChange(_: unknown, newValue: 'summary' | 'contexts' | null) {
        if (isPresent(newValue)) {
            setAdditionalInfo(newValue)
        }
    }

    if (isNotPresent(additionalInfo)) return <></>

    return (
        <Bar className='right'>
            <Header
                title={
                    <ToggleButtonGroup
                        value={additionalInfo}
                        onChange={handleTabChange}
                        spacing={0.01}
                        variant='plain'
                        size='sm'
                    >
                        <Button value='contexts'>{t('Sources')} ({contexts?.length ?? 0})</Button>
                        <Button value='summary'>{t('Summary')}</Button>
                    </ToggleButtonGroup>
                }
            />
            {
                additionalInfo === 'summary' && <ChatSummary
                    summary={chat.summary}
                />
            }

            {
                additionalInfo === 'contexts' && <ChatContexts
                    contexts={contexts}
                />
            }
        </Bar>
    )
}




