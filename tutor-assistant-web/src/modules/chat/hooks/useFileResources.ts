import { useAuth } from '../../../app/auth/useAuth.ts'
import { apiBaseUrl } from '../../../app/base.ts'


/**
 * Opens a file-resource inside the browser.
 */
export function useFileResources() {
    const { getAuthHttp } = useAuth()

    async function loadFile(id: string) {
        const response = await getAuthHttp().get(`${apiBaseUrl}/embedding_manager/resources/${id}`, {
            responseType: 'blob',
        })

        const blobUrl = URL.createObjectURL(response.data)
        window.open(blobUrl, '_blank')

        setTimeout(() => URL.revokeObjectURL(blobUrl), 30_000)
    }

    return {
        loadFile,
    }
}