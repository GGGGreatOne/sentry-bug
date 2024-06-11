import { Box, styled, Grid, Stack, Typography, IconButton } from '@mui/material'
import { ReactNode, useMemo, useState } from 'react'
import AddIcon from 'plugins/tokenToolBox/assets/toolBox/addIcon.svg'
import RightArrow from 'plugins/tokenToolBox/assets/toolBox/right_arrow.svg'
import { useRouter } from 'next/router'
import { ROUTES } from 'constants/routes'
import Table from 'plugins/tokenToolBox/pages/components/Table'
import { viewControl } from '../modal'
import { useTokenList } from 'plugins/tokenToolBox/hook/useTokenList'
import { useUserInfo } from 'state/user/hooks'
import { shortenAddress } from 'utils'
import ExportMoreSvg from 'assets/svg/export_more.svg'
import Menu from 'components/Menu'
import { NETWORK_CHAIN_ID, SupportedChainId } from 'constants/chains'
import Spinner from 'components/Spinner'
import { Currency } from 'constants/token'
import { useActiveWeb3React } from 'hooks'
import Copy from 'components/essential/Copy'
import Tooltip from 'components/Tooltip'
import useBreakpoint from 'hooks/useBreakpoint'
import { Swiper, SwiperSlide } from 'swiper/react'
import 'swiper/swiper-bundle.css'
import { ITokenListItem } from 'api/common/type'
import { useToken } from 'hooks/useToken'
import { TokenType } from 'api/common/type'
import DoubleCurrencyLogo from 'components/essential/CurrencyLogo/DoubleLogo'
import { useGetClubNetWorthList } from 'hooks/boxes/useGetClubNetWorthList'
import BigNumber from 'bignumber.js'
import { GetClubNetWorthListResult } from 'api/boxes/type'
import { IBoxesJsonData } from 'state/boxes/type'
// import CurrencyLogo from 'components/essential/CurrencyLogo'
import { useClubAuthCallback } from 'hooks/boxes/useClubAuthCallback'
import { useBoxFeeAmount, useClaimFee } from 'hooks/feeDistributor'
import { LoadingButton } from '@mui/lab'
import { ClubMemberMode } from 'hooks/boxes/types'
import { useWalletModalToggle } from 'state/application/hooks'
import { useGetPluginTokenList } from 'state/pluginTokenListConfig/hooks'
import Image from 'components/Image'
import HelpOutlineOutlinedIcon from '@mui/icons-material/HelpOutlineOutlined'
import EmptyData from 'components/EmptyData'

const TokenPairsLogo = ({
  token0Address,
  token1Address
}: {
  token0Address: string | undefined
  token1Address: string | undefined
}) => {
  const isMd = useBreakpoint('md')
  const token0 = useToken(token0Address || '')
  const token1 = useToken(token1Address || '')

  return (
    <Box display={'flex'} alignItems={'center'} width={'100'}>
      <DoubleCurrencyLogo size={20} currency0={token0 || undefined} currency1={token1 || undefined} />
      <Typography
        fontFamily={'IBM Plex Sans'}
        style={{
          width: isMd ? '45px' : '100px',
          whiteSpace: 'nowrap',
          overflow: 'hidden',
          textOverflow: 'ellipsis'
        }}
        color="var(--ps-text-100)"
        fontSize={13}
        fontWeight={400}
        lineHeight={1.4}
      >
        {token0 && token1 ? `${token0?.symbol} / ${token1?.symbol}` : ''}
      </Typography>
    </Box>
  )
}

