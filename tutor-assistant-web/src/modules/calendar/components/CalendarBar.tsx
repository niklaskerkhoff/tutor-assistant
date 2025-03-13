import { Header } from '../../../common/components/containers/Header.tsx'
import { MainContent, Row } from '../../../common/components/containers/flex-layout.tsx'
import { Button, IconButton } from '@mui/joy'
import { Cached, Logout } from '@mui/icons-material'
import { Bar } from '../../../common/components/containers/Bar.tsx'
import React from 'react'
import { useAuth } from '../../../app/auth/useAuth.ts'
import { useCalendar } from '../useCalendar.ts'
import { useTranslation } from 'react-i18next'
import { Scroller } from '../../../common/components/containers/Scroller.tsx'
import { StyledDivider } from '../../../common/components/widgets/StyledDivider.tsx'
import { CalendarTable } from './CalendarTable.tsx'

/**
 * Left sidebar containing a calendar
 * Loads and manages and displays the calendar
 * Additionally renders logout button at the bottom
 */
export function CalendarBar() {
    const { t } = useTranslation()
    const { logout, getRoles } = useAuth()
    const { calendarEntries, loadNewCalendar } = useCalendar()

    const canManage = getRoles().includes('document-manager')

    return (
        <Bar>
            <Header
                // calendarEntries.length - 1: -1 for not counting the event 'today'
                title={`${t('Calendar')} (${calendarEntries.length - 1})`}
                rightNode={
                    (canManage &&
                        <IconButton color='primary' onClick={loadNewCalendar}>
                            <Cached />
                        </IconButton>
                    )
                }
            />

            <MainContent>
                <Scroller>
                    <CalendarTable calendarEntries={calendarEntries} />
                </Scroller>
            </MainContent>

            <StyledDivider />

            <Row alignItems='center' padding={1}>
                <Button
                    color='neutral'
                    variant='outlined'
                    startDecorator={<Logout />}
                    onClick={logout}
                >
                    {t('Logout')}
                </Button>
            </Row>
        </Bar>
    )
}
