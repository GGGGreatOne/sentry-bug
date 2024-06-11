import { useState, useCallback, useMemo, Dispatch, ChangeEvent } from 'react'
import { Percent, Currency, Pair } from '@uniswap/sdk'
import { Box, useTheme, Typography, Button } from '@mui/material'
import { useActiveWeb3React } from 'hooks'
import { useWalletModalToggle } from 'state/application/hooks'
import { ApprovalState } from 'hooks/useApproveCallback'
import { useTransactionAdder } from 'state/transactions/hooks'
import useModal from 'hooks/useModal'
import TransacitonPendingModal from 'components/Modal/TransactionModals/TransactionPendingModal'
import MessageBox from 'components/Modal/TransactionModals/MessageBox'
import AppBody from 'components/Widget/component/AppBody'
import ActionButton from 'components/Widget/component/Button/ActionButton'
import { AddCircle, ArrowCircle } from 'components/Widget/assets/svg'
import { useBurnActionHandlers, useBurnState, useDerivedBurnInfo } from 'state/widget/burn/hooks'
import { Field } from 'state/widget/burn/actions'
import { wrappedCurrency } from 'components/Widget/utils/wrappedCurrency'
import { useBurnCallback } from 'components/Widget/hooks/usePoolCallback'
import { replaceErrorMessage } from 'components/Widget/utils'
import ConfirmRemoveModal from 'components/Widget/component/Modal/ConfirmRemoveModal'
import useDebouncedChangeHandler from 'components/Widget/hooks/useDebouncedChangeHandler'
import PositionCard from './PositionCard'
import { checkChainId } from 'components/Widget/utils/utils'
import TransactionSubmittedModal from 'components/Modal/TransactionModals/TransactionConfirmedModal'
import { LiquidityPage } from '..'
import CurrencyInputPanel from 'components/Widget/component/Input/CurrencyInputPanel'
import { maxAmountSpend } from 'components/Widget/utils/maxAmountSpend'
import { getSymbol } from 'components/Widget/utils/getSymbol'
import CurrencyLogo from 'components/essential/CurrencyLogo'
import { SwapMapping } from 'api/swap'

