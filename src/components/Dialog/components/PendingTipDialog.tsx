import React from 'react'
import { Typography, Box } from '@mui/material'
import BaseTransactionDialog, { BaseTransactionDialogProps } from '../baseTransactionDialog'
import LoadingAnimation from 'components/Loading'

export interface PendingTipDialogProps extends Omit<BaseTransactionDialogProps, 'children'> {
  title: string
  subTitle?: string
}
const PendingTipDialog = (props: PendingTipDialogProps) => {
  const { subTitle, title, againBtn, ...rest } = props
  return (
    <BaseTransactionDialog {...rest} disabled againBtn={againBtn ?? 'Awaiting...'} close>
      <Typography variant="h4" sx={{ color: 'var(--ps-text-inverted)', fontWeight: 500 }}>
        {title}
      </Typography>
      <Typography variant="body1" sx={{ color: 'var(--ps-text-neutral6)' }} mt={24}>
        {subTitle}
      </Typography>
      <Box>
        <Box
          sx={{
            display: 'grid',
            placeContent: 'center',
            width: 220,
            height: 220,
            margin: '0 auto'
          }}
        >
          <LoadingAnimation />
        </Box>
      </Box>
    </BaseTransactionDialog>
  )
}

export default PendingTipDialog
