import BaseDialog from 'components/Dialog/baseDialog'
import { LockInfo } from 'api/toolbox/type'
import { useEffect, useMemo } from 'react'
import { useTokenLockInfo } from 'plugins/tokenToolBox/hook/useTokenLockInfo'
import { useToken } from 'hooks/useToken'
import { Box, Button, Stack, Typography, styled } from '@mui/material'
import { useActiveWeb3React } from 'hooks'
import { useUserInfo } from 'state/user/hooks'
import { CurrencyAmount } from 'constants/token'
import { ILockType } from 'plugins/tokenToolBox/type'
// import dynamic from 'next/dynamic'
import Image from 'next/image'
import NoTokenIconSvg from 'plugins/tokenToolBox/assets/toolBox/tokeninfo_no_icon.svg'
import NoTokenIconMdSvg from 'plugins/tokenToolBox/assets/toolBox/tokeninfo_no_icon_md.svg'

import {
  useReleasaData,
  useReleasaNoLiearData,
  useReleasableERC20,
  useReleasableVestingERC20,
  useWithDrawByTokenLock
} from 'plugins/tokenToolBox/hook/useTokenTimelock'
import useCountDown from 'ahooks/lib/useCountDown'
import ConnectWalletButton from './ConnectWalletButton'
import SwitchNetworkButton from './SwitchNetworkButton'
import { NETWORK_CHAIN_ID, SupportedChainId } from 'constants/chains'
import dayjs from 'dayjs'
// const LineChartSection = dynamic(() => import('./lineChart'), { ssr: false })
// import TimeStageLine from './timeStageLine'
import { RowItem, SectionItem } from './ComonComponents'
import Copy from 'components/essential/Copy'
import Tooltip from 'components/Tooltip'
import useBreakpoint from 'hooks/useBreakpoint'
import { useGetPairToken } from './SelectToken'
import DoubleCurrencyLogo from 'components/essential/CurrencyLogo/DoubleLogo'

const WithdrawBtnForLinear = ({
  toWithDraw,
  data,
  countdown
}: {
  toWithDraw: () => void
  data: LockInfo
  countdown: number
}) => {
  const releasableNum = useReleasableVestingERC20(data?.deployContract || '', NETWORK_CHAIN_ID || undefined)
  const isReleasable = useMemo(() => {
    return Number(releasableNum) !== 0
  }, [releasableNum])
  if (!data) {
    return <></>
  }
  return (
    <Button
      sx={{ width: '100%', mt: 40 }}
      variant="contained"
      disabled={!isReleasable}
      onClick={() => {
        toWithDraw()
      }}
    >
      {Number(releasableNum) === 0 && countdown <= 0 ? 'Withdrawn' : 'Withdraw'}
    </Button>
  )
}
const WithdrawBtnForNotLinear = ({
  toWithDraw,
  data,
  countdown
}: {
  toWithDraw: () => void
  data: LockInfo
  countdown: number
}) => {
  const releasableNum = useReleasableERC20(data?.deployContract || '', NETWORK_CHAIN_ID || undefined)
  const tokenInfo = useToken(data?.token || data?.token || data?.token, NETWORK_CHAIN_ID)

  const isReleasable = useMemo(() => {
    return tokenInfo && Number(releasableNum) !== 0
  }, [releasableNum, tokenInfo])

  if (!data) {
    return <></>
  }

  return (
    <Button
      sx={{ width: '100%', mt: 40 }}
      variant="contained"
      disabled={!isReleasable}
      onClick={() => {
        toWithDraw()
      }}
    >
      {Number(releasableNum) === 0 && countdown <= 0 ? 'Withdrawn' : 'Withdraw'}
    </Button>
  )
}

const ShowTokenImg = ({ item }: { item: LockInfo }) => {
  const isMd = useBreakpoint('md')
  const { token0Address, token1Address } = useGetPairToken(item.token)

  if (token0Address) {
    return (
      <DoubleCurrencyLogo
        size={isMd ? 40 : 64}
        currency0={token0Address || undefined}
        currency1={token1Address || undefined}
      />
    )
  }
  return item.logoUri ? (
    <Box>
      <Image src={item.logoUri} alt={`${item?.title || 'token'} logo`} width={isMd ? 40 : 64} height={isMd ? 40 : 64} />
    </Box>
  ) : isMd ? (
    <NoTokenIconMdSvg />
  ) : (
    <NoTokenIconSvg />
  )
}

