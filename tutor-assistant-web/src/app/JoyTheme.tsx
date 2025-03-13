import * as React from 'react'
import { CssVarsProvider } from '@mui/joy/styles'
import { ChildrenProps } from '../common/types.ts'

/**
 * Provides the base theme for the app
 * @param children to be rendered
 */
export function JoyTheme({ children }: ChildrenProps) {
    return (
        <CssVarsProvider defaultMode='system' disableNestedContext>
            {children}
        </CssVarsProvider>
    )
}
