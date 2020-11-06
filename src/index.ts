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

/** WARNING WARNING  !!DO NOT EDIT!! this is an auto-generated file from 'codegen/ts/SourceWriter.js' 
and any changes WILL BE OVERWRITTEN WARNING WARNING */
export function replaceArray<T>(array: Array<T>, items: T[]): void {
  if (!array) {
    return
  }
  emptyArray(array)
  array.push(...items)
}