const Detail = ({ data, chain }: { data: LockInfo; chain: SupportedChainId }) => {
  const isMd = useBreakpoint('md')
  const { account, chainId } = useActiveWeb3React()
  const userinfo = useUserInfo()
  const tokenInfo = useToken(data?.token || '', chain)
  const showAmount = useMemo(() => {
    return tokenInfo ? CurrencyAmount.fromRawAmount(tokenInfo, data?.amount || '0')?.toExact() : '--'
  }, [data?.amount, tokenInfo])
  const replasetype = useMemo(() => {
    const type = data?.lockType
    switch (type) {
      case ILockType.Normal:
        return 'Normal'
      case ILockType.Linear:
        return 'Linear'
      case ILockType.Stage:
        return 'Stage'
      default:
        return '--'
    }
  }, [data?.lockType])
  const { token0Address, token1Address } = useGetPairToken(data?.token)
  const token0 = useToken(token0Address)
  const token1 = useToken(token1Address)
  const useReleasaHook = data.lockType === ILockType.Linear ? useReleasaData : useReleasaNoLiearData
  const { linearData, noLiearData } = useReleasaHook(data.deployContract, chain || undefined)
  const targetTime = useMemo(() => {
    if (!data.lockType) return null
    if (data.lockType === ILockType.Linear) {
      return linearData?.startAt ? dayjs.unix(linearData?.endAt).utc().format('YYYY-MM-DD HH:mm:ss') : '--'
    }
    return noLiearData[0] ? dayjs.unix(noLiearData[0].releaseTime).utc().format('YYYY-MM-DD HH:mm:ss') : '--'
  }, [data.lockType, linearData?.endAt, linearData?.startAt, noLiearData])

  const [countdown, { days, hours, minutes, seconds }] = useCountDown({
    targetDate: targetTime
  })

  const isCurrentChainEqualChainOfPool = useMemo(() => {
    return Number(chainId) === chain
  }, [chainId, chain])

  const toWithDraw = useWithDrawByTokenLock(data?.deployContract || '', userinfo.box?.boxAddress, chain)

  const BidBlock = () => {
    if (!account) {
      return <ConnectWalletButton />
    }
    if (!isCurrentChainEqualChainOfPool) {
      return <SwitchNetworkButton targetChain={chain || 0} />
    }
    return (
      <>
        {isCurrentChainEqualChainOfPool && replasetype === 'Linear' && data && (
          <WithdrawBtnForLinear toWithDraw={toWithDraw} data={data} countdown={countdown} />
        )}
        {isCurrentChainEqualChainOfPool && replasetype !== 'Linear' && data && (
          <WithdrawBtnForNotLinear toWithDraw={toWithDraw} data={data} countdown={countdown} />
        )}
      </>
    )
  }

  return (
    <BaseDialog mt={0} minWidth={850} onClose={() => {}}>
      <Stack gap={32}>
        <Stack flexDirection={'row'} alignItems={'center'} gap={20}>
          <ShowTokenImg item={data} />
          <Typography
            fontFamily={'IBM Plex Sans'}
            color={'var(--ps-text-100)'}
            fontSize={28}
            fontWeight={500}
            lineHeight={1.4}
            style={{
              width: isMd ? 230 : 650,
              whiteSpace: 'nowrap',
              overflow: 'hidden',
              textOverflow: 'ellipsis'
            }}
          >
            {tokenInfo?.name?.replace(/Uniswap/g, 'Bitswap')}
          </Typography>
        </Stack>

        <SectionItem label="Token Information">
          <RowItem direction={isMd ? 'column' : 'row'} label="Contract address">
            <Stack gap={6} direction={'row'} width={'100%'} alignItems={'center'} justifyContent={'space-between'}>
              <Typography
                sx={{
                  'word-wrap': 'break-word'
                }}
                fontFamily={'IBM Plex Sans'}
                width={isMd ? 258 : undefined}
                fontSize={isMd ? 15 : 16}
                fontWeight={400}
                lineHeight={1.4}
                color={'var(--ps-text-100)'}
              >
                {tokenInfo?.address || data?.deployContract || '--'}
              </Typography>
              <Tooltip title="Copy address" placement="top">
                <Copy toCopy={tokenInfo?.address || data?.deployContract} />
              </Tooltip>
            </Stack>
          </RowItem>
          <RowItem direction={isMd ? 'column' : 'row'} label="Token Name">
            <Typography
              fontFamily={'IBM Plex Sans'}
              fontSize={isMd ? 15 : 16}
              fontWeight={400}
              lineHeight={1.4}
              color={'var(--ps-text-100)'}
              style={{
                textAlign: isMd ? 'left' : 'right',
                width: isMd ? '100%' : 650,
                whiteSpace: 'nowrap',
                overflow: 'hidden',
                textOverflow: 'ellipsis'
              }}
            >
              {tokenInfo?.name || '--'}
            </Typography>
          </RowItem>
          <RowItem direction={isMd ? 'column' : 'row'} label="Token symbol">
            <Typography
              fontFamily={'IBM Plex Sans'}
              fontSize={isMd ? 15 : 16}
              fontWeight={400}
              lineHeight={1.4}
              color={'var(--ps-text-100)'}
              style={{
                textAlign: isMd ? 'left' : 'right',
                width: isMd ? '100%' : 650,
                whiteSpace: 'nowrap',
                overflow: 'hidden',
                textOverflow: 'ellipsis'
              }}
            >
              {token0 ? `${token0?.symbol} / ${token1?.symbol}` : tokenInfo?.symbol || '--'}
            </Typography>
          </RowItem>
          <RowItem direction={isMd ? 'column' : 'row'} label="Token decimal" hasBorderBottom={false}>
            <Typography
              fontFamily={'IBM Plex Sans'}
              fontSize={isMd ? 15 : 16}
              fontWeight={400}
              lineHeight={1.4}
              color={'var(--ps-text-100)'}
            >
              {tokenInfo?.decimals || '--'}
            </Typography>
          </RowItem>
        </SectionItem>

        <SectionItem label="Lock Information">
          <RowItem direction={isMd ? 'column' : 'row'} label="Title">
            <Typography
              fontFamily={'IBM Plex Sans'}
              fontSize={isMd ? 15 : 16}
              fontWeight={400}
              lineHeight={1.4}
              color={'var(--ps-text-100)'}
            >
              {data?.title || '--'}
            </Typography>
          </RowItem>
          <RowItem direction={isMd ? 'column' : 'row'} label="Amount">
            <Typography
              fontFamily={'IBM Plex Sans'}
              fontSize={isMd ? 15 : 16}
              fontWeight={400}
              lineHeight={1.4}
              color={'var(--ps-text-100)'}
            >
              {showAmount || '--'}
            </Typography>
          </RowItem>
          <RowItem direction={isMd ? 'column' : 'row'} label="Owner">
            <Typography
              sx={{
                'word-wrap': 'break-word'
              }}
              fontSize={isMd ? 15 : 16}
              fontWeight={400}
              lineHeight={1.4}
              color={'var(--ps-text-100)'}
              fontFamily={'IBM Plex Sans'}
            >
              {data?.newOwner || '--'}
            </Typography>
          </RowItem>
          <RowItem direction={isMd ? 'column' : 'row'} label="Lock Model">
            <Typography
              fontFamily={'IBM Plex Sans'}
              fontSize={isMd ? 15 : 16}
              fontWeight={400}
              lineHeight={1.4}
              color={'var(--ps-text-100)'}
            >
              {replasetype}
            </Typography>
          </RowItem>
          <RowItem direction={isMd ? 'column' : 'row'} label="Lock date">
            <Typography
              fontFamily={'IBM Plex Sans'}
              fontSize={isMd ? 15 : 16}
              fontWeight={400}
              lineHeight={1.4}
              color={'var(--ps-text-100)'}
            >
              {data.txTs ? dayjs.unix(data.txTs).format('YYYY-MM-DD HH:mm:ss') : '--'}
            </Typography>
          </RowItem>

          {replasetype === 'Normal' && (
            <RowItem direction={isMd ? 'column' : 'row'} label="Unlock time" hasBorderBottom={false}>
              <Typography
                fontFamily={'IBM Plex Sans'}
                fontSize={isMd ? 15 : 16}
                fontWeight={400}
                lineHeight={1.4}
                color={'var(--ps-text-100)'}
              >
                {noLiearData[0]
                  ? dayjs.unix(noLiearData[0].releaseTime).utc().isValid()
                    ? dayjs.unix(noLiearData[0].releaseTime).utc().format('YYYY-MM-DD HH:mm:ss')
                    : '--'
                  : '--'}
              </Typography>
            </RowItem>
          )}

          {/* {replasetype === 'Linear' && (
            <RowItem direction={isMd ? 'column' : 'row'} label="Time" hasBorderBottom={false}>
              <Typography
                fontFamily={'IBM Plex Sans'}
                fontSize={isMd ? 15 : 16}
                fontWeight={400}
                lineHeight={1.4}
                color={'var(--ps-text-100)'}
              >
                {linearData?.startAt ? dayjs.unix(linearData?.startAt).format('YYYY-MM-DD HH:mm:ss') : '--'}
                {' to '}
                {linearData?.endAt ? dayjs.unix(linearData?.endAt).format('YYYY-MM-DD HH:mm:ss') : '--'}
              </Typography>
            </RowItem>
          )}
          {replasetype === 'Linear' && tokenInfo && data && (
            <LineChartSection lockToken={tokenInfo} lockInfo={data}></LineChartSection>
          )}

          {replasetype === 'Stage' && tokenInfo && noLiearData && <TimeStageLine stageData={noLiearData} />} */}

          {replasetype === 'Normal' && countdown > 0 && (
            <Box mt={32}>
              <SectionItem label="Unlock">
                {replasetype === 'Normal' && countdown > 0 ? (
                  <Stack width={'100%'} flexDirection={'row'} gap={12}>
                    <CountDownBg key={'banner0'}>{days}D</CountDownBg>
                    <CountDownBg key={'banner1'}>{hours}H</CountDownBg>
                    <CountDownBg key={'banner2'}>{minutes}M</CountDownBg>
                    <CountDownBg key={'banner3'}>{seconds}S</CountDownBg>
                  </Stack>
                ) : (
                  <></>
                )}
              </SectionItem>
            </Box>
          )}
          <BidBlock />
        </SectionItem>
      </Stack>
    </BaseDialog>
  )
}