const ShowTokenName = ({ item, run, boxAddress }: { item: ITokenListItem; run: () => void; boxAddress: string }) => {
  const { chainId, account } = useActiveWeb3React()
  const WalletModalToggle = useWalletModalToggle()
  const toTokenInfo = () => {
    if (!account || !chainId) {
      return WalletModalToggle()
    }
    viewControl.show('TokenInfo', {
      token: new Currency(
        chainId || SupportedChainId.BB_MAINNET,
        item.contractAddress || '',
        item.decimals || 18,
        item.tokenSymbol || '',
        item.tokenName,
        item.smallImg || ''
      ),
      boxAddress: boxAddress,
      token0Contract: item.token0Contract,
      token1Contract: item.token1Contract,
      tokenType: item.tokenType,
      hideCallBack: () => {
        run()
      },
      data: item
    })
  }

  if (item.tokenType === TokenType.V2LP || item.tokenType === TokenType.V3LP) {
    return (
      <Box sx={{ cursor: 'pointer' }} onClick={toTokenInfo}>
        <TokenPairsLogo token0Address={item.token0Contract} token1Address={item.token1Contract} />
      </Box>
    )
  }

  return (
    <Stack sx={{ cursor: 'pointer' }} onClick={toTokenInfo} flexDirection={'row'} alignItems={'center'} gap={13}>
      {item.smallImg ? (
        <Image
          style={{
            borderRadius: '50%'
          }}
          width={20}
          height={20}
          sizes="20px"
          src={item.smallImg}
          alt=""
        />
      ) : (
        <HelpOutlineOutlinedIcon />
        // <CurrencyLogo size={'20px'} currencyOrAddress={item.contractAddress} />
      )}
      <Box>
        <Typography
          style={{
            maxWidth: '90px',
            whiteSpace: 'nowrap',
            overflow: 'hidden',
            textOverflow: 'ellipsis'
          }}
          fontFamily={'IBM Plex Sans'}
          color="var(--ps-text-100)"
          fontSize={13}
          fontWeight={400}
          lineHeight={1.4}
          maxWidth={{ xs: '55px !important ', md: '100px !important' }}
        >
          {item.tokenName}
        </Typography>
      </Box>
    </Stack>
  )
}

const TokenItem = ({
  label,
  value,
  startNode,
  endNode
}: {
  label?: string
  value: string
  startNode?: ReactNode
  endNode?: ReactNode
}) => {
  return (
    <Stack gap={4}>
      <Typography color="var(--ps-neutral3)" fontSize={12} lineHeight={1.4} fontFamily={'IBM Plex Sans'}>
        {label}
      </Typography>
      <Stack flexDirection={'row'} alignItems={'center'} gap={12}>
        {startNode}
        <Typography color="var(--ps-text-100)" fontSize={13} lineHeight={1.4} fontFamily={'IBM Plex Sans'}>
          {value}
        </Typography>
        {endNode}
      </Stack>
    </Stack>
  )
}

