import { emptyArray, replaceArray } from '@/index'

test('empties array', () => {
  let array = ['1', '2']
  emptyArray(array)
  expect(array).toStrictEqual([])
})
test('replaces array', () => {
  let array = ['1', '2']
  replaceArray(array, ['3', '4'])
  expect(array).toStrictEqual(['3', '4'])
})
