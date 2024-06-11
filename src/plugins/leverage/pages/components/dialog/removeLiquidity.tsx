import { Box, Button, Stack, Typography, styled } from '@mui/material'
import BaseDialog from 'components/Dialog/baseDialog'
import YellowWarnSvg from '../../../assets/yellow-warn.svg'
import Input from 'components/Input'
import { useCallback, useMemo, useState } from 'react'
import { QuantosDetails } from '../../../hook/useFactory'
import { useSingleCallResult, useSingleContractMultipleData } from '../../../../../hooks/multicall'
import { useActiveWeb3React } from '../../../../../hooks'
import { useBTokenContract } from '../../../hook/useContract'
import BigNumber from 'bignumber.js'
import { withDecimals } from '../../../utils'
import ExpandMoreIcon from '@mui/icons-material/ExpandMore'
import ExpandLessIcon from '@mui/icons-material/ExpandLess'
import { control } from './modal'
import { useInterval } from 'ahooks'
import CurrencyLogo from '../../../../../components/essential/CurrencyLogo'
import { useRemoveLiquidity } from '../../../hook/useRemoveLiquidity'
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

const StyledBox = styled(Box)(() => ({
  borderBottom: '1px solid var(--ps-text-20)',
  my: '24px'
}))

const AddLiquidity = ({
  quanto,
  userLiquidityInfo,
  boxContactAdr
}: {
  quanto: QuantosDetails
  userLiquidityInfo: UserLiquidityInfo
  boxContactAdr: string
}) => {
  const [amount, setAmount] = useState('')
  const [showExistingRequest, setShowExistingRequest] = useState(false)
  const bTokenContract = useBTokenContract(quanto.bTokenT)
  const { account } = useActiveWeb3React()
  // const [withdrawAbleAmount, setWithdrawAbleAmount] = useState(new BigNumber(0))
  const { withdrawRequest, withdraw } = useRemoveLiquidity(quanto, boxContactAdr, amount)

  const getUpdateEpoch = useSingleCallResult(undefined, bTokenContract, 'updateEpoch', [])

  const getCurrentEpoch = useSingleCallResult(undefined, bTokenContract, 'epochCurrent', [])

  const updateEpoch = useMemo(() => {
    if (getUpdateEpoch?.result?.[0]) return new BigNumber(getUpdateEpoch.result?.[0]._hex)
    else return new BigNumber(0)
  }, [getUpdateEpoch])

  const lastEpoch = useMemo(() => {
    if (getUpdateEpoch?.result?.[1]) return new BigNumber(getUpdateEpoch.result?.[1]._hex)
    else return new BigNumber(0)
  }, [getUpdateEpoch])

  const currentEpoch = useMemo(() => {
    if (getCurrentEpoch?.result?.[0]) return new BigNumber(getCurrentEpoch.result?.[0]._hex)
    else return new BigNumber(0)
  }, [getCurrentEpoch])

  const getRequestEc = useSingleContractMultipleData(
    undefined,
    bTokenContract,
    'reqWithdrawals',
    Array.from(Array(3).keys()).map(index => [account, updateEpoch.plus(index).toString()])
  )

  const getRatio = useSingleCallResult(undefined, bTokenContract, 'shareToAssetsPrice', [])

  const getEpochDuration = useSingleCallResult(undefined, bTokenContract, 'epochDuration', [])

  const tokenRatio = useMemo(() => {
    if (getRatio?.result) {
      return withDecimals(new BigNumber(getRatio.result[0]._hex), 18, false)
    } else return new BigNumber(0)
  }, [getRatio])

  const epochDuration = useMemo(() => {
    if (getEpochDuration?.result) {
      return new BigNumber(getEpochDuration.result[0]._hex).toNumber()
    } else return 0
  }, [getEpochDuration])

  const requestEc = useMemo<{ epoch: number; amount: BigNumber }[]>(() => {
    if (getRequestEc[0]?.result && updateEpoch && userLiquidityInfo.daiDeposited) {
      return getRequestEc.map((ec, index) => {
        return {
          epoch: updateEpoch.plus(index).toNumber(),
          amount: new BigNumber(ec?.result?.[0]._hex)
        }
      })
    } else
      return [
        {
          epoch: 0,
          amount: new BigNumber(0)
        },
        {
          epoch: 0,
          amount: new BigNumber(0)
        },
        {
          epoch: 0,
          amount: new BigNumber(0)
        }
      ]
  }, [getRequestEc, updateEpoch, userLiquidityInfo.daiDeposited])

  const waitPeriod = useMemo(() => {
    let wait = -1
    requestEc.forEach((period, index) => {
      if (period.amount.isGreaterThan(0) && wait === -1) {
        wait = index
      }
    })
    return wait
  }, [requestEc])

  const existingRequestLength = useMemo(() => {
    return requestEc.filter(req => req.amount.isGreaterThan(0) && userLiquidityInfo.daiDeposited.isGreaterThan(0))
      .length
  }, [requestEc, userLiquidityInfo.daiDeposited])

  const withdrawDate = useMemo(() => {
    const currentStart = lastEpoch.times(1000)
    //TODO: currentEpoch is null
    if (waitPeriod === 0) return new Date(currentStart.toNumber()).toLocaleString()

    if (waitPeriod === 1) {
      return new Date(currentStart.plus(epochDuration * 1000).toNumber()).toLocaleString()
    }
    if (waitPeriod === 2) {
      return new Date(currentStart.plus(epochDuration * 2 * 1000).toNumber()).toLocaleString()
    }
    return 'make a withdraw request'
  }, [waitPeriod, lastEpoch, epochDuration])

  const maxBtnClick = useCallback(() => {
    setAmount(userLiquidityInfo.daiDeposited.toString())
  }, [userLiquidityInfo.daiDeposited])

  const btnDisable = useMemo(() => {
    return (
      new BigNumber(amount).isGreaterThan(userLiquidityInfo.daiDeposited) ||
      new BigNumber(amount).isLessThanOrEqualTo(0) ||
      new BigNumber(amount).isNaN()
    )
  }, [amount, userLiquidityInfo])

  const btnText = useMemo(() => {
    if (new BigNumber(amount).isGreaterThan(userLiquidityInfo.daiDeposited)) return 'Insufficient Balance'
    if (new BigNumber(amount).isLessThan(0) || new BigNumber(amount).isNaN()) return 'Invalid number'
    if (new BigNumber(amount).isEqualTo(0)) return 'Enter a amount'
    return 'Request'
  }, [amount, userLiquidityInfo.daiDeposited])

  const remainingTime = useMemo(() => {
    if (lastEpoch.isGreaterThan(0) && epochDuration > 0) {
      const now = new Date().getTime()
      const diff = (lastEpoch.plus(epochDuration).toNumber() * 1000 - now) / 1000
      const disD = Math.floor(diff / 86400).toString()
      const disHour = Math.floor(diff / 3600).toString()
      const disM = Math.floor(diff / 60).toString()
      return `${disD}d ${disHour}h ${disM}m`
    } else return '--d --h --m'
  }, [lastEpoch, epochDuration])

  useInterval(() => 30000)

  return (
    <BaseDialog title="Remove Liquidity" sx={{ '& .MuiDialogContent-root': { textAlign: 'left' } }}>
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
        Reminder : Withdraws follow an epoch system. Each epoch is 72 hours long. You can make a request to withdraw
        your assets during any epoch, but you must wait until a specific withdraw epoch to actually withdraw them.
        Depending on the UTILIZATION of the liquidity, your withdraw epoch will be between 1 and 3 epochs later. You
        must withdraw your assets in your withdraw epoch, otherwise a new request is required.
      </Typography>
      <Box my={32} sx={{ width: '100%', height: '1px', backgroundColor: 'var(--ps-text-10)' }}></Box>
      <Stack my={8} flexDirection={'row'} justifyContent={'space-between'}>
        <Typography
          sx={{
            color: 'var(--ps-neutral3)',
            fontFamily: '"SF Pro Display"',
            fontStyle: 'normal',
            fontSize: '15px',
            fontWeight: '500',
            lineHeight: '100%'
          }}
        >
          Current wait period:
        </Typography>
        <Typography
          sx={{
            color: 'var(--ps-neutral5)',
            fontFamily: '"SF Pro Display"',
            fontSize: '15px',
            fontStyle: 'normal',
            fontWeight: '400',
            lineHeight: '140%'
          }}
        >
          {waitPeriod < 0 ? '----' : waitPeriod} epoch
        </Typography>
      </Stack>
      <StyledBox />
      <Stack my={8} flexDirection={'row'} justifyContent={'space-between'}>
        <Typography
          sx={{
            color: 'var(--ps-neutral3)',
            fontFamily: '"SF Pro Display"',
            fontStyle: 'normal',
            fontSize: '15px',
            fontWeight: '500',
            lineHeight: '100%'
          }}
        >
          Withdraw date:
        </Typography>
        <Typography
          sx={{
            color: 'var(--ps-neutral5)',
            fontFamily: '"SF Pro Display"',
            fontSize: '15px',
            fontStyle: 'normal',
            fontWeight: '400',
            lineHeight: '140%'
          }}
        >
          {withdrawDate}
        </Typography>
      </Stack>
      <StyledBox />
      <Stack my={8} flexDirection={'row'} justifyContent={'space-between'}>
        <Typography
          sx={{
            color: 'var(--ps-neutral3)',
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
            color: 'var(--ps-neutral5)',
            fontFamily: '"SF Pro Display"',
            fontSize: '15px',
            fontStyle: 'normal',
            fontWeight: '400',
            lineHeight: '140%'
          }}
        >
          <span style={{ color: 'var(--ps-neutral5)' }}>
            {userLiquidityInfo.daiDeposited.toFormat(2)} B{quanto.tokenInfo?.symbol}
          </span>
          {/*{showRequestBtn && (*/}
          {/*  <span style={{ color: 'var(--ps-neutral5)' }}>*/}
          {/*    {userLiquidityInfo.daiDeposited.toFormat(2)} B{quanto.tokenInfo?.symbol}*/}
          {/*  </span>*/}
          {/*)}*/}
          {/*{!showRequestBtn && (*/}
          {/*  <span style={{ color: 'var(--ps-neutral5)' }}>*/}
          {/*    {withDecimals(withdrawAbleAmount, quanto.tokenInfo?.decimals ?? 18, false).toString()} B*/}
          {/*    {quanto.tokenInfo?.symbol}*/}
          {/*  </span>*/}
          {/*)}*/}
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
            onClick={maxBtnClick}
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
      <Stack mb={8} mt={32} flexDirection={'row'} justifyContent={'space-between'}>
        <Typography
          sx={{
            color: 'var(--ps-neutral3)',
            fontFamily: '"SF Pro Display"',
            fontStyle: 'normal',
            fontSize: '15px',
            fontWeight: '500',
            lineHeight: '100%'
          }}
        >
          Ratio
        </Typography>
        <Typography
          sx={{
            color: 'var(--ps-neutral5)',
            fontFamily: '"SF Pro Display"',
            fontSize: '15px',
            fontStyle: 'normal',
            fontWeight: '400',
            lineHeight: '140%'
          }}
        >
          1{quanto?.tokenInfo?.symbol} = {new BigNumber(1).div(tokenRatio).toFixed(2)} B{quanto?.tokenInfo?.symbol}
        </Typography>
      </Stack>
      <StyledBox />
      <Stack my={8} flexDirection={'row'} justifyContent={'space-between'}>
        <Typography
          sx={{
            color: 'var(--ps-neutral3)',
            fontFamily: '"SF Pro Display"',
            fontStyle: 'normal',
            fontSize: '15px',
            fontWeight: '500',
            lineHeight: '100%'
          }}
        >
          You will receive
        </Typography>
        <Typography
          sx={{
            color: 'var(--ps-neutral5)',
            fontFamily: '"SF Pro Display"',
            fontSize: '15px',
            fontStyle: 'normal',
            fontWeight: '400',
            lineHeight: '140%'
          }}
        >
          {new BigNumber(amount).isNaN() ? '0' : tokenRatio.times(amount).toFixed(2)} {quanto.tokenInfo?.symbol}
        </Typography>
      </Stack>
      <Button
        disabled={btnDisable}
        sx={{
          width: '100%',
          height: 44,
          padding: '12px 20px 12px 24px',
          marginTop: 24,
          color: 'var(--ps-text-100)',
          fontFamily: '"SF Pro Display"',
          fontSize: '15px',
          fontStyle: 'normal',
          fontWeight: '500',
          lineHeight: '100%',
          '&.Mui-disabled': {
            color: 'var(--ps-neutral3)!important'
          }
        }}
        variant="outlined"
        onClick={() => withdrawRequest.runWithModal()}
      >
        {btnText}
      </Button>
      {/*{!showRequestBtn && (*/}
      {/*  <Button*/}
      {/*    disabled={btnDisable}*/}
      {/*    sx={{*/}
      {/*      width: '100%',*/}
      {/*      height: 44,*/}
      {/*      padding: '12px 20px 12px 24px',*/}
      {/*      marginTop: 24,*/}
      {/*      color: 'var(--ps-text-100)',*/}
      {/*      fontFamily: '"SF Pro Display"',*/}
      {/*      fontSize: '15px',*/}
      {/*      fontStyle: 'normal',*/}
      {/*      fontWeight: '500',*/}
      {/*      lineHeight: '100%'*/}
      {/*    }}*/}
      {/*    variant="outlined"*/}
      {/*    onClick={() => withdraw.runWithModal()}*/}
      {/*  >*/}
      {/*    Remove*/}
      {/*  </Button>*/}
      {/*)}*/}
      <StyledBox sx={{ mt: '32px', mb: '24px' }} />
      <Box>
        <Stack
          flexDirection={'row'}
          justifyContent={'space-between'}
          alignItems={'center'}
          onClick={() => setShowExistingRequest(!showExistingRequest)}
        >
          <Typography
            sx={{
              color: 'var(--ps-neutral5)',
              fontFamily: '"SF Pro Display"',
              fontSize: '15px',
              fontStyle: 'normal',
              fontWeight: '400',
              lineHeight: '140%'
            }}
          >
            Existing Request ({existingRequestLength})
          </Typography>
          {!showExistingRequest ? <ExpandMoreIcon /> : <ExpandLessIcon />}
        </Stack>
      </Box>
      {showExistingRequest && (
        <Box sx={{ mt: '16px' }}>
          <Box
            sx={{
              p: '16px',
              borderRadius: '12px',
              background: 'var(--Neutral-2, #282828)'
            }}
          >
            <Stack my={8} flexDirection={'row'} justifyContent={'space-between'}>
              <Typography
                sx={{
                  color: 'var(--ps-neutral3)',
                  fontFamily: '"SF Pro Display"',
                  fontStyle: 'normal',
                  fontSize: '15px',
                  fontWeight: '500',
                  lineHeight: '100%'
                }}
              >
                Now Epoch
              </Typography>
              <Typography
                sx={{
                  color: 'var(--ps-neutral5)',
                  fontFamily: '"SF Pro Display"',
                  fontSize: '15px',
                  fontStyle: 'normal',
                  fontWeight: '400',
                  lineHeight: '140%'
                }}
              >
                {updateEpoch.toString()}
              </Typography>
            </Stack>
            <StyledBox />
            <Stack my={8} flexDirection={'row'} justifyContent={'space-between'}>
              <Typography
                sx={{
                  color: 'var(--ps-neutral3)',
                  fontFamily: '"SF Pro Display"',
                  fontStyle: 'normal',
                  fontSize: '15px',
                  fontWeight: '500',
                  lineHeight: '100%'
                }}
              >
                Remaining
              </Typography>
              <Typography
                sx={{
                  color: 'var(--ps-neutral5)',
                  fontFamily: '"SF Pro Display"',
                  fontSize: '15px',
                  fontStyle: 'normal',
                  fontWeight: '400',
                  lineHeight: '140%'
                }}
              >
                <span>{remainingTime}</span>
              </Typography>
            </Stack>
            <StyledBox />
            <Stack my={8} flexDirection={'row'} justifyContent={'space-between'}>
              <Typography
                sx={{
                  color: 'var(--ps-neutral3)',
                  fontFamily: '"SF Pro Display"',
                  fontStyle: 'normal',
                  fontSize: '15px',
                  fontWeight: '500',
                  lineHeight: '100%'
                }}
              >
                Start
              </Typography>
              <Typography
                sx={{
                  color: 'var(--ps-neutral5)',
                  fontFamily: '"SF Pro Display"',
                  fontSize: '15px',
                  fontStyle: 'normal',
                  fontWeight: '400',
                  lineHeight: '140%'
                }}
              >
                {new Date(lastEpoch.toNumber() * 1000).toLocaleString()}
              </Typography>
            </Stack>
            <StyledBox />
            <Stack my={8} flexDirection={'row'} justifyContent={'space-between'}>
              <Typography
                sx={{
                  color: 'var(--ps-neutral3)',
                  fontFamily: '"SF Pro Display"',
                  fontStyle: 'normal',
                  fontSize: '15px',
                  fontWeight: '500',
                  lineHeight: '100%'
                }}
              >
                End
              </Typography>
              <Typography
                sx={{
                  color: 'var(--ps-neutral5)',
                  fontFamily: '"SF Pro Display"',
                  fontSize: '15px',
                  fontStyle: 'normal',
                  fontWeight: '400',
                  lineHeight: '140%'
                }}
              >
                {new Date((lastEpoch.toNumber() + epochDuration) * 1000).toLocaleString()}
              </Typography>
            </Stack>
            <StyledBox />
          </Box>
          <Typography
            sx={{
              color: 'var(--ps-neutral3)',
              fontFamily: '"SF Pro Display"',
              fontStyle: 'normal',
              display: 'flex',
              justifyContent: 'space-between',
              fontSize: '12px',
              fontWeight: '400',
              lineHeight: '100%',
              mt: '16px'
            }}
          >
            <span>Amount</span>
            <span>Withdraw Status</span>
          </Typography>
          <Box>
            {requestEc
              .filter(item => item.amount.isGreaterThan(0))
              .map((ec, index) => {
                return (
                  <Box key={index}>
                    <Stack my={12} alignItems={'center'} flexDirection={'row'} justifyContent={'space-between'}>
                      <Typography
                        sx={{
                          color: 'var(--ps-neutral5)',
                          fontFamily: '"SF Pro Display"',
                          fontSize: '15px',
                          fontStyle: 'normal',
                          fontWeight: '400',
                          lineHeight: '140%'
                        }}
                      >
                        {ec.amount.isGreaterThan(
                          withDecimals(userLiquidityInfo.daiDeposited, quanto?.tokenInfo?.decimals ?? 18)
                        )
                          ? userLiquidityInfo.daiDeposited.toFormat(4)
                          : withDecimals(ec.amount, quanto?.tokenInfo?.decimals ?? 18, false).toFormat(4)}
                        &nbsp;B{quanto?.tokenInfo?.symbol}
                      </Typography>
                      {ec.epoch === currentEpoch.toNumber() ? (
                        <Button
                          onClick={async () => {
                            await withdraw.runWithModal([
                              ec.amount.isGreaterThan(
                                withDecimals(userLiquidityInfo.daiDeposited, quanto?.tokenInfo?.decimals ?? 18)
                              )
                                ? withDecimals(
                                    userLiquidityInfo.daiDeposited,
                                    quanto?.tokenInfo?.decimals ?? 18
                                  ).toString()
                                : ec.amount.toString(),
                              account,
                              account
                            ])
                            control.hide('RemoveLiquidity')
                          }}
                          sx={{
                            padding: '6px 16px',
                            backgroundColor: 'var(--ps-text-100)',
                            width: 62,
                            height: 29,
                            borderRadius: '100px'
                          }}
                        >
                          Claim
                        </Button>
                      ) : (
                        <Typography
                          sx={{
                            color: 'var(--ps-neutral5)',
                            fontFamily: '"SF Pro Display"',
                            fontSize: '15px',
                            fontStyle: 'normal',
                            fontWeight: '400',
                            lineHeight: '140%'
                          }}
                        >
                          Pending
                        </Typography>
                      )}
                    </Stack>
                    <StyledBox />
                  </Box>
                )
              })}
          </Box>
        </Box>
      )}
    </BaseDialog>
  )
}
export default AddLiquidity
