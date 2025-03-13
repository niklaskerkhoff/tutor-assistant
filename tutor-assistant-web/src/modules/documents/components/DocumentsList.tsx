import { useTranslation } from 'react-i18next'
import { useDocuments } from '../hooks/useDocuments.ts'
import { Row, Spacer, VStack } from '../../../common/components/containers/flex-layout.tsx'
import { Accordion, AccordionDetails, AccordionGroup, AccordionSummary, Button, Typography } from '@mui/joy'
import { StandardList } from './StandardList.tsx'
import { Scroller } from '../../../common/components/containers/Scroller.tsx'
import { useOpenContexts } from '../../chat/hooks/useOpenContexts.ts'

interface Props {
    canManage: boolean
}

/**
 * Renders a list and buttons for viewing and managing file and website documents.
 *
 * @param canManage true if the user can embed, reembed and delete, false if the user can only view.
 */
export function DocumentsList({ canManage }: Props) {
    const { t } = useTranslation()
    const {
        embed,
        groupedDocuments,
        reembedFile,
        reembedWebsite,
        deleteFile,
        deleteWebsite,
    } = useDocuments()

    const { openContexts } = useOpenContexts()

    return (
        <VStack>
            <Scroller padding={1}>
                <VStack gap={1}>

                    <Row alignItems='center'>
                        <Spacer />
                        {canManage && (<Button variant='outlined' onClick={embed}>{t('Embed')}</Button>)}
                    </Row>

                    <AccordionGroup sx={{ width: '100%' }}>
                        {
                            Object.keys(groupedDocuments).map((key, index) => (
                                <Accordion key={key} defaultExpanded={index === 0}>
                                    <AccordionSummary>
                                        <Typography level='body-sm'>{key}</Typography>
                                    </AccordionSummary>
                                    <AccordionDetails>
                                        <StandardList
                                            items={groupedDocuments[key].files}
                                            getLabel={file => file.title}
                                            onClick={file => openContexts(file.fileStoreId)}
                                            onReload={file => reembedFile(file.id)}
                                            onDelete={file => deleteFile(file.id)}
                                            canManage={canManage}
                                        />
                                        <StandardList
                                            items={groupedDocuments[key].websites}
                                            getLabel={website => website.title}
                                            onClick={website => openContexts(website.url)}
                                            onReload={website => reembedWebsite(website.id)}
                                            onDelete={website => deleteWebsite(website.id)}
                                            canManage={canManage}
                                        />
                                    </AccordionDetails>

                                </Accordion>
                            ))
                        }

                    </AccordionGroup>


                </VStack>

            </Scroller>
        </VStack>
    )
}
