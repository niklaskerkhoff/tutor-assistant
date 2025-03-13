import { ChildrenProps } from '../../common/types.ts'
import { useAuth } from './useAuth.ts'
import { isPresent } from '../../common/utils/utils.ts'
import { haveCommonElements } from '../../common/utils/array-utils.ts'

interface Props extends ChildrenProps {
    roles?: string[]
}

/**
 * Protects a component from rendering based on the users authentication and authorization
 *
 * @param children rendered iff the user is logged in and has the required roles
 * @param roles the user must have in order to render the children
 */
export function Authenticated({ children, roles }: Props) {
    const { isLoggedIn, openLogin, getRoles } = useAuth()


    if (!isLoggedIn()) {
        openLogin()
        return <></>
    }

    if (isPresent(roles) && !haveCommonElements(roles, getRoles())) {
        return <></>
    }

    return children
}
