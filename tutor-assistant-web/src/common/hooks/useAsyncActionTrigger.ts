import { useEffect, useState } from 'react'

/**
 * Performs an async action if it can. Retries on given triggers.
 *
 * @param action to be performed.
 * @param canPerformAction function returning if action can be performed.
 * @param triggers to retry performing the action
 *
 * @returns
 *      * isProcessing: if the action is waiting to be performed or currently performing.
 *      * process: function for starting to try to perform the action.
 */
export function useAsyncActionTrigger(
    action: () => Promise<unknown>,
    canPerformAction: () => boolean,
    triggers: unknown[],
): [boolean, () => void] {
    const [isProcessing, setIsProcessing] = useState(false)

    function process() {
        setIsProcessing(true)
    }

    useEffect(() => {
        if (isProcessing && canPerformAction()) {
            doAction()
        }
    }, [...triggers, isProcessing])

    async function doAction() {
        await action()
        setIsProcessing(false)
    }

    return [
        isProcessing,
        process,
    ]
}
