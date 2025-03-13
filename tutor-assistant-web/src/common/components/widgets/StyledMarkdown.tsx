import { styled } from '@mui/joy'
import Markdown from 'react-markdown'

/**
 * Styling Markdown according to the theme
 */
export const StyledMarkdown = styled(Markdown)`
    code.hljs {
        background: ${props => props.theme.palette.background.surface};
    }
`
