import { Currency, CurrencyAmount, TokenAmount } from '@uniswap/sdk'
import React, { ChangeEvent, Dispatch, useCallback, useMemo, useState } from 'react'
import { Alert, Box, Button, Card, Typography } from '@mui/material'
import { useActiveWeb3React } from 'hooks'
import { useWalletModalToggle } from 'state/application/hooks'
import { maxAmountSpend } from '../../utils/maxAmountSpend'
import { ApprovalState, useApproveCallback } from '../../hooks/useApproveCallback'
import { useTransactionAdder } from 'state/transactions/hooks'
import AppBody from '../../component/AppBody'
import { PairState } from '../../data/Reserves'
import { ONE_BIPS, ROUTER_ADDRESS } from '../../constant'
import CurrencyInputPanel from '../../component/Input/CurrencyInputPanel'
import { useDerivedMintInfo, useMintActionHandlers, useMintState } from 'state/widget/mint/hooks'
import ConfirmSupplyModal from '../../component/Modal/ConfirmSupplyModal'
import { Field } from 'state/widget/mint/actions'
import ActionButton from '../../component/Button/ActionButton'
import { AddCircle, ArrowCircle, Lightbulb } from '../../assets/svg'
import PoolPriceBar from './PoolPriceBar'
import { useMintCallback } from '../../hooks/usePoolCallback'
import useModal from 'hooks/useModal'
import TransactionSubmittedModal from 'components/Modal/TransactionModals/TransactionConfirmedModal'
import TransactionPendingModal from 'components/Modal/TransactionModals/TransactionPendingModal'
import { wrappedCurrency } from '../../utils/wrappedCurrency'
import { checkChainId } from '../../utils/utils'
import MessageBox from 'components/Modal/TransactionModals/MessageBox'
import { replaceErrorMessage } from '../../utils'
import { LiquidityPage } from '..'
import { useTokenBalance } from 'components/Widget/hooks/wallet'
import { getSymbol } from 'components/Widget/utils/getSymbol'
import DoubleCurrencyLogo from 'components/essential/CurrencyLogo/DoubleLogo'
import { SwapMapping } from 'api/swap'

