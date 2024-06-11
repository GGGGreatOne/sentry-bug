import { Box, Button, Stack, styled, Typography } from '@mui/material'

import BaseDialog from 'components/Dialog/baseDialog'
import Input from 'components/Input'
import { useCallback, useMemo, useState } from 'react'
import LoadingButton from '@mui/lab/LoadingButton'
import CurrencyLogo from 'components/essential/CurrencyLogo'
import { Currency, CurrencyAmount } from 'constants/token'
import { useStakingPool } from 'plugins/bitFarm/hooks/useStakingPool'
import { viewControl } from 'views/editBox/modal'
import { formatStringLength } from 'utils'

const StyleLabel = styled(Typography)(({ theme }) => ({
  width: '100%',
  fontSize: '15px',
  fontWeight: 500,
  lineHeight: '15px',
  maxWidth: 'max-content',
  color: 'var(--ps-neutral3)',
  [theme.breakpoints.down('md')]: {
    fontSize: 13
  }
}))

const InputStyle = styled(Input)(({ theme }) => ({
  '&.MuiInputBase-root': {
    height: '44px',
    minHeight: '44px',
    borderRadius: '4px',
    background: 'transparent',
    paddingLeft: '16px',
    paddingRight: '24px'
  },
  '& .MuiInputBase-input::placeholder': {
    fontSize: '16px',
    fontWeight: 400,
    lineHeight: 1.4,
    color: 'var(--ps-text-60)'
  },
  '& span': {
    padding: '0 !important'
  },
  [theme.breakpoints.down('md')]: {
    '&.MuiInputBase-root': {
      height: 40,
      minHeight: 40,
      borderRadius: '4px',
      background: 'transparent',
      paddingLeft: '16px',
      paddingRight: '16px'
    }
  }
}))

const Row = styled(Box)(() => ({
  width: '100%',
  display: 'flex',
  justifyContent: 'space-between',
  alignItems: 'center'
}))

const StyleInputEndAdornment = styled(Box)(() => ({
  width: 'max-content',
  height: '100%',
  display: 'flex',
  gap: '8px',
  alignItems: 'center'
}))

const StyleLoadingButton = styled(LoadingButton)(({ theme }) => ({
  height: 44,
  [theme.breakpoints.down('md')]: {
    height: 36
  }
}))

export default function UnStakeTokenModal({
  boxAddress,
  stakingAddress,
  stakeToken,
  onSuccess,
  isLPToken,
  token0,
  token1
}: {
  boxAddress?: string | undefined
  stakingAddress?: string | undefined
  stakeToken?: Currency | undefined
  onSuccess?: () => void
  isLPToken?: boolean
  token0?: Currency | undefined
  token1?: Currency | undefined
}) {
  const [tokenAmount, setTokenAmount] = useState<string>('')
  const [loading, setLoading] = useState<boolean>(false)
  const _unStakeTokenAmount = useMemo(() => {
    if (stakeToken && tokenAmount) {
      return CurrencyAmount.fromAmount(stakeToken, tokenAmount)
    }
    return undefined
  }, [stakeToken, tokenAmount])

  const symbol = useMemo(() => {
    if (isLPToken) {
      return `${formatStringLength(token0?.symbol) || '--'} / ${formatStringLength(token1?.symbol) || '--'}`
    }
    return formatStringLength(stakeToken?.symbol) || '--'
  }, [isLPToken, stakeToken?.symbol, token0?.symbol, token1?.symbol])

  const unStakeSummary = `Successfully unStake ${_unStakeTokenAmount?.toSignificant(4)} ${symbol}`

  const { pool, unStakeCallback } = useStakingPool(boxAddress, stakingAddress, { unStakeSummary })

  const onClose = () => {
    onSuccess?.()
    setTokenAmount('')
    viewControl.hide('UnStakeTokenModal')
  }

  const Submit = useCallback(async () => {
    setLoading(true)
    try {
      if (!_unStakeTokenAmount) return
      const res = await unStakeCallback(_unStakeTokenAmount)
      console.log('🚀 ~ Submit ~ res:', res)
      setLoading(false)
      onClose()
    } catch (error) {
      console.error(error)
      onClose()
      setLoading(false)
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [_unStakeTokenAmount, unStakeCallback])

  const bt = useMemo(() => {
    if (!_unStakeTokenAmount?.greaterThan('0')) {
      return (
        <StyleLoadingButton disabled variant="contained">
          Enter an amount
        </StyleLoadingButton>
      )
    }

    if (
      (_unStakeTokenAmount && pool?.myStakedOf?.lessThan(_unStakeTokenAmount)) ||
      !pool?.myStakedOf?.greaterThan('0')
    ) {
      return (
        <StyleLoadingButton disabled variant="contained">
          Insufficient Balance
        </StyleLoadingButton>
      )
    }

    return (
      <StyleLoadingButton loading={loading} disabled={!tokenAmount || loading} variant="contained" onClick={Submit}>
        Confirm
      </StyleLoadingButton>
    )
  }, [Submit, _unStakeTokenAmount, pool?.myStakedOf, tokenAmount, loading])

  return (
    <BaseDialog title="UnStake" close onClose={onClose}>
      <Stack spacing={16} width={{ xs: '100%', md: 402 }}>
        <Stack spacing={12}>
          <Row>
            <StyleLabel>Amount</StyleLabel>
            {isLPToken ? (
              <Typography>
                Available: {pool?.myStakedOf?.toSignificant(6) || '0'} {formatStringLength(token0?.symbol) || '--'}/
                {formatStringLength(token1?.symbol) || '--'}
              </Typography>
            ) : (
              <Typography>
                Available: {pool?.myStakedOf?.toSignificant(6) || '0'} {formatStringLength(stakeToken?.symbol) || '--'}
              </Typography>
            )}
          </Row>
          <InputStyle
            type="unumber"
            hasBorder
            outlined
            value={tokenAmount}
            onValue={e => {
              setTokenAmount(e)
            }}
            placeholder="Enter"
            endAdornment={
              <StyleInputEndAdornment>
                <Button
                  variant="contained"
                  sx={{
                    maxWidth: { xs: 46, md: 58 },
                    height: { xs: 21, md: 30 },
                    borderRadius: '4px',
                    padding: { xs: '2px 10px', md: '6px 16px' }
                  }}
                  onClick={() => {
                    setTokenAmount(pool?.myStakedOf?.toExact() || '0')
                  }}
                >
                  Max
                </Button>
                <Box
                  sx={{
                    display: 'flex',
                    gap: '4px',
                    alignItems: 'center'
                  }}
                >
                  <CurrencyLogo currencyOrAddress={stakeToken?.address} size="24px" />
                  <Typography
                    sx={{
                      fontSize: '14px',
                      fontWeight: 400,
                      lineHeight: '20px'
                    }}
                  >
                    {formatStringLength(stakeToken?.symbol) || '--'}
                  </Typography>
                </Box>
              </StyleInputEndAdornment>
            }
          />
        </Stack>

        {bt}
      </Stack>
    </BaseDialog>
  )
}