const TokenRow = ({ item, run, boxAddress }: { item: ITokenListItem; run: () => void; boxAddress: string }) => {
  const { chainId, account } = useActiveWeb3React()
  const WalletModalToggle = useWalletModalToggle()

  const tokenCurrency = new Currency(
    chainId || SupportedChainId.BB_MAINNET,
    item.contractAddress || '',
    item.decimals || 18,
    item.tokenSymbol || '',
    item.tokenName,
    item.smallImg || ''
  )

  const toTokenInfo = () => {
    if (!account || !chainId) {
      return WalletModalToggle()
    }
    viewControl.show('TokenInfo', {
      token: tokenCurrency,
      token0Contract: item.token0Contract,
      token1Contract: item.token1Contract,
      tokenType: item.tokenType,
      boxAddress: boxAddress,
      hideCallBack: () => {
        run()
      },
      data: item
    })
  }

  const menuItemList = [
    {
      label: 'Detail',
      callBack: () => toTokenInfo()
    },
    {
      label: 'Lock',
      callBack: () => {
        if (!account || !chainId) {
          return WalletModalToggle()
        }
        const rfTokenCurrency = new Currency(
          chainId || SupportedChainId.BB_MAINNET,
          tokenCurrency.address || '',
          tokenCurrency.decimals || 18,
          tokenCurrency.symbol || '',
          tokenCurrency.name,
          tokenCurrency.logo || ''
        )
        viewControl.show('TokenLock', {
          tokenType: item.tokenType,
          chainId: NETWORK_CHAIN_ID,
          token: rfTokenCurrency,
          LockInfo: {
            name: item.tokenName
          },
          boxAddress: boxAddress,
          rKey: Math.random()
        })
      }
    },
    {
      label: 'Disperse',
      callBack: () => {
        if (!account || !chainId) {
          return WalletModalToggle()
        }
        const rfTokenCurrency = new Currency(
          chainId || SupportedChainId.BB_MAINNET,
          tokenCurrency.address || '',
          tokenCurrency.decimals || 18,
          tokenCurrency.symbol || '',
          tokenCurrency.name,
          tokenCurrency.logo || ''
        )
        viewControl.show('Disperse', {
          disperseType: 'token',
          token: rfTokenCurrency,
          urlChainParam: NETWORK_CHAIN_ID.toString(),
          boxAddress: boxAddress,
          rKey: Math.random()
        })
      }
    }
  ]

  return (
    <Stack gap={16}>
      <Stack flexDirection={'row'} justifyContent={'space-between'} alignItems={'center'}>
        <TokenItem value="" startNode={<ShowTokenName boxAddress={boxAddress} item={item} run={run} />} />
        <TokenItem
          value={shortenAddress(item.contractAddress)}
          endNode={item.contractAddress && <Copy toCopy={item.contractAddress} />}
        />
        {
          <Menu
            menuItemList={menuItemList}
            buttonChild={
              <ToolIconBox>
                <ExportMoreSvg />
              </ToolIconBox>
            }
            anchorOrigin={{
              vertical: 'bottom',
              horizontal: 'right'
            }}
            transformOrigin={{
              vertical: 'top',
              horizontal: 'right'
            }}
          />
        }
      </Stack>
    </Stack>
  )
}
const MdTokenList = ({ list, run, boxAddress }: { list: ITokenListItem[]; run: () => void; boxAddress: string }) => {
  return (
    <Stack
      gap={0}
      mt={17}
      sx={{
        height: '168px',
        overflowY: 'scroll',
        '::-webkit-scrollbar': {
          width: 0,
          display: 'none'
        },
        WebkitOverflowScrolling: 'touch',
        '-ms-overflow-style': 'none',
        'scrollbar-width': 'none'
      }}
    >
      {list.map(v => {
        return (
          <Box key={v.id}>
            <TokenRow boxAddress={boxAddress} key={v.id} run={run} item={v} />
            <Line />
          </Box>
        )
      })}
    </Stack>
  )
}

