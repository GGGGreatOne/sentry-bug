import { Box, Stack, styled, Typography } from '@mui/material'

import BaseDialog from 'components/Dialog/baseDialog'
import Input from 'components/Input'
import * as yup from 'yup'

import { useCallback, useMemo, useState } from 'react'
import LoadingButton from '@mui/lab/LoadingButton'
import Switch from 'components/Switch'
import DowArrowGreySvg from 'plugins/leverage/assets/dow-arrow-grey.svg'
// import ArrowDouble from 'assets/svg/boxes/arrow-double.svg'
import ArrowDownSvg from 'assets/svg/claimBox/arrow-down-blue.svg'
// import CalendarSvg from 'assets/svg/boxes/time-calendar.svg'
import { Currency, CurrencyAmount } from 'constants/token'
// import useBreakpoint from 'hooks/useBreakpoint'
import BasicDateTimePicker from 'components/DatePicker/DateTimePicker'
import { FilterTokenType, useGetPluginTokenListData } from 'state/pluginTokenListConfig/hooks'
import { SupportedChainId } from 'constants/chains'
import { useActiveWeb3React } from 'hooks'
import { globalDialogControl } from 'components/Dialog'
import { Form, Formik } from 'formik'
import FormItem from 'components/FormItem'
import dayjs from 'dayjs'
import { useCreateStaking } from 'plugins/bitFarm/hooks/useCreateStaking'
import { ApprovalState, useApproveCallback } from 'hooks/useApproveCallback'
import { STAKING_FACTORY_CONTRACT_ADDRESS } from 'plugins/bitFarm/addresses'
import { viewControl } from 'views/editBox/modal'
import CurrencyLogo from 'components/essential/CurrencyLogo'
import { useCurrencyBalance } from 'hooks/useToken'
import useBreakpoint from 'hooks/useBreakpoint'
import { PairState, usePair } from 'components/Widget/data/Reserves'
import { Currency as SDKCurrency, Token } from '@uniswap/sdk'
import isZero, { formatStringLength, shortenAddress } from 'utils'
import { WBB } from 'components/Widget/constant'
import DoubleCurrencyLogo from 'components/Widget/component/CurrencyLogo/DoubleLogo'
import Copy from 'components/essential/Copy'
import { COMMON_BASES } from 'components/Widget2/constants/routing'
import { ZERO_ADDRESS } from 'constants/index'

const StyleLabel = styled(Typography)(({ theme }) => ({
  width: '100%',
  fontSize: 20,
  fontWeight: 500,
  lineHeight: 1.3,
  letterSpacing: '-0.02em',
  maxWidth: 'max-content',
  [theme.breakpoints.down('md')]: {
    fontSize: 15
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
    fontSize: '16px !important',
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
      paddingRight: '24px'
    },
    '& .MuiInputBase-input::placeholder': {
      fontSize: '14px !important',
      fontWeight: 400,
      lineHeight: 1.4,
      color: 'var(--ps-text-60)'
    }
  }
}))

const Row = styled(Box)(() => ({
  width: '100%',
  display: 'flex',
  justifyContent: 'space-between',
  alignItems: 'center'
}))

const StylePoolDetailBox = styled(Box)(({ theme }) => ({
  width: '100%',
  padding: 24,
  backgroundColor: 'var(--ps-neutral2)',
  borderRadius: '12px',
  display: 'flex',
  flexDirection: 'column',
  gap: 20,
  [theme.breakpoints.down('md')]: {
    gap: 16,
    padding: 16
  }
}))

const StyleLabelGray = styled(Typography)(({ theme }) => ({
  fontSize: 16,
  lineHeight: 1.4,
  color: 'var(--ps-text-60)',
  [theme.breakpoints.down('md')]: {
    fontSize: 15
  }
}))

const StyleDetailContent = styled(Typography)(({ theme }) => ({
  fontSize: 16,
  lineHeight: 1.4,
  color: 'var(--ps-text-60)',
  [theme.breakpoints.down('md')]: {
    fontSize: 15
  }
}))

