import { Box, styled } from '@mui/joy'

/**
 * Applies global styling according to the theme
 */
export const Main = styled(Box)`
    width: 100%;
    height: 100%;

    table.noTableMargin {
        margin-bottom: 0;
    }

    &.noTableMargin > table {
        margin-bottom: 0;
    }

    table {
        border-spacing: 0;
        border-collapse: collapse;
        display: block;
        margin-top: 0;
        margin-bottom: 16px;
        width: max-content;
        max-width: 100%;
        border-color: ${props => props.theme.palette.divider};
        background: ${props => props.theme.palette.background.surface};
    }

    thead {
        border-bottom: 2px solid ${props => props.theme.palette.divider};
    }

    td, th {
        padding: 6px 13px;
        border: 1px solid ${props => props.theme.palette.divider};
    }

    th {
        font-weight: bold;
    }

    table tr:first-of-type th {
        border-top: none;
    }

    table tr *:first-of-type {
        border-left: none;
    }

    table tr *:last-child {
        border-right: none;
    }

    table tr:last-child td {
        border-bottom: none;

    }

    table img {
        background-color: transparent;
    }
`
