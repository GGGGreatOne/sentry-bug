import { BigNumber } from '@ethersproject/bignumber'
import type { TransactionResponse } from '@ethersproject/providers'
import { CurrencyAmount, Percent } from '@uniswap/sdk-core'
import { NonfungiblePositionManager } from '@uniswap/v3-sdk'
import { LightCard } from 'components/Card'
import { useCallback, useMemo, useState } from 'react'
import { Text } from 'rebass'
import { useTheme } from 'styled-components'
import TransactionConfirmationModal, { ConfirmationModalContent } from '../../components/TransactionConfirmationModal'
import { WRAPPED_NATIVE_CURRENCY } from '../../constants/tokens'
import { calculateGasMargin } from '../../utils/calculateGasMargin'
import { ResponsiveHeaderText, Wrapper } from './styled'
import { useActiveWeb3React } from 'hooks'
import { useV3PositionFromTokenId } from 'components/Widget2/hooks/useV3Positions'
import { isSupportedChain } from 'components/Widget2/constants/chains'
import { PositionPageUnsupportedContent } from 'components/Widget2/Pool/PositionPage'
import useNativeCurrency from 'components/Widget2/lib/hooks/useNativeCurrency'
import { useFormatter } from 'components/Widget2/utils/formatNumbers'
import { WrongChainError } from 'components/Widget2/utils/errors'
import { Box, Button, Slider, Stack, Typography, styled } from '@mui/material'
import Toggle from 'components/Widget2/components/Toggle'
import Loader from 'components/Widget2/components/Icons/LoadingSpinner'
import { useV3NFTPositionManagerContract } from 'components/Widget2/hooks/useContract'
import { useGetTransactionDeadline } from 'components/Widget2/hooks/useTransactionDeadline'
import { useUserSlippageToleranceWithDefault } from 'components/Widget2/state/user/hooks'
import { AutoColumn } from 'components/Widget2/components/Column'
import { AutoRow, RowBetween, RowFixed } from 'components/Widget2/components/Row'
import CurrencyLogo from 'components/Widget2/components/Logo/CurrencyLogo'
import { ThemedText } from 'components/Widget2/theme/components'
import { AddRemoveTabs } from 'components/Widget2/components/NavigationTabs'
import RangeBadge from 'components/Widget2/components/Badge/RangeBadge'
import { Break } from 'components/Widget2/components/earn/styled'
import AppBody from 'components/Widget2/AppBody'
import { useBurnV3ActionHandlers, useBurnV3State, useDerivedV3BurnInfo } from 'components/Widget2/state/burn/v3/hooks'
import useDebouncedChangeHandler from 'components/Widget2/hooks/useDebouncedChangeHandler'
import { useRouter } from 'next/router'
import useBreakpoint from 'hooks/useBreakpoint'
import DoubleCurrencyLogo from 'components/Widget2/components/DoubleLogo'
import { useTransactionAdder } from 'state/transactions/hooks'
import { SwapMapping } from 'api/swap'

const DEFAULT_REMOVE_V3_LIQUIDITY_SLIPPAGE_TOLERANCE = new Percent(50, 10_000)

