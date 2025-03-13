import { useContext } from 'react'
import { AuthContext } from './Auth.tsx'

/**
 * Provides common authentication functionality and common functionality that requires authentication
 */
export function useAuth() {
    return useContext(AuthContext)
}
