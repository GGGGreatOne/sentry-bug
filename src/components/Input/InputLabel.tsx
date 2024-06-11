import React from 'react'
import { InputLabel as MuiInputLabel } from '@mui/material'
import InfoIcon from '../../assets/svg/info_icon.svg'

export default function InputLabel({
  children,
  infoIcon,
  style
}: {
  children?: React.ReactNode
  infoIcon?: boolean
  style?: React.CSSProperties
}) {
  return (
    <MuiInputLabel
      sx={{
        color: 'var(--ps-text-100)',
        marginBottom: '8px',
        display: 'flex',
        alignItems: 'center'
      }}
    >
      <div
        style={{
          opacity: 0.6,
          fontSize: 12,
          fontWeight: 500,
          lineHeight: '148.69%',
          ...style
        }}
      >
        {children}
      </div>
      {infoIcon && (
        <InfoIcon
          style={{
            marginLeft: 4,
            cursor: 'pointer'
          }}
        />
      )}
    </MuiInputLabel>
  )
}
