import { VStack } from '../../../../common/components/containers/flex-layout.tsx'
import { ChatMessage } from '../../chat-model.ts'
import { ChatMessageItem } from './ChatMessageItem.tsx'

interface Props {
    messages: ChatMessage[]
    onMessageClick?: (messageId: string) => void
    selectedMessageId?: string
}


/**
 * Displays all messages as ChatMessageItems in a VStack.
 *
 * @param messages to be displayed.
 * @param onMessageClick callback when a message is clicked.
 * @param selectedMessageId id of the selected message.
 */
export function ChatMessageList({ messages, onMessageClick, selectedMessageId }: Props) {

    return (
        <VStack spacing={1}>
            {messages.map((message, index) => (
                <ChatMessageItem
                    key={index}
                    message={message}
                    onMessageClick={onMessageClick}
                    selectedMessageId={selectedMessageId}
                />
            ))}
        </VStack>
    )
}
