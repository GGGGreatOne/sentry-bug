import React from 'react'
import { Typography, Box } from '@mui/material'
import SuccessSvg from 'assets/svg/dialog/success.svg'
import ErrorSvg from 'assets/svg/dialog/error.svg'
import BaseTransactionDialog, { BaseTransactionDialogProps } from '../baseTransactionDialog'

export interface ResultTipDialogProps extends Omit<BaseTransactionDialogProps, 'children'> {
  iconType: 'success' | 'error'
  title: string
  subTitle?: string
}
const ResultTipDialog = (props: ResultTipDialogProps) => {
  const { iconType, title, subTitle, ...rest } = props
  return (
    <BaseTransactionDialog {...rest}>
      <Typography variant="h4" sx={{ color: '#FFFFE5', fontWeight: 500, fontSize: 20 }}>
        {title}
      </Typography>
      <Typography variant="body1" sx={{ color: '#BCBCBC' }} mt={24}>
        {subTitle}
      </Typography>
      <Box my={40}>
        {iconType === 'success' && <SuccessSvg />}
        {iconType === 'error' && <ErrorSvg />}
      </Box>
    </BaseTransactionDialog>
  )
}

export default ResultTipDialog
