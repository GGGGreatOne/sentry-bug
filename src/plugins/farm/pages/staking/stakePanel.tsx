import { Box, Stack, Typography, Button, styled, Divider } from '@mui/material'
import Input from 'components/Input'
import { Dispatch, SetStateAction, useCallback, useEffect, useMemo, useRef, useState } from 'react'
import { useActiveWeb3React } from 'hooks'
import { useWalletModalToggle } from 'state/application/hooks'
import { useCurrencyBalance, useToken } from 'hooks/useToken'
import { CurrencyAmount } from 'constants/token'
import { ApprovalState, useApproveCallback } from 'hooks/useApproveCallback'
import { STAKING_CONSTANTS } from 'plugins/farm/constants'
import { useStakeCallback, useViewStakedAmount } from 'plugins/farm/hook/useStakeCallback'
import { useGetTokenPrice } from 'hooks/boxes/useGetTokenPrice'
import BigNumber from 'bignumber.js'
import { formatBigNumber, getEventLog } from 'utils'
import Image from 'components/Image'
import { viewControl } from 'views/editBox/modal'
import { useFetchPluginTokenList } from 'hooks/boxes/useGetClubPlugin'
import Icon from 'assets/svg/boxes/arrow_bottom.svg'
import { SupportedChainId } from 'constants/chains'
import Checkbox from 'components/Checkbox'
import useBreakpoint from 'hooks/useBreakpoint'
import { useStakeContract } from 'plugins/farm/hook/useContract'

const Row = styled(Stack)(() => ({
  flexDirection: 'row',
  justifyContent: 'space-between'
}))

const StyleInput = styled(Box)(() => ({
  maxWidth: 206,
  '& .MuiInputBase-root': {
    background: 'transparent !important',
    padding: '0 !important',
    fontSize: '28px !important',
    minHeight: 'unset',
    '>input': {
      padding: '0 !important',
      height: '31px'
    },
    '>span': {
      display: 'flex',
      padding: '0 !important'
    }
  }
}))

const StyleButton = styled(Button)(() => ({
  height: 44,
  backgroundColor: 'var(--ps-neutral)',
  color: 'var(--ps-text-100)',
  ':hover': {
    backgroundColor: 'var(--ps-neutral)',
    color: 'var(--ps-text-100)',
    opacity: 0.9
  }
}))