const StyledSlider = styled(Slider)(({ theme }) => ({
  color: theme.palette.mode === 'dark' ? '#fff' : '#007bff',
  height: 5,
  padding: '15px 0',
  '& .MuiSlider-thumb': {
    height: 20,
    width: 20,
    backgroundColor: '#fff',
    boxShadow: '0 0 2px 0px rgba(0, 0, 0, 0.1)',
    '&:focus, &:hover, &.Mui-active': {
      boxShadow: '0px 0px 3px 1px rgba(0, 0, 0, 0.1)',
      // Reset on touch devices, it doesn't add specificity
      '@media (hover: none)': {
        boxShadow: '0 3px 1px rgba(0,0,0,0.1),0 4px 8px rgba(0,0,0,0.13),0 0 0 1px rgba(0,0,0,0.02)'
      }
    },
    '&:before': {
      boxShadow: '0px 0px 1px 0px rgba(0,0,0,0.2), 0px 0px 0px 0px rgba(0,0,0,0.14), 0px 0px 1px 0px rgba(0,0,0,0.12)'
    }
  },
  '& .MuiSlider-valueLabel': {
    fontSize: 12,
    fontWeight: 'normal',
    top: -6,
    backgroundColor: 'unset',
    color: theme.palette.text.primary,
    '&::before': {
      display: 'none'
    },
    '& *': {
      background: 'transparent',
      color: theme.palette.mode === 'dark' ? '#fff' : '#000'
    }
  },
  '& .MuiSlider-track': {
    border: 'none',
    height: 5
  },
  '& .MuiSlider-rail': {
    opacity: 0.5,
    boxShadow: 'inset 0px 0px 4px -2px #000',
    backgroundColor: '#d0d0d0'
  }
}))

const SmallMaxButton = styled(Stack)({
  width: 'fit-content',
  padding: '8px 24px',
  borderRadius: '8px',
  cursor: 'pointer',
  background: '#FFFFFF0D'
})

