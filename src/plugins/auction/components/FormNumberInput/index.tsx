import InputNumerical from 'components/Input/InputNumerical'

type Props = React.ComponentProps<typeof InputNumerical>
// Remove leading zeros from numbers
function removeLeadingZero(str: string, isCanNull: boolean = false) {
  if (str.trim() === '' && !isCanNull) {
    return '0'
  }
  if (str === '0' && str.length === 1) {
    return str
  }
  if (str.startsWith('0') && !str.startsWith('0.')) {
    str = str.replace(/^0+/, '')
    if (str.startsWith('.')) {
      str = '0' + str
    } else if (str.startsWith('0.')) {
      str = '0' + str.substr(1).replace(/^0+/, '')
    }
  }
  return str
}

export default function FormNumberInput(props: Props) {
  return (
    <InputNumerical
      {...props}
      onChange={e => {
        // e.target.selectionStart : The position of the cursor in the input box
        // When entering 0 in the first digit
        const val = e.target.selectionStart === 1 ? e.target.value : removeLeadingZero(e.target.value, true)
        const _event = { ...e }
        _event.target.value = val
        props.onChange?.(_event)
      }}
      onBlur={e => {
        const val = removeLeadingZero(e.target.value)
        const _event = { ...e }
        _event.target.value = val
        props.onBlur?.(_event)
        props.onChange?.(_event as any)
      }}
    />
  )
}
