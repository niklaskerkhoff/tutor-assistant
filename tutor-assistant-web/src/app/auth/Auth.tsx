import { createContext } from 'react'
import axios, { AxiosInstance } from 'axios'
import { chill, isNotPresent } from '../../common/utils/utils.ts'
import { ChildrenProps } from '../../common/types.ts'
import { useKeycloak } from '@react-keycloak/web'

type AuthContextType = {
    getAuthHttp: () => AxiosInstance,
    isLoggedIn: () => boolean,
    openLogin: () => void,
    logout: () => void,
    getRoles: () => string[]
}

/**
 * Use only through useAuth
 *
 * Provides:
 *  getAuthHttp: returns a REST client with authorization headers set if the user is logged in
 *  isLoggedIn: if the user is logged in.
 *  openLogin: opens the login page of the identity provider.
 *  logout: logouts the user
 *  getRoles: returns the users roles
 */
export const AuthContext = createContext<AuthContextType>({
    getAuthHttp: () => axios,
    isLoggedIn: () => false,
    openLogin: chill,
    logout: chill,
    getRoles: () => [],
})


/**
 * Applies AuthContext
 *
 * @param children wrapped by this context provider
 */
export function Auth({ children }: ChildrenProps) {

    const { keycloak, initialized } = useKeycloak()


    function isLoggedIn() {
        return keycloak.authenticated ?? false
    }

    if (!initialized) return <></>

    function getAuthHttp() {
        if (!keycloak.authenticated || isNotPresent(keycloak.token)) {
            keycloak.login()
            return axios
        }

        return axios.create({
            headers: {
                Authorization: `Bearer ${keycloak.token}`,
            },
        })
    }

    return (
        <AuthContext.Provider
            value={{
                getAuthHttp,
                isLoggedIn,
                openLogin: keycloak.login,
                logout: keycloak.logout,
                getRoles: () => keycloak.tokenParsed?.realm_access?.roles ?? [],
            }}
        >
            {children}
        </AuthContext.Provider>
    )
}



