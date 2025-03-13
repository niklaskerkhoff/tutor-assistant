import React, { useEffect, useMemo, useRef, useState } from 'react'
import { byNumberReverse, isNotPresent, stringToNumber } from '../../utils/utils.ts'
import { last } from '../../utils/array-utils.ts'
import { HStack, MainContent, VStack } from './flex-layout.tsx'
import { Scroller } from './Scroller.tsx'

type WidthColumnCount = { [width: number]: number }

interface Props<T> {
    columnCounts: WidthColumnCount | number
    values: T[]
    render: (value: T) => React.ReactNode
    fill: 'vertical' | 'horizontal'
    spacing?: number
}

/**
 * Renders items in a column layout
 *
 * @param columnCounts defines the number of columns absolutely or dependent of the window width (in px):
 *              Examples: 3, {0: 1, 400: 2, 800: 3}
 * @param fill either vertical-wise or horizontal-wise
 * @param values to be rendered
 * @param render applied on each value
 * @param spacing between the rendered items. Defaults to 0
 * @constructor
 */
export function ColumnLayout<T>({ columnCounts, fill, values, render, spacing }: Props<T>) {

    if (isNotPresent(spacing)) spacing = 0

    const wrapperRef = useRef<HTMLDivElement>(null)
    const [wrapperWidth, setWrapperWidth] = useState(0)

    const items = useMemo(() => {

        if (fill === 'vertical') {
            return getFilledVertical()
        } else {
            return getFilledHorizontal()
        }

    }, [getCount(), values])


    function getKey() {
        const widthColumnCounts = columnCounts as WidthColumnCount

        const keys = Object.keys(widthColumnCounts).map(it => stringToNumber(it)).sort(byNumberReverse)

        for (const key of keys) {
            if (key < wrapperWidth) return key
        }

        return last(keys)
    }

    function getCount() {
        if (typeof columnCounts === 'number') return columnCounts
        return columnCounts[getKey()!]
    }

    function getFilledVertical() {
        const count = getCount()
        const result: T[][] = []

        for (let i = 0; i < count; i++) {
            result.push([])
        }

        let currentColumn = 0
        const itemsPerColumn = Math.ceil(values.length / count)

        for (let i = 0; i < values.length; i++) {
            result[currentColumn].push(values[i])

            if (result[currentColumn].length >= itemsPerColumn) {
                currentColumn++
            }
        }

        return result
    }

    function getFilledHorizontal() {
        const count = getCount()
        const result: T[][] = []

        for (let i = 0; i < count; i++) {
            result.push([])
        }

        for (let i = 0; i < values.length; i++) {
            result[i % count].push(values[i])
        }

        return result
    }


    useEffect(() => {
        const resizeHandler = () => {
            setWrapperWidth(wrapperRef.current?.offsetWidth ?? 0)
        }

        window.addEventListener('resize', resizeHandler)

        return () => {
            window.removeEventListener('resize', resizeHandler)
        }
    }, [])

    useEffect(() => {
        setWrapperWidth(wrapperRef.current?.offsetWidth ?? 0)
    }, [wrapperRef.current])


    return (
        <HStack ref={wrapperRef} columnGap={spacing}>

            {
                items.map((item, index) => (
                    <MainContent key={index}>
                        <Scroller>
                            <VStack rowGap={spacing}>
                                {
                                    item.map((value, index) => (
                                        <React.Fragment key={index}>
                                            {render(value)}
                                        </React.Fragment>
                                    ))
                                }
                            </VStack>
                        </Scroller>
                    </MainContent>

                ))
            }

        </HStack>
    )
}
