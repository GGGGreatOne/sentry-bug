import { LoadingButton } from '@mui/lab'
import { Button, Slider, Stack, Typography, styled } from '@mui/material'
import BaseDialog from 'components/Dialog/baseDialog'
import InputNumerical from 'components/Input/InputNumerical'
import { useActiveWeb3React } from 'hooks'
import { useCurrencyBalance } from 'hooks/useToken'
import { useCallback, useMemo, useState } from 'react'
import BigNumber from 'bignumber.js'
import { StabilityPoolInfoProps, TroveInfoProps, useUserStakeStablecoin } from 'plugins/liquity/hooks/useLiquityInfo'
import { CurrencyAmount } from 'constants/token'
import { ApprovalState, useApproveCallback } from 'hooks/useApproveCallback'
import { ZERO_ADDRESS } from '../../../../../constants'
import { viewControl } from 'views/editBox/modal'
import CurrencyLogo from 'components/essential/CurrencyLogo'

export const StyledSlider = styled(Slider)({
  fontSize: 13,
  '& .MuiSlider-valueLabel': {
    background: '#fff',
    color: '#23262F'
  }
})

export const marks = [
  {
    value: 0,
    label: '0%'
  },
  {
    value: 25,
    label: '25%'
  },
  {
    value: 50,
    label: '50%'
  },
  {
    value: 75,
    label: '75%'
  },
  {
    value: 100,
    label: '100%'
  }
]

export interface Props {
  boxContractAddr?: string
  troveInfo: TroveInfoProps
  stabilityPoolInfo: StabilityPoolInfoProps
}

export default function Page({ boxContractAddr, troveInfo, stabilityPoolInfo }: Props) {
  const { account } = useActiveWeb3React()
  const [amount, setAmount] = useState('')
  const userTokenBalance = useCurrencyBalance(account, troveInfo.stableToken ?? undefined)
  const inputAmount = CurrencyAmount.fromAmount(troveInfo.stableToken, amount)
  const cb = useCallback(() => {
    viewControl.hide('StakeModal')
  }, [])
  const { runWithModal: stake } = useUserStakeStablecoin(boxContractAddr, stabilityPoolInfo, cb)
  const [approveState, approve] = useApproveCallback(inputAmount, boxContractAddr)

  const maxValue = useMemo(() => {
    return userTokenBalance?.toExact()
  }, [userTokenBalance])

  const onMax = useCallback(() => {
    if (userTokenBalance) {
      setAmount(userTokenBalance.toExact())
    }
  }, [userTokenBalance])

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
    stake([inputAmount.raw.toString(), ZERO_ADDRESS])
  }, [approve, approveState, inputAmount, stake])
  return (
    <BaseDialog title={`Supply ${troveInfo.stableToken.symbol?.toLocaleUpperCase()}`} close>
      <Stack>
        <InputNumerical
          label="Amount"
          onMax={onMax}
          balance={userTokenBalance?.toSignificant()}
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
          <Button variant="outlined" sx={{ width: 133 }} onClick={() => viewControl.hide('StakeModal')}>
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
