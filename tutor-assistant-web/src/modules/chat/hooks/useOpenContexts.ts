import { useFileResources } from './useFileResources.ts'
import { ChatMessageContext } from '../chat-model.ts'
import { isNotPresent } from '../../../common/utils/utils.ts'


/**
 * Opens a context from a website-resource or file-resource inside the browser.
 * @see useFileResources
 */
export function useOpenContexts() {
    const { loadFile } = useFileResources()

    function openContexts(context: ChatMessageContext | string | undefined) {
        if (isNotPresent(context)) return
        const key = typeof context === 'string' ? context : context.originalKey
        if (isNotPresent(key)) return

        if (key.startsWith('http')) {
            window.open(key, '_blank')
        } else {
            loadFile(key)
        }
    }

    return {
        openContexts,
    }
}