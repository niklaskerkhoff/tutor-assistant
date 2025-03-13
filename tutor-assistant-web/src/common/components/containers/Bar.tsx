import { styled } from '@mui/joy'
import { VStack } from './flex-layout.tsx'

const barWidth = '380px'

/**
 * Sidebar with surface background based on a VStack
 *
 * Supports className 'right' to change styling when used as a bar on the right
 */
export const Bar = styled(VStack)`
    min-width: ${barWidth};
    width: ${barWidth};
    max-width: ${barWidth};
    background: ${props => props.theme.palette.background.surface};
    border-right: 1px solid ${props => props.theme.palette.divider};

    &.right {
        border-right: none;
        border-left: 1px solid ${props => props.theme.palette.divider};
    }
`
