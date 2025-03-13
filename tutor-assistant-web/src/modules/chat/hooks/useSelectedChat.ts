import { useEffect, useRef, useState } from 'react'
import { Chat, ChatMessage } from '../chat-model.ts'
import { last, lastIndex } from '../../../common/utils/array-utils.ts'
import { apiBaseUrl } from '../../../app/base.ts'
import { useAuth } from '../../../app/auth/useAuth.ts'
import { SSE, SSEvent } from 'sse.js'
import { useKeycloak } from '@react-keycloak/web'
import { isNotPresent } from '../../../common/utils/utils.ts'
import { useChatContext } from '../useChatContext.ts'


/**
 * Loads and provides the selected chat.
 * Handles message sending and response message loading.
 * Loads response messages are loaded from an event stream.
 *
 * @returns
 *      * selectedChat: the selected chat.
 *      * sendMessage(message: string): function for sending messages.
 *      * isLoading: true while sending new message and waiting for response to finish loading. false otherwise.
 *
 * @param chatId of the selected chat. Undefined if no chat is selected.
 */
export function useSelectedChat(chatId: string | undefined) {
    const eventStreamEnd = '=====END====='
    const messageEnd = '=====MESSAGE_END====='


    const { selectedChat, setSelectedChat } = useChatContext()

    const [isLoading, setIsLoading] = useState(false)
    const sseRef = useRef<SSE>()
    const { getAuthHttp } = useAuth()

    const { keycloak } = useKeycloak()

    useEffect(() => {
        loadChat()
        return () => {
            cleanupStreaming()
        }
    }, [chatId])


    async function loadChat() {
        if (isNotPresent(chatId)) {
            setSelectedChat(undefined)
            return
        }
        setIsLoading(true)
        const result = await getAuthHttp().get<Chat>(`${apiBaseUrl}/chats/${chatId}`)
        setSelectedChat(result.data)
        setIsLoading(false)
    }

    async function sendMessage(message: string) {

        if (isLoading) return
        if (isNotPresent(selectedChat)) return

        sseRef.current?.close()

        setSelectedChat(prevState => {

            if (isNotPresent(prevState)) return

            return {
                ...prevState,
                messages: [
                    ...prevState.messages,
                    { role: 'user', content: message },
                ],
            }
        })

        const url = `${apiBaseUrl}/chats/${selectedChat.id}/messages`

        const sse = new SSE(url, {
            headers: {
                Authorization: `Bearer ${keycloak.token}`,
            },
            method: 'POST',
            payload: message,
        })

        sseRef.current = sse
        setIsLoading(true)


        sse.onmessage = (event: SSEvent) => {
            if (event.data === messageEnd) {
                // message complete. waiting for summary
            } else if (event.data === eventStreamEnd) {
                cleanupStreaming()
                loadChat()
            } else {
                processData(event.data)
            }
        }

        sse.onerror = (event: SSEvent) => {
            console.log('ERROR: ', event)
            sseRef.current?.close()
            setIsLoading(false)
        }
    }

    function cleanupStreaming() {
        sseRef.current?.close()
        setIsLoading(false)
    }

    function processData(data: string) {
        const token = data.substring(1, data.length - 1)

        setSelectedChat(prevState => {
            if (isNotPresent(prevState)) return

            const messages = [...prevState.messages]

            const lastMessage = last(messages)!
            if (lastMessage.role === 'user') {
                messages.push({ role: 'ai', content: '' })
            }

            const lastAiMessage = last(messages)!

            const updatedAiMessage: ChatMessage = {
                ...lastAiMessage,
                content: lastAiMessage.content + token,
            }

            messages[lastIndex(messages)] = updatedAiMessage

            return {
                ...prevState,
                messages,
            }
        })
    }

    return {
        selectedChat,
        sendMessage,
        isLoading,
    }
}
