import { Box, Stack, styled } from '@mui/joy'

/**
 * Full-width, full-height vertical stack with flex layout
 */
export const VStack = styled(Stack)`
    margin: 0 !important;
    flex-direction: column;
    width: 100%;
    height: 100%;
    overflow-y: hidden;
`

/**
 * Full-width, full-height horizontal stack with flex layout
 */
export const HStack = styled(Stack)`
    margin: 0 !important;
    flex-direction: row;
    width: 100%;
    height: 100%;
    overflow-y: hidden;
`

export const Column = styled(Stack)`
    margin: 0 !important;
    flex-direction: column;
    height: 100%;
    overflow-y: hidden;
`

/**
 * Full-width, min-height horizontal stack with flex layout
 */
export const Row = styled(Stack)`
    margin: 0 !important;
    flex-direction: row;
    width: 100%;
`

/**
 * Extending content inside a flex container
 */
export const MainContent = styled(Box)`
    width: 100%;
    height: 100%;
    flex: 1;
    overflow: hidden;
`

/**
 * Creating empty space between items in a flex container in order to create maximum space between items
 */
export const Spacer = styled('span')`
    flex: 1;
`