const StakePanel = ({
  boxContactAddr,
  tokenAddress,
  setTokenAddress,
  logo,
  setLogo
}: {
  boxContactAddr: string
  tokenAddress: string | undefined
  setTokenAddress: Dispatch<SetStateAction<string | undefined>>
  logo: string | undefined
  setLogo: Dispatch<SetStateAction<string | undefined>>
}) => {
  const isMd = useBreakpoint('md')
  const [amount, setAmount] = useState<string>('')
  const { chainId, account } = useActiveWeb3React()
  const WalletModalToggle = useWalletModalToggle()
  const CurrencyToken = useToken(tokenAddress || '')
  const price = useGetTokenPrice([tokenAddress || ''])
  const userTokenBalance = useCurrencyBalance(account, CurrencyToken || undefined, chainId)
  const StakedAmount = useViewStakedAmount(CurrencyToken)

  const tokenCurrencyAmount = useMemo(() => {
    if (CurrencyToken) {
      return CurrencyAmount.fromAmount(CurrencyToken, amount)
    }
    return undefined
  }, [CurrencyToken, amount])

  const tokenPriceUsd = useMemo(() => {
    if (price[0] && amount) {
      return new BigNumber(price[0]).times(amount)
    }
    return undefined
  }, [amount, price])

  const [approvalState, run] = useApproveCallback(
    tokenCurrencyAmount,
    STAKING_CONSTANTS[chainId || SupportedChainId.TESTNET]
  )
  const contract = useStakeContract(STAKING_CONSTANTS[chainId || SupportedChainId.TESTNET])
  const stakedToken = useRef<string | null>(null)
  const cb = useCallback(() => {
    if (stakedToken.current) {
      alert(stakedToken.current)
    }
  }, [])
  cb
  const { runWithModal } = useStakeCallback(boxContactAddr, tokenCurrencyAmount)
  const [checked, setChecked] = useState(false)
  const { data } = useFetchPluginTokenList({
    params: {
      pageSize: 100,
      pageNum: 0
    }
  })

  const handle = useCallback(async () => {
    try {
      const stakedRes = await runWithModal()
      if (contract && stakedRes.logs) {
        const ret = await getEventLog(contract, stakedRes.logs, 'Staked', 'token')
        ret && (stakedToken.current = ret)
      }
    } catch (error) {
      console.error(error)
    }
  }, [contract, runWithModal])

  useEffect(() => {
    setAmount('')
  }, [tokenAddress])

  const bt = useMemo(() => {
    if (!chainId || !account) {
      return (
        <StyleButton variant="contained" onClick={WalletModalToggle}>
          Login
        </StyleButton>
      )
    }
    if (!checked) {
      return (
        <StyleButton variant="contained" disabled>
          Enter an amount
        </StyleButton>
      )
    }
    if (!tokenCurrencyAmount) {
      return (
        <StyleButton variant="contained" disabled>
          Enter an amount
        </StyleButton>
      )
    }

    if (tokenCurrencyAmount && userTokenBalance?.lessThan(tokenCurrencyAmount)) {
      return (
        <StyleButton variant="contained" disabled>
          Insufficient Balance
        </StyleButton>
      )
    }
    if (tokenCurrencyAmount && approvalState !== ApprovalState.APPROVED) {
      return (
        <StyleButton onClick={run} variant="contained" fullWidth>
          Approve {tokenCurrencyAmount?.currency.symbol || 'Token'}
        </StyleButton>
      )
    }

    return (
      <StyleButton variant="contained" onClick={handle}>
        STAKE
      </StyleButton>
    )
  }, [WalletModalToggle, account, approvalState, chainId, checked, handle, run, tokenCurrencyAmount, userTokenBalance])

  return (
    <Stack
      spacing={24}
      sx={{
        width: '100%',
        maxWidth: '360px'
      }}
    >
      <Box sx={{ display: 'flex', width: '100%', justifyContent: 'space-between' }}>
        <Button variant="contained" sx={{ height: 44, maxWidth: 174, width: '100%' }}>
          STAKE
        </Button>
        <Button
          disabled
          variant="outlined"
          sx={{
            height: 44,
            maxWidth: 174,
            width: '100%',
            color: 'var(--ps-text-60) !important',
            cursor: 'not-allowed'
          }}
        >
          UNSTAKE
        </Button>
      </Box>
      <Box
        sx={{
          width: '100%',
          maxWidth: '360px',
          backgroundColor: 'var(--ps-neutral)',
          padding: '12px 4px 4px',
          display: 'flex',
          flexDirection: 'column',
          gap: 12,
          borderRadius: 16
        }}
      >
        <Row padding={'0 8px'}>
          <Typography color={'var(--ps-text-80)'} lineHeight={1.4}>
            Amount
          </Typography>
          <Typography color={'var(--ps-text-40)'} fontSize={15} lineHeight={1.4}>
            Balance: {userTokenBalance?.toSignificant() || '0'}
          </Typography>
        </Row>
        <Stack gap={16}>
          <Row padding={'0 12px'} gap={10}>
            <Stack spacing={10}>
              <StyleInput>
                <Input
                  placeholder="Enter Amount"
                  type="unumber"
                  onValue={e => {
                    setAmount(e)
                  }}
                  value={amount}
                  endAdornment={
                    <Button
                      sx={{
                        minWidth: 48,
                        padding: '0',
                        height: '31px',
                        borderRadius: '8px',
                        backgroundColor: 'var(--ps-neutral3)',
                        '&:hover': {
                          backgroundColor: isMd ? 'var(--ps-neutral3)' : 'rgba(255, 255, 255, 0.80)'
                        }
                      }}
                      variant="contained"
                      onClick={() => {
                        setAmount(userTokenBalance?.toExact() || '0')
                      }}
                    >
                      <Typography color={'var(--ps-text-100)'} fontSize={16} fontWeight={400}>
                        Max
                      </Typography>
                    </Button>
                  }
                />
              </StyleInput>
              <Typography color={'var(--ps-text-80)'} fontSize={13} lineHeight={1.4}>
                ${tokenPriceUsd ? formatBigNumber(tokenPriceUsd, 2) : '0'}
              </Typography>
            </Stack>
            <Stack
              sx={{
                height: 'fit-content',
                cursor: 'pointer',
                borderRadius: '16px',
                background: '#FFFFFF'
              }}
              onClick={() => {
                viewControl.show('PluginListModal', {
                  data: data,
                  tokenAddress: tokenAddress,
                  setTokenAddress: setTokenAddress,
                  setLogo: setLogo
                })
              }}
            >
              <Box display={'flex'} gap={6} alignItems={'center'} p={5}>
                <Image
                  src={(logo ? logo : data?.[0].smallImg) || ''}
                  alt="tokenLogo"
                  width={24}
                  height={24}
                  style={{ borderRadius: '50%' }}
                />
                <Typography color={'var(--ps-grey-01)'} fontSize={16} fontWeight={500}>
                  {CurrencyToken?.symbol?.toLocaleUpperCase() || 'AUCTION'}
                </Typography>
                <Icon />
              </Box>
            </Stack>
          </Row>
          <Row padding={'0 12px'}>
            <Typography color={'var(--ps-text-40)'} fontSize={15} lineHeight={1.4}>
              You’ve staked
            </Typography>
            <Typography color={'var(--ps-text-40)'} fontSize={15} lineHeight={1.4}>
              {StakedAmount ? formatBigNumber(new BigNumber(StakedAmount)) : '0'} {` `}
              {CurrencyToken?.symbol || 'token'}
            </Typography>
          </Row>
          <Box
            sx={{
              padding: '8px 12px 10px',
              backgroundColor: 'var(--ps-text-100)',
              display: 'flex',
              flexDirection: 'column',
              gap: 8,
              borderRadius: 12
            }}
          >
            <Stack spacing={8}>
              <Typography
                sx={{
                  fontSize: '12px',
                  lineHeight: 1.5,
                  color: 'var(--ps-neutral)',
                  display: 'flex',
                  alignItems: 'center',
                  gap: 4
                }}
              >
                <Box>
                  <Checkbox checked={checked} onChange={e => setChecked(e.target.checked)} />
                </Box>
                The UNSTAKE function will be used after the mainnet is launched, and Trade Value continues to accumulate
                every day.
              </Typography>
              <Divider sx={{ backgroundColor: 'var(--ps-neutral)' }} />
            </Stack>
            {bt}
          </Box>
        </Stack>
      </Box>
    </Stack>
  )
}

export default StakePanel
