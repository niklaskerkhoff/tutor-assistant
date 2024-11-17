import { Chat as ChatModel, Chat } from '../chat-model.ts'
import { apiBaseUrl } from '../../../app/base.ts'
import { useAuth } from '../../../app/auth/useAuth.ts'
import { useEffect, useMemo, useState } from 'react'
import { remove } from '../../../lib/utils/array-utils.ts'
import { isPresent } from '../../../lib/utils/utils.ts'

export function useChatManager() {

    const [chats, setChats] = useState<Chat[]>([])

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
        chats,
        summarizedChats,
        createChat,
        deleteChat,
    }
}