import { Accordion, AccordionDetails, AccordionSummary, Stack, Typography } from '@mui/material'
import Copy from 'components/essential/Copy'
import { useActiveWeb3React } from 'hooks'
import { TroveInfoProps, useStabilityPoolInfo } from 'plugins/liquity/hooks/useLiquityInfo'
import { useMemo } from 'react'
import { formatBigNumber, formatGroupNumber, shortenAddress } from 'utils'
import { useSingleCallResult } from 'hooks/multicall'
import { useTokenContract } from 'hooks/useContract'
import { CurrencyAmount } from 'constants/token'
import RedirectIcon from '../../../../assets/svg/boxes/redirect.svg'
// import ProgressIcon from '../../../../assets/svg/boxes/progress.svg'
import Image from 'components/Image'
import BigNumber from 'bignumber.js'
import ItemWithTooltip from 'views/clubs/components/ItemWithTooltip'
import { getEtherscanLink } from 'utils/getEtherscanLink'
import { SupportedChainId } from 'constants/chains'
import BTCIcon from 'assets/images/boxes/bbtc.png'
import CurrencyLogo from 'components/essential/CurrencyLogo'
import { useGetTokenPrice } from 'hooks/boxes/useGetTokenPrice'
import useBreakpoint from 'hooks/useBreakpoint'
import ExpandMoreIcon from '@mui/icons-material/ExpandMore'