const StyleBasicDateTimePicker = styled(BasicDateTimePicker)(({ theme }) => ({
  borderRadius: '4px !important',
  '& .MuiInputAdornment-sizeMedium ': {
    height: '100%',
    width: '40px'
  },
  '& .MuiInputAdornment-root .MuiButtonBase-root': {
    color: '#fff !important'
  },

  '& .MuiOutlinedInput-root': {
    height: 44,
    '&>input.MuiOutlinedInput-input': {
      padding: '0 0 0 16px !important'
    }
  },
  [theme.breakpoints.down('md')]: {
    '& .MuiOutlinedInput-root': {
      height: 40
    },
    '& .MuiInputBase-input::placeholder': {
      fontSize: '14px !important',
      fontWeight: 400,
      lineHeight: 1.4,
      color: 'var(--ps-text-60)'
    }
  }
}))

const StyleSelectTokenBox = styled(Box)(({ theme }) => ({
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'space-between',
  padding: '5px 16px',
  height: 44,
  border: '1px solid var(--ps-text-20)',
  borderRadius: '4px',
  cursor: 'pointer',
  userSelect: 'none',
  ':hover': {
    border: '1px solid var(--ps-neutral3)'
  },
  ':active': {
    opacity: 0.7,
    border: '1px solid var(--ps-neutral3)'
  },
  svg: {
    path: {
      stroke: 'var(--ps-neutral3)'
    }
  },
  [theme.breakpoints.down('md')]: {
    padding: '4px 16px',
    height: 40
  }
}))

const StyleLoadingButton = styled(LoadingButton)(({ theme }) => ({
  height: 44,
  [theme.breakpoints.down('md')]: {
    height: 36
  }
}))

const StyleRound = styled(Box)(() => ({
  width: 28,
  height: 28,
  borderRadius: '50%',
  backgroundColor: '#717171',
  position: 'absolute',
  bottom: -22,
  left: '50%',
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  margin: '0 !important',
  transform: 'translateX(-50%)',
  zIndex: 2,
  svg: {
    path: {
      fill: '#fff'
    }
  }
}))

interface FormProps {
  title: string
  stakeToken: string | undefined
  rewardToken: string | undefined
  startTime: number | undefined
  endTime: number | undefined
  totalReward: string
  rewardPer: string
  selectToken0?: string | undefined
  selectToken1?: string | undefined
}

const initVal: FormProps = {
  title: '',
  stakeToken: undefined,
  rewardToken: undefined,
  startTime: undefined,
  endTime: undefined,
  totalReward: '',
  rewardPer: '',
  selectToken0: undefined,
  selectToken1: undefined
}

