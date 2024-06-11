import { useCallback, useMemo, useState } from 'react'
import {
  styled,
  Button,
  Box,
  useTheme,
  Typography,
  Popper,
  Stack,
  Avatar,
  ClickAwayListener,
  tooltipClasses
} from '@mui/material'
import useENSName from '../../hooks/useENSName'
import { shortenAddress } from '../../utils'
import TransactionsSvg from 'assets/svg/account/transactions.svg'
import DisconnectSvg from 'assets/svg/account/disconnect.svg'
// import SetSvg from 'assets/svg/account/set.svg'
import useBreakpoint from 'hooks/useBreakpoint'
import { useActiveWeb3React } from 'hooks'
import { ChevronLeft, ExpandLess, ExpandMore } from '@mui/icons-material'
import { useWalletModalToggle } from 'state/application/hooks'
import Copy from 'components/essential/Copy'
import { Currency } from 'constants/token'
import { useLogout, useUserInfo } from 'state/user/hooks'
import { useETHBalance } from 'hooks/useToken'
import Tooltip from 'components/Tooltip'
import Divider from 'components/Divider'
import { OutlinedCard } from 'components/Card'
import { isTransactionRecent, useAllTransactions } from 'state/transactions/hooks'
import { TransactionDetails } from 'state/transactions/reducer'
import { useDispatch } from 'react-redux'
import { AppDispatch } from 'state'
import { clearAllTransactions } from 'state/transactions/actions'
import { renderTransactions } from 'components/Modal/TransactionModals/Transactions'
import AccountSvg from 'assets/svg/account.svg'
// import { CURRENT_ENVIRONMENT } from 'constants/chains'
import { useRouter } from 'next/router'
import { ROUTES } from 'constants/routes'
import DefaultAvatar from 'assets/images/account/default_followings_item.png'
const StyledAccount = styled(AccountSvg)(({ theme }) => ({
  cursor: 'pointer',
  '& g': {
    stroke: theme.palette.text.primary
  }
}))

const StyledBtn = styled('button')(`
  background-color: transparent;
  padding: 0 !important;
  border-radius: 50%;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  position: relative;
  height: 24px;
  width: 24px;
  min-width: auto !important,
  color: rgb(13, 17, 28);
  border: none;
  outline: none;
  svg {
    path {
      fill: var(--ps-neutral3)
    }
  },
  :hover{
    opacity:0.9
  }
`)

const StyleTooltip = styled(Tooltip)(() => ({
  [`& .${tooltipClasses.tooltip}`]: {
    backgroundColor: 'var(--ps-neutral2)',
    borderRadius: '8px',
    height: '50px',
    display: 'flex',
    alignItems: 'center',
    minWidth: '50px',
    justifyContent: 'center',
    color: 'var(--ps-text-100)',
    fontSize: '12px'
  }
}))

const StyleLabel = styled(Typography)(() => ({
  display: 'flex',
  alignItems: 'center',
  svg: {
    path: {
      fill: 'var(--ps-neutral3)'
    }
  },
  p: {
    color: 'var(--ps-text-100)',
    fontSize: '15px'
  }
}))

// we want the latest one to come first, so return negative if a is after b
function newTransactionsFirst(a: TransactionDetails, b: TransactionDetails) {
  return b.addedTime - a.addedTime
}

function Web3StatusInner({ opacity = 1, avatar }: { opacity: number; avatar?: string | null }) {
  const isDownSm = useBreakpoint()
  const theme = useTheme()

  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null)

  const handleClick = (event: React.MouseEvent<HTMLElement>) => {
    setAnchorEl(anchorEl ? null : event.currentTarget)
  }

  return (
    <ClickAwayListener
      onClickAway={() => {
        setAnchorEl(null)
      }}
    >
      <Box>
        <Button
          onClick={handleClick}
          sx={{
            cursor: 'pointer',
            padding: '4px 10px 4px 4px',
            minWidth: isDownSm ? 54 : 64,
            // border: opacity >= 0.65 ? '1px solid var(--ps-gray-20)' : '1px solid transparent',
            height: isDownSm ? 40 : 44,
            backgroundColor: isDownSm ? 'transparent' : `var(--ps-neutral)`,
            // '&:hover .line': {
            //   borderColor: 'var(--ps-text-4)'
            // },
            borderRadius: '60px!important'
          }}
        >
          <Avatar
            sx={{ marginRight: isDownSm ? 0 : 10, width: { xs: 24, md: 36 }, height: { xs: 24, md: 36 } }}
            src={avatar ? avatar : DefaultAvatar.src}
          />

          {!isDownSm &&
            (anchorEl ? (
              <ExpandLess sx={{ fill: opacity >= 0.65 ? theme.palette.text.primary : '#fff' }} />
            ) : (
              <ExpandMore sx={{ fill: opacity >= 0.65 ? theme.palette.text.primary : '#fff' }} />
            ))}
        </Button>
        <WalletPopper anchorEl={anchorEl} avatar={avatar} close={() => setAnchorEl(null)} />
      </Box>
    </ClickAwayListener>
  )
}