export default function RemoveLiquidity({
  boxId,
  setPage
}: {
  boxId: string | number
  setPage: Dispatch<LiquidityPage>
}) {
  const [showConfirm, setShowConfirm] = useState<boolean>(false)

  const theme = useTheme()
  const { showModal, hideModal } = useModal()

  const { account, chainId } = useActiveWeb3React()
  const toggleWalletModal = useWalletModalToggle()

  const { independentField, typedValue } = useBurnState()
  const { pair, parsedAmounts, error, lpBalance, poolShare, currencies } = useDerivedBurnInfo()
  const { [Field.CURRENCY_A]: currencyA, [Field.CURRENCY_B]: currencyB } = currencies
  const { onUserInput: _onUserInput /*, onCurrencySelection*/ } = useBurnActionHandlers()
  const { burnCallback, burnApproveCallback, setSignatureData, approval, signatureData } = useBurnCallback({
    currencyA,
    currencyB,
    parsedAmounts,
    pair
  })
  const balance = lpBalance
  const isValid = !error

  const formattedAmounts = {
    [Field.LIQUIDITY_PERCENT]: parsedAmounts[Field.LIQUIDITY_PERCENT].equalTo('0')
      ? '0'
      : parsedAmounts[Field.LIQUIDITY_PERCENT].lessThan(new Percent('1', '100'))
        ? '<1'
        : parsedAmounts[Field.LIQUIDITY_PERCENT].toFixed(0),
    [Field.LIQUIDITY]:
      (independentField as Field) === Field.LIQUIDITY
        ? typedValue
        : parsedAmounts[Field.LIQUIDITY]?.toSignificant(6) ?? '',
    [Field.CURRENCY_A]:
      independentField === Field.CURRENCY_A ? typedValue : parsedAmounts[Field.CURRENCY_A]?.toSignificant(6) ?? '',
    [Field.CURRENCY_B]:
      independentField === Field.CURRENCY_B ? typedValue : parsedAmounts[Field.CURRENCY_B]?.toSignificant(6) ?? ''
  }

  const poolTokenPercentage = poolShare + '%'

  // wrapped onUserInput to clear signatures
  const onUserInput = useCallback(
    (field: Field, typedValue: string) => {
      setSignatureData(null)
      return _onUserInput(field, typedValue)
    },
    [_onUserInput, setSignatureData]
  )
  const liquidityPercentChangeCallback = useCallback(
    (value: string) => {
      onUserInput(Field.LIQUIDITY, value)
    },
    [onUserInput]
  )
  const [innterLiquidityPercentage, setInnerLiquidityPercentage] = useDebouncedChangeHandler<string>(
    parsedAmounts[Field.LIQUIDITY]?.toFixed(0) ?? '0',
    liquidityPercentChangeCallback
  )
  // tx sending
  const addTransaction = useTransactionAdder()

  const handleRemove = useCallback(() => {
    setShowConfirm(false)
    showModal(<TransacitonPendingModal />)
    burnCallback()
      ?.then(async response => {
        hideModal()
        showModal(<TransactionSubmittedModal />)
        if (response && boxId) {
          await SwapMapping(boxId, response.hash)
          addTransaction(response, {
            summary:
              'Remove ' +
              parsedAmounts[Field.CURRENCY_A]?.toSignificant(3) +
              ' ' +
              getSymbol(currencyA, chainId) +
              ' and ' +
              parsedAmounts[Field.CURRENCY_B]?.toSignificant(3) +
              ' ' +
              getSymbol(currencyB, chainId)
          })
          onUserInput(Field.LIQUIDITY, '0')
          setInnerLiquidityPercentage('0')
        }
      })
      .catch((error: Error) => {
        hideModal()
        showModal(<MessageBox type="error">{replaceErrorMessage(error.message)}</MessageBox>)
        // we only care if the error is something _other_ than the user rejected the tx
        console.error(error)
      })
  }, [
    addTransaction,
    boxId,
    burnCallback,
    chainId,
    currencyA,
    currencyB,
    hideModal,
    onUserInput,
    parsedAmounts,
    setInnerLiquidityPercentage,
    showModal
  ])

  const handleDismissConfirmation = useCallback(() => {
    setShowConfirm(false)
    setSignatureData(null) // important that we clear signature data to avoid bad sigs
  }, [setSignatureData])

  // const pendingText = `Removing ${parsedAmounts[Field.CURRENCY_A]?.toSignificant(6)} ${
  //   currencyA?.symbol
  // } and ${parsedAmounts[Field.CURRENCY_B]?.toSignificant(6)} ${currencyB?.symbol}`

  const checkedChainId = checkChainId(chainId)
  // const oneCurrencyIsETH = currencyA === ETHER || currencyB === ETHER
  // const oneCurrencyIsWETH = Boolean(
  //   checkedChainId &&
  //     ((currencyA && currencyEquals(WETH[checkedChainId], currencyA)) ||
  //       (currencyB && currencyEquals(WETH[checkedChainId], currencyB)))
  // )

  const assets = useMemo(() => {
    return pair?.token0.address === ((wrappedCurrency(currencyA, checkedChainId) as any)?.address ?? '')
      ? [currencyA, currencyB]
      : [currencyB, currencyA]
  }, [pair?.token0.address, currencyA, checkedChainId, currencyB])

  const priceA = pair?.token0Price.equalTo('0') ? '0' : pair?.token0Price?.toFixed(6, undefined, 2) ?? '-'
  const priceB = pair?.token1Price.equalTo('0') ? '0' : pair?.token1Price?.toFixed(6, undefined, 2) ?? '-'

  const handleMax = useCallback(() => {
    onUserInput(Field.LIQUIDITY, maxAmountSpend(lpBalance)?.toExact() ?? '0')
    setInnerLiquidityPercentage(maxAmountSpend(lpBalance)?.toExact() ?? '0')
  }, [lpBalance, onUserInput, setInnerLiquidityPercentage])

  return (
    <>
      <ConfirmRemoveModal
        isOpen={showConfirm}
        onConfirm={handleRemove}
        onDismiss={handleDismissConfirmation}
        val={formattedAmounts[Field.LIQUIDITY]}
        priceA={priceA}
        priceB={priceB}
        tokenA={currencyA}
        tokenB={currencyB}
        valA={formattedAmounts[Field.CURRENCY_A]}
        valB={formattedAmounts[Field.CURRENCY_B]}
      />
      <AppBody
        onReturnClick={() => {
          setPage(LiquidityPage.Pool)
        }}
        title="Remove Liquidity"
      >
        <Box padding="12px" display={'flex'} flexDirection={'column'}>
          {/* <Tips /> */}

          <NumericalCard
            sliderValue={innterLiquidityPercentage}
            onSliderChange={setInnerLiquidityPercentage}
            onMax={handleMax}
            currency={lpBalance?.token}
            lpPair={pair ?? undefined}
          />
          <ArrowCircle style={{ margin: '20px auto' }} />

          {/* 
          <InputCard
            value={formattedAmounts[Field.LIQUIDITY]}
            balance={balance?.toExact() ?? ''}
            currency0={currencyA}
            currency1={currencyB}
          />
          <Box sx={{ height: 76, display: 'flex', alignItems: 'center', justifyContent: 'center' }} onClick={() => {}}>
            <ArrowCircle />
          </Box> */}
          <OutputCard value={formattedAmounts[Field.CURRENCY_A]} currency={currencyA} />
          <Box
            sx={{
              height: 'max-content',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              backgroundColor: '#ffffff',
              width: 'max-content',
              padding: '8px',
              margin: '-14px auto',
              position: 'relative',
              zIndex: 1
            }}
          >
            <AddCircle />
          </Box>

          <OutputCard value={formattedAmounts[Field.CURRENCY_B]} currency={currencyB} />
          {/* {chainId && (oneCurrencyIsWETH || oneCurrencyIsETH) ? (
            <Box display="flex" style={{ justifyContent: 'center' }} margin={'30px 0'} width="100%">
              {oneCurrencyIsETH ? (
                <Button
                  variant="contained"
                  onClick={() => {
                    if (currencyA === ETHER && checkedChainId) {
                      onCurrencySelection(Field.CURRENCY_A, WETH[checkedChainId])
                    }
                    if (currencyB === ETHER && checkedChainId) {
                      onCurrencySelection(Field.CURRENCY_B, WETH[checkedChainId])
                    }
                  }}
                >
                  Receive {getSymbol(WETH[checkedChainId ?? 9000], chainId)}
                </Button>
              ) : oneCurrencyIsWETH ? (
                <Button
                  variant="contained"
                  onClick={() => {
                    const isCurAEther = currencyA?.symbol === 'WETH'
                    if (isCurAEther) {
                      onCurrencySelection(Field.CURRENCY_A, ETHER)
                    } else {
                      onCurrencySelection(Field.CURRENCY_B, ETHER)
                    }
                  }}
                >
                  Receive {getSymbol(ETHER, chainId)}
                </Button>
              ) : null}
            </Box>
          ) : null} */}
          {pair && assets[0] && assets[1] && (
            <Box
              display={'flex'}
              justifyContent="space-between"
              mt={36}
              mb={52}
              gap={8}
              sx={{ backgroundColor: 'rgba(255, 255, 255, 0.10)', padding: 20, borderRadius: '16px' }}
            >
              <Typography sx={{ fontSize: 20 }}>Price</Typography>
              <Box display="grid" gap={12}>
                <Typography sx={{ color: theme.palette.text.secondary, fontSize: 13 }}>
                  1 {getSymbol(assets[0], chainId)} ={' '}
                  <span style={{ color: '#ffffff' }}>
                    {priceA} {getSymbol(assets[1], chainId)}
                  </span>
                </Typography>
                <Typography sx={{ color: theme.palette.text.secondary, fontSize: 13 }}>
                  1 {getSymbol(assets[1], chainId)} ={' '}
                  <span style={{ color: '#ffffff' }}>
                    {priceB} {getSymbol(assets[0], chainId)}
                  </span>
                </Typography>
              </Box>
            </Box>
          )}
          <Box display={'grid'} gap={8} width={'100%'}>
            {!account ? (
              <Button onClick={toggleWalletModal} fullWidth size="large">
                Connect Wallet
              </Button>
            ) : (
              <>
                {approval !== ApprovalState.APPROVED && isValid && (
                  <>
                    {' '}
                    <ActionButton
                      onAction={burnApproveCallback}
                      disableAction={approval !== ApprovalState.NOT_APPROVED || signatureData !== null}
                      pending={approval === ApprovalState.PENDING}
                      success={signatureData !== null}
                      pendingText={'Approving'}
                      successText="Approved"
                      actionText="Approve"
                      isBlackBg
                      width="100%"
                    />
                    <Box height={15}></Box>
                  </>
                )}

                <ActionButton
                  isBlackBg
                  onAction={() => {
                    setShowConfirm(true)
                  }}
                  error={error}
                  actionText="Remove"
                  disableAction={!isValid || (signatureData === null && approval !== ApprovalState.APPROVED)}
                ></ActionButton>
              </>
            )}
          </Box>
        </Box>
        {assets[0] && assets[1] && pair && (
          <PositionCard
            assetA={assets[0]}
            assetB={assets[1]}
            lpBalance={balance?.toFixed(6)}
            liquidityA={pair?.reserve0.toFixed(6)}
            liquidityB={pair?.reserve1.toFixed(6)}
            poolShare={poolTokenPercentage}
          />
        )}
      </AppBody>
    </>
  )
}