function PoolDetail({
  title,
  stakeToken,
  rewardToken,
  totalReward,
  startTime,
  endTime,
  isLPTokenPool,
  token0,
  token1
}: {
  title: string | undefined
  stakeToken: Currency | undefined
  rewardToken: Currency | undefined
  totalReward: string | undefined
  startTime: number | undefined
  endTime: number | undefined
  isLPTokenPool?: boolean | undefined
  token0?: Currency | undefined
  token1?: Currency | undefined
}) {
  console.log('stakeToken', stakeToken, rewardToken, totalReward, startTime, endTime)
  const day = 60 * 60 * 24 * 1000
  const isMd = useBreakpoint('md')
  const _rewardPer = useMemo(() => {
    if (startTime && endTime && totalReward) {
      const duration = endTime - startTime
      if (duration < day) {
        return totalReward
      }
      return Number(totalReward) / Number((duration / day).toFixed(2))
    }
    return undefined
  }, [day, endTime, startTime, totalReward])

  const rewardPer = useMemo(() => {
    if (_rewardPer && rewardToken) {
      return CurrencyAmount.fromAmount(rewardToken, _rewardPer)
    }
    return undefined
  }, [_rewardPer, rewardToken])

  if (isMd) {
    return (
      <StylePoolDetailBox>
        <Typography
          sx={{
            fontSize: 15,
            fontWeight: 500,
            lineHeight: 1.3
          }}
        >
          Pool confirmation
        </Typography>
        <Stack direction={'row'} gap={8} alignItems={'center'}>
          <CurrencyLogo currencyOrAddress={stakeToken?.address} size={isMd ? '24px' : '40px'} />

          <Stack spacing={4}>
            <Typography
              sx={{
                fontSize: 15,
                fontWeight: 500,
                lineHeight: 1.3
              }}
            >
              {title || '--'}
            </Typography>
            <Typography
              sx={{
                fontSize: '12px',
                fontWeight: 400,
                lineHeight: 1.4
              }}
            >
              Stake {formatStringLength(stakeToken?.symbol) || '--'} Earn{' '}
              {formatStringLength(rewardToken?.symbol) || '--'}
            </Typography>
          </Stack>
        </Stack>
        <Row>
          <StyleDetailContent>Total Reward</StyleDetailContent>
          <StyleDetailContent color={'var(--ps-text-100) !important'}>
            {totalReward || '--'} {formatStringLength(rewardToken?.symbol) || '--'}
          </StyleDetailContent>
        </Row>
        <Row>
          <StyleDetailContent>Pool Duration</StyleDetailContent>
          <StyleDetailContent color={'var(--ps-text-100) !important'}>
            {startTime ? dayjs(startTime).format('MM.DD.YYYY HH:mm') : '--'} -
            <br />
            {endTime ? dayjs(endTime).format('MM.DD.YYYY HH:mm') : '--'}
          </StyleDetailContent>
        </Row>
        <Row>
          <StyleDetailContent>Reward Per Day</StyleDetailContent>
          <StyleDetailContent color={'var(--ps-text-100) !important'}>
            {rewardPer?.toSignificant(6) || '--'} {formatStringLength(rewardToken?.symbol) || '--'}
          </StyleDetailContent>
        </Row>
      </StylePoolDetailBox>
    )
  }

  return (
    <StylePoolDetailBox>
      <Typography
        sx={{
          fontSize: '20px',
          fontWeight: 600,
          lineHeight: '28px',
          letterSpacing: '-0.02em'
        }}
      >
        Pool confirmation
      </Typography>

      {isLPTokenPool ? (
        <Stack direction={'row'} gap={8} alignItems={'center'}>
          <DoubleCurrencyLogo currency0={token0} currency1={token1} size={isMd ? 24 : 40} />
          <Stack spacing={4}>
            <Typography
              sx={{
                fontSize: '18px',
                fontWeight: 600,
                lineHeight: '24px'
              }}
            >
              {title || '--'}
            </Typography>
            <Typography
              sx={{
                fontSize: '12px',
                fontWeight: 400,
                lineHeight: '16px'
              }}
            >
              Stake{' '}
              {token0 && token1 ? formatStringLength(token0?.symbol) + '/' + formatStringLength(token1.symbol) : '--'}{' '}
              Earn {rewardToken?.symbol || '--'}{' '}
            </Typography>
          </Stack>
        </Stack>
      ) : (
        <Stack direction={'row'} gap={8} alignItems={'center'}>
          <CurrencyLogo currencyOrAddress={stakeToken?.address} size={isMd ? '24px' : '40px'} />

          <Stack spacing={4}>
            <Typography
              sx={{
                fontSize: '18px',
                fontWeight: 600,
                lineHeight: '24px'
              }}
            >
              {title || '--'}
            </Typography>
            <Typography
              sx={{
                fontSize: '12px',
                fontWeight: 400,
                lineHeight: '16px'
              }}
            >
              Stake {formatStringLength(stakeToken?.symbol) || '--'} Earn{' '}
              {formatStringLength(rewardToken?.symbol) || '--'}
            </Typography>
          </Stack>
        </Stack>
      )}

      <Row>
        <StyleDetailContent>Total Reward</StyleDetailContent>
        <StyleDetailContent color={'var(--ps-text-100) !important'}>
          {totalReward || '--'} {formatStringLength(rewardToken?.symbol) || '--'}
        </StyleDetailContent>
      </Row>
      <Row>
        <StyleDetailContent>Pool Duration</StyleDetailContent>
        <StyleDetailContent color={'var(--ps-text-100) !important'}>
          {startTime ? dayjs(startTime).utc().format('MM.DD.YYYY HH:mm') : '--'} -{' '}
          {endTime ? dayjs(endTime).utc().format('MM.DD.YYYY HH:mm') : '--'}
        </StyleDetailContent>
      </Row>
      <Row>
        <StyleDetailContent>Reward Per Day</StyleDetailContent>
        <StyleDetailContent color={'var(--ps-text-100) !important'}>
          {rewardPer?.toSignificant(6) || '--'} {formatStringLength(rewardToken?.symbol) || '--'}
        </StyleDetailContent>
      </Row>
    </StylePoolDetailBox>
  )
}

