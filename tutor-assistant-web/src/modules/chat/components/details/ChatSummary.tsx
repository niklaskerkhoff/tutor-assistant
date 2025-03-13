import { ChatSummary as ChatSummaryModel } from '../../chat-model.ts'
import { MainContent } from '../../../../common/components/containers/flex-layout.tsx'
import { Scroller } from '../../../../common/components/containers/Scroller.tsx'
import { isPresent } from '../../../../common/utils/utils.ts'
import { Box } from '@mui/joy'
import { StyledMarkdown } from '../../../../common/components/widgets/StyledMarkdown.tsx'
import React from 'react'

interface ChatSummaryProps {
    summary: ChatSummaryModel | undefined
}

/**
 * Displays summary of a chat.
 *
 * @param summary of the chat.
 */
export function ChatSummary({ summary }: ChatSummaryProps) {

    return (
        <>
            <MainContent>
                <Scroller padding={1}>
                    {
                        isPresent(summary) && (
                            <Box sx={{ overflow: 'hidden' }}>
                                <StyledMarkdown>{`## ${summary.title}`}</StyledMarkdown>
                                <StyledMarkdown>{`### ${summary.subtitle}`}</StyledMarkdown>
                                <StyledMarkdown>{summary.content}</StyledMarkdown>
                            </Box>
                        )
                    }
                </Scroller>
            </MainContent>
        </>
    )
}
