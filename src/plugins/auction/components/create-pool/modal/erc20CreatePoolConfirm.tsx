import { LoadingButton } from '@mui/lab'
import { Box, Stack, styled, SxProps, Typography } from '@mui/material'
import BaseDialog from 'components/Dialog/baseDialog'
import CurrencyLogo from 'components/essential/CurrencyLogo'
import { CurrencyAmount } from 'constants/token'
import { ApprovalState, useApproveCallback } from 'hooks/useApproveCallback'
import { Actions, ICreatePoolParams } from 'plugins/auction/pages/erc20-create-pool/type'
import { AllocationStatus, IReleaseType } from 'plugins/auction/plugins/fixed-price/constants/type'
import { useFixedSwapERC20Contract } from 'plugins/auction/plugins/fixed-price/hooks/useContract'
import { useCreateFixedSwapPool } from 'plugins/auction/plugins/fixed-price/hooks/useCreateFixedSwapPool'
import { ICreateFixedPricePool } from 'plugins/auction/plugins/fixed-price/pages/create-fixed-price/createType'
import React, { Dispatch, useMemo } from 'react'
import { useUserInfo } from 'state/user/hooks'
import { shortenAddress } from 'utils'
import DefaultAlertSvg from '../../../assets/svg/detault-alert.svg'
import { Tip, WeightP } from '../../poolDetail/Alert'
import { NextBtnStyle } from '../components/createSubmitBtn'
interface IProps {
  state: ICreatePoolParams
  dispatch: Dispatch<Actions> | null
}
const PairLabel = styled(Typography)`
  color: rgba(255, 255, 229, 0.6);
  font-size: 14px;
  font-style: normal;
  font-weight: 600;
  line-height: 150%;
  letter-spacing: -0.28px;
`
export const InformationDisplay = ({
  label,
  text,
  startIcon,
  sx,
  hideText = true
}: {
  label: string
  text: React.ReactNode
  startIcon?: JSX.Element | string
  sx?: SxProps
  hideText?: boolean
}) => {
  return (
    <Stack key={label} flexDirection={'row'} justifyContent={'space-between'} sx={{ ...sx }}>
      <Typography
        sx={{
          color: ' rgba(255, 255, 229, 0.60)',
          fontSize: '13px',
          fontStyle: 'normal',
          fontWeight: 400,
          lineHeight: '140%',
          textTransform: 'capitalize'
        }}
      >
        {label}
      </Typography>
      <Stack flexDirection={'row'} alignItems={'center'} sx={{ gap: 4 }}>
        {typeof startIcon === 'string' && <CurrencyLogo currencyOrAddress={startIcon} size={'20px'} />}
        {typeof startIcon !== 'string' && startIcon}
        <Box
          sx={{
            color: '#FFFFE5',
            fontSize: '13px',
            fontStyle: 'normal',
            fontWeight: 400,
            lineHeight: '140%',
            textTransform: 'capitalize',
            '& .hide': {
              display: 'block',
              maxWidth: 200,
              overflow: 'hidden',
              textOverflow: 'ellipsis',
              whiteSpace: 'nowrap'
            },
            '& p,& span': {
              fontSize: { xs: 14 }
            },
            ...(hideText && {
              display: 'block',
              maxWidth: 200,
              overflow: 'hidden',
              textOverflow: 'ellipsis',
              whiteSpace: 'nowrap'
            })
          }}
        >
          {text}
        </Box>
      </Stack>
    </Stack>
  )
}
export default function Page({ state, dispatch }: IProps) {
  const { settings, basic } = state
  const poolInfo = state.poolInfo as ICreateFixedPricePool
  const userInfo = useUserInfo()
  const boxAddress = userInfo.box?.boxAddress
  const { runWithModal, submitted: createSubmitted } = useCreateFixedSwapPool(state, boxAddress, dispatch)
  const fixedSwapERC20Contract = useFixedSwapERC20Contract()
  const amount0 = useMemo(() => {
    if (!poolInfo.amountTotal0) return undefined
    return CurrencyAmount.fromAmount(poolInfo.amountTotal0, poolInfo.totalSupply)
  }, [poolInfo.amountTotal0, poolInfo.totalSupply])

  const [approvalState, approveWithModal] = useApproveCallback(amount0, fixedSwapERC20Contract?.address)
  const actionBtn = useMemo((): React.ComponentProps<typeof LoadingButton> => {
    if (approvalState !== ApprovalState.APPROVED) {
      if (approvalState === ApprovalState.PENDING || approvalState === ApprovalState.UNKNOWN) {
        return {
          children: 'Approve',
          disabled: true,
          loading: true
        }
      }
      if (approvalState === ApprovalState.NOT_APPROVED) {
        return {
          children: 'Approve',
          onClick: approveWithModal
        }
      }
    }
    if (approvalState === ApprovalState.APPROVED) {
      return {
        loading: createSubmitted.pending,
        children: 'Confirm',
        onClick: runWithModal
      }
    }
    return {
      children: 'Confirm',
      disabled: true
    }
  }, [approvalState, approveWithModal, createSubmitted.pending, runWithModal])
  return (
    <BaseDialog
      title="Creation confirmation"
      sx={{
        '& .MuiDialog-paper': {
          backgroundColor: '#1C1C19',
          minWidth: { md: 1000, xs: 300 },
          margin: { xs: 16, md: 32 },
          border: 'none'
        },
        '& .MuiDialogTitle-root h3': {
          color: '#FFFFE5',
          fontWeight: 600
        }
      }}
    >
      <Box sx={{ borderRadius: 20, border: '1px solid rgba(255, 255, 229, 0.40)', padding: { xs: 10, md: 30 } }}>
        <Typography sx={{ color: '#FFFFE5', fontWeight: 600, pb: 20 }}>
          {basic.auctionName} {poolInfo.auctionType} Auction Pool
        </Typography>
        <Box sx={{ display: 'grid', gridTemplateColumns: { xs: '1fr', md: '1fr 1fr' }, gap: '20px' }}>
          <Box p="24px" sx={{ borderRadius: 16, background: 'rgba(255, 255, 229, 0.10)' }}>
            <PairLabel>Token Information</PairLabel>
            <Stack sx={{ gap: 10 }} mt={10}>
              <InformationDisplay label="Token Name" text={poolInfo.amountTotal0?.name?.toUpperCase() || '--'} />
              <InformationDisplay
                label="Token symbol"
                text={poolInfo.amountTotal0?.symbol?.toLocaleUpperCase() || '--'}
              />
              <InformationDisplay
                label="Contract address"
                text={shortenAddress(poolInfo.amountTotal0?.address || '') || '--'}
              />
              <InformationDisplay label="Token decimals" text={poolInfo.amountTotal0?.decimals || '--'} />
            </Stack>
          </Box>

          <Box p="24px" sx={{ borderRadius: 16, background: 'rgba(255, 255, 229, 0.10)' }}>
            <PairLabel>Participant Settings</PairLabel>
            <Stack sx={{ gap: 10 }} mt={10}>
              <InformationDisplay label="Participation Limitation" text={settings.participantStatus || '--'} />
              <InformationDisplay label="Raised Fund Sharing" text={`${settings.clubShare} %`} />
            </Stack>
          </Box>

          <Box
            p="24px"
            sx={{ borderRadius: 16, background: 'rgba(255, 255, 229, 0.10)', gridColumn: { xs: 1, md: 'span 2' } }}
          >
            <PairLabel>Auction Information</PairLabel>
            <Stack sx={{ gap: 10 }} mt={10}>
              <InformationDisplay label="Auction Type" text={`${poolInfo.auctionType} Auction`} />
              <InformationDisplay
                label="Funding Currency"
                text={poolInfo.amountTotal1?.symbol?.toLocaleUpperCase() || '--'}
                startIcon={poolInfo.amountTotal1?.address || ''}
              />
              <InformationDisplay
                label="Swap Ratio"
                hideText={false}
                text={
                  <Stack flexDirection={'row'}>
                    1<p className="hide">{poolInfo.amountTotal0?.symbol?.toLocaleUpperCase() || '--'}</p> =
                    {poolInfo.swapRatio}
                    <p className="hide"> {poolInfo.amountTotal1?.symbol?.toLocaleUpperCase()}</p>
                  </Stack>
                }
              />
              <InformationDisplay
                label="Total Supply"
                text={
                  poolInfo.amountTotal0 &&
                  CurrencyAmount.fromAmount(poolInfo.amountTotal0, poolInfo.totalSupply)?.toSignificant() +
                    '  ' +
                    poolInfo.amountTotal0.symbol?.toLocaleUpperCase()
                }
              />
              <InformationDisplay
                label="Auction Time (UTC Time)"
                text={`Form ${poolInfo.startTime?.utc().format('YYYY-MM-DD HH:mm:ss')} to ${poolInfo.endTime
                  ?.utc()
                  .format('YYYY-MM-DD HH:mm:ss')}`}
                hideText={false}
              />
              <InformationDisplay
                label="Allocation per Wallet"
                text={`${
                  poolInfo.allocationStatus === AllocationStatus.NoLimits
                    ? 'No Limits'
                    : `Limit ${poolInfo.allocationPerWallet} ${poolInfo.amountTotal1?.symbol?.toLocaleLowerCase()}`
                }`}
              />
              <InformationDisplay
                label="Token Unlock"
                text={`${
                  Number(poolInfo.releaseType) === IReleaseType.Instant
                    ? 'No'
                    : Number(poolInfo.releaseType) === IReleaseType.Cliff
                      ? poolInfo.delayUnlockingTime?.utc().format('YYYY-MM-DD HH:mm:ss')
                      : ''
                }`}
              />
            </Stack>
          </Box>
        </Box>
      </Box>
      <Stack
        mt={30}
        flexDirection={'row'}
        alignItems={'center'}
        sx={{ width: '100%', padding: '16px', gap: 16, borderRadius: 8, background: 'var(--yellow-light, #F9FCDE)' }}
      >
        <DefaultAlertSvg />
        <Tip sx={{ width: 'calc(100% - 50px)' }}>
          <WeightP>Please pay attention.</WeightP> You can cancel your pool before it goes live. But you can’t cancel
          your pool when it is live and your tokens will be locked in the pool during the auction, so please choose all
          parameters wisely.
        </Tip>
      </Stack>
      <NextBtnStyle
        sx={{ width: '100%', mt: 16, borderRadius: 100 }}
        type="submit"
        variant="contained"
        {...actionBtn}
      />
    </BaseDialog>
  )
}
