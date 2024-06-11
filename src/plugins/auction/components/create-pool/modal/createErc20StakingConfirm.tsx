import { LoadingButton } from '@mui/lab'
import { Box, Stack, styled, Typography } from '@mui/material'
import BaseDialog from 'components/Dialog/baseDialog'
import { CurrencyAmount } from 'constants/token'
import { ApprovalState, useApproveCallback } from 'hooks/useApproveCallback'
import { Actions, ICreatePoolParams } from 'plugins/auction/pages/erc20-create-pool/type'
import { IReleaseType } from 'plugins/auction/plugins/fixed-price/constants/type'
import { useStakeTokenWithTimeWeightContract } from 'plugins/auction/plugins/stake/hooks/useContract'
import { useCreateWithTimeWeightStakingPool } from 'plugins/auction/plugins/stake/hooks/useStakeHooks'
import { ICreateStakePool } from 'plugins/auction/plugins/stake/pages/create-stake/createType'
import React, { Dispatch, useMemo } from 'react'
import { useUserInfo } from 'state/user/hooks'
import { shortenAddress } from 'utils'
import { NextBtnStyle } from '../components/createSubmitBtn'
import DefaultAlertSvg from '../../../assets/svg/detault-alert.svg'
import { Tip, WeightP } from '../../poolDetail/Alert'
import { InformationDisplay } from './erc20CreatePoolConfirm'
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

export default function CreateErc20StakingConfirm({ state, dispatch }: IProps) {
  const poolInfo = state.poolInfo as ICreateStakePool
  const userInfo = useUserInfo()
  const boxAddress = userInfo.box?.boxAddress
  const { runWithModal, submitted } = useCreateWithTimeWeightStakingPool(state, boxAddress, dispatch)
  const stakeTokenWithTimeWeightContract = useStakeTokenWithTimeWeightContract()
  const amount0 = useMemo(() => {
    if (!poolInfo.token0Currency) return undefined
    return CurrencyAmount.fromAmount(poolInfo.token0Currency, poolInfo.amountTotal0)
  }, [poolInfo.amountTotal0, poolInfo.token0Currency])

  const [approvalState, approveWithModal] = useApproveCallback(amount0, stakeTokenWithTimeWeightContract?.address)
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
        children: 'Create',
        loading: submitted.pending,
        onClick: () => {
          runWithModal()
        }
      }
    }
    return {
      children: 'Create',
      disabled: true
    }
  }, [approvalState, approveWithModal, runWithModal, submitted.pending])
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
          {state.basic.auctionName} {poolInfo.auctionType} Auction Pool
        </Typography>
        <Box sx={{ display: 'grid', gridTemplateColumns: { xs: '1fr', md: '1fr 1fr' }, gap: '20px' }}>
          <Box p="24px" sx={{ borderRadius: 16, background: 'rgba(255, 255, 229, 0.10)' }}>
            <PairLabel>Token Information</PairLabel>
            <Stack sx={{ gap: 10 }} mt={10}>
              <InformationDisplay label="Token Name" text={poolInfo.token0Currency?.name?.toUpperCase() || '--'} />
              <InformationDisplay
                label="Token symbol"
                text={poolInfo.token0Currency?.symbol?.toLocaleUpperCase() || '--'}
              />
              <InformationDisplay
                label="Contract address"
                text={shortenAddress(poolInfo.token0Currency?.address || '') || '--'}
              />
              <InformationDisplay label="Token decimals" text={poolInfo.token0Currency?.decimals || '--'} />
            </Stack>
          </Box>

          <Box p="24px" sx={{ borderRadius: 16, background: 'rgba(255, 255, 229, 0.10)' }}>
            <PairLabel>Participant Settings</PairLabel>
            <Stack sx={{ gap: 10 }} mt={10}>
              <InformationDisplay label="Raised Fund Sharing" text={`${poolInfo.clubShare} %`} />
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
                text={poolInfo.token1Currency?.symbol?.toLocaleUpperCase() || '--'}
                startIcon={poolInfo.token1Currency?.address || ''}
              />
              <InformationDisplay
                label="Funding Total Supply"
                text={`${poolInfo.amountTotal1}  ${poolInfo.token1Currency?.symbol?.toLocaleUpperCase()}`}
              />
              <InformationDisplay
                label="Selling Total Supply"
                text={`${poolInfo.amountTotal0}  ${poolInfo.token0Currency?.symbol?.toLocaleUpperCase()}`}
              />

              <InformationDisplay
                label="Auction Time (UTC Time)"
                text={`Form ${poolInfo.startTime?.utc().format('YYYY-MM-DD HH:mm:ss')} to ${poolInfo.endTime?.format(
                  'YYYY-MM-DD HH:mm:ss'
                )}`}
                hideText={false}
              />
              {/* TODO: release */}
              <InformationDisplay
                label="Token Unlock (UTC)"
                text={`${
                  Number(poolInfo.releaseType) === Number(IReleaseType.Instant)
                    ? 'No'
                    : Number(poolInfo.releaseType) === Number(IReleaseType.Cliff)
                      ? poolInfo.delayUnlockingTime?.utc().format('YYYY-MM-DD HH:mm:ss')
                      : ''
                }`}
                hideText={false}
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
