import { Chat } from '../../chat-model.ts'
import { useTranslation } from 'react-i18next'
import { useNavigate } from 'react-router-dom'
import {
    Button,
    Card,
    CardActions,
    CardContent,
    Dropdown,
    IconButton,
    Menu,
    MenuButton,
    MenuItem,
    Typography,
} from '@mui/joy'
import { MainContent, Row, Spacer } from '../../../../common/components/containers/flex-layout.tsx'
import { MoreVert } from '@mui/icons-material'
import React from 'react'

interface Props {
    chat: Chat,
    deleteChat: (chatId: string) => void,
}

/**
 * Displays a chat card for each chat.
 * Displays the summary, menu with delete option and button for opening the chat in ChatDetails.
 *
 * @param chat to be displayed.
 * @param deleteChat function for deleting a chat.
 * @constructor
 */
export function ChatCard({ chat, deleteChat }: Props) {
    const { t } = useTranslation()
    const navigate = useNavigate()

    return (
        <Card sx={{ width: '100%' }}>

            <CardContent>
                <Row alignItems='flex-start'>
                    <MainContent>
                        <Typography level='title-lg'>{chat.summary?.title}</Typography>
                        <Typography level='body-md'>{chat.summary?.subtitle}</Typography>
                    </MainContent>


                    <Dropdown>
                        <MenuButton slots={{ root: IconButton }}>
                            <MoreVert />
                        </MenuButton>
                        <Menu>
                            <MenuItem
                                variant='soft'
                                color='danger'
                                onClick={() => deleteChat(chat.id)}
                            >
                                {t('Delete')}
                            </MenuItem>
                        </Menu>
                    </Dropdown>
                </Row>


                <Typography level='body-sm'>{chat.summary?.content}</Typography>

            </CardContent>
            <CardActions>
                <Spacer />
                <Button variant='outlined' onClick={() => navigate(`/chats/${chat.id}`)}>{t('Open')}</Button>
            </CardActions>
        </Card>
    )
}
