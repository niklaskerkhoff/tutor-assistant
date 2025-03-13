import { Row, Spacer } from './flex-layout.tsx'
import { Divider, Typography } from '@mui/joy'
import React, { ReactNode } from 'react'
import { isPresent } from '../../utils/utils.ts'

interface Props {
    title: ReactNode | string
    leftNode?: ReactNode
    rightNode?: ReactNode
}


/**
 * Horizontal bar to render a title with additional items at the top
 *
 * @param title rendered in the middle of the bar
 * @param leftNode rendered at the left border
 * @param rightNode rendered at the right border
 */
export function Header({ title, leftNode, rightNode }: Props) {
    return (
        <>
            <Row alignItems='center' height={36}>
                <Spacer>{isPresent(leftNode) && leftNode}</Spacer>
                {
                    typeof title === 'string'
                        ? <Typography level='title-lg'>{title}</Typography>
                        : title
                }

                <Spacer sx={{ textAlign: 'end' }}>{isPresent(rightNode) && rightNode}</Spacer>
            </Row>
            <Divider />
        </>
    )
}
