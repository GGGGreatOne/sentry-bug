import { Box, Button, Stack, SxProps, Typography } from '@mui/material'
import { Tabs } from './chartTab'
import { useEffect, useMemo, useState } from 'react'
import YellowWarnSvg from '../../assets/yellow-warn.svg'

import ActionButton from '../components/conductTrade/ActionButton'
import Slider from '../components/conductTrade/slider'
import PayContainer from '../components/conductTrade/PayContainer'
import { QuantosDetails } from '../../hook/useFactory'
import { useActiveWeb3React } from '../../../../hooks'
import BigNumber from 'bignumber.js'
import { getLiqPrice } from '../../utils'
import { control } from '../components/dialog/modal'
import { TRADE_MODE } from './index'
import { useGetOrderLimit } from '../../hook/useGetOrderLimt'
import { useRequest } from 'ahooks'
import { useLeverageStateData } from 'plugins/leverage/state/hooks'
import { WBB_ADDRESS } from '../../constants'
import { ZERO_ADDRESS } from '../../../../constants'
import { useCurrencyBalance } from '../../../../hooks/useToken'
import { Currency } from '../../../../constants/token'

export const InfoPair = ({
  label,
  value,
  link,
  sx,
  fontSize
}: {
  label: string
  value: string | JSX.Element
  link?: string
  sx?: SxProps
  fontSize?: 'small' | 'medium'
}) => {
  const size = fontSize === 'medium' ? 15 : 13
  return (
    <Stack flexDirection={'row'} justifyContent={'space-between'} alignItems={'center'} sx={{ ...sx }}>
      <Typography sx={{ color: 'var(--ps-neutral3)', fontSize: size, fontWeight: 400, lineHeight: 1.4 }}>
        {label}
      </Typography>

      <Typography
        component={link ? 'a' : 'p'}
        href={link || ''}
        sx={{
          color: 'var(--ps-text-100)',
          fontFamily: 'SF Pro Display',
          fontSize: size,
          lineHeight: 1.4,
          textDecoration: link ? 'underline' : 'none'
        }}
        target="_blank"
      >
        {value}
      </Typography>
    </Stack>
  )
}

const tradeTimeType = ['Long', 'Short']
const tradeTypes = ['Market', 'Limit']

export interface TradeTuple {
  trader: string
  sl: '0'
  tp: '0'
  pairIndex: number
  openPrice: string
  leverage: number
  initialPosToken: number
  index: number
  buy: boolean
  positionSizeDai: string
}

enum ButtonText {
  CONNECT_WALLET = 'Login in',
  ENTER_AMOUNT = 'Enter an amount',
  EXCEED_LIMIT = 'exceed order limit',
  LONG = 'Long',
  SHORT = 'Short',
  INSUFFICIENT_BALANCE = 'Insufficient Balance',
  REACHED_LIMIT = 'Reached max positions limit',
  MIN_SIZE = 'Min position size is 1500'
}

