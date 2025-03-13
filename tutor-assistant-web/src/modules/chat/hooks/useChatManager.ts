import { Chat as ChatModel, Chat } from '../chat-model.ts'
import { apiBaseUrl } from '../../../app/base.ts'
import { useAuth } from '../../../app/auth/useAuth.ts'
import { useEffect, useMemo } from 'react'
import { remove } from '../../../common/utils/array-utils.ts'
import { isPresent } from '../../../common/utils/utils.ts'
import { useChatContext } from '../useChatContext.ts'


/**
 * Manages all chats.
 *
 * @returns
 *      * summarizedChats: all chats having a summary the user.
 *      * createChat(): create a new empty chat.
 *      * deleteChat(): deletes a chat.
 */
export function useChatManager() {

    const { chats, setChats } = useChatContext()

    const summarizedChats = useMemo(() => chats.filter(it => isPresent(it.summary)), [chats])

    const { getAuthHttp } = useAuth()

    useEffect(() => {
        loadChats()
    }, [])

    async function loadChats() {
        const result = await getAuthHttp().get<Chat[]>(`${apiBaseUrl}/chats`)
        setChats(result.data)
    }

    async function createChat() {
        const result = await getAuthHttp().post<ChatModel>(`${apiBaseUrl}/chats`)
        return result.data
    }

    async function deleteChat(chatId: string) {
        await getAuthHttp().delete<Chat>(`${apiBaseUrl}/chats/${chatId}`)
        setChats(prevState => remove(chatId, prevState))
    }

    return {
        summarizedChats,
        createChat,
        deleteChat,
    }
}
