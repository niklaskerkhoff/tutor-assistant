/**
 * CalenderEntry based on backend data type
 * @property title of the event
 * @property date representation of the datetime of the event
 * @property time representation of the datetime of the event
 * @property isCurrentDate true if datetime is today else false
 */
export interface CalendarEntry {
    title: string
    date: string
    time?: string
    isCurrentDate: boolean
}