export default function AddLiquidity({ boxId, setPage }: { boxId: string | number; setPage: Dispatch<LiquidityPage> }) {
  const { account, chainId } = useActiveWeb3React()
  const { showModal, hideModal } = useModal()

  const toggleWalletModal = useWalletModalToggle() // toggle wallet when disconnected

  // mint state
  const { independentField, typedValue, otherTypedValue } = useMintState()
  const {
    dependentField,
    currencies,
    pair,
    pairState,
    currencyBalances,
    parsedAmounts,
    price,
    noLiquidity,
    liquidityMinted,
    poolTokenPercentage,
    error
  } = useDerivedMintInfo()

  const createLiquidityPermissions = useMemo(() => {
    if (pairState === PairState.NOT_EXISTS) {
      return true
    }
    return true
  }, [pairState])

  const { [Field.CURRENCY_A]: currencyA, [Field.CURRENCY_B]: currencyB } = currencies

  const { addLiquidityCb } = useMintCallback({ currencyA, currencyB, parsedAmounts, noLiquidity })

  const { onFieldAInput, onFieldBInput, onCurrencySelection, onResetMintState } = useMintActionHandlers(noLiquidity)

  // modal and loading
  const [showConfirm, setShowConfirm] = useState<boolean>(false)

  const [txHash, setTxHash] = useState<string>('')

  const shareOfPool =
    noLiquidity && price
      ? '100'
      : (poolTokenPercentage?.lessThan(ONE_BIPS) ? '<0.01' : poolTokenPercentage?.toFixed(2)) ?? '0'

  // get formatted amounts
  const formattedAmounts = {
    [independentField]: typedValue,
    [dependentField]: noLiquidity ? otherTypedValue : parsedAmounts[dependentField]?.toSignificant(6) ?? ''
  }

  // get the max amounts user can add
  const maxAmounts: { [field in Field]?: TokenAmount } = [Field.CURRENCY_A, Field.CURRENCY_B].reduce(
    (accumulator, field) => {
      return {
        ...accumulator,
        [field]: maxAmountSpend(currencyBalances[field])
      }
    },
    {}
  )

  const handleMaxInputA = useCallback(() => {
    onFieldAInput(maxAmounts[Field.CURRENCY_A]?.toFixed(8, undefined, 0) ?? '')
  }, [maxAmounts, onFieldAInput])

  const handleMaxInputB = useCallback(() => {
    onFieldBInput(maxAmounts[Field.CURRENCY_B]?.toFixed(8, undefined, 0) ?? '')
  }, [maxAmounts, onFieldBInput])

  const priceA = pair?.token0Price.equalTo('0') ? '0' : pair?.token0Price?.toFixed(8, undefined, 2) ?? '-'
  const priceB = pair?.token1Price.equalTo('0') ? '0' : pair?.token1Price?.toFixed(8, undefined, 2) ?? '-'

  const flipOrder = pair?.token0.address === ((wrappedCurrency(currencyA, checkChainId(chainId)) as any)?.address ?? '')

  // check whether the user has approved the router on the tokens
  const [approvalA, approveACallback] = useApproveCallback(parsedAmounts[Field.CURRENCY_A], ROUTER_ADDRESS)
  const [approvalB, approveBCallback] = useApproveCallback(parsedAmounts[Field.CURRENCY_B], ROUTER_ADDRESS)

  const addTransaction = useTransactionAdder()

  async function handleAddCb() {
    setShowConfirm(false)
    showModal(<TransactionPendingModal />)

    await addLiquidityCb()
      .then(async response => {
        onResetMintState()
        hideModal()
        showModal(<TransactionSubmittedModal />)

        if (!response || !boxId) return
        await SwapMapping(boxId, response.hash)
        addTransaction(response, {
          summary:
            'Add ' +
            parsedAmounts[Field.CURRENCY_A]?.toSignificant(3) +
            ' ' +
            getSymbol(currencies[Field.CURRENCY_A], chainId) +
            ' and ' +
            parsedAmounts[Field.CURRENCY_B]?.toSignificant(3) +
            ' ' +
            getSymbol(currencies[Field.CURRENCY_B], chainId)
        })

        setTxHash(response.hash)
      })
      .catch(error => {
        if (error?.code !== 4001) {
          console.error(error)
          showModal(
            <MessageBox type="error">
              {error?.message ? replaceErrorMessage(error.message) : 'Contract Error'}
            </MessageBox>
          )
        }
      })
  }

  const handleAdd = useCallback(() => {
    setShowConfirm(true)
  }, [])

  const handleAssetA = useCallback(
    (currency: Currency) => {
      onCurrencySelection(Field.CURRENCY_A, currency)
    },
    [onCurrencySelection]
  )

  const handleAssetB = useCallback(
    (currency: Currency) => {
      onCurrencySelection(Field.CURRENCY_B, currency)
    },
    [onCurrencySelection]
  )

  const handleAssetAVal = useCallback(
    (e: ChangeEvent<HTMLInputElement>) => {
      onFieldAInput(e.target.value)
    },
    [onFieldAInput]
  )

  const handleAssetBVal = useCallback(
    (e: ChangeEvent<HTMLInputElement>) => {
      onFieldBInput(e.target.value)
    },
    [onFieldBInput]
  )

  const handleDismissConfirmation = useCallback(() => {
    setShowConfirm(false)
    // if there was a tx hash, we want to clear the input
    if (txHash) {
      onFieldAInput('')
    }
    setTxHash('')
  }, [onFieldAInput, txHash])

  const assets = useMemo(() => {
    return flipOrder ? [currencyA, currencyB] : [currencyB, currencyA]
  }, [flipOrder, currencyA, currencyB])

  const balences = useMemo(() => {
    return flipOrder
      ? [currencyBalances[Field.CURRENCY_A], currencyBalances[Field.CURRENCY_B]]
      : [currencyBalances[Field.CURRENCY_B], currencyBalances[Field.CURRENCY_A]]
  }, [flipOrder, currencyBalances])

  const lpBalance = useTokenBalance(account, liquidityMinted?.token)

  // const assetsTexts = getTokenText(assets[0], assets[1])

  return (
    <>
      <ConfirmSupplyModal
        liquidityMinted={liquidityMinted}
        onConfirm={handleAddCb}
        tokenA={currencyA}
        tokenB={currencyB}
        priceA={flipOrder ? priceA : priceB}
        priceB={flipOrder ? priceB : priceA}
        valA={formattedAmounts[Field.CURRENCY_A]}
        valB={formattedAmounts[Field.CURRENCY_B]}
        isOpen={showConfirm}
        onDismiss={handleDismissConfirmation}
        shareOfPool={shareOfPool}
      />

      <AppBody
        onReturnClick={() => {
          setPage(LiquidityPage.Pool)
          onResetMintState()
        }}
        title="Add Liquidity"
      >
        <Box display={'grid'} gap={28} padding="12px">
          <Tips noLiquidity={noLiquidity} />
          <Box display={'grid'}>
            <Box
              bgcolor={'#ffffff'}
              sx={{
                borderRadius: '16px',
                padding: '20px'
              }}
            >
              <CurrencyInputPanel
                value={formattedAmounts[Field.CURRENCY_A]}
                onChange={handleAssetAVal}
                onSelectCurrency={handleAssetA}
                currency={currencyA}
                onMax={handleMaxInputA}
                isSecond
              />
            </Box>
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
            <Box
              bgcolor={'#ffffff'}
              sx={{
                borderRadius: '16px',
                padding: '20px'
              }}
              marginBottom={'12px'}
            >
              <CurrencyInputPanel
                value={formattedAmounts[Field.CURRENCY_B]}
                onChange={handleAssetBVal}
                onSelectCurrency={handleAssetB}
                currency={currencyB}
                onMax={handleMaxInputB}
                isSecond
              />{' '}
            </Box>
            {currencies[Field.CURRENCY_A] && currencies[Field.CURRENCY_B] && pairState !== PairState.INVALID && (
              <>
                {!error && <ArrowCircle style={{ margin: '0 auto 15px' }} />}
                <PoolPriceBar
                  noLiquidity={noLiquidity}
                  data={{
                    [`${getSymbol(assets[1], chainId)} per ${getSymbol(assets[0], chainId)}`]: priceA ?? '-',
                    [`${getSymbol(assets[0], chainId)} per ${getSymbol(assets[1], chainId)}`]: priceB ?? '-',
                    ['Share of pool']: `${shareOfPool}
                          %`
                  }}
                />
              </>
            )}
          </Box>

          {!account ? (
            <Button onClick={toggleWalletModal} size="large">
              Connect Wallet
            </Button>
          ) : !createLiquidityPermissions ? (
            <Alert variant="outlined" severity={'warning'}>
              The creation of liquidity pools is restricted to users who hold Club.
            </Alert>
          ) : (
            <Box display="grid" gap={'16px'}>
              {(approvalA === ApprovalState.NOT_APPROVED ||
                approvalA === ApprovalState.PENDING ||
                approvalB === ApprovalState.NOT_APPROVED ||
                approvalB === ApprovalState.PENDING) &&
                !error && (
                  <Box
                    display="flex"
                    gap={16}
                    sx={{
                      '& button': {
                        width: '100%'
                      }
                    }}
                  >
                    {approvalA !== ApprovalState.APPROVED && (
                      <ActionButton
                        isBlackBg
                        onAction={approveACallback}
                        disableAction={approvalA === ApprovalState.PENDING}
                        pending={approvalA === ApprovalState.PENDING}
                        pendingText={`Approving ${
                          currencies[Field.CURRENCY_A]?.symbol ?? currencies[Field.CURRENCY_A]?.name
                        }`}
                        actionText={
                          'Approve ' + (currencies[Field.CURRENCY_A]?.symbol ?? currencies[Field.CURRENCY_A]?.name)
                        }
                      />
                    )}
                    {approvalB !== ApprovalState.APPROVED && (
                      <ActionButton
                        isBlackBg
                        onAction={approveBCallback}
                        disableAction={approvalB === ApprovalState.PENDING}
                        pending={approvalB === ApprovalState.PENDING}
                        pendingText={`Approving ${
                          currencies[Field.CURRENCY_B]?.symbol ?? currencies[Field.CURRENCY_B]?.name
                        }`}
                        actionText={
                          'Approve ' + (currencies[Field.CURRENCY_B]?.symbol ?? currencies[Field.CURRENCY_B]?.name)
                        }
                      />
                    )}
                  </Box>
                )}
              <ActionButton
                isBlackBg
                error={error}
                actionText="Supply"
                onAction={handleAdd}
                disableAction={!!error || approvalA !== ApprovalState.APPROVED || approvalB !== ApprovalState.APPROVED}
              />
            </Box>
          )}
        </Box>
        {!error && (
          <LPCard
            assets={assets}
            lpBalance={lpBalance}
            data={{
              [`You pool share`]: `${shareOfPool} %`,
              [`${getSymbol(assets[0], chainId)}`]: balences[0]?.toExact() ?? '-',
              [`${getSymbol(assets[1], chainId)}`]: balences[1]?.toExact() ?? '-'
            }}
          />
        )}
        <Typography padding="12px 24px 24px" fontSize={12} color="rgba(255, 255, 255, 0.60)" textAlign={'center'}>
          By adding liquidity you&apos;ll earn 0.3% of all trades on this pair proportional to your share of the pool.
          Fees are added to the pool, accrue in real time and can be claimed by withdrawing your liquidity.
        </Typography>
      </AppBody>
    </>
  )
}

