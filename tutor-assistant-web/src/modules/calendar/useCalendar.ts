import { useEffect, useState } from 'react'
import { useAuth } from '../../app/auth/useAuth.ts'
import { apiBaseUrl } from '../../app/base.ts'
import { CalendarEntry } from './calendar-model.ts'
import { format } from 'date-fns'
import { useTranslation } from 'react-i18next'

/**
 * Loads and manages the calendar
 *
 * Provides
 * @property calendarEntries loaded
 * @property loadNewCalendar requests the creation of a new calendar and loads its entries
 */
export function useCalendar() {
    const { t } = useTranslation()
    const { getAuthHttp } = useAuth()

    const [calendarEntries, setCalendarEntries] = useState<CalendarEntry[]>([])


    useEffect(() => {
        loadCalendarEntries()
    }, [])

    async function loadCalendarEntries() {
        const currentDate = format(new Date(), 'dd.MM.yyyy')
        const url = `${apiBaseUrl}/calendar?currentDate=${currentDate}&currentTitle=${t('Today')}`
        const response = await getAuthHttp().get<CalendarEntry[]>(url)
        setCalendarEntries(response.data)
    }

    async function loadNewCalendar() {
        await getAuthHttp().post<string>(`${apiBaseUrl}/calendar`)
        loadCalendarEntries()
    }

    return {
        calendarEntries,
        loadNewCalendar,
    }
}
