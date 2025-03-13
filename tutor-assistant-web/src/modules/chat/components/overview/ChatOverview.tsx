import React from 'react'
import { MainContent, VStack } from '../../../../common/components/containers/flex-layout.tsx'
import { useTranslation } from 'react-i18next'
import { Scroller } from '../../../../common/components/containers/Scroller.tsx'
import { ColumnLayout } from '../../../../common/components/containers/ColumnLayout.tsx'
import { useChatManager } from '../../hooks/useChatManager.ts'
import { Header } from '../../../../common/components/containers/Header.tsx'
import { ChatCard } from './ChatOverviewCard.tsx'
import { Button } from '@mui/joy'
import { useNavigate } from 'react-router-dom'


/**
 * Displays overview page content. Displays a chat card for each chat.
 */
export function ChatOverview() {

    const { t } = useTranslation()
    const navigate = useNavigate()

    const { summarizedChats, deleteChat } = useChatManager()

    return (
        <VStack>
            <Header
                title={t('Chats')} rightNode={
                <Button variant='plain' onClick={() => navigate('/documents')}>
                    {t('Documents')}
                </Button>
            }
            />

            <MainContent>
                <Scroller padding={1}>
                    <ColumnLayout
                        fill='horizontal'
                        columnCounts={{ 990: 3, 660: 2, 0: 1 }}
                        values={summarizedChats}
                        render={chat => <ChatCard chat={chat} deleteChat={deleteChat} />}
                        spacing={1}
                    />
                </Scroller>
            </MainContent>

        </VStack>
    )
}