// function Tips() {
//   const theme = useTheme()

//   return (
//     <Box
//       sx={{
//         width: '100%',
//         background: theme.palette.background.default,
//         padding: '16px 20px',
//         borderRadius: '8px'
//       }}
//     >
//       <Typography sx={{ fontSize: 12, fontWeight: 400, color: theme.palette.text.secondary }}>
//         Tip: When you add liquidity, you will receive pool tokens representing your position. These tokens automatically
//         earn fees proportional to your share of the pool, and can be redeemed at any time.
//       </Typography>
//     </Box>
//   )
// }

function NumericalCard({
  sliderValue,
  onSliderChange,
  onMax,
  currency,
  lpPair
}: {
  sliderValue: string
  onSliderChange: (val: string) => void
  onMax: () => void
  currency: Currency | undefined
  lpPair: Pair | undefined
}) {
  const onChange = useCallback(
    (e: ChangeEvent<HTMLInputElement>) => {
      const val = (e.target as any)?.value
      onSliderChange(val)
    },
    [onSliderChange]
  )

  return (
    <Box style={{ position: 'relative' }}>
      <Box
        bgcolor={'#ffffff'}
        sx={{
          borderRadius: '16px',
          padding: '20px'
        }}
        display="grid"
        gap={10}
      >
        <Typography sx={{ fontSize: 14, fontWeight: 400, paddingRight: 103, color: '#333' }}>Remove Amount</Typography>
        <CurrencyInputPanel
          value={sliderValue}
          onChange={onChange}
          currency={currency}
          onMax={onMax}
          isSecond
          disableCurrencySelect
          pair={lpPair}
        />
      </Box>
      {/* {mode === Mode.DETAIL && (
        <>
          <StyledSlider onChange={onChange} value={sliderValue} />
        </>
      )} */}
    </Box>
  )
}

