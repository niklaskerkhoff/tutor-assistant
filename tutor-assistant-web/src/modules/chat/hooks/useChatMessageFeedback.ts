import { useAuth } from '../../../app/auth/useAuth.ts'
import { apiBaseUrl } from '../../../app/base.ts'
import { ChatMessageFeedback } from '../chat-model.ts'
import { isNotPresent } from '../../../common/utils/utils.ts'
import { useChatContext } from '../useChatContext.ts'


/**
 * Manages feedback to ai messages.
 *
 * @returns
 *      * selectedMessageFeedback: the feedback of the selected message.
 *      * setContent: state setter for the content of the message.
 *      * loadFeedback(messageId: string): for loading the feedback.
 *      * updateFeedbackRating: sends the update of the rating of the feedback to the server.
 *      * updateFeedbackContent: sends the update of the content of the feedback to the server.
 */
export function useChatMessageFeedback() {
    const { getAuthHttp } = useAuth()

    const { selectedMessageFeedback, setSelectedMessageFeedback } = useChatContext()

    async function loadFeedback(messageId: string) {
        setSelectedMessageFeedback(undefined)
        const response = await getAuthHttp().get<ChatMessageFeedback>(`${apiBaseUrl}/chats/messages/${messageId}`)
        setSelectedMessageFeedback(response.data)
    }

    async function updateFeedbackRating(messageId: string | undefined, rating: number) {
        if (isNotPresent(messageId)) return
        const response = await getAuthHttp()
            .patch<ChatMessageFeedback>(`${apiBaseUrl}/chats/messages/${messageId}/feedback-rating`, { rating })
        setRating(response.data.rating)
    }

    async function updateFeedbackContent(messageId: string, content: string) {
        if (isNotPresent(messageId)) return
        const response = await getAuthHttp()
            .patch<ChatMessageFeedback>(`${apiBaseUrl}/chats/messages/${messageId}/feedback-content`, { content })
        setContent(response.data.content)
    }

    function setRating(rating: number) {
        setSelectedMessageFeedback(prevState => isNotPresent(prevState) ? undefined : ({ ...prevState, rating }))
    }

    function setContent(content: string) {
        setSelectedMessageFeedback(prevState => isNotPresent(prevState) ? undefined : ({ ...prevState, content }))
    }


    return {
        selectedMessageFeedback,
        setContent,
        loadFeedback,
        updateFeedbackRating,
        updateFeedbackContent,
    }
}