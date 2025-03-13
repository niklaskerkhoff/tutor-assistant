/**
 * @param value to check
 * @returns if the given value is null or undefined
 */
export function isNotPresent(value: any): value is null | undefined {
    return value === undefined || value === null
}

/**
 * @param value to check
 * @returns if the given value is of its type but not undefined or null
 */
export function isPresent<T>(value: T | undefined | null): value is T {
    return !isNotPresent(value)
}

/**
 * Sorting value for revered soring
 *
 * @param a first value
 * @param b second value
 * @returns positive if a is less than b, negative if a is greater than b, zero if they are equal
 */
export function byNumberReverse(a: number, b: number) {
    return b - a
}

/**
 * Converts a string to a number
 *
 * @param s to be converted
 * @returns a number of the given string
 */
export function stringToNumber(s: string) {
    return +s
}

/**
 * @returns this base url
 */
export function getCurrentBaseUrl() {
    const { protocol, host } = window.location
    return `${protocol}//${host}`
}

/**
 * Function that does nothing
 * Can be used as default value
 */
export const chill = () => undefined
