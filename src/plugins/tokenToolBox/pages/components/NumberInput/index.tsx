import { OutlinedInput, OutlinedInputProps } from '@mui/material'

export type NumberInputProps = OutlinedInputProps & {
  value?: string
  onUserInput: (value: string) => void
}

// esacape special characters -> match escaped "." -> replace commas with periods

// match escaped "." characters via in a non-capturing group
// 0~n digit + . + 0~n digit
const inputRegex = RegExp(`^\\d*(?:\\\\[.])?\\d*$`)

// The replacement result you get is each match in your string being escaped by a literal backslash (represented by \\).
const escapeRegExp = (string: string): string => {
  return string.replace(/[.*+?^${}()|[\]N\\]/g, '\\$&') // $& means the whole matched string
}

const NumberInput = ({ value, onUserInput, ...rest }: NumberInputProps) => {
  const enforcer = (nextUserInput: string) => {
    if (nextUserInput === '' || inputRegex.test(escapeRegExp(nextUserInput))) {
      onUserInput(nextUserInput)
    }
  }

  return (
    <OutlinedInput
      {...rest}
      autoComplete="off"
      autoCorrect="off"
      spellCheck="false"
      type="text"
      value={value}
      onChange={event => {
        // replace commas with periods, because we exclusively uses period as the decimal separator
        enforcer(event.target.value.replace(/,/g, '.'))
        console.log('enforcer result: ', enforcer(event.target.value.replace(/,/g, '.')))
      }}
    />
  )
}

export default NumberInput
