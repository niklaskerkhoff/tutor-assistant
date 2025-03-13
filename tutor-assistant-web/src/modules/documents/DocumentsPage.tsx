import { HStack, MainContent, VStack } from '../../common/components/containers/flex-layout.tsx'
import { Header } from '../../common/components/containers/Header.tsx'
import { useTranslation } from 'react-i18next'
import { useNavigate } from 'react-router-dom'
import { IconButton } from '@mui/joy'
import { ArrowBackIosNew } from '@mui/icons-material'
import React from 'react'
import { DocumentSettingsList } from './components/DocumentSettingsList.tsx'
import { DocumentsList } from './components/DocumentsList.tsx'
import { useAuth } from '../../app/auth/useAuth.ts'


/**
 * View and manage documents.
 * This includes uploading settings and perform embedding based on these settings.
 */
export function DocumentsPage() {
    const navigate = useNavigate()
    const { t } = useTranslation()

    const { getRoles } = useAuth()
    const canManage = getRoles().includes('document-manager')

    return (
        <VStack>
            <HStack>
                {canManage && (
                    <DocumentSettingsList canManage={canManage} />
                )}
                <MainContent>
                    <VStack>
                        <Header
                            leftNode={
                                <IconButton color='primary' onClick={() => navigate('/chats')}>
                                    <ArrowBackIosNew />
                                </IconButton>
                            }
                            title={t('Documents')}
                        />
                        <MainContent>
                            <DocumentsList canManage={canManage} />
                        </MainContent>
                    </VStack>
                </MainContent>
            </HStack>

        </VStack>
    )
}