// function InputCard({
//   value,
//   balance,
//   currency0,
//   currency1
// }: {
//   value: string
//   balance: string
//   currency0: Currency | undefined
//   currency1: Currency | undefined
// }) {
//   return (
//     <Box
//       padding="24px"
//       bgcolor={'#ffffff'}
//       sx={{
//         borderRadius: '16px',
//         color: '#121212',
//         marginTop: 16
//       }}
//     >
//       <Box sx={{ display: { xs: 'grid', sm: 'flex' }, justifyContent: 'space-between' }} gap={8}>
//         <Box display="grid" gap={12}>
//           <Typography sx={{ fontSize: 20, fontWeight: 400 }}>Input</Typography>
//           <Typography sx={{ fontSize: 24, fontWeight: 900, wordBreak: 'break-all' }}>{value ? value : '0'}</Typography>
//         </Box>
//         <Box display="grid" gap={14}>
//           <Typography sx={{ fontSize: 16, fontWeight: 400 }}>Balance: {balance ?? '-'}</Typography>
//           <Box display="flex" gap={11} alignItems="center">
//             <DoubleCurrencyLogo currency0={currency0} currency1={currency1} />
//             <Typography>
//               {currency0?.symbol}:{currency1?.symbol}
//             </Typography>
//           </Box>
//         </Box>
//       </Box>
//     </Box>
//   )
// }

function OutputCard({ value, currency }: { value: string; currency: Currency | undefined }) {
  const { chainId } = useActiveWeb3React()
  return (
    <Box
      padding="24px"
      bgcolor={'#ffffff'}
      sx={{
        borderRadius: '16px',
        color: '#121212'
      }}
    >
      <Box sx={{ display: { xs: 'grid', sm: 'flex' }, justifyContent: 'space-between', alignItems: 'center' }} gap={8}>
        <Box display="grid" gap={12}>
          {/* <Typography sx={{ fontSize: 20, fontWeight: 400 }}>Output</Typography> */}
          <Typography sx={{ fontSize: 24, fontWeight: 900 }}>{value ? value : 0}</Typography>
        </Box>
        <Box display="flex" gap={12} alignItems="center">
          <Box
            sx={{
              background: '#0D0D0D10',
              color: '#20201E',
              fontSize: 16,
              fontWeight: 400,
              transition: '.3s',
              padding: '4px 10px 4px 10px',
              position: 'relative',
              width: 'max-content',
              borderRadius: '60px',
              height: 36,
              display: 'flex',
              alignItems: 'center',
              gap: 6
            }}
          >
            {currency && <CurrencyLogo currencyOrAddress={currency as any} />}
            <Typography>{getSymbol(currency, chainId)}</Typography>
          </Box>
        </Box>
      </Box>
    </Box>
  )
}