function Tips({ noLiquidity }: { noLiquidity?: boolean }) {
  return (
    <Box bgcolor="rgba(255, 255, 255, 0.10)" fontSize={12} display={'flex'} padding="12px" gap={8} borderRadius={'8px'}>
      <Lightbulb style={{ flexShrink: 0 }} />
      {noLiquidity ? (
        <Box display={'grid'} gap="10px">
          <Typography fontWeight={600}>You are the first liquidity provider.</Typography>
          <Typography fontWeight={400}>The ratio of tokens you add will set the price of this pool.</Typography>
          <Typography fontWeight={400}>Once you are happy with the rate click supply to review.</Typography>
        </Box>
      ) : (
        <Box component={'p'}>
          <b>Tip:</b> When you add liquidity, you will receive lp tokens representing your position. These tokens
          automatically earn fees proportional to your share of the pool, and can be redeemed at any time.
        </Box>
      )}
    </Box>
  )
}

function LPCard({
  data,
  assets,
  lpBalance
}: {
  data: object
  assets: (Currency | undefined)[]
  lpBalance: CurrencyAmount | undefined
}) {
  return (
    <Card sx={{ borderRadius: '16px', margin: '0 24px', padding: 20 }}>
      <Typography mb={17} fontSize={20} fontWeight={700}>
        LP TOKENS IN YOUR WALLET
      </Typography>
      <Box sx={{ display: 'grid', gap: 12 }}>
        <Box display="flex" justifyContent="space-between">
          <Typography
            sx={{ fontWeight: 500 }}
            fontSize={13}
            component={'div'}
            display={'flex'}
            alignItems={'center'}
            gap={15}
            lineHeight={1}
          >
            <DoubleCurrencyLogo currency0={assets[0] as any} currency1={assets[1] as any} size={20} />{' '}
            {assets[0]?.symbol === 'ETH' ? 'BB' : assets[0]?.symbol} -{' '}
            {assets[1]?.symbol === 'ETH' ? 'BB' : assets[1]?.symbol}
          </Typography>
          <Typography color="rgba(255, 255, 255, 0.60)" fontSize={13}>
            {lpBalance?.toExact() ?? '-'}
          </Typography>
        </Box>
        {Object.keys(data).map((key, idx) => (
          <>
            <Box key={key + idx + data[key as keyof typeof data]} display="flex" justifyContent="space-between">
              <Typography sx={{ fontWeight: 500 }} fontSize={13}>
                {key}
              </Typography>
              <Typography color="rgba(255, 255, 255, 0.60)" fontSize={13}>
                {data[key as keyof typeof data]}
              </Typography>
            </Box>
          </>
        ))}
      </Box>
    </Card>
  )
}