const staticTitle = ['Asset', 'Contract', '']
const TokenPairsList = ({ boxAddress, queryBoxId }: { boxAddress: string; queryBoxId: string | undefined }) => {
  const { run } = useGetPluginTokenList()
  const isMd = useBreakpoint('md')
  const userInfo = useUserInfo()
  const { chainId, account } = useActiveWeb3React()
  const WalletModalToggle = useWalletModalToggle()

  const tokenListData = useTokenList(
    queryBoxId ? Number(queryBoxId) : userInfo.box?.boxId ? Number(userInfo.box?.boxId) : undefined
  )
  const [headData] = useState(staticTitle)

  const filterData = useMemo(() => {
    return tokenListData?.pluginTokenList
      .filter(v => {
        return v.tokenType !== TokenType.V3LP
      })
      .filter(v => v.boxId !== '0')
  }, [tokenListData?.pluginTokenList])

  const List = useMemo(() => {
    return filterData?.map(v => {
      const tokenCurrency = new Currency(
        chainId || SupportedChainId.BB_MAINNET,
        v.contractAddress || '',
        v.decimals || 18,
        v.tokenSymbol || '',
        v.tokenName,
        v.smallImg || ''
      )
      const menuItemList = [
        {
          label: 'Lock',
          callBack: () => {
            if (!account || !chainId) {
              return WalletModalToggle()
            }
            const rfTokenCurrency = new Currency(
              chainId || SupportedChainId.BB_MAINNET,
              tokenCurrency.address || '',
              tokenCurrency.decimals || 18,
              tokenCurrency.symbol || '',
              tokenCurrency.name,
              tokenCurrency.logo || ''
            )
            viewControl.show('TokenLock', {
              tokenType: v.tokenType,
              chainId: NETWORK_CHAIN_ID,
              token: rfTokenCurrency,
              LockInfo: {
                name: v.tokenName
              },
              boxAddress: boxAddress,
              rKey: Math.random()
            })
          }
        },
        {
          label: 'Disperse',
          callBack: () => {
            if (!account || !chainId) {
              return WalletModalToggle()
            }
            const rfTokenCurrency = new Currency(
              chainId || SupportedChainId.BB_MAINNET,
              tokenCurrency.address || '',
              tokenCurrency.decimals || 18,
              tokenCurrency.symbol || '',
              tokenCurrency.name,
              tokenCurrency.logo || ''
            )
            viewControl.show('Disperse', {
              disperseType: 'token',
              token: rfTokenCurrency,
              urlChainParam: NETWORK_CHAIN_ID.toString(),
              boxAddress: boxAddress,
              rKey: Math.random()
            })
          }
        }
      ]

      return [
        <Cell key={v.tokenName}>
          <ShowTokenName boxAddress={boxAddress} item={v} run={run} />
        </Cell>,
        <Cell key={v.contractAddress}>
          <Typography
            fontFamily={'IBM Plex Sans'}
            color="var(--ps-text-100)"
            fontSize={15}
            fontWeight={500}
            lineHeight={'100%'}
          >
            {shortenAddress(v.contractAddress)}
          </Typography>
          <Tooltip title="Copy address" placement="top">
            <Copy toCopy={v.contractAddress} />
          </Tooltip>
        </Cell>,
        <Cell key={v.id}>
          {v.tokenType !== TokenType.V3LP && (
            <Stack width={'100%'} flexDirection={'row'} justifyContent={'end'}>
              {
                <Menu
                  menuItemList={menuItemList}
                  buttonChild={
                    <ToolIconBox>
                      <ExportMoreSvg />
                    </ToolIconBox>
                  }
                  anchorOrigin={{
                    vertical: 'bottom',
                    horizontal: 'right'
                  }}
                  transformOrigin={{
                    vertical: 'top',
                    horizontal: 'right'
                  }}
                />
              }
            </Stack>
          )}
        </Cell>
      ]
    })
  }, [WalletModalToggle, account, boxAddress, chainId, filterData, run])

  if (filterData?.length === 0) {
    return <EmptyData color="var(--ps-text-40)" height={150} />
  }
  return (
    <>
      {isMd &&
        (filterData ? (
          <MdTokenList run={run} list={filterData} boxAddress={boxAddress}></MdTokenList>
        ) : (
          <Stack width={'100%'} height={100} alignItems={'center'} justifyContent={'center'}>
            <Spinner />
          </Stack>
        ))}
      {!isMd && (
        <>
          {List ? (
            <StyleTable>
              <Table stickyHeader maxHeight={160} variant="outlined" header={headData} rows={List} />
            </StyleTable>
          ) : (
            <Stack width={'100%'} height={100} alignItems={'center'} justifyContent={'center'}>
              <Spinner />
            </Stack>
          )}
        </>
      )}
    </>
  )
}

