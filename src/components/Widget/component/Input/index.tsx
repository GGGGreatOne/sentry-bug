import React, { ChangeEvent, InputHTMLAttributes } from 'react'
import { InputBase, useTheme } from '@mui/material'
import InputLabel from './InputLabel'

export interface InputProps {
  placeholder?: string
  value: string
  onChange?: (e: ChangeEvent<HTMLInputElement>) => void
  label?: string
  disabled?: boolean
  focused?: boolean
  // outlined?: boolean
  type?: string
  startAdornment?: React.ReactNode
  endAdornment?: React.ReactNode
  maxWidth?: string | number
  height?: string | number
  error?: boolean
  multiline?: boolean
  rows?: string | number
  isBlackBg?: boolean
  // smallPlaceholder?: boolean

  helperText?: string
  borderRadius?: string
  requiredLabel?: boolean
}

export default function Input({
  focused,
  placeholder,
  onChange,
  value,
  disabled,
  type,
  // outlined,
  startAdornment,
  endAdornment,
  maxWidth,
  label,
  height,
  error,
  multiline,
  rows,
  // smallPlaceholder,
  helperText,
  borderRadius = '8px',
  requiredLabel,
  isBlackBg,
  ...rest
}: InputProps & Omit<InputHTMLAttributes<HTMLInputElement>, 'color' | 'outline' | 'size'>) {
  const theme = useTheme()

  return (
    <div style={{ width: '100%', maxWidth: maxWidth || 'unset' }}>
      {label && (
        <InputLabel required={requiredLabel} helperText={helperText}>
          {label}
        </InputLabel>
      )}
      <InputBase
        sx={{
          height: multiline ? 'auto' : height || 'max-content',
          borderRadius,
          padding: 0,
          zIndex: 1,
          color: isBlackBg ? '#ffffff' : '#20201E',
          // background: error ? 'red' : 'transparent',
          '&.Mui-focused:before': {
            display: 'none'
          },
          '& .MuiInputBase-input': {
            // height: '100%',
            padding: `0 ${endAdornment ? '60px' : '0'} 0 ${startAdornment ? '60px' : '0'}`,
            backgroundClip: 'padding-box',
            boxSizing: 'border-box',
            borderRadius,
            fontSize: 36,
            maxWidth: '100%'
            // textOverflow: 'ellipsis',
            // whiteSpace: 'nowrap',
            // overflow: 'hidden'
          },
          '& .MuiInputBase-input.Mui-disabled': {
            WebkitTextFillColor: theme.palette.text.secondary,
            opacity: theme.palette.action.disabledOpacity
          },
          '&.Mui-focused .MuiInputBase-input, &:hover .MuiInputBase-input': {
            height: '100%',
            width: '100%',
            padding: `0 ${endAdornment ? '60px' : '0'} 0 ${startAdornment ? '60px' : '0'}`,
            borderRadius
          },
          '&:after': {
            top: -1,
            right: -1,
            bottom: -1,
            left: -1,
            zIndex: -1,
            content: '""',
            borderRadius: `calc(${borderRadius} + 1px)`,
            position: 'absolute',
            background: error ? `${theme.palette.error.main}!important` : 'transparent'
          },
          '&.Mui-disabled:hover:after': {
            background: 'unset'
          },
          '& span': {
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            paddingLeft: 22,
            paddingRight: '0 !important',
            position: 'absolute'
          },
          '&.Mui-focused span': {
            // background: theme.palette.background.default,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            borderRadius: `${borderRadius} 0 0 ${borderRadius}`
          }
        }}
        color={error ? 'error' : 'primary'}
        fullWidth={true}
        placeholder={placeholder}
        inputRef={input => input && focused && input.focus()}
        onChange={onChange}
        value={value}
        multiline={multiline}
        rows={rows}
        disabled={disabled}
        type={type}
        startAdornment={startAdornment && <span style={{ paddingRight: 17 }}>{startAdornment}</span>}
        endAdornment={endAdornment && <span style={{ paddingRight: 20, right: 0 }}>{endAdornment}</span>}
        {...rest}
      />
    </div>
  )
}