enum WalletView {
  MAIN,
  Set,
  TRANSACTIONS
}

function WalletPopper({
  anchorEl,
  close,
  avatar
}: {
  anchorEl: null | HTMLElement
  close: () => void
  avatar?: string | null
}) {
  const route = useRouter()
  const open = !!anchorEl
  const theme = useTheme()
  const { account, chainId } = useActiveWeb3React()
  const { ENSName } = useENSName(account || undefined)
  const myETH = useETHBalance(account || undefined)
  const [curView, setCurView] = useState(WalletView.MAIN)
  // const { toggleThemeMode, mode } = useUpdateThemeMode()

  const dispatch = useDispatch<AppDispatch>()
  const { logout } = useLogout()

  const allTransactions = useAllTransactions()

  const sortedRecentTransactions = useMemo(() => {
    const txs = Object.values(allTransactions)
    return txs
      .filter(isTransactionRecent)
      .sort(newTransactionsFirst)
      .filter(v => v.from.toUpperCase() === account?.toUpperCase())
  }, [account, allTransactions])

  const pendingTransactions = sortedRecentTransactions.filter(tx => !tx.receipt).map(tx => tx.hash)
  const confirmedTransactions = sortedRecentTransactions.filter(tx => tx.receipt).map(tx => tx.hash)

  const clearAllTransactionsCallback = useCallback(() => {
    if (chainId) dispatch(clearAllTransactions({ chainId }))
  }, [dispatch, chainId])

  if (!chainId || !account) return null
  return (
    <Popper
      open={open}
      anchorEl={anchorEl}
      placement="bottom-start"
      sx={{
        top: { xs: 0, sm: '20px !important' },
        width: 320,
        zIndex: theme.zIndex.modal,
        [theme.breakpoints.down('md')]: {
          width: '100%'
        }
      }}
    >
      <Box
        sx={{
          border: '1px solid rgba(18, 18, 18, 0.06)',
          bgcolor: 'background.paper',
          borderRadius: '12px',
          padding: '24px',
          minHeight: 280
        }}
      >
        {curView === WalletView.MAIN && (
          <Box
            sx={{
              display: 'flex',
              flexDirection: 'column',
              gap: 15
            }}
          >
            <Box display={'flex'} justifyContent="space-between" alignItems={'center'}>
              <Box display={'flex'} alignItems="center">
                <Avatar sx={{ marginRight: 18, width: 24, height: 24 }} src={avatar ? avatar : DefaultAvatar.src} />
                <Stack>
                  <Box display={'flex'} alignItems={'center'} gap={6}>
                    <Typography fontSize={12} fontWeight={500}>
                      {shortenAddress(account || '')}
                    </Typography>
                    <Tooltip title="Copy address" placement="top">
                      <Box>
                        <Copy toCopy={account || ''} />
                      </Box>
                    </Tooltip>
                  </Box>
                  <Typography fontSize={12}>{ENSName}</Typography>
                </Stack>
              </Box>
              <Stack direction={'row'} spacing={8}>
                <StyleTooltip title="Transactions" placement="top">
                  <StyledBtn onClick={() => setCurView(WalletView.TRANSACTIONS)}>
                    <TransactionsSvg />
                  </StyledBtn>
                </StyleTooltip>

                {/* <StyleTooltip title="Settings" placement="top">
                  <StyledBtn>
                    <SetSvg
                      onClick={() => {
                        setCurView(WalletView.Set)
                      }}
                    />
                  </StyledBtn>
                </StyleTooltip> */}
                <StyleTooltip title="Disconnect" placement="top">
                  <StyledBtn>
                    <DisconnectSvg
                      onClick={() => {
                        logout()
                        close()
                      }}
                    />
                  </StyledBtn>
                </StyleTooltip>
              </Stack>
            </Box>
            <Divider />
            <Box
              padding="20px 0"
              sx={{
                backgroundColor: 'var(--ps-neutral2)',
                borderRadius: '12px',
                height: 115,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center'
              }}
            >
              <Typography variant="h3" fontWeight={500}>
                {myETH?.toSignificant() || '-'} {Currency.getNativeCurrency(chainId).symbol}
              </Typography>
            </Box>

            <Box
              sx={{
                display: 'flex',
                gap: 6,
                width: '100%'
              }}
            >
              <Button
                variant="contained"
                sx={{ height: 44, width: '50%' }}
                onClick={() => {
                  route.push(ROUTES.account.dashboard)
                  close()
                }}
              >
                Dashboard
              </Button>
              <Button
                sx={{
                  height: 44,
                  width: '50%'
                }}
                variant="outlined"
                onClick={() => {
                  route.push(ROUTES.account.myAssets)
                  close()
                }}
              >
                My Assets
              </Button>
            </Box>
          </Box>
        )}

        {curView === WalletView.TRANSACTIONS && (
          <Box
            sx={{
              height: '100%'
            }}
          >
            <Box pb={15} display={'flex'} justifyContent="space-between" alignItems={'center'}>
              <StyledBtn>
                <ChevronLeft onClick={() => setCurView(WalletView.MAIN)} />
              </StyledBtn>
              <StyleLabel>
                <TransactionsSvg />
                <Typography ml={5}>Transactions</Typography>
              </StyleLabel>
            </Box>
            <Divider />
            <OutlinedCard style={{ border: 'none', marginTop: 15 }}>
              {!!pendingTransactions.length || !!confirmedTransactions.length ? (
                <Box display="grid" gap="16px" width="100%">
                  <Box
                    display="flex"
                    justifyContent="space-between"
                    alignItems={'center'}
                    width="100%"
                    fontWeight={500}
                  >
                    <Typography variant="inherit">Recent Transactions</Typography>
                    <Typography
                      fontSize={12}
                      sx={{
                        cursor: 'pointer'
                      }}
                      onClick={clearAllTransactionsCallback}
                    >
                      (clear all)
                    </Typography>
                  </Box>
                  <Box
                    display="grid"
                    sx={{
                      maxHeight: '50vh',
                      paddingRight: '15px',
                      marginRight: '-15px',
                      overflowY: 'auto'
                    }}
                  >
                    {renderTransactions(pendingTransactions)}
                    {renderTransactions(confirmedTransactions)}
                  </Box>
                </Box>
              ) : (
                <Box
                  sx={{
                    display: 'flex',
                    width: '100%',
                    flexDirection: 'column',
                    justifyContent: 'center',
                    alignItems: 'center',
                    marginTop: 15,
                    height: '176px',
                    gap: 8
                  }}
                >
                  <Typography variant="h5" fontSize={15}>
                    No records yet
                  </Typography>
                  <Typography fontSize={13} color="var(--ps-neutral3)" textAlign={'center'}>
                    As you start to use your wallet, you will see your activity here.
                  </Typography>
                </Box>
              )}
            </OutlinedCard>
          </Box>
        )}

        {/* {curView === WalletView.Set && (
          <Box
            sx={{
              height: '100%'
            }}
          >
            <Box pb={15} display={'flex'} justifyContent="space-between" alignItems={'center'}>
              <StyledBtn>
                <ChevronLeft onClick={() => setCurView(WalletView.MAIN)} />
              </StyledBtn>
              <StyleLabel>
                <SetSvg />
                <Typography ml={5}>Settings</Typography>
              </StyleLabel>
            </Box>
            <Divider />
            <OutlinedCard style={{ border: 'none', marginTop: 15 }}>
              {CURRENT_ENVIRONMENT === 'dev' && (
                <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <Typography fontSize={'15px'} color={'var(--ps-text-100)'}>
                    Theme
                  </Typography>
                  <Button onClick={toggleThemeMode} variant="outlined" sx={{ textTransform: 'capitalize' }}>
                    {mode}
                  </Button>
                </Box>
              )}
            </OutlinedCard>
          </Box>
        )} */}
      </Box>
    </Popper>
  )
}

export default function Web3Status({ opacity = 1 }: { opacity?: number }) {
  const { chainId, account } = useActiveWeb3React()
  const { user } = useUserInfo()
  const WalletModalToggle = useWalletModalToggle()
  const isMd = useBreakpoint('md')

  if (isMd) {
    return (
      <>
        {!chainId || !account ? <StyledAccount onClick={WalletModalToggle} /> : <Web3StatusInner opacity={opacity} />}
      </>
    )
  }
  return (
    <>
      {!chainId || !account ? (
        <Button onClick={WalletModalToggle} variant="contained" size="large">
          {'Sign in'}
        </Button>
      ) : (
        <Web3StatusInner opacity={opacity} avatar={user?.avatar} />
      )}
    </>
  )
}
