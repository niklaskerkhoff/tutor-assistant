import { Row } from '../containers/flex-layout.tsx'
import { range } from '../../utils/array-utils.ts'
import { useState } from 'react'
import { Star, StarOutline } from '@mui/icons-material'
import { isPresent } from '../../utils/utils.ts'

interface Props {
    max: number
    rating: number
    onSelect: (rating: number) => void
}

/**
 * Picker of star icons
 *
 * Controlled component
 *
 * @param max number of stars
 * @param rating currently selected. Takes values from 1 to max (both inclusive)
 * @param onSelect function called when a star is clicked. Takes the rating
 * @constructor
 */
export function StarRater({ max, rating, onSelect }: Props) {
    const [preview, setPreview] = useState<number>()

    function isFilled(index: number) {
        return index + 1 <= (isPresent(preview) ? preview : rating)
    }

    function handleSelection(index: number) {
        onSelect(index + 1)
    }

    return (
        <Row alignItems='center'>
            {range(0, max).map((_, index) => (
                <RatingStar
                    key={index}
                    isFilled={isFilled(index)}
                    onClick={() => handleSelection(index)}
                    onMouseOver={() => setPreview(index + 1)}
                    onMouseOut={() => setPreview(undefined)}
                />
            ))}
        </Row>
    )
}

interface RatingStarProps {
    isFilled: boolean
    onClick: () => void
    onMouseOver: () => void
    onMouseOut: () => void
}

function RatingStar({ isFilled, onClick, onMouseOver, onMouseOut }: RatingStarProps) {
    return (
        isFilled
            ? (<Star onClick={onClick} onMouseOver={onMouseOver} onMouseOut={onMouseOut} />)
            : (<StarOutline onClick={onClick} onMouseOver={onMouseOver} onMouseOut={onMouseOut} />)
    )
}