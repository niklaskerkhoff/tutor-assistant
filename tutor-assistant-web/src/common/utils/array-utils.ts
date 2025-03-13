import { isNotPresent } from './utils.ts'

/**
 * Appends an item to the end of an array
 *
 * Pure function
 * @param item to append
 * @param array to updated
 * @returns a new array with the new item
 */
export function append<T>(item: T, array: T[]) {
    return [...array, item]
}

/**
 * Updates an object with an id in an array
 *
 * Finds the object to update by the id
 *
 * Pure function
 * @param item to update
 * @param array to update
 * @returns a new array with the item updated if the id is present else the original array
 */
export function update<T extends { id?: string }>(item: T, array: T[]) {
    if (isNotPresent(item.id)) return array
    return array.map(item => item.id === item.id ? item : item)
}

/**
 * Removes an object with an id in an array
 *
 * Pure function
 * @param item either an id or an object with an id to be removed
 * @param array to update
 * @returns a new array without the object with the given id
 */
export function remove<T extends { id?: string }>(item: T | string, array: T[]) {
    const id = typeof item === 'string' ? item : item.id
    return array.filter(it => it.id !== id)
}

/**
 * last index of a given array
 *
 * Pure function
 * @param array
 * @returns the last index of the array or -1
 */
export function lastIndex(array: any[]) {
    return array.length - 1
}

/**
 * last element of a given array
 *
 * Pure function
 * @param array
 * @returns last element of the array or undefined
 */
export function last<T>(array: T[]) {
    if (empty(array)) return undefined
    return array[lastIndex(array)]
}

/**
 * checks if a given array has no elements
 *
 * Pure function
 * @param array
 * @returns if the array is empty
 */
export function empty(array: unknown[]) {
    return array.length === 0
}

export function notEmpty(array: unknown[]) {
    return !empty(array)
}


/**
 * Partitions an array into two arrays
 *
 * Pure function
 * @param predicate to partition the array
 * @param array to be partitioned
 * @returns an array with two elements
 *  The first array contains all elements of the array for which predicate returns true,
 *  the second array contains all other elements
 */
export function partition<T>(predicate: (item: T) => boolean, array: T[]) {
    const result = [[], []] as [T[], T[]]
    array.forEach(item => predicate(item) ? result[0].push(item) : result[1].push(item))
    return result
}

/**
 * Checks, if two arrays have at least one common element
 *
 * Pure function
 * @param array1 first array
 * @param array2 second array
 * @returns true if the arrays have at least one common array else false
 */
export function haveCommonElements<T>(array1: T[], array2: T[]): boolean {
    const set1 = new Set(array1)
    for (const item of array2) {
        if (set1.has(item)) {
            return true
        }
    }
    return false
}

/**
 * Creates an array with all integers between the given integers in ascending order
 *
 * @param start integer inclusive
 * @param end integer exclusive
 * @returns an array with integers from start to end
 */
export function range(start: number, end: number) {
    let result = []
    for (let i = start; i < end; i++) {
        result.push(i)
    }
    return result
}