const ClubNetWorthList = ({ clubNetWorthData }: { clubNetWorthData: GetClubNetWorthListResult | undefined }) => {
  const [headData] = useState(['App', 'Trading Valume', 'TVL'])

  const List = useMemo(() => {
    return clubNetWorthData?.list?.map(v => {
      const volume = new BigNumber(v.volume)
      const tvl = new BigNumber(v.tvl)
      return [
        <Cell key={v.plugin_id + v.pluginName}>
          <Typography fontFamily={'IBM Plex Sans'} fontSize={13} color="#30D69A">
            {v.pluginName}
          </Typography>
        </Cell>,
        <Cell key={v.plugin_id + v.volume}>
          <Typography fontFamily={'IBM Plex Sans'} fontSize={13} color="var(--ps-text-100)">
            {volume.isZero() ? '$0.00' : `$${volume.toFixed(2, BigNumber.ROUND_HALF_UP)}`}
          </Typography>
        </Cell>,
        <Cell key={v.plugin_id + v.tvl}>
          <Stack width={'100%'} flexDirection={'row'} justifyContent={'end'}>
            <Typography fontFamily={'IBM Plex Sans'} fontSize={13} color="var(--ps-text-100)">
              {tvl.isZero() ? '$0.00' : `$${tvl.toFixed(2, BigNumber.ROUND_HALF_UP)}`}
            </Typography>
          </Stack>
        </Cell>
      ]
    })
  }, [clubNetWorthData?.list])

  if (clubNetWorthData?.total === 0) {
    return <EmptyData color="var(--ps-text-40)" height={150} />
  }
  return (
    <>
      <StyleTable>
        <>
          {List ? (
            <Table stickyHeader maxHeight={128} variant="outlined" header={headData} rows={List} />
          ) : (
            <Stack width={'100%'} height={100} alignItems={'center'} justifyContent={'center'}>
              <Spinner />
            </Stack>
          )}
        </>
      </StyleTable>
    </>
  )
}

const DashboardBox = ({
  children,
  title,
  toolIcon,
  topNode,
  iconCb,
  nodeHeight,
  direction = 'row'
}: {
  children: ReactNode
  title: string
  toolIcon?: any
  topNode?: ReactNode
  iconCb?: () => void
  nodeHeight?: number
  direction?: 'column' | 'row'
}) => {
  const isMd = useBreakpoint('md')
  return (
    <Card height={240}>
      <Stack width={'100%'}>
        <Stack
          gap={direction === 'column' ? 12 : 0}
          flexDirection={direction}
          width={'100%'}
          justifyContent={'space-between'}
          flexWrap={'wrap'}
        >
          <Typography
            fontFamily={'IBM Plex Sans'}
            fontSize={isMd ? 15 : 20}
            lineHeight={1.3}
            fontWeight={500}
            color="var(--ps--text-100)"
          >
            {title}
          </Typography>
          <Box height={nodeHeight}>
            {toolIcon && <ToolIconBox onClick={iconCb}>{toolIcon || <RightArrow />}</ToolIconBox>}
            {topNode}
          </Box>
        </Stack>
        <Box>{children}</Box>
      </Stack>
    </Card>
  )
}

const ClaimFeeBlock = ({ boxAddress }: { boxAddress: string }) => {
  const { paymentToken, isClubOwner, memberMode } = useClubAuthCallback(boxAddress)
  const { amount, currencyAmount } = useBoxFeeAmount(boxAddress, paymentToken?.address)

  const { runWithModal: claimFee, submitted: claimFeeSubmitted } = useClaimFee(
    boxAddress,
    paymentToken?.address,
    currencyAmount
  )

  const isCanClaim = useMemo(() => {
    if (amount.gt(0)) {
      return true
    }
    return false
  }, [amount])

  if (!isClubOwner || memberMode !== ClubMemberMode.PAYMENT_MODE) {
    return null
  }

  return (
    <LoadingButton
      onClick={() => claimFee()}
      loading={claimFeeSubmitted.pending}
      disabled={!isCanClaim}
      variant="contained"
      size="small"
    >
      Claim {currencyAmount?.toSignificant() || '--'} {currencyAmount?.currency.symbol}
    </LoadingButton>
  )
}

