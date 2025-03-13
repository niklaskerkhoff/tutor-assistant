/**
 * Chat between user and assistant.
 */
export interface Chat {
    id: string
    summary?: ChatSummary
    messages: ChatMessage[]
}

/**
 * Messages in a chat. Contexts are only present if role is ai.
 */
export interface ChatMessage {
    id?: string
    role: 'user' | 'ai'
    content: string
    contexts?: ChatMessageContext[]
}

/**
 * Summary of the chat based on the messages.
 */
export interface ChatSummary {
    title: string,
    subtitle: string,
    content: string
}

/**
 * Context used for generating an ai message.
 */
export interface ChatMessageContext {
    title?: string
    originalKey?: string
    page?: number
    content?: string
    score?: number
}

/**
 * Feedback given by a user to an ai message.
 */
export interface ChatMessageFeedback {
    rating: number
    content: string
}
