import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { App } from './app/App.tsx'
import './index.css'
import { ReactKeycloakProvider } from '@react-keycloak/web'
import { keycloak } from './app/config/keycloak-config.ts'

import '@fontsource/inter'
import '@fontsource/inter/500.css'
import '@fontsource/inter/600.css'
import '@fontsource/inter/700.css'
import '@fontsource/inter/500-italic.css'
import '@fontsource/inter/600-italic.css'
import '@fontsource/inter/700-italic.css'

// Keycloak must be outside strict mode because of side effects
createRoot(document.getElementById('root')!).render(
    <ReactKeycloakProvider authClient={keycloak}>
        <StrictMode>
            <App />
        </StrictMode>
    </ReactKeycloakProvider>,
)
