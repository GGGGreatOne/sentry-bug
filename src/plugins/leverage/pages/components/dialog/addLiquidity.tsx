import { Box, Button, Stack, styled, Typography } from '@mui/material'
import BaseDialog from 'components/Dialog/baseDialog'
import YellowWarnSvg from '../../../assets/yellow-warn.svg'
import Input from 'components/Input'
import { useMemo, useState } from 'react'
import AddIcon from '@mui/icons-material/Add'
import { QuantosDetails } from '../../../hook/useFactory'
import BigNumber from 'bignumber.js'
import { useAddLiquidity } from '../../../hook/useAddLiquidity'
import { ApprovalState, useApproveCallback } from '../../../../../hooks/useApproveCallback'
import { CurrencyAmount } from '../../../../../constants/token'
import { withDecimals } from '../../../utils'
import { control } from './modal'
import CurrencyLogo from '../../../../../components/essential/CurrencyLogo'
import { UserLiquidityInfo } from '../../liquidityPools/LiquidityPoolCard'

const InputStyle = styled(Input)`
  &.MuiInputBase-root {
    height: 44px;
    padding: 16px;
    border-radius: 4px;
    border: 1px solid var(--ps-text-20);
    background-color: transparent;
  }
  &.MuiInputBase-root.Mui-focused {
    border: 1px solid var(--ps-text-20) !important;
  }
  & .MuiInputBase-input {
    padding-right: 155px;
  }
`

const AddLiquidity = ({
  quanto,
  userLiquidityInfo,
  boxContactAdr,
  isWBB
}: {
  quanto: QuantosDetails
  userLiquidityInfo: UserLiquidityInfo
  boxContactAdr: string
  isWBB: boolean
}) => {
  const [amount, setAmount] = useState('')
  const { runWithModal } = useAddLiquidity(quanto, boxContactAdr, amount, isWBB)
  const [approvalState, approve] = useApproveCallback(
    quanto.tokenInfo
      ? CurrencyAmount.fromAmount(quanto.tokenInfo, withDecimals(amount, quanto.tokenInfo.decimals).toString())
      : undefined,
    quanto.bTokenT,
    false,
    true
  )

  const btnDisable = useMemo(() => {
    return (
      new BigNumber(amount).isGreaterThan(userLiquidityInfo.userWalletBalance) ||
      new BigNumber(amount).isLessThanOrEqualTo(0) ||
      new BigNumber(amount).isNaN()
    )
  }, [amount, userLiquidityInfo.userWalletBalance])

  const btnText = useMemo(() => {
    if (new BigNumber(amount).isGreaterThan(userLiquidityInfo.userWalletBalance)) return 'Insufficient Balance'
    if (new BigNumber(amount).isLessThanOrEqualTo(0) || new BigNumber(amount).isNaN()) return 'Invalid number'
    return 'Add'
  }, [amount, userLiquidityInfo.userWalletBalance])

  return (
    <BaseDialog title="Add Liquidity" sx={{ '& .MuiDialogContent-root': { textAlign: 'left' } }}>
      <Stack flexDirection={'row'} sx={{ gap: 8 }}>
        <YellowWarnSvg />
        <Typography
          sx={{
            color: 'var(--ps-neutral5)',
            fontFamily: '"SF Pro Display"',
            fontSize: '15px',
            fontStyle: 'normal',
            fontWeight: '500',
            lineHeight: '100%'
          }}
        >
          Liquidity Remove Limit
        </Typography>
      </Stack>
      <Typography
        sx={{
          color: 'var(--ps-neutral3)',
          fontFamily: '"SF Pro Display"',
          fontSize: '15px',
          fontStyle: 'normal',
          fontWeight: '400',
          lineHeight: '140%',
          marginTop: 12
        }}
      >
        {`  Reminder : Withdraws follow an epoch system. Each epoch is 72 hours long. You can make a request to withdraw
          your assets during any epoch, but you must wait until a specific withdraw epoch to actually withdraw
          them.Depending on the UTILIZATION of the liquidity, your withdraw epoch will be between 1 and 3 epochs
          later.You must withdraw your assets in your withdraw epoch, otherwise a new request is required.`}
      </Typography>
      <Box my={32} sx={{ width: '100%', height: '1px', backgroundColor: 'var(--ps-text-10)' }}></Box>
      <Stack flexDirection={'row'} justifyContent={'space-between'}>
        <Typography
          sx={{
            color: 'var(--ps-neutral5)',
            fontFamily: '"SF Pro Display"',
            fontStyle: 'normal',
            fontSize: '15px',
            fontWeight: '500',
            lineHeight: '100%'
          }}
        >
          Amount
        </Typography>
        <Typography
          sx={{
            color: 'var(--ps-neutral3)',
            fontFamily: '"SF Pro Display"',
            fontSize: '15px',
            fontStyle: 'normal',
            fontWeight: '400',
            lineHeight: '140%'
          }}
        >
          Available: {userLiquidityInfo.userWalletBalance.toFormat(2)} {quanto.tokenInfo?.symbol}
        </Typography>
      </Stack>
      <Box mt={12} sx={{ position: 'relative' }}>
        <InputStyle value={amount} type="number" placeholder="0" onChange={e => setAmount(e.target.value)} />
        <Stack
          flexDirection={'row'}
          sx={{ gap: 8, position: 'absolute', top: '50%', right: 16, transform: 'translateY(-50%)' }}
          alignItems={'center'}
        >
          <Button
            variant="contained"
            onClick={() => setAmount(userLiquidityInfo.userWalletBalance.toString())}
            sx={{ padding: '6px 16px', backgroundColor: 'var(--ps-text-100)', width: 58, height: 29, borderRadius: 4 }}
          >
            MAX
          </Button>
          <CurrencyLogo currencyOrAddress={quanto.tokenInfo?.address} size={'24px'} />
          <Typography
            sx={{
              color: 'var(--ps-neutral5)',
              fontFamily: '"SF Pro Display"',
              fontStyle: 'normal',
              fontSize: '15px',
              fontWeight: '500',
              lineHeight: '100%'
            }}
          >
            {quanto.tokenInfo?.symbol}
          </Typography>
        </Stack>
      </Box>
      <Button
        variant="contained"
        disabled={btnDisable}
        onClick={async () => {
          if (approvalState !== ApprovalState.APPROVED && !isWBB) {
            await approve()
          }
          await runWithModal()
          control.hide('AddLiquidity')
        }}
        sx={{
          width: '100%',
          height: 44,
          padding: '12px 20px 12px 24px',
          marginTop: 24,
          background: 'var(--ps-text-100)',
          color: 'var(--ps-text-primary)',
          fontFamily: '"SF Pro Display"',
          fontSize: '15px',
          fontStyle: 'normal',
          fontWeight: '500',
          lineHeight: '100%'
        }}
      >
        <AddIcon /> {btnText}
      </Button>
    </BaseDialog>
  )
}
export default AddLiquidity
