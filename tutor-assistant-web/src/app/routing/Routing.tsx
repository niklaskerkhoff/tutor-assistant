import { Navigate, Route, Routes } from 'react-router-dom'
import { ChatPage } from '../../modules/chat/ChatPage.tsx'
import { Authenticated } from '../auth/Authenticated.tsx'
import { DocumentsPage } from '../../modules/documents/DocumentsPage.tsx'
import { ChatProvider } from '../../modules/chat/ChatProvider.tsx'

/**
 * Configures routing
 * Sub routes might be configured in child components
 */
export function Routing() {

    return (
        <Routes>

            <Route index element={<Navigate to='/chats' replace={true} />} />

            <Route
                path='/chats/:chatId?' element={
                <Authenticated>
                    <ChatProvider>
                        <ChatPage />
                    </ChatProvider>
                </Authenticated>
            }
            />

            <Route
                path='/documents' element={
                <Authenticated>
                    <DocumentsPage />
                </Authenticated>
            }
            />

        </Routes>
    )
}