const MainDashboard = ({
  draftInfo,
  isMine,
  boxAddress,
  feeAndReward,
  editing
}: {
  draftInfo?: IBoxesJsonData | null | undefined
  boxAddress: string
  isMine: boolean
  feeAndReward: { fee: string }
  editing?: boolean
}) => {
  const isMd = useBreakpoint('md')
  const router = useRouter()
  const userInfo = useUserInfo()
  const queryBoxId = router.query.clubId
  const { data: clubNetWorthData } = useGetClubNetWorthList({ boxId: (queryBoxId as string) || userInfo.box?.boxId })
  const totalVolume = new BigNumber(clubNetWorthData?.totalVolume || '0')
  const totalTvl = new BigNumber(clubNetWorthData?.totalTvl || '0')
  const fee = new BigNumber(feeAndReward?.fee || '0')

  return (
    <>
      {!isMd && (
        <Grid container columnSpacing={24}>
          <Grid item xs={4.5}>
            <DashboardBox
              nodeHeight={36}
              topNode={
                <Stack width={'100%'}>
                  <Stack flexDirection={'row'} justifyContent={'end'} gap={10}>
                    <Typography fontSize={15} fontFamily={'IBM Plex Sans'} color="var(--ps-neutral3)">
                      Total Trading Value
                    </Typography>
                    <Typography fontSize={15} fontFamily={'IBM Plex Sans'} color="#20994B">
                      $ {totalVolume.isZero() ? '0.00' : totalVolume.toFixed(2, BigNumber.ROUND_HALF_UP)}
                    </Typography>
                  </Stack>
                  <Stack width={'100%'} flexDirection={'row'} justifyContent={'end'} gap={10}>
                    <Typography fontSize={15} fontFamily={'IBM Plex Sans'} color="var(--ps-neutral3)">
                      Total TVL
                    </Typography>
                    <Typography fontSize={15} fontFamily={'IBM Plex Sans'} color="#20994B">
                      $ {totalTvl.isZero() ? '0.00' : totalTvl.toFixed(2, BigNumber.ROUND_HALF_UP)}
                    </Typography>
                  </Stack>
                </Stack>
              }
              title="Club Net Worth
"
              iconCb={() => router.push(ROUTES.account.myAssets)}
            >
              <ClubNetWorthList clubNetWorthData={clubNetWorthData} />
            </DashboardBox>
          </Grid>
          <Grid item xs={4.5}>
            <DashboardBox
              nodeHeight={36}
              title="Token List"
              toolIcon={isMine && editing ? <AddIcon /> : null}
              iconCb={() => (isMine && editing ? viewControl.show('TokenMinter', { draftInfo, boxAddress }) : () => {})}
            >
              <TokenPairsList queryBoxId={queryBoxId as string} boxAddress={boxAddress} />
            </DashboardBox>
          </Grid>
          <Grid item xs={3}>
            {/* <DashboardBox title="Fees & Reward">
              <></>
            </DashboardBox> */}
            <DashboardBox title="Fees" nodeHeight={36}>
              <Stack mt={16} gap={4}>
                <Typography color="var(--ps-neutral3)" fontSize={12} fontFamily={'IBM Plex Sans'}>
                  Fees Income
                </Typography>
                <Typography color="#30AD44" fontSize={13} fontFamily={'IBM Plex Sans'}>
                  $ {fee.isZero() ? '0.00' : fee.toFixed(2, BigNumber.ROUND_HALF_UP)}
                </Typography>
                <ClaimFeeBlock boxAddress={boxAddress} />
              </Stack>
            </DashboardBox>
          </Grid>
        </Grid>
      )}
      {isMd && (
        <MdContainer>
          <Swiper observeParents={true} observer={true} slidesPerView={1.1} spaceBetween={'16px'}>
            <SwiperSlide>
              <DashboardBox
                direction="column"
                title="Club Net Worth
"
                topNode={
                  <Stack>
                    <Stack flexDirection={'row'} justifyContent={'start'} gap={10}>
                      <Typography fontSize={15} fontFamily={'IBM Plex Sans'} color="var(--ps-neutral3)">
                        Total Trading Value
                      </Typography>
                      <Typography fontSize={15} fontFamily={'IBM Plex Sans'} color="#20994B">
                        $ {totalVolume.isZero() ? '0.00' : totalVolume.toFixed(2, BigNumber.ROUND_HALF_UP)}
                      </Typography>
                    </Stack>
                    <Stack flexDirection={'row'} justifyContent={'start'} gap={10}>
                      <Typography fontSize={15} fontFamily={'IBM Plex Sans'} color="var(--ps-neutral3)">
                        Total TVL
                      </Typography>
                      <Typography fontSize={15} fontFamily={'IBM Plex Sans'} color="#20994B">
                        $ {totalTvl.isZero() ? '0.00' : totalTvl.toFixed(2, BigNumber.ROUND_HALF_UP)}
                      </Typography>
                    </Stack>
                  </Stack>
                }
              >
                <ClubNetWorthList clubNetWorthData={clubNetWorthData} />
              </DashboardBox>
            </SwiperSlide>
            <SwiperSlide>
              <DashboardBox
                title="Token List"
                toolIcon={isMine ? <AddIcon /> : null}
                iconCb={() => viewControl.show('TokenMinter', { draftInfo, boxAddress })}
              >
                <TokenPairsList queryBoxId={queryBoxId as string} boxAddress={boxAddress} />
              </DashboardBox>
            </SwiperSlide>
            <SwiperSlide>
              {/* <DashboardBox title="Fees & Reward">
                <></>
              </DashboardBox> */}
              <DashboardBox title="Fees">
                <Stack gap={4} mt={16}>
                  <Typography color="var(--ps-neutral3)" fontSize={12} fontFamily={'IBM Plex Sans'}>
                    Fees Income
                  </Typography>
                  <Typography color="#30AD44" fontSize={12} fontFamily={'IBM Plex Sans'}>
                    $ {fee.isZero() ? '0.00' : fee.toFixed(2, BigNumber.ROUND_HALF_UP)}
                  </Typography>
                  <ClaimFeeBlock boxAddress={boxAddress} />
                </Stack>
              </DashboardBox>
            </SwiperSlide>
          </Swiper>
        </MdContainer>
      )}
    </>
  )
}

