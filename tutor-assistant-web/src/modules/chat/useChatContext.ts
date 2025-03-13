import { useContext } from 'react'
import { ChatContext } from './ChatProvider.tsx'


/**
 * Provides states for managing chats, messages and feedbacks on messages.
 */
export function useChatContext() {
    return useContext(ChatContext)
}