function SelectTokenAsset({
  chainId,
  checkToken,
  CurrencyToken0,
  CurrencyToken1,
  setCheckToken,
  placeholder,
  tokenList,
  disabled
}: {
  chainId: number | undefined
  checkToken?: Currency | undefined
  CurrencyToken0?: Currency | undefined
  CurrencyToken1?: Currency | undefined
  setCheckToken?: (e: Currency | undefined) => void
  placeholder?: string | undefined
  tokenList?: Currency[]
  disabled?: boolean
}) {
  const isMd = useBreakpoint('md')

  const bases = chainId !== undefined ? COMMON_BASES[chainId] ?? [] : []

  const hotTokenList = useMemo(() => {
    if (!bases.length) return undefined

    return bases.map(v => {
      const formatSymbol = v.symbol?.toUpperCase() === 'ETH' ? 'BB' : v.symbol
      return new Currency(
        chainId || SupportedChainId.BIT_DEVNET,
        v.isNative ? ZERO_ADDRESS : v.wrapped.address || '',
        v.decimals || 18,
        formatSymbol || '',
        v.name,
        ''
      )
    })
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [chainId])

  const handleTokenSelection = useCallback(
    (e: Currency) => {
      setCheckToken?.(e)
      globalDialogControl.hide('SelectTokenDialog')
    },
    [setCheckToken]
  )

  const openSelectTokenModal = useCallback(() => {
    if (disabled) return
    globalDialogControl.show('SelectTokenDialog', {
      tokens: tokenList,
      curSelectToken: checkToken || undefined,
      handleTokenSelection,
      CurrencyToken0,
      CurrencyToken1,
      showCreate: false,
      hotTokenList
    })
  }, [disabled, tokenList, checkToken, handleTokenSelection, CurrencyToken0, CurrencyToken1, hotTokenList])
  return (
    <StyleSelectTokenBox onClick={openSelectTokenModal}>
      {!checkToken ? (
        <Typography color={'var(--ps-grey-03)'} fontSize={{ xs: 14, md: 16 }} lineHeight={{ xs: '30px', md: '32px' }}>
          {placeholder ?? 'Select Token'}
        </Typography>
      ) : (
        <Box display={'flex'} gap={10} alignItems={'center'} width={'calc(100%  - 34px)'}>
          <CurrencyLogo currencyOrAddress={checkToken.address} size={isMd ? '20px' : '24px'} />
          <Stack spacing={{ xs: 3, md: 5 }} width={'calc(100%  - 30px)'}>
            <Typography color={'var(--ps-grey-03)'} fontSize={12} lineHeight={'17px'}>
              Select Token
            </Typography>
            <Typography noWrap fontSize={{ xs: 15, md: 16 }} color={'var(--ps-text-100)'} lineHeight={1.1}>
              {checkToken?.symbol || 'token'}
            </Typography>
          </Stack>
        </Box>
      )}
      <DowArrowGreySvg />
    </StyleSelectTokenBox>
  )
}

export default function CreatePoolModal({ boxAddress }: { boxAddress: string | undefined }) {
  const [isLPTokenPool, setIsLPTokenPool] = useState<boolean>(false)
  // const [isBlockReward, setIsBlockReward] = useState<boolean>(false)
  const { chainId, account } = useActiveWeb3React()

  const [_token0, _setToken0] = useState<Currency | undefined>()
  const [_token1, _setToken1] = useState<Currency | undefined>()

  const [_stakeToken, _setStakeToken] = useState<Currency | undefined>()
  const [_rewardToken, _setRewardToken] = useState<Currency | undefined>()
  const [_totalReward, _setTotalReward] = useState<string>()

  const { createStaking } = useCreateStaking(boxAddress)
  const { pluginTokenList } = useGetPluginTokenListData(FilterTokenType.Token)

  const pairToken0: SDKCurrency | undefined = useMemo(() => {
    if (_token0 && chainId) {
      const tokenAddress = isZero(_token0.address) ? WBB.address : _token0.address
      return new Token(chainId as number, tokenAddress, _token0.decimals, _token0.symbol, _token0.name)
    }
    return undefined
  }, [_token0, chainId])
  const pairToken1: SDKCurrency | undefined = useMemo(() => {
    if (_token1 && chainId) {
      const tokenAddress = isZero(_token1.address) ? WBB.address : _token1.address
      return new Token(chainId as number, tokenAddress, _token1.decimals, _token1.symbol, _token1.name)
    }
    return undefined
  }, [_token1, chainId])

  const [_PairState, pairToken] = usePair(pairToken0, pairToken1)

  const _stakeLPToken = pairToken?.liquidityToken

  const pairStatus = useMemo(() => {
    if (!pairToken0 || !pairToken1) return undefined
    if (!!pairToken0 && !!pairToken1 && !!_stakeLPToken) return undefined
    if (_PairState === PairState.LOADING) {
      return {
        text: 'loading...',
        color: 'var(--ps-text-60)'
      }
    }

    if (_PairState === PairState.INVALID || _PairState === PairState.NOT_EXISTS) {
      return {
        text: 'Invalid Pair Token',
        color: 'var(--ps-red)'
      }
    }
    return {}
  }, [_PairState, _stakeLPToken, pairToken0, pairToken1])

  const TokenList = pluginTokenList
    .map(v => {
      return new Currency(
        chainId || SupportedChainId.BIT_DEVNET,
        v.contractAddress || '',
        v.decimals || 18,
        v.tokenSymbol || '',
        v.tokenName,
        v.smallImg || ''
      )
    })
    .filter(v => v?.symbol?.toUpperCase() !== 'WBB' && v?.symbol?.toUpperCase() !== 'BB')

  const RewardToken = useMemo(() => {
    if (!_rewardToken || !_totalReward) return undefined
    return CurrencyAmount.fromAmount(_rewardToken, _totalReward)
  }, [_rewardToken, _totalReward])

  const isZeroRewardToken = useMemo(() => {
    return _totalReward === '0'
  }, [_totalReward])

  const userTokenBalance = useCurrencyBalance(account, _rewardToken || undefined, chainId)

  const [approvalState, run] = useApproveCallback(
    RewardToken,
    STAKING_FACTORY_CONTRACT_ADDRESS[chainId || SupportedChainId.TESTNET]
  )

  const onClose = useCallback(() => {
    viewControl.hide('CreatePoolModal')
    _setStakeToken(undefined)
    _setRewardToken(undefined)
    _setTotalReward(undefined)
    _setToken0(undefined)
    _setToken1(undefined)
    setIsLPTokenPool(false)
  }, [])

  const createSingleTokenPool = useCallback(
    async (values: FormProps) => {
      if (
        !values.title ||
        !values.endTime ||
        !values.startTime ||
        !values.rewardToken ||
        !values.stakeToken ||
        !values.totalReward ||
        !_stakeToken ||
        !RewardToken
      ) {
        return
      }

      const _duration = Math.floor((values.endTime - values.startTime) / 1000)
      try {
        await createStaking(
          values.title,
          _stakeToken,
          RewardToken,
          Math.floor(values.startTime / 1000).toString(),
          _duration.toString()
        )
        onClose()
      } catch (error) {
        console.error(error)
      }
    },
    [_stakeToken, RewardToken, createStaking, onClose]
  )

  const createLPTokenPool = useCallback(
    async (values: FormProps) => {
      if (
        !values.title ||
        !values.endTime ||
        !values.startTime ||
        !values.rewardToken ||
        !values.totalReward ||
        !_stakeLPToken ||
        !RewardToken
      ) {
        return
      }

      const _duration = Math.floor((values.endTime - values.startTime) / 1000)
      try {
        await createStaking(
          values.title,
          new Currency(
            _stakeLPToken.chainId as number,
            _stakeLPToken.address,
            _stakeLPToken.decimals,
            _stakeLPToken.symbol,
            _stakeLPToken.name
          ),
          RewardToken,
          Math.floor(values.startTime / 1000).toString(),
          _duration.toString()
        )
        onClose()
      } catch (error) {
        console.error(error)
      }
    },
    [RewardToken, _stakeLPToken, createStaking, onClose]
  )

  const Submit = useCallback(
    (values: FormProps) => {
      if (!isLPTokenPool) {
        createSingleTokenPool(values)
      } else {
        createLPTokenPool(values)
      }
    },
    [isLPTokenPool, createSingleTokenPool, createLPTokenPool]
  )

  const validationSchema = yup.object({
    title: yup.string().required('Please enter title'),
    stakeToken: yup.string().test('verifyStakeToken', 'Please select stake token', value => {
      if (!value && !isLPTokenPool) {
        return false
      }
      return true
    }),
    rewardToken: yup.string().required('Please select reward token'),
    startTime: yup
      .number()
      .required('Please select a starting date')
      .test('verifyStartTime', 'error time', starttime => {
        const currentTime = Date.now()
        if (starttime && starttime < currentTime) return false
        return true
      }),
    endTime: yup
      .number()
      .required('Please select a closure date')
      .test('verifyEndTime', 'error time', (endtime, obj) => {
        if (endtime && endtime < obj.parent.startTime) return false
        return true
      }),
    totalReward: yup
      .string()
      .required('Please enter total reward')
      .test('verifyTotalReward', isZeroRewardToken ? 'Invalid Amount' : 'Insufficient Balance', value => {
        const val = value !== '0' ? value : undefined
        if (val && _rewardToken && !userTokenBalance?.lessThan(CurrencyAmount.fromAmount(_rewardToken, val) || '0')) {
          return true
        }
        return false
      }),
    selectToken0: yup.string().test('verifySelectToken0', 'Please select token0', value => {
      if (!value && isLPTokenPool) {
        return false
      }
      return true
    }),
    selectToken1: yup.string().test('verifySelectToken1', 'Please select token1', value => {
      if (!value && isLPTokenPool) {
        return false
      }
      return true
    })
    // rewardPer: yup.string().required('Please enter reward per')
  })

  const addTime = 5 * 60 * 1000 // add 5 mins

  return (
    <BaseDialog title="Create A Pool" close onClose={onClose} disableBackClick>
      <Formik validationSchema={validationSchema} initialValues={initVal} onSubmit={Submit}>
        {({ values, setFieldValue }) => {
          return (
            <Stack spacing={32} width={{ xs: '100%', md: 514 }} component={Form}>
              <Stack spacing={16}>
                <StyleLabel>Pool Title</StyleLabel>
                <FormItem name="title">
                  <InputStyle
                    hasBorder
                    outlined
                    value={values.title}
                    onValue={e => {
                      setFieldValue('title', e)
                    }}
                    placeholder="Enter"
                  />
                </FormItem>
              </Stack>
              <Stack spacing={16}>
                <Row>
                  <StyleLabel>Select Staking Asset</StyleLabel>

                  <Box
                    display={'flex'}
                    sx={{
                      alignItems: 'center',
                      gap: 8
                    }}
                  >
                    <Switch
                      value={isLPTokenPool}
                      onChange={() => {
                        setIsLPTokenPool(!isLPTokenPool)
                      }}
                    />
                    <Typography variant="h5">Select an LP Token</Typography>
                  </Box>
                </Row>
                {isLPTokenPool ? (
                  <Stack spacing={16}>
                    <Stack
                      spacing={16}
                      sx={{
                        padding: { xs: 16, md: 24 },
                        borderRadius: '12px',
                        backgroundColor: 'var(--ps-neutral2)',
                        position: 'relative'
                      }}
                    >
                      <FormItem name="selectToken0">
                        <SelectTokenAsset
                          chainId={chainId}
                          checkToken={_token0}
                          CurrencyToken0={_token0}
                          CurrencyToken1={_token1}
                          setCheckToken={e => {
                            _setToken0(e)
                            setFieldValue('selectToken0', e?.address)
                          }}
                          tokenList={TokenList}
                        />
                      </FormItem>
                      <FormItem name="selectToken1">
                        <SelectTokenAsset
                          chainId={chainId}
                          checkToken={_token1}
                          CurrencyToken0={_token0}
                          CurrencyToken1={_token1}
                          setCheckToken={e => {
                            _setToken1(e)
                            setFieldValue('selectToken1', e?.address)
                          }}
                          tokenList={TokenList}
                        />
                      </FormItem>
                      {_token1 && _token0 && (
                        <StyleRound>
                          <ArrowDownSvg />
                        </StyleRound>
                      )}
                    </Stack>

                    {_token1 && _token0 && (
                      <Stack
                        spacing={16}
                        sx={{
                          padding: { xs: 16, md: 24 },
                          borderRadius: '12px',
                          backgroundColor: 'var(--ps-neutral2)',
                          position: 'relative'
                        }}
                      >
                        <StyleLabel>LP Infomation</StyleLabel>

                        {!!pairStatus ? (
                          <Typography
                            sx={{
                              fontSize: { xs: 15, md: 16 },
                              textAlign: 'center'
                            }}
                            color={pairStatus.color}
                          >
                            {pairStatus.text}
                          </Typography>
                        ) : (
                          <Stack spacing={10}>
                            <Row>
                              <StyleDetailContent>Logo</StyleDetailContent>
                              <CurrencyLogo currencyOrAddress={_stakeLPToken?.address} size="16px" />
                            </Row>
                            <Row>
                              <StyleDetailContent>
                                {_token0.symbol || 'token0'}-{_token1.symbol || 'token1'}
                              </StyleDetailContent>
                              <DoubleCurrencyLogo currency0={_token0} currency1={_token1} size={16} />
                            </Row>
                            <Row>
                              <StyleDetailContent>Pair Address</StyleDetailContent>

                              <StyleDetailContent
                                sx={{
                                  display: 'flex',
                                  alignItems: 'center',
                                  gap: 4
                                }}
                              >
                                {_stakeLPToken?.address ? shortenAddress(_stakeLPToken?.address) : '--'}
                                {_stakeLPToken?.address && <Copy toCopy={_stakeLPToken?.address || ''} margin="0" />}
                              </StyleDetailContent>
                            </Row>
                          </Stack>
                        )}
                      </Stack>
                    )}
                  </Stack>
                ) : (
                  <FormItem name="stakeToken">
                    <SelectTokenAsset
                      chainId={chainId}
                      checkToken={_stakeToken}
                      setCheckToken={e => {
                        _setStakeToken(e)
                        setFieldValue('stakeToken', e?.address)
                      }}
                      tokenList={TokenList}
                    />
                  </FormItem>
                )}
              </Stack>
              <Stack spacing={16}>
                <StyleLabel>Select Farming Asset</StyleLabel>
                <FormItem name="rewardToken">
                  <SelectTokenAsset
                    chainId={chainId}
                    checkToken={_rewardToken}
                    setCheckToken={e => {
                      _setRewardToken(e)
                      setFieldValue('rewardToken', e?.address)
                    }}
                    tokenList={TokenList}
                  />
                </FormItem>
              </Stack>
              <Stack spacing={16}>
                <StyleLabel>Pool Start (UTC time)</StyleLabel>
                <FormItem name="startTime" fieldType="custom">
                  <StyleBasicDateTimePicker
                    value={values.startTime ? dayjs(values.startTime) : undefined}
                    onChange={value => {
                      const timestamp = dayjs(value).valueOf()
                      const currentTime = dayjs().valueOf()
                      if (timestamp > currentTime) {
                        setFieldValue('startTime', timestamp)
                      } else {
                        setFieldValue('startTime', currentTime + addTime)
                      }
                    }}
                    minDateTime={dayjs(dayjs().valueOf() + addTime)}
                  />
                </FormItem>
              </Stack>
              <Stack spacing={16}>
                <StyleLabel>Pool End (UTC time)</StyleLabel>

                <FormItem name="endTime" fieldType="custom">
                  <StyleBasicDateTimePicker
                    disabled={!values.startTime}
                    value={values.endTime ? dayjs(values.endTime) : undefined}
                    onChange={value => {
                      if (!values?.startTime) return
                      const timestamp = dayjs(value).valueOf()
                      setFieldValue('endTime', timestamp)
                    }}
                    minDateTime={dayjs(values.startTime)}
                  />
                </FormItem>
              </Stack>
              <Stack spacing={16}>
                <Row>
                  <StyleLabel>Total Reward</StyleLabel>
                  {_rewardToken && (
                    <StyleLabelGray>Balance: {userTokenBalance?.toSignificant(6) || '--'}</StyleLabelGray>
                  )}
                </Row>

                <FormItem name="totalReward">
                  <InputStyle
                    type="unumber"
                    value={values.totalReward}
                    onValue={e => {
                      setFieldValue('totalReward', e)
                      _setTotalReward(e)
                    }}
                    placeholder="Enter amount"
                    hasBorder
                    outlined
                    endAdornment={
                      _rewardToken ? (
                        <Box
                          component="span"
                          sx={{
                            display: 'flex',
                            alignItems: 'center'
                          }}
                        >
                          <CurrencyLogo currencyOrAddress={_rewardToken?.address} size="24px" />
                        </Box>
                      ) : (
                        <></>
                      )
                    }
                  />
                </FormItem>
              </Stack>
              {/* <Stack spacing={16}>
                <Row>
                  <StyleLabel>{isBlockReward ? 'Reward Per Block' : 'Reward Per Day'}</StyleLabel>
                  <StyleLabelGray
                    onClick={() => setIsBlockReward(!isBlockReward)}
                    sx={{
                      display: 'flex',
                      alignItems: 'center',
                      gap: 4,
                      cursor: 'pointer'
                    }}
                  >
                    <ArrowDouble /> {isBlockReward ? 'Per Block' : 'Per Day'}
                  </StyleLabelGray>
                </Row>
                <FormItem name="rewardPer">
                <InputStyle
                  value={values.rewardPer}
                  onValue={e => {
                    setFieldValue('rewardPer', e)
                  }}
                  placeholder="Enter amount"
                  hasBorder
                  outlined
                  endAdornment={
                    <Box
                      component="span"
                      sx={{
                        display: 'flex',
                        alignItems: 'center'
                      }}
                    >
                      <CurrencyLogo currencyOrAddress={_rewardToken?.address} size="24px" />
                    </Box>
                  }
                />
                </FormItem>
              </Stack>  
              <Row>
                <StyleLabel>Reward Per Block</StyleLabel>
                <StyleLabel>-- {RewardToken?.currency.symbol || '--'}</StyleLabel>
              </Row> */}
              <Row>
                <StyleLabel>Pool End (UTC time)</StyleLabel>
                <StyleLabel>
                  {values.endTime ? dayjs(values.endTime).utc().format('YYYY-MM-DD HH:mm') : '--'}
                </StyleLabel>
              </Row>
              {((isLPTokenPool && _token0 && _token1 && _rewardToken) || (_stakeToken && _rewardToken)) && (
                <PoolDetail
                  title={values.title}
                  stakeToken={_stakeToken}
                  rewardToken={_rewardToken}
                  totalReward={values.totalReward}
                  startTime={values.startTime}
                  endTime={values.endTime}
                  isLPTokenPool={isLPTokenPool}
                  token0={_token0}
                  token1={_token1}
                />
              )}
              <>
                {(isLPTokenPool ? !!_stakeLPToken : !!_stakeToken) &&
                !!values.title &&
                !!values.startTime &&
                !!values.endTime &&
                !!RewardToken &&
                approvalState !== ApprovalState.APPROVED ? (
                  approvalState === ApprovalState.UNKNOWN ? (
                    <StyleLoadingButton disabled variant="contained">
                      Loading...
                    </StyleLoadingButton>
                  ) : (
                    <StyleLoadingButton
                      loading={approvalState === ApprovalState.PENDING}
                      variant="contained"
                      onClick={run}
                    >
                      Approval {RewardToken?.currency.symbol}
                    </StyleLoadingButton>
                  )
                ) : (
                  <StyleLoadingButton variant="contained" type="submit">
                    Stake & Create
                  </StyleLoadingButton>
                )}
              </>
            </Stack>
          )
        }}
      </Formik>
    </BaseDialog>
  )
}
