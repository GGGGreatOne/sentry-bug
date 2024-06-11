import React, { useMemo, useState } from 'react'
import { Stack, Typography, styled, Button } from '@mui/material'
import { ApprovalState, useApproveCallback } from 'hooks/useApproveCallback'
import { useActiveWeb3React } from 'hooks'
import { SUPPORT_NETWORK_CHAIN_IDS } from 'constants/chains'
import BaseDialog from 'components/Dialog/baseDialog'
import BidInput from 'plugins/auction/components/create-pool/components/BidInput'
import stakingDialogControl from '.'
import { LoadingButton } from '@mui/lab'
import { CurrencyAmount } from 'constants/token'
import { useCurrencyBalance, useToken } from 'hooks/useToken'
import { useStakingBid } from '../../hooks/useStakeHooks'
import { useStakeTokenWithTimeWeightContract } from '../../hooks/useContract'
interface IProps {
  token1Address: string | undefined
  showLoginModal: () => void
  switchNetwork: () => void
  poolId: string | undefined
  boxAddress: string | undefined
}
export const GrayTitle = styled(Typography)`
  color: #626262;
  font-family: Inter;
  font-size: 16px;
  font-style: normal;
  font-weight: 400;
  line-height: 150%; /* 24px */
`
export const BalanceTitle = styled(Typography)`
  color: #121212;
  font-family: Public Sans;
  font-size: 16px;
  font-style: normal;
  font-weight: 500;
  line-height: 150%; /* 24px */
  letter-spacing: -0.32px;
`

export const ConfirmBtnStyle = styled(LoadingButton)`
  height: 52px;
  width: 100%;
  border-radius: 8px;
  background: #121212;
  color: #fff;
  font-family: Inter;
  font-size: 16px;
  font-style: normal;
  font-weight: 400;
  line-height: 150%; /* 24px */
  &:hover {
    background: #121212;
    opacity: 0.9;
  }
  &.Mui-disabled {
    color: #959595;
  }
`
export const CancelBtnStyle = styled(Button)`
  height: 52px;
  border-radius: 8px;
  border: 1px solid #121212;
  background: #fff;
  color: #121212;
  font-family: Inter;
  font-size: 16px;
  font-style: normal;
  font-weight: 400;
  line-height: 150%; /* 24px */
  &:hover {
    background: #fff;
  }
`
const StakeAuctionInputDialog = (props: IProps) => {
  const { token1Address, showLoginModal, switchNetwork, poolId, boxAddress } = props
  const { account, chainId } = useActiveWeb3React()
  const [curAmount, setCurAmount] = useState('0')
  const token1Currency = useToken(token1Address || '', chainId)
  const token1Amount = useMemo(() => {
    if (!token1Currency) {
      return undefined
    }
    return CurrencyAmount.fromAmount(token1Currency, curAmount)
  }, [curAmount, token1Currency])
  const token1Balance = useCurrencyBalance(account, token1Currency || undefined)
  const contract = useStakeTokenWithTimeWeightContract()
  const [approvalState, approveWithModal] = useApproveCallback(token1Amount, contract?.address)
  const onClose = () => {
    setCurAmount('0')
    stakingDialogControl.hide('StakeAuctionInput')
  }
  const { runWithModal: commitRunWithModal, submitted } = useStakingBid(boxAddress, poolId, token1Amount, onClose)
  const confirmBtn = useMemo(() => {
    if (!account) {
      return (
        <ConfirmBtnStyle onClick={() => showLoginModal()} sx={{ flex: 2 }}>
          Connect Wallet
        </ConfirmBtnStyle>
      )
    }
    if (!chainId || !SUPPORT_NETWORK_CHAIN_IDS.includes(chainId)) {
      return (
        <ConfirmBtnStyle onClick={() => switchNetwork()} sx={{ flex: 2 }}>
          Switch Network
        </ConfirmBtnStyle>
      )
    }
    if (!curAmount || !Number(curAmount)) {
      return (
        <ConfirmBtnStyle disabled sx={{ flex: 2 }}>
          Confirm
        </ConfirmBtnStyle>
      )
    }
    if (token1Amount && token1Balance && token1Amount.greaterThan(token1Balance)) {
      return (
        <ConfirmBtnStyle disabled sx={{ flex: 2 }}>
          Insufficient Balance
        </ConfirmBtnStyle>
      )
    }
    if (approvalState !== ApprovalState.APPROVED) {
      if (approvalState === ApprovalState.UNKNOWN || approvalState === ApprovalState.PENDING) {
        return (
          <ConfirmBtnStyle disabled={true} sx={{ flex: 2 }}>
            Pending...
          </ConfirmBtnStyle>
        )
      }
      return (
        <ConfirmBtnStyle onClick={() => approveWithModal()} sx={{ flex: 2 }}>
          Approve
        </ConfirmBtnStyle>
      )
    }
    if (token1Amount && token1Balance && !token1Amount.greaterThan(token1Balance)) {
      return (
        <ConfirmBtnStyle sx={{ flex: 2 }} onClick={() => commitRunWithModal()} loading={submitted.pending}>
          Confirm
        </ConfirmBtnStyle>
      )
    }
    return (
      <ConfirmBtnStyle disabled sx={{ flex: 2 }}>
        Confirm
      </ConfirmBtnStyle>
    )
  }, [
    account,
    approvalState,
    approveWithModal,
    chainId,
    commitRunWithModal,
    curAmount,
    showLoginModal,
    submitted.pending,
    switchNetwork,
    token1Amount,
    token1Balance
  ])

  return (
    <BaseDialog
      title=""
      sx={{
        '& .MuiDialog-paper': {
          height: 424,
          backgroundColor: '#fff'
        },
        '& .MuiDialogContent-root': {
          marginTop: 0,
          display: 'flex',
          flexDirection: 'column',
          gap: 48
        }
      }}
      onClose={onClose}
    >
      <Typography
        sx={{
          textAlign: 'center',
          color: '#171717',
          fontSize: '28px',
          fontStyle: 'normal',
          fontWeight: 600,
          lineHeight: '130%',
          letterSpacing: '-0.56px',
          textTransform: 'capitalize'
        }}
      >
        Stake
      </Typography>
      <Stack sx={{ height: '100%' }} justifyContent={'space-between'}>
        <Stack gap={12}>
          <BidInput
            sx={{
              '& p': {
                color: '#000'
              },
              '& div.MuiInputBase-root': {
                background: '#F6F6F3 !important',
                color: '#000 !important',
                '& button ~ span': {
                  color: '#959595'
                }
              }
            }}
            inputToken={token1Currency || undefined}
            value={curAmount}
            onChange={v => {
              setCurAmount(v)
            }}
          />
        </Stack>

        <Stack flexDirection={'row'} alignItems={'center'} gap={12} mb={40}>
          <CancelBtnStyle style={{ flex: 1 }} onClick={onClose}>
            Cancel
          </CancelBtnStyle>
          {confirmBtn}
        </Stack>
      </Stack>
    </BaseDialog>
  )
}

export default StakeAuctionInputDialog
