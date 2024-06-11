import { InputHTMLAttributes, useCallback, ChangeEvent } from 'react'
import { Box, Button } from '@mui/material'
import Input, { InputProps } from './index'
import { escapeRegExp } from 'utils'
import InputLabel from './InputLabel'
import React from 'react'

const inputRegex = RegExp(`^\\d*(?:\\\\[.])?\\d*$`) // match escaped "." characters via in a non-capturing group

export default function InputNumerical({
  placeholder,
  onChange,
  maxWidth,
  onMax,
  balance,
  label,
  unit,
  endAdornment,
  subStr,
  ...props
}: InputProps &
  InputHTMLAttributes<HTMLInputElement> & {
    onMax?: () => void
    balance?: string
    unit?: string
    endAdornment?: JSX.Element
    onDeposit?: () => void
    subStr?: string
  }) {
  const enforcer = (nextUserInput: string) => {
    const fixed = nextUserInput.replace(/,/g, '.')
    if (fixed === '' || inputRegex.test(escapeRegExp(fixed))) {
      return fixed
    }
    return null
  }
  const handleChange = useCallback(
    (event: ChangeEvent<HTMLInputElement>) => {
      // replace commas with periods
      const formatted = enforcer(event.target.value)
      if (formatted === null) {
        return
      }
      event.target.value = formatted
      onChange && onChange(event)
    },
    [onChange]
  )

  return (
    <Box sx={{ position: 'relative', maxWidth: maxWidth ?? 'unset', width: '100%' }}>
      {(label || balance) && (
        <Box display="flex" justifyContent="space-between">
          <InputLabel>{label}</InputLabel>
          <Box display="flex" alignItems="baseline">
            {!!balance && (
              <InputLabel style={{ fontSize: '15px' }}>
                Available: {balance} {unit ?? 'USDT'}
              </InputLabel>
            )}
          </Box>
        </Box>
      )}
      <Input
        {...props} // universal input options
        maxWidth={maxWidth}
        onChange={handleChange}
        inputMode="decimal"
        title="Token Amount"
        autoComplete="off"
        autoCorrect="off"
        // text-specific options
        type="text"
        pattern="^[0-9]*[.,]?[0-9]*$"
        placeholder={placeholder || '0.0'}
        minLength={1}
        maxLength={79}
        spellCheck="false"
        endAdornment={
          <Box gap="8px" display="flex" alignItems="center" paddingLeft="10px" paddingBottom="2px">
            {onMax && (
              <Button
                disabled={props.disabled === true ? true : false}
                onClick={onMax}
                sx={{
                  color: 'var(--ps-text-primary)',
                  borderRadius: '4px',
                  fontWeight: 500
                }}
                style={{
                  background: '#fff',
                  width: '60px',
                  height: '32px'
                }}
              >
                MAX
              </Button>
            )}
            {endAdornment ? endAdornment : unit && <span>{unit ?? 'USDT'}</span>}
          </Box>
        }
        subStr={subStr}
      />
    </Box>
  )
}
