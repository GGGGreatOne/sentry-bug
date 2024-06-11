import { LoadingButton } from '@mui/lab'
import { Button, Stack, Typography } from '@mui/material'
import BaseDialog from 'components/Dialog/baseDialog'
import InputNumerical from 'components/Input/InputNumerical'
import { useCallback, useMemo, useState } from 'react'
import BigNumber from 'bignumber.js'
import { StabilityPoolInfoProps, TroveInfoProps, useUserWithdrawStablecoin } from 'plugins/liquity/hooks/useLiquityInfo'
import { CurrencyAmount } from 'constants/token'
import { ApprovalState, useApproveCallback } from 'hooks/useApproveCallback'
import { viewControl } from 'views/editBox/modal'
import { StyledSlider, marks } from './StakeModal'
import CurrencyLogo from 'components/essential/CurrencyLogo'

export interface Props {
  boxContractAddr?: string
  troveInfo: TroveInfoProps
  stabilityPoolInfo: StabilityPoolInfoProps
}

export default function Page({ boxContractAddr, troveInfo, stabilityPoolInfo }: Props) {
  const [amount, setAmount] = useState('')
  const inputAmount = CurrencyAmount.fromAmount(troveInfo.stableToken, amount)
  const cb = useCallback(() => {
    viewControl.hide('UnstakeModal')
  }, [])
  const { runWithModal: withdraw } = useUserWithdrawStablecoin(boxContractAddr, stabilityPoolInfo, cb)
  const [approveState, approve] = useApproveCallback(inputAmount, boxContractAddr)

  const maxValue = useMemo(() => {
    return stabilityPoolInfo.userWithdrawableAmount?.toExact()
  }, [stabilityPoolInfo.userWithdrawableAmount])

  const onMax = useCallback(() => {
    if (stabilityPoolInfo.userWithdrawableAmount) {
      setAmount(stabilityPoolInfo.userWithdrawableAmount.toExact())
    }
  }, [stabilityPoolInfo.userWithdrawableAmount])

  const onChangeSlider = useCallback(
    (e: any) => {
      setAmount(e !== null && maxValue ? new BigNumber(maxValue).times(e.target.value).div(100).toString() : '0')
    },
    [maxValue]
  )
  const onConfirm = useCallback(async () => {
    if (approveState !== ApprovalState.APPROVED) {
      approve()
      return
    }
    if (!inputAmount) return
    withdraw([inputAmount.raw.toString()])
  }, [approve, approveState, inputAmount, withdraw])
  return (
    <BaseDialog title={`Withdraw ${troveInfo.stableToken.symbol?.toLocaleUpperCase()}`} close>
      <Stack>
        <InputNumerical
          label="Amount"
          onMax={onMax}
          balance={stabilityPoolInfo.userWithdrawableAmount?.toSignificant()}
          unit={troveInfo.stableToken.symbol?.toLocaleUpperCase()}
          value={amount}
          onChange={e => setAmount(e.target.value)}
          endAdornment={
            <>
              <CurrencyLogo currencyOrAddress={troveInfo.stableToken.address} />
              <Typography>{troveInfo.stableToken.symbol?.toLocaleUpperCase()}</Typography>
            </>
          }
        />
        <Stack px={'20px'}>
          <StyledSlider
            marks={marks}
            step={5}
            value={maxValue ? new BigNumber(amount).div(maxValue).times(100).toNumber() : undefined}
            valueLabelDisplay="auto"
            min={0}
            max={100}
            valueLabelFormat={() => new BigNumber(amount).toNumber()}
            onChange={onChangeSlider}
          />
        </Stack>
        <Stack direction={'row'} justifyContent={'center'} spacing={10} mt={40}>
          <Button variant="outlined" sx={{ width: 133 }} onClick={() => viewControl.hide('UnstakeModal')}>
            Cancel
          </Button>
          <LoadingButton disabled={!amount} variant="contained" sx={{ width: 133 }} onClick={onConfirm}>
            {amount && approveState !== ApprovalState.APPROVED ? 'Approve' : 'Confirm'}
          </LoadingButton>
        </Stack>
      </Stack>
    </BaseDialog>
  )
}
