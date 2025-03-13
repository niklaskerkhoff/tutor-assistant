import { getCurrentBaseUrl } from '../common/utils/utils.ts'

const envApiBaseUrl = import.meta.env.VITE_API_BASE_URL as string
const envKeycloakBaseUrl = import.meta.env.VITE_KEYCLOAK_BASE_URL as string

const currentBaseUrl = getCurrentBaseUrl()

/**
 * Backend api url the web frontend is supposed to communicate with
 * Must be configured through env. 'default' uses the same protocol and host as this web frontend
 */
export const apiBaseUrl = envApiBaseUrl !== 'default' ? envApiBaseUrl : `${currentBaseUrl}/api`

/**
 * Keycloak url for authentication and authorization
 * Must be configured through env. 'default' uses the same protocol and host as this web frontend
 */
export const keycloakBaseUrl = envKeycloakBaseUrl !== 'default' ? envKeycloakBaseUrl : `${currentBaseUrl}/auth`