export const Card = styled(Box)`
  display: flex;
  padding: 20px 24px;
  flex-direction: column;
  align-items: center;
  flex-shrink: 0;
  border-radius: 12px;
  background: var(--ps-neutral);

  ${props => props.theme.breakpoints.down('md')} {
    padding: 16px;
  }
`
export const ToolIconBox = styled(IconButton)`
  cursor: pointer;
  display: flex;
  width: 36px;
  height: 36px;
  padding: 6px 6.379px 6px 5.621px;
  justify-content: center;
  align-items: center;
  border-radius: 50%;
  background: var(--ps-text-10);
`

const Cell = styled(Box)`
  display: flex;
  align-items: center;
  gap: 12px;
`

const StyleTable = styled(Box)(({ theme }) => ({
  width: '100%',
  marginTop: 17,

  thead: {
    position: 'relative',
    zIndex: 9,

    tr: {
      th: { padding: '0 0px !important' },

      '.MuiTableCell-root': {
        color: 'var(--ps-neutral3)',
        backgroundColor: 'var(--ps-neutral)'
      },

      '.MuiTableCell-root:last-child': {
        textAlign: 'end'
      }
    }
  },
  tbody: {
    tr: {
      height: '0px !important',

      td: {
        padding: '6px 0px !important'
      }
    },

    'tr:hover': {
      background: 'none'
    },

    'tr:last-of-type': {
      '.MuiTableCell-root': {
        width: '25%'
      },
      '.MuiTableCell-root:first-of-type': {
        borderBottom: '1px solid transparent'
      },
      '.MuiTableCell-root:last-of-type': {
        borderBottom: '1px solid transparent'
      }
    },

    '.MuiTableCell-root': {
      width: '25%'
    }
  },

  [theme.breakpoints.down('md')]: {
    display: 'grid',
    gap: 16
  }
}))

const MdContainer = styled(Box)`
  width: calc(100vw - 40px);
`

const Line = styled(Box)`
  width: 100%;
  height: 1px;
  background-color: var(--ps-text-10);
  margin: 10px 0;
`

export default MainDashboard
