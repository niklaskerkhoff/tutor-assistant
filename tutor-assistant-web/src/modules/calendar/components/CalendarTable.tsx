import { isPresent } from '../../../common/utils/utils.ts'
import React from 'react'
import { CalendarEntry } from '../calendar-model.ts'
import { styled } from '@mui/joy'
import classNames from 'classnames'

interface Props {
    calendarEntries: CalendarEntry[]
}

/**
 * Renders calendar entries in a table
 *
 * @param calendarEntries to be rendered
 */
export function CalendarTable({ calendarEntries }: Props) {
    return (
        <table className='noTableMargin'>
            <thead>
            <tr>
                <th>Datum</th>
                <th>Ereignis</th>
            </tr>
            </thead>
            <tbody>
            {calendarEntries.map((entry, index) => (
                <TableRow key={index} className={classNames({ current: entry.isCurrentDate })}>
                    <td>
                        {entry.date} {isPresent(entry.time) && <><br />({entry.time}&nbsp;Uhr)</>}
                    </td>
                    <td>{entry.title}</td>
                </TableRow>
            ))}
            </tbody>
        </table>
    )
}

const TableRow = styled('tr')`
    &.current {
        background: ${props => props.theme.palette.background.level2};
    }
`
