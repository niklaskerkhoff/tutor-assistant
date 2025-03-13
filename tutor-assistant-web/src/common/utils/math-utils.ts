/**
 * Rounds a value to decimals
 *
 * @param value to be rounded
 * @param decimals to which the value is supposed to be rounded
 */
export function roundTo(value: number, decimals: number) {
    const factor = Math.pow(10, decimals)
    return Math.round(value * factor) / factor
}