const TokenLockerInfo = ({ chainId: chain, hash }: { chainId: string; hash: string }) => {
  const chainIdToNumber = Number(chain as string)
  const { data, loading, run } = useTokenLockInfo(chainIdToNumber, hash as string)
  useEffect(() => {
    if (!loading && (!data || (Array.isArray(data) && data.length === 0))) {
      setTimeout(() => {
        run()
      }, 3000)
    }
    return () => {}
  }, [data, loading, run])
  const tokenInfo = useToken(data?.token || '', chainIdToNumber)

  if (loading || !data || !tokenInfo) {
    return (
      <Box sx={{ height: 300 }} display={'flex'} alignItems="center" justifyContent="center">
        loading
      </Box>
    )
  }
  return <>{data && <Detail data={data} chain={NETWORK_CHAIN_ID} />}</>
}

const CountDownBg = styled(Box)`
  font-family: 'IBM Plex Sans';
  display: flex;
  padding: 24px 10px;
  justify-content: center;
  align-items: center;
  gap: 4px;
  flex: 1 0 0;
  border-radius: 12px;
  background: var(--ps-text-10);
  backdrop-filter: blur(2px);
  color: var(--ps-text-100);
  font-variant-numeric: lining-nums proportional-nums;
  font-family: 'IBM Plex Sans';
  font-size: 40px;
  font-style: normal;
  font-weight: 700;
  line-height: 140%;
  backdrop-filter: blur(2px);

  ${props => props.theme.breakpoints.down('md')} {
    font-size: 24px;
    border-radius: 4px;
    backdrop-filter: blur(2px);
    padding: 24px 10px;
  }
`
export default TokenLockerInfo
