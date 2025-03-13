import React, { useEffect, useRef } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import { isNotPresent, isPresent } from '../../common/utils/utils.ts'
import { useChatManager } from './hooks/useChatManager.ts'
import { useTranslation } from 'react-i18next'
import { useSelectedChat } from './hooks/useSelectedChat.ts'
import { useAsyncActionTrigger } from '../../common/hooks/useAsyncActionTrigger.ts'
import { MainContent, Row, VStack } from '../../common/components/containers/flex-layout.tsx'
import { Divider } from '@mui/joy'
import { ChatDetails } from './components/details/ChatDetails.tsx'
import { ChatOverview } from './components/overview/ChatOverview.tsx'
import { SubmitTextarea } from '../../common/components/widgets/SubmitTextarea.tsx'


/**
 * Shows either ChatOverview or ChatDetails together with a Textarea for sending messages.
 * In case of ChatDetails sending messages adds the message to the opened chat.
 * In case of ChatOverview sending messages leads to creating a new chat with this message and opening it in ChatDetails.
 */
export function ChatPage() {
    const { t } = useTranslation()
    const navigate = useNavigate()

    const inputRef = useRef<HTMLTextAreaElement>(null)

    const chatId = useParams().chatId
    const { createChat } = useChatManager()
    const { selectedChat, sendMessage, isLoading } = useSelectedChat(chatId)
    const [isSending, sendMessageAction] = useAsyncActionTrigger(
        handleSend,
        () => isPresent(selectedChat) && selectedChat.id === chatId,
        [selectedChat?.id],
    )


    useEffect(() => {
        inputRef.current?.focus()
    }, [isSending, isLoading, inputRef.current, chatId])

    async function handleSubmit() {
        const input = inputRef.current
        if (isNotPresent(input) || input.value.trim() === '') return

        await handleCreateChat()
        sendMessageAction()
    }

    async function handleCreateChat() {
        if (isNotPresent(chatId)) {
            const chat = await createChat()
            navigate(`/chats/${chat.id}`)
        }
    }

    async function handleSend() {
        const input = inputRef.current
        if (isNotPresent(input) || input.value === '') return

        const message = input.value
        if (message !== '') {
            await sendMessage(message)
            input.value = ''
        }
    }

    return (
        <VStack spacing={1}>
            <MainContent>
                {
                    isPresent(chatId)
                        ? <ChatDetails />
                        : <ChatOverview />
                }
            </MainContent>

            <Divider sx={{ marginTop: '0px !important' }} />
            <Row alignItems='center' padding={1}>
                <MainContent>
                    <SubmitTextarea
                        onSubmit={handleSubmit}
                        maxRows={10}
                        sx={{ marginTop: 0 }}
                        slotProps={{ textarea: { ref: inputRef } }}
                        placeholder={t('Message')}
                        disabled={isSending || isLoading}
                    />
                </MainContent>

            </Row>

        </VStack>
    )
}