export default function CollateralRatioContent({
  troveInfo,
  stablePoolContractAddr
}: {
  troveInfo: TroveInfoProps
  stablePoolContractAddr?: string
}) {
  const { chainId } = useActiveWeb3React()
  const isMd = useBreakpoint('md')
  const price = useGetTokenPrice([troveInfo.btcToken.address])
  const stabilityPoolInfo = useStabilityPoolInfo(stablePoolContractAddr, troveInfo.stableToken)
  const btcPrice = CurrencyAmount.fromAmount(troveInfo.btcToken, price[0] || 0)
  const stableTokenPrice = CurrencyAmount.fromAmount(troveInfo.stableToken, '1')
  const stableCoinTokenContract = useTokenContract(troveInfo.stableToken.address)
  const totalSupplyRes = useSingleCallResult(chainId, stableCoinTokenContract, 'totalSupply', undefined, undefined)
  const totalSupply = useMemo(() => {
    if (totalSupplyRes.result && troveInfo.stableToken) {
      return CurrencyAmount.fromRawAmount(troveInfo.stableToken, totalSupplyRes.result[0].toString())
    }
    return undefined
  }, [totalSupplyRes.result, troveInfo.stableToken])

  const liquidateAmount = useMemo(() => {
    if (troveInfo.sysTotalColl && troveInfo.sysTotalDebt) {
      const val = new BigNumber(troveInfo.sysTotalDebt?.toExact())?.times(1.5).div(troveInfo.sysTotalColl.toExact())
      return val
    }
    return undefined
  }, [troveInfo.sysTotalColl, troveInfo.sysTotalDebt])

  const tokenInfoList = [
    {
      icon: BTCIcon.src,
      address: troveInfo.btcToken.address,
      name: 'BBTC',
      price: btcPrice,
      text: 'Market Price'
    },
    {
      address: troveInfo.stableToken.address,
      name: troveInfo.stableToken.symbol?.toLocaleUpperCase(),
      price: stableTokenPrice,
      text: 'Market Price'
    }
  ]

  const userAssetList = useMemo(
    () => [
      {
        id: 0,
        icon: BTCIcon.src,
        tokenAddr: troveInfo.btcToken.address,
        tokenDecimals: troveInfo.btcToken.decimals,
        tokenSymbol: troveInfo.btcToken.symbol,
        name: troveInfo.btcToken.name,
        balance: troveInfo.userBtcBalance,
        usdBalance: troveInfo.btcPrice && troveInfo.userBtcBalance?.mul(troveInfo.btcPrice)
      },
      {
        id: 1,
        tokenAddr: troveInfo.stableToken.address,
        tokenDecimals: troveInfo.stableToken.decimals,
        tokenSymbol: troveInfo.stableToken.symbol,
        name: troveInfo.stableToken.name,
        balance: troveInfo.userStableTokenBalance,
        usdBalance: troveInfo.userStableTokenBalance
      }
    ],
    [
      troveInfo.btcPrice,
      troveInfo.btcToken.address,
      troveInfo.btcToken.decimals,
      troveInfo.btcToken.name,
      troveInfo.btcToken.symbol,
      troveInfo.stableToken.address,
      troveInfo.stableToken.decimals,
      troveInfo.stableToken.name,
      troveInfo.stableToken.symbol,
      troveInfo.userBtcBalance,
      troveInfo.userStableTokenBalance
    ]
  )

  const descriptions = [
    {
      label: 'Borrowing Fee',
      value: `${troveInfo.borrowRate?.mul(100).toFixed(2) || '--'}%`,
      tips: `The Borrowing Fee is a one-off fee charged as a percentage of the borrowed amount (in ${troveInfo.stableToken.symbol?.toLocaleUpperCase()}) and is part of a Trove's debt. The fee varies between 0.5% and 5% depending on ${troveInfo.stableToken.symbol?.toLocaleUpperCase()} redemption volumes.`
    },
    {
      label: 'TVL',
      value: `${
        (troveInfo.btcAmount && new BigNumber(troveInfo.btcAmount.toExact()).toFixed(2, BigNumber.ROUND_DOWN)) || '--'
      } BBTC($${
        (troveInfo.btcPrice &&
          troveInfo.btcAmount &&
          formatGroupNumber(
            new BigNumber(troveInfo.btcAmount?.toExact())?.times(troveInfo.btcPrice.toExact()).toNumber(),
            '',
            2
          )) ||
        '--'
      })`,
      tips: `The Total Value Locked (TVL) is the total value of Bitcoin BEP20 locked as collateral in the system, given in BBTC and USD.`
    },
    {
      label: 'Troves',
      value: troveInfo.troveSize ? formatBigNumber(troveInfo.troveSize) : '--',
      tips: `The total number of active Troves in the system.`
    },
    {
      label: `${troveInfo.stableToken.symbol?.toLocaleUpperCase()} Supply`,
      value: totalSupply?.toSignificant(2) || '--',
      tips: `The total ${troveInfo.stableToken.symbol?.toLocaleUpperCase()} minted by the BounceClub Protocol.`
    },
    {
      label: `${troveInfo.stableToken.symbol?.toLocaleUpperCase()} in Stability Pool`,
      value: stabilityPoolInfo.stableCoinAmountInStabilityPool?.toSignificant() || '--',
      tips: `The total ${troveInfo.stableToken.symbol?.toLocaleUpperCase()} currently held in the Stability Pool, expressed as an amount and a fraction of the ${troveInfo.stableToken.symbol?.toLocaleUpperCase()} supply.`
    },
    {
      label: 'Total Collateral Ratio',
      value: `${
        (troveInfo.troveSize && troveInfo.troveSize.gt('0') && troveInfo.TCR?.div(1e18).times(100)?.toFixed(2)) || '--'
      }%`,
      tips: `The ratio of the Dollar value of the entire system collateral at the current BBTC:USD price, to the entire system debt.`
    },
    {
      label: 'Recovery Mode',
      value: troveInfo.isRecoveryMode ? 'YES' : 'NO',
      tips: `Recovery Mode is activated when the Total Collateral Ratio (TCR) falls below 150%. When active, your Trove can be liquidated if its collateral ratio is below the TCR. The maximum collateral you can lose from liquidation is capped at 110% of your Trove's debt. Operations are also restricted that would negatively impact the TCR.`
    },
    {
      label: 'Recovery Mode Price Threshold',
      value: `$${liquidateAmount ? formatBigNumber(liquidateAmount, 2) : '--'}`,
      tips: `The Dollar value of BBTC below which the Total Collateral Ratio will drop below 150% and the system will enter Recovery Mode..`
    }
  ]

  return (
    <Stack
      sx={{
        width: isMd ? 'fit-content' : 330,
        height: 'fit-content',
        padding: isMd ? '12px 8px' : '24px 16px',
        background: 'var(--ps-neutral2)',
        borderRadius: '12px'
      }}
    >
      {isMd ? (
        <Accordion>
          <AccordionSummary expandIcon={<ExpandMoreIcon />} aria-controls="panel2-content" id="panel2-header">
            <Typography fontSize={32} width={'100%'} textAlign={'center'}>
              Dashboard
            </Typography>
          </AccordionSummary>
          <AccordionDetails>
            <Stack>
              {/* <Stack spacing={8}>
                {(troveInfo.userDebtAmount?.equalTo('0') || !troveInfo.userDebtAmount) && (
                  <Typography fontSize={24} color={'#1FC64E'} fontWeight={600} width={'100%'} textAlign={'center'}>
                    --%
                  </Typography>
                )}
                {troveInfo.userDebtAmount?.greaterThan('0') &&
                  troveInfo.userCollateralRatio?.mul(100)?.greaterThan('150') && (
                    <Typography fontSize={24} color={'#1FC64E'} fontWeight={600} width={'100%'} textAlign={'center'}>
                      {troveInfo.userCollateralRatio.mul(100).toFixed(2)}%
                    </Typography>
                  )}
                {troveInfo.userDebtAmount?.greaterThan('0') &&
                  troveInfo.userCollateralRatio?.mul(100)?.lessThan('110') && (
                    <Typography fontSize={24} color={'#D12A1F'} fontWeight={600} width={'100%'} textAlign={'center'}>
                      {troveInfo.userCollateralRatio.mul(100).toFixed(2)}%
                    </Typography>
                  )}
                {troveInfo.userDebtAmount?.greaterThan('0') &&
                  troveInfo.userCollateralRatio?.mul(100)?.greaterThan('110') &&
                  troveInfo.userCollateralRatio?.mul(100)?.lessThan('150') && (
                    <Typography fontSize={24} color={'#F7931B'} fontWeight={600} width={'100%'} textAlign={'center'}>
                      {troveInfo.userCollateralRatio.mul(100).toFixed(2)}%
                    </Typography>
                  )}
                <Stack direction={'row'} justifyContent={'center'} spacing={8} alignItems={'center'}>
                  <Typography fontSize={16}>Your Current Collateral Ratio</Typography>
                  <ItemWithTooltip
                    text="&nbsp;"
                    title={`
                    The ratio between the dollar value of the collateral and the debt (in
                    ${troveInfo.stableToken.symbol?.toLocaleUpperCase()}) you are depositing. While the Minimum
                    Collateral Ratio is 110% during normal operation, it is recommended to keep the Collateral Ratio
                    always above 150% to avoid liquidation under Recovery Mode. A Collateral Ratio above 200% or 250% is
                    recommended for additional safety.`}
                  />
                </Stack>
                <ProgressIcon style={{ margin: '8px auto 0' }} />
                <Stack direction={'row'} justifyContent={'space-between'} alignItems={'center'}>
                  <Typography fontSize={12} color={'#FFFFFF99'}>
                    Liquidate: 110%
                  </Typography>
                  <Typography fontSize={12} color={'#FFFFFF99'}>
                    Safe: 150%
                  </Typography>
                </Stack>
              </Stack> */}
              <Stack sx={{ width: '100%', border: '0.5px solid #FFFFFF1A', margin: '16px 0 !important' }} />
            </Stack>
            <Stack>
              <Stack spacing={16}>
                {tokenInfoList.map((item, index) => (
                  <Stack
                    direction={'row'}
                    alignItems={'center'}
                    justifyContent={'space-between'}
                    key={index}
                    sx={{
                      background: '#FFFFFF0D',
                      borderRadius: '4px',
                      padding: '12px 16px',
                      ' p': {
                        fontSize: 14,
                        fontWeight: 550
                      }
                    }}
                  >
                    <Stack>
                      {item.icon ? (
                        <Image src={item.icon} width={24} style={{ borderRadius: '50%' }} alt="bbtc" />
                      ) : (
                        <CurrencyLogo currencyOrAddress={item.address} />
                      )}
                      <p>{item.name}</p>
                    </Stack>
                    <Stack>
                      <p style={{ textAlign: 'right' }}>${item?.price?.toSignificant()}</p>
                      <p>{item?.text}</p>
                    </Stack>
                  </Stack>
                ))}
              </Stack>
              <Stack sx={{ width: '100%', border: '0.5px solid #FFFFFF1A', margin: '16px 0 !important' }} />
              <Stack spacing={16}>
                <Typography fontSize={18}>Protocol</Typography>
                <Stack spacing={8}>
                  {descriptions.map((item, index) => (
                    <Stack
                      key={index}
                      display={'grid'}
                      gridTemplateColumns={'1fr 1fr'}
                      direction={'row'}
                      justifyContent={'space-between'}
                      alignItems={'center'}
                      spacing={8}
                    >
                      <ItemWithTooltip text={item.label} title={item.tips} />
                      <Typography fontSize={14} textAlign={'right'}>
                        {item.value}
                      </Typography>
                    </Stack>
                  ))}
                  <Stack direction={'row'} justifyContent={'space-between'} alignItems={'center'}>
                    <Typography fontSize={14} color={'#FFFFFF99'}>
                      Contract
                    </Typography>
                    <Typography
                      color={'#FFFFFF'}
                      fontSize={14}
                      display={'flex'}
                      flexDirection={'row'}
                      justifyContent={'flex-end'}
                      alignItems={'center'}
                      gap={4}
                    >
                      <span>{stablePoolContractAddr ? shortenAddress(stablePoolContractAddr) : ''}</span>
                      <Copy toCopy={stablePoolContractAddr || ''} />
                      <RedirectIcon
                        style={{ marginLeft: '-10px', cursor: 'pointer' }}
                        onClick={() =>
                          window.open(
                            getEtherscanLink(
                              chainId || SupportedChainId.BB_MAINNET,
                              stablePoolContractAddr || '',
                              'address'
                            ),
                            '_blank'
                          )
                        }
                      />
                    </Typography>
                  </Stack>
                </Stack>
              </Stack>
            </Stack>
            <Stack sx={{ width: '100%', border: '0.5px solid #FFFFFF1A', margin: '16px 0 !important' }} />
            <Stack spacing={16}>
              <Typography fontSize={15}>Wallet Balance</Typography>
              {userAssetList.map(item => (
                <Stack
                  direction={'row'}
                  alignItems={'center'}
                  justifyContent={'space-between'}
                  key={item.id}
                  sx={{
                    background: '#FFFFFF0D',
                    borderRadius: '8px',
                    padding: '12px 16px',
                    ' p': {
                      fontSize: 14,
                      fontWeight: 550
                    }
                  }}
                >
                  <Stack direction={'row'} alignItems={'center'} spacing={8}>
                    {item.icon ? (
                      <Image src={item.icon} width={24} style={{ borderRadius: '50%' }} alt="bbtc" />
                    ) : (
                      <CurrencyLogo currencyOrAddress={item.tokenAddr} />
                    )}
                    <Typography>{item.tokenSymbol?.toLocaleUpperCase()}</Typography>
                  </Stack>
                  <Stack direction={'column'} spacing={4} justifyContent={'flex-end'}>
                    <Typography textAlign={'right'}>
                      {item.balance?.toSignificant(6) === '0' ? '0.00' : item.balance?.toSignificant(6) || '0.00'}
                    </Typography>
                    <Typography textAlign={'right'}>${item.usdBalance?.toSignificant(6)}</Typography>
                  </Stack>
                </Stack>
              ))}
            </Stack>
          </AccordionDetails>
        </Accordion>
      ) : (
        <>
          <Typography fontSize={32} width={'100%'} textAlign={'center'}>
            Dashboard
          </Typography>
          <Stack>
            {/* <Stack spacing={8}>
              {(troveInfo.userDebtAmount?.equalTo('0') || !troveInfo.userDebtAmount) && (
                <Typography fontSize={24} color={'#1FC64E'} fontWeight={600} width={'100%'} textAlign={'center'}>
                  --%
                </Typography>
              )}
              {troveInfo.userDebtAmount?.greaterThan('0') &&
                troveInfo.userCollateralRatio?.mul(100)?.greaterThan('150') && (
                  <Typography fontSize={24} color={'#1FC64E'} fontWeight={600} width={'100%'} textAlign={'center'}>
                    {troveInfo.userCollateralRatio.mul(100).toFixed(2)}%
                  </Typography>
                )}
              {troveInfo.userDebtAmount?.greaterThan('0') &&
                troveInfo.userCollateralRatio?.mul(100)?.lessThan('110') && (
                  <Typography fontSize={24} color={'#D12A1F'} fontWeight={600} width={'100%'} textAlign={'center'}>
                    {troveInfo.userCollateralRatio.mul(100).toFixed(2)}%
                  </Typography>
                )}
              {troveInfo.userDebtAmount?.greaterThan('0') &&
                troveInfo.userCollateralRatio?.mul(100)?.greaterThan('110') &&
                troveInfo.userCollateralRatio?.mul(100)?.lessThan('150') && (
                  <Typography fontSize={24} color={'#F7931B'} fontWeight={600} width={'100%'} textAlign={'center'}>
                    {troveInfo.userCollateralRatio.mul(100).toFixed(2)}%
                  </Typography>
                )}
              <Stack direction={'row'} justifyContent={'center'} spacing={8} alignItems={'center'}>
                <Typography fontSize={16}>Your Current Collateral Ratio</Typography>
                <ItemWithTooltip
                  text="&nbsp;"
                  title={`
                    The ratio between the dollar value of the collateral and the debt (in
                    ${troveInfo.stableToken.symbol?.toLocaleUpperCase()}) you are depositing. While the Minimum
                    Collateral Ratio is 110% during normal operation, it is recommended to keep the Collateral Ratio
                    always above 150% to avoid liquidation under Recovery Mode. A Collateral Ratio above 200% or 250% is
                    recommended for additional safety.`}
                />
              </Stack>
              <ProgressIcon style={{ margin: '8px auto 0' }} />
              <Stack direction={'row'} justifyContent={'space-between'} alignItems={'center'}>
                <Typography fontSize={12} color={'#FFFFFF99'}>
                  Liquidate: 110%
                </Typography>
                <Typography fontSize={12} color={'#FFFFFF99'}>
                  Safe: 150%
                </Typography>
              </Stack>
            </Stack> */}
            <Stack sx={{ width: '100%', border: '0.5px solid #FFFFFF1A', margin: '16px 0 !important' }} />
          </Stack>
          <Stack>
            <Stack spacing={16}>
              {tokenInfoList.map((item, index) => (
                <Stack
                  direction={'row'}
                  alignItems={'center'}
                  justifyContent={'space-between'}
                  key={index}
                  sx={{
                    background: '#FFFFFF0D',
                    borderRadius: '4px',
                    padding: '12px 16px',
                    ' p': {
                      fontSize: 14,
                      fontWeight: 550
                    }
                  }}
                >
                  <Stack>
                    {item.icon ? (
                      <Image src={item.icon} width={24} style={{ borderRadius: '50%' }} alt="bbtc" />
                    ) : (
                      <CurrencyLogo currencyOrAddress={item.address} />
                    )}
                    <p>{item.name}</p>
                  </Stack>
                  <Stack>
                    <p style={{ textAlign: 'right' }}>${item?.price?.toSignificant()}</p>
                    <p>{item?.text}</p>
                  </Stack>
                </Stack>
              ))}
            </Stack>
            <Stack sx={{ width: '100%', border: '0.5px solid #FFFFFF1A', margin: '16px 0 !important' }} />
            <Stack spacing={16}>
              <Typography fontSize={18}>Protocol</Typography>
              <Stack spacing={8}>
                {descriptions.map((item, index) => (
                  <Stack
                    key={index}
                    display={'grid'}
                    gridTemplateColumns={'1fr 1fr'}
                    direction={'row'}
                    justifyContent={'space-between'}
                    alignItems={'center'}
                    spacing={8}
                  >
                    <ItemWithTooltip text={item.label} title={item.tips} />
                    <Typography fontSize={14} textAlign={'right'}>
                      {item.value}
                    </Typography>
                  </Stack>
                ))}
                <Stack direction={'row'} justifyContent={'space-between'} alignItems={'center'}>
                  <Typography fontSize={14} color={'#FFFFFF99'}>
                    Contract
                  </Typography>
                  <Typography
                    color={'#FFFFFF'}
                    fontSize={14}
                    display={'flex'}
                    flexDirection={'row'}
                    justifyContent={'flex-end'}
                    alignItems={'center'}
                    gap={4}
                  >
                    <span>{stablePoolContractAddr ? shortenAddress(stablePoolContractAddr) : ''}</span>
                    <Copy toCopy={stablePoolContractAddr || ''} />
                    <RedirectIcon
                      style={{ marginLeft: '-10px', cursor: 'pointer' }}
                      onClick={() =>
                        window.open(
                          getEtherscanLink(
                            chainId || SupportedChainId.BB_MAINNET,
                            stablePoolContractAddr || '',
                            'address'
                          ),
                          '_blank'
                        )
                      }
                    />
                  </Typography>
                </Stack>
              </Stack>
            </Stack>
          </Stack>
          <Stack sx={{ width: '100%', border: '0.5px solid #FFFFFF1A', margin: '16px 0 !important' }} />
          <Stack spacing={16}>
            <Typography fontSize={15}>Wallet Balance</Typography>
            {userAssetList.map(item => (
              <Stack
                direction={'row'}
                alignItems={'center'}
                justifyContent={'space-between'}
                key={item.id}
                sx={{
                  background: '#FFFFFF0D',
                  borderRadius: '8px',
                  padding: '12px 16px',
                  ' p': {
                    fontSize: 14,
                    fontWeight: 550
                  }
                }}
              >
                <Stack direction={'row'} alignItems={'center'} spacing={8}>
                  {item.icon ? (
                    <Image src={item.icon} width={24} style={{ borderRadius: '50%' }} alt="bbtc" />
                  ) : (
                    <CurrencyLogo currencyOrAddress={item.tokenAddr} />
                  )}
                  <Typography>{item.tokenSymbol?.toLocaleUpperCase()}</Typography>
                </Stack>
                <Stack direction={'column'} spacing={4} justifyContent={'flex-end'}>
                  <Typography textAlign={'right'}>
                    {item.balance?.toSignificant(6) === '0' ? '0.00' : item.balance?.toSignificant(6) || '0.00'}
                  </Typography>
                  <Typography textAlign={'right'}>${item.usdBalance?.toSignificant(6) || 0}</Typography>
                </Stack>
              </Stack>
            ))}
          </Stack>
        </>
      )}
    </Stack>
  )
}