const Page = ({
  quantos,
  tradePrice,
  tradeMode,
  boxContractAdr,
  boxQuantos,
  setIsLong,
  totalPosition
}: {
  quantos: undefined | QuantosDetails
  tradePrice: BigNumber
  tradeMode: TRADE_MODE
  boxContractAdr: string
  boxQuantos: undefined | QuantosDetails[]
  setIsLong: (c: boolean) => void
  totalPosition: number
}) => {
  const { account, chainId } = useActiveWeb3React()
  const { data: Bitleverage } = useLeverageStateData()
  const [tradeTime, setTradeTime] = useState(tradeTimeType[0])
  const [tradeType, setTradeType] = useState(tradeTypes[0])
  const [limitPrice, setLimitPrice] = useState<string>('')
  const [positionSize, setPositionSize] = useState('')
  const [buttonState, setButtonState] = useState<ButtonText>(ButtonText.CONNECT_WALLET)
  const isFirstConfirm = false
  const [leverageNum, setLeverageNum] = useState(2)
  const [orderLimit, setOrderLimit] = useState(new BigNumber(0))
  const getOrderLimit = useGetOrderLimit(quantos?.pairStorageT, quantos?.poolCurrentBalance)

  useRequest(
    async () => {
      const res = await getOrderLimit()
      if (typeof res !== 'undefined') setOrderLimit(res)
    },
    { pollingInterval: 30000, refreshDeps: [quantos] }
  )

  const tokenInfo = useCurrencyBalance(
    account,
    new Currency(
      chainId ?? 6001,
      quantos?.tokenT.toLowerCase() === WBB_ADDRESS.toLowerCase() ? ZERO_ADDRESS : quantos?.tokenT ?? '',
      quantos?.tokenInfo?.decimals ?? 18
    ),
    chainId
  )

  const userWalletBalance = useMemo(() => {
    return new BigNumber(tokenInfo?.toExact() ?? '0')
  }, [tokenInfo])

  const tradeTuple = useMemo<TradeTuple>(() => {
    return {
      trader: account!,
      sl: '0',
      tp: '0',
      pairIndex: Bitleverage?.tradePairIndex || 0,
      openPrice: tradeType === 'Market' ? tradePrice.toString() : limitPrice.toString(),
      leverage: leverageNum,
      initialPosToken: 0,
      index: 0,
      buy: tradeTime === 'Long',
      positionSizeDai: positionSize.toString()
    }
  }, [account, Bitleverage?.tradePairIndex, tradeType, tradePrice, limitPrice, leverageNum, tradeTime, positionSize])

  const liqPrice = useMemo(() => {
    return getLiqPrice(tradePrice, new BigNumber(positionSize), tradeTime === 'Long', leverageNum)
  }, [tradePrice, positionSize, tradeTime, leverageNum])

  useEffect(() => {
    if (!account) setButtonState(ButtonText.CONNECT_WALLET)
    else if (new BigNumber(positionSize).isGreaterThan(userWalletBalance))
      setButtonState(ButtonText.INSUFFICIENT_BALANCE)
    else if (
      !new BigNumber(positionSize).isEqualTo(0) &&
      new BigNumber(positionSize).times(leverageNum).isLessThan(quantos?.minPositionLev ?? '0')
    )
      setButtonState(ButtonText.MIN_SIZE)
    else if (!new BigNumber(positionSize).isGreaterThan(0)) setButtonState(ButtonText.ENTER_AMOUNT)
    else if (new BigNumber(positionSize).times(leverageNum).isGreaterThan(orderLimit))
      setButtonState(ButtonText.EXCEED_LIMIT)
    else if (totalPosition >= 3) setButtonState(ButtonText.REACHED_LIMIT)
    else if (tradeTime === 'Long') setButtonState(ButtonText.LONG)
    else if (tradeTime !== 'Long') setButtonState(ButtonText.SHORT)
  }, [account, tradeTime, leverageNum, positionSize, quantos, userWalletBalance, orderLimit, totalPosition])

  useEffect(() => {
    setLeverageNum(tradeMode === TRADE_MODE.DEGEN ? 51 : 2)
    setPositionSize('')
  }, [tradeMode])

  useEffect(() => {
    setPositionSize('')
    setLeverageNum(tradeMode === TRADE_MODE.DEGEN ? 51 : 2)
  }, [tradeTime, tradeMode])

  useEffect(() => {
    setLimitPrice('')
  }, [tradeType])

  return (
    <Box sx={{ width: '100%', padding: 12, borderRadius: 12, background: 'var(--ps-neutral2)' }}>
      <Tabs
        tabs={tradeTimeType}
        initTab={tradeTime}
        setTab={v => {
          setTradeTime(v)
          setIsLong(v === 'Long')
        }}
      />
      {isFirstConfirm && <FirstConfirm />}
      {!isFirstConfirm && (
        <>
          <Box mt={12}>
            <Tabs tabs={tradeTypes} initTab={tradeType} setTab={v => setTradeType(v)} isLevel2 />
          </Box>
          {(tradeType === 'Market' || tradeType === 'Limit') && (
            <Box mt={12}>
              <Typography sx={{ color: 'var(--ps-text-100)', fontSize: 13, lineHeight: 1.4 }}>
                Available: &nbsp;&nbsp;{userWalletBalance.toFormat(2)} {quantos?.tokenInfo?.symbol}
              </Typography>
              <Typography mt={4} sx={{ color: 'var(--ps-text-100)', fontSize: 13, lineHeight: 1.4 }}>
                Order limit: &nbsp;&nbsp; {orderLimit?.toFormat(2)} {quantos?.tokenInfo?.symbol}
              </Typography>
              <Box my={12}>
                <PayContainer
                  isLimit={tradeType === 'Limit'}
                  leverage={leverageNum}
                  positionSize={positionSize}
                  tokenSymbol={quantos?.tokenInfo?.symbol}
                  limitPrice={limitPrice}
                  setLimitPrice={v => setLimitPrice(v)}
                  setPositionSize={v => setPositionSize(v.toString())}
                  boxAddress={boxContractAdr}
                  boxQuantos={boxQuantos}
                  tokenAddress={quantos?.tokenInfo?.address ?? ''}
                />
              </Box>
              <Slider value={leverageNum} setValue={v => setLeverageNum(v)} tradeMode={tradeMode} />
            </Box>
          )}
          <Stack mt={18} sx={{ gap: 4 }}>
            <InfoPair value={quantos?.tokenInfo?.symbol ?? ''} label="Collateral in" />
            <InfoPair value={leverageNum.toString()} label="Leverage" />
            <InfoPair value={`$${tradePrice.toFixed(2)}`} label="Entry Price" />
            <InfoPair value={'$' + liqPrice.toFixed(2)} label="Liq. Price" />
            <InfoPair value={'-'} label="Fees" />
          </Stack>
          <ActionButton
            disabled={
              buttonState === ButtonText.INSUFFICIENT_BALANCE ||
              buttonState === ButtonText.REACHED_LIMIT ||
              buttonState === ButtonText.MIN_SIZE ||
              buttonState === ButtonText.ENTER_AMOUNT ||
              buttonState === ButtonText.EXCEED_LIMIT
            }
            onClick={() => {
              if (quantos) {
                control.show('ConfirmLong', {
                  quantos: quantos,
                  tradeTuple: tradeTuple,
                  liqPrice: liqPrice.toFixed(2),
                  tradeType: tradeType === 'Market' ? 0 : 1,
                  boxContactAddr: boxContractAdr
                })
              }
            }}
          >
            {buttonState}
          </ActionButton>
        </>
      )}
    </Box>
  )
}
const FirstConfirm = () => {
  return (
    <Box mt={18}>
      <Box sx={{ padding: '12px 12px 16px 12px', borderRadius: 12, background: 'var(--ps-text-primary)' }}>
        <Stack
          flexDirection={'row'}
          alignItems={'center'}
          sx={{ paddingBottom: 16, borderBottom: '1px solid var(--ps-text-10)' }}
        >
          <YellowWarnSvg />
          <Typography ml={10} sx={{ color: 'var(--ps-text-100)', fontSize: 15, fontWeight: 500 }}>
            Attention
          </Typography>
        </Stack>
        <Box mt={16}>
          <Typography sx={{ color: 'var(--ps-text-100)', fontWeight: 500, fontSize: 13 }}>1. Order Limit</Typography>
          <Typography mt={8} sx={{ color: 'var(--ps-neutral3)', fontWeight: 400, fontSize: 13, lineHeight: 1.4 }}>
            When placing orders, be aware that the total quantity of your position, inclusive of leverage, should not
            exceed 20% of the total market liquidity. Please review the available liquidity before placing your orders
            to maintain seamless trading operations.
          </Typography>
        </Box>
        <Box mt={16}>
          <Typography sx={{ color: 'var(--ps-text-100)', fontWeight: 500, fontSize: 13 }}>
            2. Position Reduction
          </Typography>
          <Typography mt={8} sx={{ color: 'var(--ps-neutral3)', fontWeight: 400, fontSize: 13, lineHeight: 1.4 }}>
            When placing orders, be aware that the total quantity of your position, inclusive of leverage, should not
            exceed 20% of the total market liquidity. Please review the available liquidity before placing your orders
            to maintain seamless trading operations.
          </Typography>
        </Box>
      </Box>
      <Button
        variant="contained"
        sx={{ backgroundColor: 'var(--ps-text-100)', width: '100%', marginTop: 18, height: 44 }}
      >
        OK
      </Button>
    </Box>
  )
}
export default Page
