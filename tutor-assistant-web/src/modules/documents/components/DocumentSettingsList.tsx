import { MainContent, Row, Spacer, VStack } from '../../../common/components/containers/flex-layout.tsx'
import { useDocumentSettings } from '../hooks/useDocumentSettings.tsx'
import { StandardList } from './StandardList.tsx'
import { useTranslation } from 'react-i18next'
import { Add } from '@mui/icons-material'
import { Scroller } from '../../../common/components/containers/Scroller.tsx'
import { FileButton } from '../../../common/components/widgets/FileButton.tsx'
import { Bar } from '../../../common/components/containers/Bar.tsx'
import { Header } from '../../../common/components/containers/Header.tsx'
import React from 'react'
import { useOpenContexts } from '../../chat/hooks/useOpenContexts.ts'

interface Props {
    canManage: boolean
}

/**
 * Renders a list for displaying and managing the document settings: main setting, value settings, resources.
 *
 * @param canManage true if the user can manage the documents, false if they can only view.
 */
export function DocumentSettingsList({ canManage }: Props) {

    const {
        mainSettings,
        valueSettings,
        resources,
        addSetting,
        addResource,
        deleteSetting,
        deleteResource,
    } = useDocumentSettings()

    const { t } = useTranslation()

    const { openContexts } = useOpenContexts()

    return (
        <Bar>
            <Header title={t('Uploads')} />
            <MainContent>
                <Scroller padding={1}>
                    <VStack gap={1}>

                        <Row alignItems='center' gap={1}>
                            <Spacer />
                            <FileButton
                                addFile={addSetting}
                                startDecorator={<Add />}
                                variant='outlined'
                            >
                                {t('Setting')}
                            </FileButton>
                            <FileButton
                                addFile={addResource}
                                startDecorator={<Add />}
                                variant='outlined'
                            >
                                {t('Resource')}
                            </FileButton>
                        </Row>
                        <StandardList
                            title={t('Main Setting')}
                            items={mainSettings}
                            getLabel={setting => setting.name}
                            onDelete={setting => deleteSetting(setting.id)}
                            canManage={canManage}
                        />
                        <StandardList
                            title={t('Value Settings')}
                            items={valueSettings}
                            getLabel={setting => setting.name}
                            onDelete={setting => deleteSetting(setting.id)}
                            canManage={canManage}
                        />
                        <StandardList
                            title={t('Resources')}
                            items={resources}
                            getLabel={resource => resource.displayName}
                            onClick={resource => openContexts(resource.id)}
                            onDelete={resource => deleteResource(resource.id)}
                            canManage={canManage}
                        />
                    </VStack>

                </Scroller>
            </MainContent>
        </Bar>
    )
}
