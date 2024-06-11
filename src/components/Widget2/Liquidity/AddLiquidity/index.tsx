import { BigNumber } from '@ethersproject/bignumber'
import type { TransactionResponse } from '@ethersproject/providers'
import { Currency, CurrencyAmount, NONFUNGIBLE_POSITION_MANAGER_ADDRESSES, Percent } from '@uniswap/sdk-core'
import { FeeAmount, NonfungiblePositionManager } from '@uniswap/v3-sdk'

import usePrevious from 'hooks/usePrevious'
import { useCallback, useEffect, useMemo, useState } from 'react'
import { AlertTriangle } from 'react-feather'
import styled, { useTheme } from 'styled-components'
import { BlueCard, OutlineCard, YellowCard } from '../../components/Card'
import { AutoColumn } from '../../components/Column'
import CurrencyInputPanel from '../../components/CurrencyInputPanel'
import Row, { RowBetween, RowFixed } from '../../components/Row'
import { ZERO_PERCENT } from '../../constants/misc'
import { WRAPPED_NATIVE_CURRENCY } from '../../constants/tokens'
import { useCurrency } from '../../hooks/Tokens'
import { useIsSwapUnsupported } from '../../hooks/useIsSwapUnsupported'
import { useStablecoinValue } from '../../hooks/useStablecoinPrice'
import { useGetTransactionDeadline } from '../../hooks/useTransactionDeadline'
import { Bound, Field } from '../../state/mint/v3/actions'
import { TransactionInfo, TransactionType } from '../../state/transactions/types'
import { useUserSlippageToleranceWithDefault } from '../../state/user/hooks'
import { calculateGasMargin } from '../../utils/calculateGasMargin'
import { currencyId } from '../../utils/currencyId'
import { maxAmountSpend } from '../../utils/maxAmountSpend'
import { Review } from './Review'
import { DynamicSection, MediumOnly, ResponsiveTwoColumns, ScrollablePage, StyledInput, Wrapper } from './styled'
import { Button, Stack, Typography } from '@mui/material'
import { useActiveWeb3React } from 'hooks'
import { isSupportedChain } from 'components/Widget2/constants/chains'
import { BodyWrapper } from 'components/Widget2/AppBody'
import { useV3NFTPositionManagerContract } from 'components/Widget2/hooks/useContract'
import { useV3PositionFromTokenId } from 'components/Widget2/hooks/useV3Positions'
import { useDerivedPositionInfo } from 'components/Widget2/hooks/useDerivedPositionInfo'
import {
  useRangeHopCallbacks,
  useV3MintActionHandlers,
  useV3MintState,
  useV3DerivedMintInfo
} from 'components/Widget2/state/mint/v3/hooks'
import { NumberType, useFormatter } from 'components/Widget2/utils/formatNumbers'
import { WrongChainError } from 'components/Widget2/utils/errors'
import { ThemedText } from 'components/Widget2/theme/components'
import { Dots } from 'components/Widget2/components/swap/styled'
import { useSingleCallResult } from 'hooks/multicall'
import { useWalletModalToggle } from 'state/application/hooks'
import { PositionPreview } from 'components/Widget2/components/PositionPreview'
import RateToggle from 'components/Widget2/components/RateToggle'
import UnsupportedCurrencyFooter from 'components/Widget2/components/swap/UnsupportedCurrencyFooter'
import { PositionPageUnsupportedContent } from 'components/Widget2/Pool/PositionPage'
import TransactionConfirmationModal, {
  ConfirmationModalContent
} from 'components/Widget2/components/TransactionConfirmationModal'
import { useArgentWalletContract } from 'components/Widget2/hooks/useArgentWalletContract'
import approveAmountCalldata from 'components/Widget2/utils/approveAmountCalldata'
import { addressesAreEquivalent } from 'components/Widget2/utils/addressesAreEquivalent'
import { AddRemoveTabs } from 'components/Widget2/components/NavigationTabs'
import FeeSelector from 'components/Widget2/components/FeeSelector'
import OwnershipWarning from 'components/Widget2/components/addLiquidity/OwnershipWarning'
import HoverInlineText from 'components/Widget2/components/HoverInlineText'
import PresetsButtons from 'components/Widget2/components/RangeSelector/PresetsButtons'
import RangeSelector from 'components/Widget2/components/RangeSelector'
import LiquidityChartRangeInput from 'components/Widget2/components/LiquidityChartRangeInput'
import { useRouter } from 'next/router'
import { IRouteType } from 'components/Widget2/pool-v3'
import { useTransactionAdder } from 'state/transactions/hooks'
import { useApproveCallback } from 'components/Widget2/hooks/useApproveCallback'
import { ApprovalState } from 'components/Widget2/lib/hooks/useApproval'
import { useRoutePushWithQueryParams } from 'hooks/useRoutePushWithQueryParams'

const DEFAULT_ADD_IN_RANGE_SLIPPAGE_TOLERANCE = new Percent(50, 10_000)

const StyledBodyWrapper = styled(BodyWrapper)<{ $hasExistingPosition: boolean }>`
  padding: ${({ $hasExistingPosition }) => ($hasExistingPosition ? 0 : 0)};
  max-width: 640px;
`

