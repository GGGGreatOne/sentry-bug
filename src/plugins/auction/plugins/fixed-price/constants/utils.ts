import { isAddress } from 'utils'

export function formatInput(input: string) {
  const regexNumber = /\b\d+(\.\d+)?\b/g
  console.log(
    'input',
    input
      .split('\n')
      .join('')
      .split('')
      .map(i => i.trim())
      .join('')
  )

  const arr = input
    .split('\n')
    .filter(v => v.length > 42)
    .filter(v => isAddress(v.substring(0, 42)))
    .filter(v => {
      const result = v.substring(42).match(regexNumber)
      return result && Number(result[0]) > 0 && isFinite(Number(result[0]))
    }) // contain number
    .map(v => {
      return [v.substring(0, 42), v.substring(42).match(regexNumber)?.[0]]
    })
    .filter((v, i, arr) => {
      const _arr = arr.slice(i + 1)
      return _arr.flat().findIndex(i => i?.toLocaleLowerCase() === v[0]?.toLocaleLowerCase()) === -1
    })

  const recipients: string[] = []
  const amount: string[] = []

  arr.forEach(v => {
    v[0] && recipients.push(v[0])
    v[1] && amount.push(v[1])
  })
  const addressWithAmountArr = arr.reduce((newArr, value) => {
    newArr.push(value.join(','))
    return newArr
  }, [])
  return [recipients, amount, arr, addressWithAmountArr]
}
