import { ChatMessageContext } from '../../chat-model.ts'
import { useTranslation } from 'react-i18next'
import { useOpenContexts } from '../../hooks/useOpenContexts.ts'
import { isNotPresent, isPresent } from '../../../../common/utils/utils.ts'
import { MainContent, Spacer, VStack } from '../../../../common/components/containers/flex-layout.tsx'
import { Button, Card, CardActions, CardContent, Typography } from '@mui/joy'
import { Scroller } from '../../../../common/components/containers/Scroller.tsx'
import { roundTo } from '../../../../common/utils/math-utils.ts'
import { Multiline } from '../../../../common/components/widgets/Multiline.tsx'
import React from 'react'

interface ChatContextsProps {
    contexts: ChatMessageContext[] | undefined
}

/**
 * Displays contexts (sources) as cards. Displays open buttons for sources that can be opened (have an originalKey).
 *
 * @param contexts to be displayed.
 */
export function ChatContexts({ contexts }: ChatContextsProps) {
    const { t } = useTranslation()

    const { openContexts } = useOpenContexts()

    if (isNotPresent(contexts)) contexts = []

    function getTitleAndPage(context: ChatMessageContext) {
        const pageOutput = isPresent(context.page) ? `, ${t('Page')} ${context.page + 1}` : ''
        return isPresent(context.title) ? `${context.title}${pageOutput}` : ''
    }

    if (contexts.length === 0) return (
        <MainContent>
            <VStack justifyContent='center' alignItems='center'>
                <Typography>{t('Select a message')}</Typography>
            </VStack>
        </MainContent>
    )

    return (
        <>
            <MainContent>
                <Scroller padding={1}>
                    <VStack gap={1}>
                        {
                            contexts.map((context, index) => (
                                <Card key={index}>
                                    <CardContent sx={{ maxHeight: '300px', overflow: 'auto' }}>

                                        <Typography level='body-sm'>
                                            {getTitleAndPage(context)}
                                        </Typography>
                                        <Typography level='body-sm'>
                                            {t('Relevance')}: {roundTo(context.score ?? -1, 2)}
                                        </Typography>

                                        <Multiline text={context.content ?? ''} />

                                    </CardContent>
                                    {isPresent(context.originalKey) && (
                                        <CardActions>
                                            <Spacer />
                                            <Button variant='outlined' onClick={() => openContexts(context)}>
                                                {t('Open')}
                                            </Button>
                                        </CardActions>
                                    )}
                                </Card>
                            ))
                        }
                    </VStack>

                </Scroller>
            </MainContent>

        </>
    )
}

