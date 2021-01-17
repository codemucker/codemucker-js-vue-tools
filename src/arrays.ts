/**
 * Due to Vue not being able to detect array.length=0 (due to javascript limitations) we add a conventince method
 * to clear the array that vue does pickup
 *
 * https://vuejs.org/v2/guide/reactivity.html#Change-Detection-Caveats
 *
 * @param array
 */
export function emptyArray(array: Array<unknown>): void {
  if (!array) {
    return
  }
  while (array.length > 0) {
    array.pop()
  }
}

export function replaceArray<T>(array: Array<T>, items: T[]): void {
  if (!array) {
    return
  }
  emptyArray(array)
  array.push(...items)
}

/**
 * Return a new array with the element at the given position replaced
 */
export function replaceArrayItem<T>(array: Array<T>, index:number, item: T): T[] { 
  return [...array.slice(0, index), item, ...array.slice(index+1)]
}