// redirect invalid tokenIds
export default function RemoveLiquidityV3({ boxId, tokenId }: { boxId: string | number; tokenId: string }) {
  const { chainId } = useActiveWeb3React()
  const router = useRouter()
  const parsedTokenId = useMemo(() => {
    try {
      return BigNumber.from(tokenId)
    } catch {
      return null
    }
  }, [tokenId])

  const { position, loading } = useV3PositionFromTokenId(parsedTokenId ?? undefined)
  if (parsedTokenId === null || parsedTokenId.eq(0)) {
    return <Box onClick={() => router.back()}></Box>
  }
  if (isSupportedChain(chainId) && (loading || position)) {
    return <Remove boxId={boxId} tokenId={parsedTokenId} />
  } else {
    return <PositionPageUnsupportedContent />
  }
}
function Remove({ boxId, tokenId }: { boxId: string | number; tokenId: BigNumber }) {
  const { position } = useV3PositionFromTokenId(tokenId)
  const theme = useTheme()
  const isSm = useBreakpoint('sm')
  const { account, chainId, library: provider } = useActiveWeb3React()
  const { formatCurrencyAmount } = useFormatter()

  // flag for receiving WETH
  const [receiveWETH, setReceiveWETH] = useState(false)
  const nativeCurrency = useNativeCurrency(chainId)
  const nativeWrappedSymbol = nativeCurrency.wrapped.symbol?.toLocaleUpperCase()

  // burn state
  const { percent } = useBurnV3State()
  const {
    position: positionSDK,
    liquidityPercentage,
    liquidityValue0,
    liquidityValue1,
    feeValue0,
    feeValue1,
    outOfRange,
    error
  } = useDerivedV3BurnInfo(position, receiveWETH)
  const { onPercentSelect } = useBurnV3ActionHandlers()

  const removed = position?.liquidity?.eq(0)

  // boilerplate for the slider
  const [percentForSlider, onPercentSelectForSlider] = useDebouncedChangeHandler(percent, onPercentSelect)

  const getDeadline = useGetTransactionDeadline() // custom from users settings
  const allowedSlippage = useUserSlippageToleranceWithDefault(DEFAULT_REMOVE_V3_LIQUIDITY_SLIPPAGE_TOLERANCE) // custom from users

  const [showConfirm, setShowConfirm] = useState(false)
  const [attemptingTxn, setAttemptingTxn] = useState(false)
  const [txnHash, setTxnHash] = useState<string | undefined>()
  const addTransaction = useTransactionAdder()
  const positionManager = useV3NFTPositionManagerContract()
  const burn = useCallback(async () => {
    setAttemptingTxn(true)
    if (
      !positionManager ||
      !liquidityValue0 ||
      !liquidityValue1 ||
      !account ||
      !chainId ||
      !positionSDK ||
      !liquidityPercentage ||
      !provider ||
      !boxId
    ) {
      return
    }

    const deadline = await getDeadline()
    if (!deadline) throw new Error('could not get deadline')

    // we fall back to expecting 0 fees in case the fetch fails, which is safe in the
    // vast majority of cases
    const { calldata, value } = NonfungiblePositionManager.removeCallParameters(positionSDK, {
      tokenId: tokenId.toString(),
      liquidityPercentage,
      slippageTolerance: allowedSlippage,
      deadline: deadline.toString(),
      collectOptions: {
        expectedCurrencyOwed0: feeValue0 ?? CurrencyAmount.fromRawAmount(liquidityValue0.currency, 0),
        expectedCurrencyOwed1: feeValue1 ?? CurrencyAmount.fromRawAmount(liquidityValue1.currency, 0),
        recipient: account
      }
    })

    const txn = {
      to: positionManager.address,
      data: calldata,
      value
    }

    const connectedChainId = await provider.getSigner().getChainId()
    if (chainId !== connectedChainId) throw new WrongChainError()

    provider
      .getSigner()
      .estimateGas(txn)
      .then(estimate => {
        const newTxn = {
          ...txn,
          gasLimit: calculateGasMargin(estimate)
        }

        return provider
          .getSigner()
          .sendTransaction(newTxn)
          .then(async (response: TransactionResponse) => {
            setTxnHash(response.hash)
            setAttemptingTxn(false)
            // type: TransactionType.REMOVE_LIQUIDITY_V3,
            //   baseCurrencyId: currencyId(liquidityValue0.currency),
            //   quoteCurrencyId: currencyId(liquidityValue1.currency),
            //   expectedAmountBaseRaw: liquidityValue0.quotient.toString(),
            //   expectedAmountQuoteRaw: liquidityValue1.quotient.toString()
            await SwapMapping(boxId, response.hash)
            addTransaction(response, {
              summary: `Remove liquidity ${
                liquidityValue0.currency.symbol?.toLocaleUpperCase() === 'ETH'
                  ? 'BB'
                  : liquidityValue0.currency.symbol?.toLocaleUpperCase()
              } and ${
                liquidityValue1.currency.symbol?.toLocaleUpperCase() === 'ETH'
                  ? 'BB'
                  : liquidityValue1.currency.symbol?.toLocaleUpperCase()
              }`
            })
          })
      })
      .catch(error => {
        setAttemptingTxn(false)
        console.error(error)
      })
  }, [
    positionManager,
    liquidityValue0,
    liquidityValue1,
    account,
    chainId,
    positionSDK,
    liquidityPercentage,
    provider,
    boxId,
    getDeadline,
    tokenId,
    allowedSlippage,
    feeValue0,
    feeValue1,
    addTransaction
  ])

  const handleDismissConfirmation = useCallback(() => {
    setShowConfirm(false)
    // if there was a tx hash, we want to clear the input
    if (txnHash) {
      onPercentSelectForSlider(0)
    }
    setAttemptingTxn(false)
    setTxnHash('')
  }, [onPercentSelectForSlider, txnHash])

  const pendingText = (
    <Typography>
      Removing {liquidityValue0?.toSignificant(6)}{' '}
      {liquidityValue0?.currency?.symbol?.toLocaleUpperCase() === 'ETH'
        ? 'BB'
        : liquidityValue0?.currency?.symbol?.toLocaleUpperCase()}{' '}
      and {liquidityValue1?.toSignificant(6)}{' '}
      {liquidityValue1?.currency?.symbol?.toLocaleUpperCase() === 'ETH'
        ? 'BB'
        : liquidityValue1?.currency?.symbol?.toLocaleUpperCase()}
    </Typography>
  )

  function modalHeader() {
    return (
      <AutoColumn gap="sm" style={{ padding: '16px' }}>
        <RowBetween align="flex-end">
          <Text fontSize={16} fontWeight={535}>
            <Typography>
              Pooled{' '}
              {liquidityValue0?.currency?.symbol?.toLocaleUpperCase() === 'ETH'
                ? 'BB'
                : liquidityValue0?.currency?.symbol?.toLocaleUpperCase()}
              :
            </Typography>
          </Text>
          <RowFixed>
            <Text fontSize={16} fontWeight={535} marginLeft="6px">
              {liquidityValue0 && formatCurrencyAmount({ amount: liquidityValue0 })}
            </Text>
            <CurrencyLogo size="20px" style={{ marginLeft: 8 }} currency={liquidityValue0?.currency} />
          </RowFixed>
        </RowBetween>
        <RowBetween align="flex-end">
          <Text fontSize={16} fontWeight={535}>
            <Typography>
              Pooled{' '}
              {liquidityValue1?.currency?.symbol?.toLocaleUpperCase() === 'ETH'
                ? 'BB'
                : liquidityValue1?.currency?.symbol?.toLocaleUpperCase()}
              :
            </Typography>
          </Text>
          <RowFixed>
            <Text fontSize={16} fontWeight={535} marginLeft="6px">
              {liquidityValue1 && formatCurrencyAmount({ amount: liquidityValue1 })}
            </Text>
            <CurrencyLogo size="20px" style={{ marginLeft: 8 }} currency={liquidityValue1?.currency} />
          </RowFixed>
        </RowBetween>
        {feeValue0?.greaterThan(0) || feeValue1?.greaterThan(0) ? (
          <>
            <ThemedText.DeprecatedItalic fontSize={12} color={theme.neutral2} textAlign="left" padding="8px 0 0 0">
              <Typography>You will also collect fees earned from this position.</Typography>
            </ThemedText.DeprecatedItalic>
            <RowBetween>
              <Text fontSize={16} fontWeight={535}>
                <Typography>
                  {feeValue0?.currency?.symbol?.toLocaleUpperCase() === 'ETH'
                    ? 'BB'
                    : feeValue0?.currency?.symbol?.toLocaleUpperCase()}{' '}
                  Fees Earned:
                </Typography>
              </Text>
              <RowFixed>
                <Text fontSize={16} fontWeight={535} marginLeft="6px" marginRight={'8px'}>
                  {feeValue0 && formatCurrencyAmount({ amount: feeValue0 })}
                </Text>
                <CurrencyLogo size="20px" currency={feeValue0?.currency} />
              </RowFixed>
            </RowBetween>
            <RowBetween>
              <Text fontSize={16} fontWeight={535}>
                <Typography>
                  {feeValue1?.currency?.symbol?.toLocaleUpperCase() === 'ETH'
                    ? 'BB'
                    : feeValue1?.currency?.symbol?.toLocaleUpperCase()}{' '}
                  Fees Earned:
                </Typography>
              </Text>
              <RowFixed>
                <Text fontSize={16} fontWeight={535} marginLeft="6px" marginRight={'8px'}>
                  {feeValue1 && formatCurrencyAmount({ amount: feeValue1 })}
                </Text>
                <CurrencyLogo size="20px" currency={feeValue1?.currency} />
              </RowFixed>
            </RowBetween>
          </>
        ) : null}
        <Button variant="contained" sx={{ marginTop: 16 }} onClick={burn}>
          <Typography>Remove</Typography>
        </Button>
      </AutoColumn>
    )
  }

  const showCollectAsWeth = Boolean(
    liquidityValue0?.currency &&
      liquidityValue1?.currency &&
      (liquidityValue0.currency.isNative ||
        liquidityValue1.currency.isNative ||
        WRAPPED_NATIVE_CURRENCY[liquidityValue0.currency.chainId]?.equals(liquidityValue0.currency.wrapped) ||
        WRAPPED_NATIVE_CURRENCY[liquidityValue1.currency.chainId]?.equals(liquidityValue1.currency.wrapped))
  )
  return (
    <AutoColumn style={{ marginTop: 30 }}>
      <TransactionConfirmationModal
        isOpen={showConfirm}
        onDismiss={handleDismissConfirmation}
        attemptingTxn={attemptingTxn}
        hash={txnHash ?? ''}
        reviewContent={() => (
          <ConfirmationModalContent
            title={<Typography>Remove liquidity</Typography>}
            onDismiss={handleDismissConfirmation}
            topContent={modalHeader}
          />
        )}
        pendingText={pendingText}
      />
      <AppBody $maxWidth="640px">
        <AddRemoveTabs creating={false} adding={false} autoSlippage={DEFAULT_REMOVE_V3_LIQUIDITY_SLIPPAGE_TOLERANCE} />
        <Wrapper>
          {position ? (
            <AutoColumn gap="lg">
              <RowBetween>
                <RowFixed>
                  <DoubleCurrencyLogo
                    currency0={liquidityValue0?.currency as any}
                    currency1={liquidityValue1?.currency as any}
                    size={24}
                    margin={true}
                  />
                  <ThemedText.DeprecatedLabel ml="10px" fontSize="20px" id="remove-liquidity-tokens">{`${
                    liquidityValue0?.currency?.symbol?.toLocaleUpperCase() === 'ETH'
                      ? 'BB'
                      : liquidityValue0?.currency?.symbol?.toLocaleUpperCase()
                  }/${
                    liquidityValue1?.currency?.symbol?.toLocaleUpperCase() === 'ETH'
                      ? 'BB'
                      : liquidityValue1?.currency?.symbol?.toLocaleUpperCase()
                  }`}</ThemedText.DeprecatedLabel>
                </RowFixed>
                <RangeBadge removed={removed} inRange={!outOfRange} />
              </RowBetween>
              <LightCard>
                <AutoColumn gap="md">
                  <ThemedText.DeprecatedMain fontWeight={485}>
                    <Typography>Amount</Typography>
                  </ThemedText.DeprecatedMain>
                  <Stack direction={isSm ? 'column' : 'row'} justifyContent={isSm ? 'flex-start' : 'space-between'}>
                    <ResponsiveHeaderText>
                      <Typography fontWeight={500} fontSize={isSm ? 20 : 28}>
                        {percentForSlider}%
                      </Typography>
                    </ResponsiveHeaderText>
                    <AutoRow gap="4px" justify={isSm ? 'flex-start' : 'flex-end'}>
                      <SmallMaxButton onClick={() => onPercentSelect(25)} width="20%">
                        <Typography color={'#fff'} fontSize={isSm ? 12 : 16}>
                          25%
                        </Typography>
                      </SmallMaxButton>
                      <SmallMaxButton onClick={() => onPercentSelect(50)} width="20%">
                        <Typography color={'#fff'} fontSize={isSm ? 12 : 16}>
                          50%
                        </Typography>
                      </SmallMaxButton>
                      <SmallMaxButton onClick={() => onPercentSelect(75)} width="20%">
                        <Typography color={'#fff'} fontSize={isSm ? 12 : 16}>
                          75%
                        </Typography>
                      </SmallMaxButton>
                      <SmallMaxButton onClick={() => onPercentSelect(100)} width="20%">
                        <Typography color={'#fff'} fontSize={isSm ? 12 : 16}>
                          Max
                        </Typography>
                      </SmallMaxButton>
                    </AutoRow>
                  </Stack>
                  <StyledSlider
                    aria-label="mui slider"
                    value={percentForSlider}
                    onChange={(_, value) => onPercentSelectForSlider(value as number)}
                  />
                </AutoColumn>
              </LightCard>
              <LightCard>
                <AutoColumn gap="md">
                  <RowBetween>
                    <Text fontSize={16} fontWeight={535} id="remove-pooled-tokena-symbol">
                      <Typography>
                        Pooled{' '}
                        {liquidityValue0?.currency?.symbol?.toLocaleUpperCase() === 'ETH'
                          ? 'BB'
                          : liquidityValue0?.currency?.symbol?.toLocaleUpperCase()}
                        :
                      </Typography>
                    </Text>
                    <RowFixed>
                      <Text fontSize={16} fontWeight={535} marginLeft="6px">
                        {liquidityValue0 && formatCurrencyAmount({ amount: liquidityValue0 })}
                      </Text>
                      <CurrencyLogo size="20px" style={{ marginLeft: '8px' }} currency={liquidityValue0?.currency} />
                    </RowFixed>
                  </RowBetween>
                  <RowBetween>
                    <Text fontSize={16} fontWeight={535} id="remove-pooled-tokenb-symbol">
                      <Typography>
                        Pooled{' '}
                        {liquidityValue1?.currency?.symbol?.toLocaleUpperCase() === 'ETH'
                          ? 'BB'
                          : liquidityValue1?.currency?.symbol?.toLocaleUpperCase()}
                        :
                      </Typography>
                    </Text>
                    <RowFixed>
                      <Text fontSize={16} fontWeight={535} marginLeft="6px">
                        {liquidityValue1 && formatCurrencyAmount({ amount: liquidityValue1 })}
                      </Text>
                      <CurrencyLogo size="20px" style={{ marginLeft: '8px' }} currency={liquidityValue1?.currency} />
                    </RowFixed>
                  </RowBetween>
                  {feeValue0?.greaterThan(0) || feeValue1?.greaterThan(0) ? (
                    <>
                      <Break />
                      <RowBetween>
                        <Text fontSize={16} fontWeight={535}>
                          <Typography>
                            {feeValue0?.currency?.symbol?.toLocaleUpperCase() === 'ETH'
                              ? 'BB'
                              : feeValue0?.currency?.symbol?.toLocaleUpperCase()}{' '}
                            Fees Earned:
                          </Typography>
                        </Text>
                        <RowFixed>
                          <Text fontSize={16} fontWeight={535} marginLeft="6px">
                            {feeValue0 && formatCurrencyAmount({ amount: feeValue0 })}
                          </Text>
                          <CurrencyLogo size="20px" style={{ marginLeft: '8px' }} currency={feeValue0?.currency} />
                        </RowFixed>
                      </RowBetween>
                      <RowBetween>
                        <Text fontSize={16} fontWeight={535}>
                          <Typography>
                            {feeValue1?.currency?.symbol?.toLocaleUpperCase() === 'ETH'
                              ? 'BB'
                              : feeValue1?.currency?.symbol?.toLocaleUpperCase()}{' '}
                            Fees Earned:
                          </Typography>
                        </Text>
                        <RowFixed>
                          <Text fontSize={16} fontWeight={535} marginLeft="6px">
                            {feeValue1 && formatCurrencyAmount({ amount: feeValue1 })}
                          </Text>
                          <CurrencyLogo size="20px" style={{ marginLeft: '8px' }} currency={feeValue1?.currency} />
                        </RowFixed>
                      </RowBetween>
                    </>
                  ) : null}
                </AutoColumn>
              </LightCard>

              {showCollectAsWeth && (
                <RowBetween>
                  <ThemedText.DeprecatedMain>
                    <Typography>Collect as {nativeWrappedSymbol}</Typography>
                  </ThemedText.DeprecatedMain>
                  <Toggle
                    id="receive-as-weth"
                    isActive={receiveWETH}
                    toggle={() => setReceiveWETH(receiveWETH => !receiveWETH)}
                  />
                </RowBetween>
              )}

              <div style={{ display: 'flex' }}>
                <AutoColumn gap="md" style={{ flex: '1' }}>
                  <Button
                    variant="contained"
                    disabled={removed || percent === 0 || !liquidityValue0}
                    onClick={() => setShowConfirm(true)}
                  >
                    {removed ? <Typography>Closed</Typography> : error ?? <Typography>Remove</Typography>}
                  </Button>
                </AutoColumn>
              </div>
            </AutoColumn>
          ) : (
            <Loader />
          )}
        </Wrapper>
      </AppBody>
    </AutoColumn>
  )
}
