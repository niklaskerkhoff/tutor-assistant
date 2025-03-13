import { Box, Divider, IconButton, List, ListItem, ListItemButton, Typography } from '@mui/joy'
import { Cached, Delete } from '@mui/icons-material'
import React from 'react'
import { useTranslation } from 'react-i18next'
import { isNotPresent, isPresent } from '../../../common/utils/utils.ts'

interface Props<T extends { id?: string }> {
    title?: string
    items: T[]
    getLabel: (item: T) => string
    onClick?: (item: T) => void
    onReload?: (item: T) => void
    onDelete?: (item: T) => void
    canManage?: boolean
}

/**
 * Renders items in a list.
 * Provides reload and delete icon with configurable action.
 *
 * @param title rendered above the list iff present.
 * @param items to be rendered.
 * @param getLabel returns text to be rendered in each list item for each given item.
 * @param onClick performed on list item click.
 * @param onReload performed on reload icon clicked.
 * @param onDelete performed on delete icon clicked.
 * @param canManage true if user can reload and delete, false if they can only view.
 */
export function StandardList<T extends { id?: string }>(
    { title, items, getLabel, onClick, onReload, onDelete, canManage }: Props<T>,
) {

    const { t } = useTranslation()

    function handleOnClick(item: T) {
        if (isNotPresent(onClick)) return
        onClick(item)
    }

    return (
        <>
            {isPresent(title) && (
                <Typography level='body-sm'>{title}</Typography>
            )}
            <List>
                {items.map((item, index) => (
                    <React.Fragment key={item.id}>
                        <ListItem
                            endAction={canManage && (
                                <Box display='flex'>
                                    {isPresent(onReload) && (
                                        <IconButton
                                            aria-label={t('Delete')}
                                            size='sm'
                                            color='primary'
                                            onClick={() => onReload(item)}
                                        >
                                            <Cached />
                                        </IconButton>
                                    )}
                                    {isPresent(onDelete) && (
                                        <IconButton
                                            aria-label={t('Delete')}
                                            size='sm'
                                            color='danger'
                                            onClick={() => onDelete(item)}
                                        >
                                            <Delete />
                                        </IconButton>
                                    )}
                                </Box>
                            )}
                        >
                            <ListItemButton onClick={() => handleOnClick(item)}>
                                {getLabel(item)}
                            </ListItemButton>
                        </ListItem>
                        {index < items.length - 1 && <Divider />}
                    </React.Fragment>
                ))}
            </List>
        </>
    )
}