export default function AddLiquidityWrapper({ boxId }: { boxId: string }) {
  const { chainId } = useActiveWeb3React()
  if (isSupportedChain(chainId)) {
    return <AddLiquidity boxId={boxId} />
  } else {
    return <PositionPageUnsupportedContent />
  }
}

function AddLiquidity({ boxId }: { boxId: string }) {
  const router = useRouter()
  const { swapRoutePush } = useRoutePushWithQueryParams()
  const query = useMemo(() => router.query as unknown as IRouteType, [router.query])
  const tokenId = useMemo(() => query.tokenId, [query.tokenId])
  const currencyIdA = useMemo(() => query.currency0, [query.currency0])
  const currencyIdB = useMemo(() => query.currency1, [query.currency1])
  const feeAmountFromUrl = useMemo(() => query.feeAmount, [query.feeAmount])

  const { account, chainId, library: provider } = useActiveWeb3React()
  const theme = useTheme()
  const WalletModalToggle = useWalletModalToggle()
  const addTransaction = useTransactionAdder()
  const positionManager = useV3NFTPositionManagerContract()

  // check for existing position if tokenId in url
  const { position: existingPositionDetails, loading: positionLoading } = useV3PositionFromTokenId(
    tokenId ? BigNumber.from(tokenId) : undefined
  )

  const hasExistingPosition = !!existingPositionDetails && !positionLoading
  const { position: existingPosition } = useDerivedPositionInfo(existingPositionDetails)

  // fee selection from url

  const feeAmount: FeeAmount | undefined = useMemo(() => {
    if (feeAmountFromUrl && Object.values(FeeAmount).includes(parseFloat(feeAmountFromUrl.toString()))) {
      return parseFloat(feeAmountFromUrl.toString())
    }
    return undefined
  }, [feeAmountFromUrl])

  const baseCurrency = useCurrency(currencyIdA)
  const currencyB = useCurrency(currencyIdB)

  // prevent an error if they input ETH/WETH
  const quoteCurrency =
    baseCurrency && currencyB && baseCurrency.wrapped.equals(currencyB.wrapped) ? undefined : currencyB

  // mint state
  const { independentField, typedValue, startPriceTypedValue } = useV3MintState()

  const {
    pool,
    ticks,
    dependentField,
    price,
    pricesAtTicks,
    pricesAtLimit,
    parsedAmounts,
    currencyBalances,
    position,
    noLiquidity,
    currencies,
    errorMessage,
    invalidPool,
    invalidRange,
    outOfRange,
    depositADisabled,
    depositBDisabled,
    invertPrice,
    ticksAtLimit
  } = useV3DerivedMintInfo(
    baseCurrency ?? undefined,
    quoteCurrency ?? undefined,
    feeAmount,
    baseCurrency ?? undefined,
    existingPosition
  )

  const { formatPrice } = useFormatter()
  const formattedPrice = formatPrice({
    price: invertPrice ? price?.invert() : price,
    type: NumberType.TokenTx
  })
  const { onFieldAInput, onFieldBInput, onLeftRangeInput, onRightRangeInput, onStartPriceInput } =
    useV3MintActionHandlers(noLiquidity)

  const isValid = !errorMessage && !invalidRange

  // modal and loading
  const [showConfirm, setShowConfirm] = useState<boolean>(false)
  const [attemptingTxn, setAttemptingTxn] = useState<boolean>(false) // clicked confirm

  // txn values
  const getDeadline = useGetTransactionDeadline() // custom from users settings

  const [txHash, setTxHash] = useState<string>('')

  // get formatted amounts
  const formattedAmounts = {
    [independentField]: typedValue,
    [dependentField]: parsedAmounts[dependentField]?.toSignificant(6) ?? ''
  }

  const usdcValues = {
    [Field.CURRENCY_A]: useStablecoinValue(parsedAmounts[Field.CURRENCY_A]),
    [Field.CURRENCY_B]: useStablecoinValue(parsedAmounts[Field.CURRENCY_B])
  }

  // get the max amounts user can add
  const maxAmounts: { [field in Field]?: CurrencyAmount<Currency> } = [Field.CURRENCY_A, Field.CURRENCY_B].reduce(
    (accumulator, field) => {
      return {
        ...accumulator,
        [field]: maxAmountSpend(currencyBalances[field])
      }
    },
    {}
  )

  const atMaxAmounts: { [field in Field]?: CurrencyAmount<Currency> } = [Field.CURRENCY_A, Field.CURRENCY_B].reduce(
    (accumulator, field) => {
      return {
        ...accumulator,
        [field]: maxAmounts[field]?.equalTo(parsedAmounts[field] ?? '0')
      }
    },
    {}
  )

  const argentWalletContract = useArgentWalletContract()

  // check whether the user has approved the router on the tokens
  const [approvalA, approveACallback] = useApproveCallback(
    argentWalletContract ? undefined : parsedAmounts[Field.CURRENCY_A],
    chainId ? NONFUNGIBLE_POSITION_MANAGER_ADDRESSES[chainId] : undefined
  )
  const [approvalB, approveBCallback] = useApproveCallback(
    argentWalletContract ? undefined : parsedAmounts[Field.CURRENCY_B],
    chainId ? NONFUNGIBLE_POSITION_MANAGER_ADDRESSES[chainId] : undefined
  )

  const allowedSlippage = useUserSlippageToleranceWithDefault(
    outOfRange ? ZERO_PERCENT : DEFAULT_ADD_IN_RANGE_SLIPPAGE_TOLERANCE
  )

  async function onAdd() {
    if (!chainId || !provider || !account) return

    if (!positionManager || !baseCurrency || !quoteCurrency) {
      return
    }

    const deadline = await getDeadline()

    if (position && account && deadline) {
      const useNative = baseCurrency.isNative ? baseCurrency : quoteCurrency.isNative ? quoteCurrency : undefined
      const { calldata, value } =
        hasExistingPosition && tokenId
          ? NonfungiblePositionManager.addCallParameters(position, {
              tokenId,
              slippageTolerance: allowedSlippage,
              deadline: deadline.toString(),
              useNative
            })
          : NonfungiblePositionManager.addCallParameters(position, {
              slippageTolerance: allowedSlippage,
              recipient: account,
              deadline: deadline.toString(),
              useNative,
              createPool: noLiquidity
            })

      let txn: { to: string; data: string; value: string } = {
        to: NONFUNGIBLE_POSITION_MANAGER_ADDRESSES[chainId],
        data: calldata,
        value
      }

      if (argentWalletContract) {
        const amountA = parsedAmounts[Field.CURRENCY_A]
        const amountB = parsedAmounts[Field.CURRENCY_B]
        const batch = [
          ...(amountA && amountA.currency.isToken
            ? [approveAmountCalldata(amountA, NONFUNGIBLE_POSITION_MANAGER_ADDRESSES[chainId])]
            : []),
          ...(amountB && amountB.currency.isToken
            ? [approveAmountCalldata(amountB, NONFUNGIBLE_POSITION_MANAGER_ADDRESSES[chainId])]
            : []),
          {
            to: txn.to,
            data: txn.data,
            value: txn.value
          }
        ]
        const data = argentWalletContract.interface.encodeFunctionData('wc_multiCall', [batch])
        txn = {
          to: argentWalletContract.address,
          data,
          value: '0x0'
        }
      }

      const connectedChainId = await provider.getSigner().getChainId()
      if (chainId !== connectedChainId) throw new WrongChainError()

      setAttemptingTxn(true)

      provider
        .getSigner()
        .estimateGas(txn)
        .then((estimate: any) => {
          const newTxn = {
            ...txn,
            gasLimit: calculateGasMargin(estimate)
          }

          return provider
            .getSigner()
            .sendTransaction(newTxn)
            .then((response: TransactionResponse) => {
              setAttemptingTxn(false)
              const transactionInfo: TransactionInfo = {
                type: TransactionType.ADD_LIQUIDITY_V3_POOL,
                baseCurrencyId: currencyId(baseCurrency),
                quoteCurrencyId: currencyId(quoteCurrency),
                createPool: Boolean(noLiquidity),
                expectedAmountBaseRaw: parsedAmounts[Field.CURRENCY_A]?.quotient?.toString() ?? '0',
                expectedAmountQuoteRaw: parsedAmounts[Field.CURRENCY_B]?.quotient?.toString() ?? '0',
                feeAmount: position.pool.fee
              }
              transactionInfo
              addTransaction(response, {
                summary: `Add liquidity with ${
                  baseCurrency.symbol?.toLocaleUpperCase() === 'ETH' ? 'BB' : baseCurrency.symbol?.toLocaleUpperCase()
                } and ${
                  quoteCurrency.symbol?.toLocaleUpperCase() === 'ETH' ? 'BB' : quoteCurrency.symbol?.toLocaleUpperCase()
                }`
              })
              setTxHash(response.hash)
            })
        })
        .catch((error: { code: number }) => {
          console.error('Failed to send transaction', error)
          setAttemptingTxn(false)
          // we only care if the error is something _other_ than the user rejected the tx
          if (error?.code !== 4001) {
            console.error(error)
          }
        })
    } else {
      return
    }
  }

  const handleCurrencySelect = useCallback(
    (currencyNew: Currency, currencyIdOther?: string): (string | undefined)[] => {
      const currencyIdNew = currencyId(currencyNew)

      if (currencyIdNew === currencyIdOther) {
        // not ideal, but for now clobber the other if the currency ids are equal
        return [currencyIdNew, undefined]
      } else {
        // prevent weth + eth
        const isETHOrWETHNew =
          currencyIdNew === 'ETH' ||
          (chainId !== undefined && currencyIdNew === WRAPPED_NATIVE_CURRENCY[chainId]?.address)
        const isETHOrWETHOther =
          currencyIdOther !== undefined &&
          (currencyIdOther === 'ETH' ||
            (chainId !== undefined && currencyIdOther === WRAPPED_NATIVE_CURRENCY[chainId]?.address))

        if (isETHOrWETHNew && isETHOrWETHOther) {
          return [currencyIdNew, undefined]
        } else {
          return [currencyIdNew, currencyIdOther]
        }
      }
    },
    [chainId]
  )

  const handleCurrencyASelect = useCallback(
    (currencyANew: Currency) => {
      const [idA, idB] = handleCurrencySelect(currencyANew, currencyIdB)
      if (idB === undefined) {
        // navigate(`/add/${idA}`)
        swapRoutePush({ type: 'add', currency0: idA || '' })
      } else {
        // navigate(`/add/${idA}/${idB}`)
        swapRoutePush({ type: 'add', currency0: idA || '', currency1: idB || '' })
      }
    },
    [handleCurrencySelect, currencyIdB, swapRoutePush]
  )

  const handleCurrencyBSelect = useCallback(
    (currencyBNew: Currency) => {
      const [idB, idA] = handleCurrencySelect(currencyBNew, currencyIdA)
      if (idA === undefined) {
        // navigate(`/add/${idB}`)
        swapRoutePush({ type: 'add', currency0: idB || '' })
      } else {
        // navigate(`/add/${idA}/${idB}`)
        swapRoutePush({ type: 'add', currency0: idA || '', currency1: idB || '' })
      }
    },
    [handleCurrencySelect, currencyIdA, swapRoutePush]
  )

  const handleFeePoolSelect = useCallback(
    (newFeeAmount: FeeAmount) => {
      onLeftRangeInput('')
      onRightRangeInput('')
      // navigate(`/add/${currencyIdA}/${currencyIdB}/${newFeeAmount}`)
      swapRoutePush({
        type: 'add',
        currency0: currencyIdA || '',
        currency1: currencyIdB || '',
        feeAmount: newFeeAmount
      })
    },
    [currencyIdA, currencyIdB, onLeftRangeInput, onRightRangeInput, swapRoutePush]
  )

  const handleDismissConfirmation = useCallback(() => {
    setShowConfirm(false)
    // if there was a tx hash, we want to clear the input
    if (txHash) {
      onFieldAInput('')
      // dont jump to pool page if creating
      // navigate('/pools')
      router.back()
    }
    setTxHash('')
  }, [onFieldAInput, router, txHash])

  const addIsUnsupported = useIsSwapUnsupported(currencies?.CURRENCY_A, currencies?.CURRENCY_B)

  const clearAll = useCallback(() => {
    onFieldAInput('')
    onFieldBInput('')
    onLeftRangeInput('')
    onRightRangeInput('')
    swapRoutePush({ type: 'add' })
  }, [onFieldAInput, onFieldBInput, onLeftRangeInput, onRightRangeInput, swapRoutePush])

  // get value and prices at ticks
  const { [Bound.LOWER]: tickLower, [Bound.UPPER]: tickUpper } = ticks
  const { [Bound.LOWER]: priceLower, [Bound.UPPER]: priceUpper } = pricesAtTicks

  const { getDecrementLower, getIncrementLower, getDecrementUpper, getIncrementUpper, getSetFullRange } =
    useRangeHopCallbacks(baseCurrency ?? undefined, quoteCurrency ?? undefined, feeAmount, tickLower, tickUpper, pool)

  // we need an existence check on parsed amounts for single-asset deposits
  const showApprovalA =
    !argentWalletContract && approvalA !== ApprovalState.APPROVED && !!parsedAmounts[Field.CURRENCY_A]
  const showApprovalB =
    !argentWalletContract && approvalB !== ApprovalState.APPROVED && !!parsedAmounts[Field.CURRENCY_B]

  const pendingText = `Supplying ${!depositADisabled ? parsedAmounts[Field.CURRENCY_A]?.toSignificant(6) : ''} ${
    !depositADisabled
      ? currencies[Field.CURRENCY_A]?.symbol?.toLocaleUpperCase() === 'ETH'
        ? 'BB'
        : currencies[Field.CURRENCY_A]?.symbol?.toLocaleUpperCase()
      : ''
  } ${!outOfRange ? 'and' : ''} ${!depositBDisabled ? parsedAmounts[Field.CURRENCY_B]?.toSignificant(6) : ''} ${
    !depositBDisabled
      ? currencies[Field.CURRENCY_B]?.symbol?.toLocaleUpperCase() === 'ETH'
        ? 'BB'
        : currencies[Field.CURRENCY_B]?.symbol?.toLocaleUpperCase()
      : ''
  }`

  const [_minPrice, setMinPrice] = useState('')
  const [_maxPrice, setMaxPrice] = useState('')

  const handleSetFullRange = useCallback(() => {
    getSetFullRange()

    const minPrice = pricesAtLimit[Bound.LOWER]
    if (minPrice) setMinPrice(minPrice.toSignificant(5))
    const maxPrice = pricesAtLimit[Bound.UPPER]
    if (maxPrice) setMaxPrice(maxPrice.toSignificant(5))
  }, [getSetFullRange, pricesAtLimit])

  // START: sync values with query string
  const _oldMinPrice = usePrevious(_minPrice)
  const _oldMaxPrice = usePrevious(_maxPrice)
  // use query string as an input to onInput handlers
  useEffect(() => {
    const minPrice = _minPrice
    const oldMinPrice = _oldMinPrice
    if (
      minPrice &&
      typeof minPrice === 'string' &&
      !isNaN(minPrice as any) &&
      (!oldMinPrice || oldMinPrice !== minPrice)
    ) {
      onLeftRangeInput(minPrice)
    }
    // disable eslint rule because this hook only cares about the url->input state data flow
    // input state -> url updates are handled in the input handlers
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])
  useEffect(() => {
    const maxPrice = _maxPrice
    const oldMaxPrice = _oldMaxPrice
    if (
      maxPrice &&
      typeof maxPrice === 'string' &&
      !isNaN(maxPrice as any) &&
      (!oldMaxPrice || oldMaxPrice !== maxPrice)
    ) {
      onRightRangeInput(maxPrice)
    }
    // disable eslint rule because this hook only cares about the url->input state data flow
    // input state -> url updates are handled in the input handlers
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])
  // END: sync values with query string
  // relocation wen page reload
  useEffect(() => {
    const handleRouteChange = () => {
      sessionStorage.setItem('scrollPosition', window.pageYOffset.toString())
    }

    router.events.on('routeChangeStart', handleRouteChange)

    return () => {
      router.events.off('routeChangeStart', handleRouteChange)
    }
  }, [router.events])

  useEffect(() => {
    const savedScrollPosition = sessionStorage.getItem('scrollPosition')
    if (savedScrollPosition) {
      window.scrollTo(0, Number(savedScrollPosition))
    }
  }, [router])

  const Buttons = () =>
    addIsUnsupported ? (
      <Button
        variant="contained"
        disabled
        sx={{
          height: 44,
          mb: 12,
          padding: 12
        }}
      >
        <Typography>Unsupported Asset</Typography>
      </Button>
    ) : !account ? (
      <Button
        variant="contained"
        onClick={WalletModalToggle}
        sx={{
          height: 44,
          padding: 12
        }}
      >
        <Typography>Connect wallet</Typography>
      </Button>
    ) : (
      <AutoColumn gap="md">
        {(approvalA === ApprovalState.NOT_APPROVED ||
          approvalA === ApprovalState.PENDING ||
          approvalB === ApprovalState.NOT_APPROVED ||
          approvalB === ApprovalState.PENDING) &&
          isValid && (
            <RowBetween marginTop={16}>
              {showApprovalA && (
                <Button
                  variant="contained"
                  onClick={approveACallback}
                  disabled={approvalA === ApprovalState.PENDING}
                  sx={{
                    height: 44,
                    width: showApprovalB ? '48%' : '100%'
                  }}
                >
                  {approvalA === ApprovalState.PENDING ? (
                    <Typography>
                      Approving{' '}
                      {currencies[Field.CURRENCY_A]?.symbol?.toLocaleUpperCase() === 'ETH'
                        ? 'BB'
                        : currencies[Field.CURRENCY_A]?.symbol?.toLocaleUpperCase()}
                      <Dots></Dots>
                    </Typography>
                  ) : (
                    <Typography>
                      Approve{' '}
                      {currencies[Field.CURRENCY_A]?.symbol?.toLocaleUpperCase() === 'ETH'
                        ? 'BB'
                        : currencies[Field.CURRENCY_A]?.symbol?.toLocaleUpperCase()}
                    </Typography>
                  )}
                </Button>
              )}
              {showApprovalB && (
                <Button
                  variant="contained"
                  onClick={approveBCallback}
                  disabled={approvalB === ApprovalState.PENDING}
                  sx={{
                    height: 44,
                    width: showApprovalA ? '48%' : '100%'
                  }}
                >
                  {approvalB === ApprovalState.PENDING ? (
                    <Typography>
                      Approving{' '}
                      {currencies[Field.CURRENCY_B]?.symbol?.toLocaleUpperCase() === 'ETH'
                        ? 'BB'
                        : currencies[Field.CURRENCY_B]?.symbol?.toLocaleUpperCase()}
                      <Dots />
                    </Typography>
                  ) : (
                    <Typography>
                      Approve{' '}
                      {currencies[Field.CURRENCY_B]?.symbol?.toLocaleUpperCase() === 'ETH'
                        ? 'BB'
                        : currencies[Field.CURRENCY_B]?.symbol?.toLocaleUpperCase()}
                    </Typography>
                  )}
                </Button>
              )}
            </RowBetween>
          )}
        <Button
          variant="contained"
          onClick={() => {
            setShowConfirm(true)
          }}
          sx={{
            height: 44,
            mt: 16
          }}
          disabled={
            !isValid ||
            (!argentWalletContract && approvalA !== ApprovalState.APPROVED && !depositADisabled) ||
            (!argentWalletContract && approvalB !== ApprovalState.APPROVED && !depositBDisabled)
          }
          // error={!isValid && !!parsedAmounts[Field.CURRENCY_A] && !!parsedAmounts[Field.CURRENCY_B]}
        >
          <Typography fontWeight={535}>
            {errorMessage
              ? errorMessage == 'Insufficient ETH balance'
                ? 'Insufficient BB balance'
                : errorMessage
              : 'Preview'}
          </Typography>
        </Button>
      </AutoColumn>
    )

  const usdcValueCurrencyA = usdcValues[Field.CURRENCY_A]
  const usdcValueCurrencyB = usdcValues[Field.CURRENCY_B]
  const currencyAFiat = useMemo(
    () => ({
      data: usdcValueCurrencyA ? parseFloat(usdcValueCurrencyA.toSignificant()) : undefined,
      isLoading: false
    }),
    [usdcValueCurrencyA]
  )
  const currencyBFiat = useMemo(
    () => ({
      data: usdcValueCurrencyB ? parseFloat(usdcValueCurrencyB.toSignificant()) : undefined,
      isLoading: false
    }),
    [usdcValueCurrencyB]
  )

  const owner = useSingleCallResult(chainId, tokenId ? positionManager : undefined, 'ownerOf', [tokenId]).result?.[0]
  const ownsNFT =
    addressesAreEquivalent(owner, account) || addressesAreEquivalent(existingPositionDetails?.operator, account)
  const showOwnershipWarning = Boolean(hasExistingPosition && account && !ownsNFT)

  return (
    <>
      <ScrollablePage>
        <TransactionConfirmationModal
          isOpen={showConfirm}
          onDismiss={handleDismissConfirmation}
          attemptingTxn={attemptingTxn}
          hash={txHash}
          reviewContent={() => (
            <ConfirmationModalContent
              title={
                <Typography color={'#fff !important'} textAlign={'center'} fontSize={16}>
                  Add Liquidity
                </Typography>
              }
              onDismiss={handleDismissConfirmation}
              topContent={() => (
                <Review
                  parsedAmounts={parsedAmounts}
                  position={position}
                  existingPosition={existingPosition}
                  priceLower={priceLower}
                  priceUpper={priceUpper}
                  outOfRange={outOfRange}
                  ticksAtLimit={ticksAtLimit}
                />
              )}
              bottomContent={() => (
                <Button variant="contained" style={{ marginTop: '1rem', height: 44 }} onClick={onAdd}>
                  <Typography fontWeight={535} fontSize={20}>
                    Add
                  </Typography>
                </Button>
              )}
            />
          )}
          pendingText={pendingText}
        />
        <StyledBodyWrapper $hasExistingPosition={hasExistingPosition}>
          <AddRemoveTabs
            creating={false}
            adding={true}
            autoSlippage={DEFAULT_ADD_IN_RANGE_SLIPPAGE_TOLERANCE}
            showBackLink={!hasExistingPosition}
          >
            {!hasExistingPosition && (
              <Row justify="flex-end" style={{ width: 'fit-content', minWidth: 'fit-content', cursor: 'pointer' }}>
                <MediumOnly>
                  <Typography fontSize={16} onClick={clearAll} color={'#5A7FFF'}>
                    Clear all
                  </Typography>
                </MediumOnly>
              </Row>
            )}
          </AddRemoveTabs>
          <Wrapper>
            <ResponsiveTwoColumns wide={!hasExistingPosition}>
              <AutoColumn gap="lg">
                {!hasExistingPosition && (
                  <>
                    <AutoColumn gap="md">
                      <RowBetween paddingBottom="20px">
                        <Typography fontSize={16} color={'#fff'}>
                          Select pair
                        </Typography>
                      </RowBetween>
                      <RowBetween gap="md">
                        <Stack width={'50%'}>
                          <CurrencyInputPanel
                            boxId={boxId}
                            value={formattedAmounts[Field.CURRENCY_A]}
                            onUserInput={onFieldAInput}
                            hideInput
                            onMax={() => {
                              onFieldAInput(maxAmounts[Field.CURRENCY_A]?.toExact() ?? '')
                            }}
                            onCurrencySelect={handleCurrencyASelect}
                            showMaxButton={!atMaxAmounts[Field.CURRENCY_A]}
                            currency={currencies[Field.CURRENCY_A] ?? null}
                            id="add-liquidity-input-tokena"
                          />
                        </Stack>
                        <Stack width={'50%'}>
                          <CurrencyInputPanel
                            boxId={boxId}
                            value={formattedAmounts[Field.CURRENCY_B]}
                            hideInput
                            onUserInput={onFieldBInput}
                            onCurrencySelect={handleCurrencyBSelect}
                            onMax={() => {
                              onFieldBInput(maxAmounts[Field.CURRENCY_B]?.toExact() ?? '')
                            }}
                            showMaxButton={!atMaxAmounts[Field.CURRENCY_B]}
                            currency={currencies[Field.CURRENCY_B] ?? null}
                            id="add-liquidity-input-tokenb"
                          />
                        </Stack>
                      </RowBetween>

                      <FeeSelector
                        disabled={!quoteCurrency || !baseCurrency}
                        feeAmount={feeAmount}
                        handleFeePoolSelect={handleFeePoolSelect}
                        currencyA={baseCurrency ?? undefined}
                        currencyB={quoteCurrency ?? undefined}
                      />
                    </AutoColumn>{' '}
                  </>
                )}
                {hasExistingPosition && existingPosition && (
                  <PositionPreview
                    position={existingPosition}
                    title={
                      <Typography fontSize={16} color={'#fff'}>
                        Selected range
                      </Typography>
                    }
                    inRange={!outOfRange}
                    ticksAtLimit={ticksAtLimit}
                  />
                )}
              </AutoColumn>

              {!hasExistingPosition && (
                <>
                  <DynamicSection gap="md" disabled={!feeAmount || invalidPool}>
                    <Stack
                      justifyContent={'space-between'}
                      sx={{
                        flexDirection: { xs: 'column', md: 'row' },
                        alignItems: { xs: 'flex-start', md: 'center' }
                      }}
                    >
                      <ThemedText.DeprecatedLabel>
                        <Typography fontSize={16} color={'#fff'}>
                          Set price range
                        </Typography>
                      </ThemedText.DeprecatedLabel>
                      {Boolean(baseCurrency && quoteCurrency) && (
                        <Stack
                          direction={'row'}
                          alignItems={'center'}
                          justifyContent={'space-between'}
                          gap={16}
                          sx={{
                            width: { xs: '100%', md: 'auto' }
                          }}
                        >
                          <PresetsButtons onSetFullRange={handleSetFullRange} />
                          <RateToggle
                            currencyA={baseCurrency as Currency}
                            currencyB={quoteCurrency as Currency}
                            handleRateToggle={() => {
                              if (!ticksAtLimit[Bound.LOWER] && !ticksAtLimit[Bound.UPPER]) {
                                onLeftRangeInput(
                                  (invertPrice ? priceLower : priceUpper?.invert())?.toSignificant(6) ?? ''
                                )
                                onRightRangeInput(
                                  (invertPrice ? priceUpper : priceLower?.invert())?.toSignificant(6) ?? ''
                                )
                                onFieldAInput(formattedAmounts[Field.CURRENCY_B] ?? '')
                              }
                              // navigate(
                              //   `/add/${currencyIdB as string}/${currencyIdA as string}${
                              //     feeAmount ? '/' + feeAmount : ''
                              //   }`
                              // )
                              swapRoutePush({
                                type: 'add',
                                currency0: currencyIdB as string,
                                currency1: currencyIdA as string,
                                feeAmount: feeAmount || ''
                              })
                            }}
                          />
                        </Stack>
                      )}
                    </Stack>
                    <RangeSelector
                      priceLower={priceLower}
                      priceUpper={priceUpper}
                      getDecrementLower={getDecrementLower}
                      getIncrementLower={getIncrementLower}
                      getDecrementUpper={getDecrementUpper}
                      getIncrementUpper={getIncrementUpper}
                      onLeftRangeInput={onLeftRangeInput}
                      onRightRangeInput={onRightRangeInput}
                      currencyA={baseCurrency}
                      currencyB={quoteCurrency}
                      feeAmount={feeAmount}
                      ticksAtLimit={ticksAtLimit}
                    />

                    {outOfRange && (
                      <YellowCard padding="8px 12px" $borderRadius="12px">
                        <RowBetween>
                          <AlertTriangle stroke={theme.deprecated_yellow3} size="16px" />
                          <Typography ml={12} fontSize={12}>
                            Your position will not earn fees or be used in trades until the market price moves into your
                            range.
                          </Typography>
                        </RowBetween>
                      </YellowCard>
                    )}

                    {invalidRange && (
                      <YellowCard padding="8px 12px" $borderRadius="12px">
                        <RowBetween>
                          <AlertTriangle stroke={theme.deprecated_yellow3} size="16px" />
                          <Typography ml={12} fontSize={12}>
                            Invalid range selected. The min price must be lower than the max price.
                          </Typography>
                        </RowBetween>
                      </YellowCard>
                    )}
                  </DynamicSection>

                  <DynamicSection gap="md" disabled={!feeAmount || invalidPool}>
                    {!noLiquidity ? (
                      <>
                        {Boolean(price && baseCurrency && quoteCurrency && !noLiquidity) && (
                          <AutoColumn gap="2px" style={{ marginTop: '0.5rem' }}>
                            <Typography>
                              <ThemedText.DeprecatedMain fontWeight={535} fontSize={12} color="text1">
                                Current price:
                              </ThemedText.DeprecatedMain>
                              <ThemedText.DeprecatedBody fontWeight={535} fontSize={20} color="text1">
                                {price && <HoverInlineText maxCharacters={20} text={formattedPrice} />}
                              </ThemedText.DeprecatedBody>
                              {baseCurrency && (
                                <ThemedText.DeprecatedBody color="text2" fontSize={12}>
                                  {quoteCurrency?.symbol?.toLocaleUpperCase() === 'ETH'
                                    ? 'BB'
                                    : quoteCurrency?.symbol?.toLocaleUpperCase()}{' '}
                                  per{' '}
                                  {baseCurrency.symbol?.toLocaleUpperCase() === 'ETH'
                                    ? 'BB'
                                    : baseCurrency.symbol?.toLocaleUpperCase()}
                                </ThemedText.DeprecatedBody>
                              )}
                            </Typography>
                          </AutoColumn>
                        )}
                        <LiquidityChartRangeInput
                          currencyA={baseCurrency ?? undefined}
                          currencyB={quoteCurrency ?? undefined}
                          feeAmount={feeAmount}
                          ticksAtLimit={ticksAtLimit}
                          price={
                            price ? parseFloat((invertPrice ? price.invert() : price).toSignificant(8)) : undefined
                          }
                          priceLower={priceLower}
                          priceUpper={priceUpper}
                          onLeftRangeInput={onLeftRangeInput}
                          onRightRangeInput={onRightRangeInput}
                          interactive={!hasExistingPosition}
                        />
                      </>
                    ) : (
                      <AutoColumn gap="md">
                        {noLiquidity && (
                          <BlueCard
                            style={{
                              display: 'flex',
                              flexDirection: 'row',
                              backgroundColor: '#131313',
                              alignItems: 'center',
                              padding: '1rem 1rem'
                            }}
                          >
                            <ThemedText.DeprecatedBody
                              fontSize={14}
                              style={{ fontWeight: 535 }}
                              textAlign="left"
                              color={theme.surface2_dark}
                            >
                              <Typography color={'#fff'}>
                                This pool must be initialized before you can add liquidity. To initialize, select a
                                starting price for the pool. Then, enter your liquidity price range and deposit amount.
                                Gas fees will be higher than usual due to the initialization transaction.
                              </Typography>
                            </ThemedText.DeprecatedBody>
                          </BlueCard>
                        )}
                        <OutlineCard padding="12px">
                          <StyledInput
                            className="start-price-input"
                            style={{
                              background: 'transparent'
                            }}
                            value={startPriceTypedValue}
                            onUserInput={onStartPriceInput}
                          />
                        </OutlineCard>
                        <RowBetween
                          style={{
                            backgroundColor: theme.surface1,
                            padding: '12px',
                            borderRadius: '12px'
                          }}
                        >
                          <ThemedText.DeprecatedMain>
                            <Typography>
                              Starting{' '}
                              {baseCurrency?.symbol?.toLocaleUpperCase() === 'ETH'
                                ? 'BB'
                                : baseCurrency?.symbol?.toLocaleUpperCase()}{' '}
                              Price:
                            </Typography>
                          </ThemedText.DeprecatedMain>
                          <ThemedText.DeprecatedMain>
                            {price ? (
                              <ThemedText.DeprecatedMain>
                                <RowFixed>
                                  <HoverInlineText
                                    maxCharacters={20}
                                    text={invertPrice ? price?.invert()?.toSignificant(8) : price?.toSignificant(8)}
                                  />{' '}
                                  <span style={{ marginLeft: '4px' }}>
                                    {quoteCurrency?.symbol?.toLocaleUpperCase() === 'ETH'
                                      ? 'BB'
                                      : quoteCurrency?.symbol?.toLocaleUpperCase()}{' '}
                                    per{' '}
                                    {baseCurrency?.symbol?.toLocaleUpperCase() === 'ETH'
                                      ? 'BB'
                                      : baseCurrency?.symbol?.toLocaleUpperCase()}
                                  </span>
                                </RowFixed>
                              </ThemedText.DeprecatedMain>
                            ) : (
                              '-'
                            )}
                          </ThemedText.DeprecatedMain>
                        </RowBetween>
                      </AutoColumn>
                    )}
                  </DynamicSection>
                </>
              )}
              <div>
                <DynamicSection disabled={invalidPool || invalidRange || (noLiquidity && !startPriceTypedValue)}>
                  <AutoColumn gap="md">
                    <ThemedText.DeprecatedLabel>
                      {hasExistingPosition ? (
                        <Typography fontSize={16} color={'#fff'} mt={16}>
                          Add more liquidity
                        </Typography>
                      ) : (
                        <Typography fontSize={16} color={'#fff'} mt={16}>
                          Deposit amounts
                        </Typography>
                      )}
                    </ThemedText.DeprecatedLabel>
                    <CurrencyInputPanel
                      boxId={boxId}
                      value={formattedAmounts[Field.CURRENCY_A]}
                      onUserInput={onFieldAInput}
                      onMax={() => {
                        onFieldAInput(maxAmounts[Field.CURRENCY_A]?.toExact() ?? '')
                      }}
                      showMaxButton={!atMaxAmounts[Field.CURRENCY_A]}
                      currency={currencies[Field.CURRENCY_A] ?? null}
                      id="add-liquidity-input-tokena"
                      fiatValue={currencyAFiat}
                      locked={depositADisabled}
                      bgColor="#0D0D0D1A !important"
                      fColor="#121212 !important"
                    />
                    <CurrencyInputPanel
                      boxId={boxId}
                      value={formattedAmounts[Field.CURRENCY_B]}
                      onUserInput={onFieldBInput}
                      onMax={() => {
                        onFieldBInput(maxAmounts[Field.CURRENCY_B]?.toExact() ?? '')
                      }}
                      showMaxButton={!atMaxAmounts[Field.CURRENCY_B]}
                      fiatValue={currencyBFiat}
                      currency={currencies[Field.CURRENCY_B] ?? null}
                      id="add-liquidity-input-tokenb"
                      locked={depositBDisabled}
                      bgColor="#0D0D0D1A !important"
                      fColor="#121212 !important"
                    />
                  </AutoColumn>
                </DynamicSection>
              </div>
              <Buttons />
            </ResponsiveTwoColumns>
          </Wrapper>
        </StyledBodyWrapper>
        {showOwnershipWarning && <OwnershipWarning ownerAddress={owner} />}
        {addIsUnsupported && (
          <UnsupportedCurrencyFooter
            show={addIsUnsupported}
            currencies={[currencies.CURRENCY_A, currencies.CURRENCY_B]}
          />
        )}
      </ScrollablePage>
    </>
  )
}
