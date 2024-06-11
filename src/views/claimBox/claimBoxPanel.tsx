import { Box, Stack, Typography, styled, useTheme } from '@mui/material'
import { useUserInfo } from 'state/user/hooks'
import { IBoxUserStatus } from 'api/user/type'
import { useEffect, useMemo } from 'react'
import Image from 'next/image'
import useGetBoxAddress from 'hooks/boxes/useGetBoxAddress'
import { useActiveWeb3React } from 'hooks'
import LogoImg from 'assets/images/claimBox/logo.png'
import ClaimBG from 'assets/images/claimBox/claim-bg.png'
import ClaimMobileBG from 'assets/images/claimBox/claim-bg-mobile.png'
import useBreakpoint from 'hooks/useBreakpoint'
import { useWalletModalToggle } from 'state/application/hooks'
import { useRouter } from 'next/router'
import { LoadingButton } from '@mui/lab'
import { Element } from 'react-scroll'
import { ROUTES } from 'constants/routes'

const BtnStyle = styled(LoadingButton)(
  ({ theme }) => `
width: 206px;
height: 44px;
padding: 12px 24px;
border-radius: 100px;
background: var(--ps-text-100);
color: var(--ps-text-primary);
margin-top: 20px;
font-family: 'SF Pro Display';
font-size: ${theme.breakpoints.down('sm') ? 12 : 15};
font-style: normal;
font-weight: 500;
line-height: 100%;
&:disabled {
  background: var(--ps-neutral3);
  color: var(--ps-neutral2);
}
`
)

// const TokenItem = ({ item }: { item: IGetTokenAssetParams }) => {
//   const token = useToken(item.tokenContract)
//   const tvl = useMemo(() => {
//     if (item.amount) {
//       return new BigNumber(item.amount)
//     }
//     return undefined
//   }, [item.amount])
//   return (
//     <Stack
//       direction={'row'}
//       alignItems={'center'}
//       spacing={6}
//       sx={{
//         width: 'fit-content',
//         borderRadius: 8,
//         background: 'var(--ps-text-10)',
//         backdropFilter: 'blur(5px)',
//         padding: 8
//       }}
//     >
//       <CurrencyLogo currencyOrAddress={item.tokenContract} />
//       <Typography
//         sx={{
//           color: 'var(--ps-text-80)',
//           fontSize: '13px',
//           fontStyle: 'normal',
//           fontWeight: 500,
//           lineHeight: '100%'
//         }}
//       >
//         {token?.symbol?.toLocaleUpperCase()}:
//       </Typography>
//       <Typography
//         sx={{
//           color: 'var(--ps-text-80)',
//           fontSize: '13px',
//           fontStyle: 'normal',
//           fontWeight: 500,
//           lineHeight: '100%'
//         }}
//       >
//         {tvl
//           ? formatGroupNumber(
//               tvl.toNumber(),
//               '',
//               ['WBTC', 'BTCB'].includes(token?.symbol?.toLocaleUpperCase() || '') ? 4 : 0
//             )
//           : '0'}
//       </Typography>
//     </Stack>
//   )
// }

// const TaskItem = ({
//   title,
//   btnText,
//   click,
//   completed
// }: {
//   title: string
//   btnText: string
//   click: () => void
//   completed?: boolean
// }) => {
//   return (
//     <Stack
//       sx={{
//         padding: 16,
//         borderRadius: '8px',
//         background: 'var(--text-10, rgba(255, 255, 255, 0.10))',
//         backdropFilter: 'blur(5px)',
//         flexDirection: { xs: 'column', md: 'row' },
//         justifyContent: { xs: 'flex-start', md: 'space-between' },
//         alignItems: { xs: 'flex-start', md: 'center' },
//         gap: 10
//       }}
//     >
//       <Typography
//         sx={{
//           color: 'var(--ps-text-100)',
//           fontSize: '15px',
//           fontStyle: 'normal',
//           fontWeight: '500',
//           lineHeight: '15px'
//         }}
//       >
//         {title}
//       </Typography>
//       <Button
//         variant="contained"
//         onClick={() => click()}
//         disabled={!!completed}
//         sx={{
//           width: { xs: '100%', md: 100 },
//           padding: '8px 16px',
//           borderRadius: 100,
//           background: 'var(--ps-text-100)'
//         }}
//       >
//         {btnText}
//       </Button>
//     </Stack>
//   )
// }

const formatTime = (t: number) => {
  return new Intl.DateTimeFormat('en-US', {
    year: 'numeric',
    month: 'long',
    day: 'numeric'
  }).format(t)
}

// const BindTwitter = () => {
//   const userInfo = useUserInfo()
//   const [url, setUrl] = useState<undefined | string>(undefined)
//   const { run } = useRequest(
//     async () => {
//       const { data } = await AuthorizeTwitter()
//       setUrl(data.url)
//     },
//     {
//       manual: true
//     }
//   )
//   useEffect(() => {
//     if (userInfo.user !== null) {
//       run()
//     }
//   }, [run, userInfo.user])
//   return (
//     <TaskItem
//       completed={!!userInfo.user?.twitterSocialId}
//       title="Bind Your Twitter Account "
//       click={async () => {
//         if (!url) return
//         window.open(
//           url,
//           'intent',
//           'scrollbars=yes,resizable=yes,toolbar=no,location=yes,width=500,height=500,left=0,top=0'
//         )
//       }}
//       btnText={userInfo.user?.twitterSocialId ? 'Connected' : 'Connect'}
//     />
//   )
// }

const ClaimBoxPanel = () => {
  const userInfo = useUserInfo()
  const WalletModalToggle = useWalletModalToggle()
  const { boxAddressRaw } = useGetBoxAddress(userInfo.box?.rewardId || undefined)
  const { account } = useActiveWeb3React()
  // const [airdropClaiming, setAirdropClaiming] = useState<boolean>(false)
  // const refreshCheckStatus = useRefreshCheckStatus()
  const router = useRouter()
  // const startId = router.query.a

  // const onClaim = async () => {
  //   const res = await claimBox()
  //   if (res.code === 200) {
  //     refreshCheckStatus()
  //     toast.success('You have successfully claimed the club!')
  //     router.push('/club/createClub')
  //     return
  //   }
  //   toast.error('Club claim failed!')
  // }

  // const onClaimAirdrop = useCallback(async () => {
  //   setAirdropClaiming(true)
  //   try {
  //     const res = await claimAirdrop({ address: account })
  //     if (res.code === 200) {
  //       toast.success(
  //         'You have successfully claimed XX BB airdrop. Your address will receive it within 48 hours, please check your account!'
  //       )
  //       refreshCheckStatus()
  //       return
  //     }
  //     toast.error('Airdrop claim failed!')
  //     setAirdropClaiming(false)
  //   } catch (_) {
  //     setAirdropClaiming(false)
  //     toast.error('Airdrop claim failed!')
  //   }
  // }, [account, refreshCheckStatus])

  const subTitle = (
    <Typography
      sx={{
        color: 'var(--ps-neutral3)',
        fontFamily: 'IBM Plex Sans',
        fontSize: 12,
        fontWeight: 400,
        lineHeight: 1.4,
        textTransform: 'capitalize'
      }}
    >
      {userInfo.box?.createTime && <>{formatTime(new Date(userInfo.box?.createTime).getTime())}</>}
    </Typography>
  )
  const boxStatus = useMemo(() => userInfo.user?.boxStatus, [userInfo.user?.boxStatus])

  const claimClubInfo = useMemo(() => {
    if (!account || !boxStatus) {
      return {
        clubBtn: {
          onClick: () => {},
          children: 'Create',
          disabled: true
        }
      }
    }

    if (boxStatus === IBoxUserStatus.NOT_OBTAIN) {
      return {
        clubBtn: {
          onClick: () => {
            router.push(ROUTES.market)
          },
          children: 'Club Market'
        }
      }
    }

    // if (boxStatus === IBoxUserStatus.UNCLAIMED) {
    //   return {
    //     clubBtn: {
    //       children: 'Create',
    //       onClick: onClaim,
    //       disabled: false
    //     }
    //   }
    // }

    if (Number(boxStatus) >= IBoxUserStatus.CLAIMED && !userInfo.box?.boxAddress) {
      return {
        clubBtn: {
          children: 'Create Club',
          onClick: () => router.push('/club/createClub'),
          disabled: false
        }
      }
    }

    if (boxStatus === IBoxUserStatus.CREATED && boxAddressRaw) {
      return {
        clubBtn: {
          children: 'Enter My Club',
          onClick: () => router.push('/club/editClub'),
          disabled: false
        },
        subTitle
      }
    }
    return { clubBtn: { children: 'Create', onClick: () => {}, disabled: false } }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [account, boxAddressRaw, boxStatus, router, userInfo.box?.boxAddress])

  // const claimAirdropInfo = useMemo(() => {
  //   const tokenAmount = new BigNumber(userInfo.box?.airdrop?.tokenAmount || '0')

  //   if (!account) {
  //     return {
  //       clubBtn: {
  //         onClick: () => {},
  //         children: 'Gasless Claim',
  //         disabled: true
  //       },
  //       tokenAmount: '--'
  //     }
  //   }
  //   if (userInfo.box?.airdrop?.status === ClaimAirdropStatus.NOT_ELIGIBLE) {
  //     return {
  //       clubBtn: {
  //         onClick: () => {},
  //         children: 'Gasless Claim',
  //         disabled: true
  //       },
  //       tokenAmount: '--'
  //     }
  //   }

  //   if (userInfo.box?.airdrop?.status === ClaimAirdropStatus.ELIGIBLE) {
  //     return {
  //       clubBtn: {
  //         onClick: () => {},
  //         children: 'Gasless Claim',
  //         disabled: false
  //       },

  //       tokenAmount: tokenAmount.isZero() ? '--' : formatBigNumber(tokenAmount, 0)
  //     }
  //   }
  //   return {}
  // }, [account, userInfo.box?.airdrop?.status, userInfo.box?.airdrop?.tokenAmount])

  const { tipTestColor, tipText } = useMemo(() => {
    if (!account) {
      return {
        tipText: 'Connect Wallet',
        tipTestColor: 'var(--ps-text-100)'
      }
    }

    if (boxStatus === IBoxUserStatus.NOT_OBTAIN) {
      return {
        tipText: `Sorry,
          you're not eligible.`,
        tipTestColor: 'var(--ps-red)'
      }
    }

    if (boxStatus && (boxStatus as number) !== 0) {
      return {
        tipText: `Congratulations! You're eligible.`,
        tipTestColor: 'var(--ps-green)'
      }
    }
    return {}
  }, [account, boxStatus])

  // const { userTestnetBit, isTestnetClubOwner, isBindTwitter } = useMemo(() => {
  //   if (!account) {
  //     return {
  //       userTestnetBit: '--',
  //       isTestnetClubOwner: 'false',
  //       isBindTwitter: 'false'
  //     }
  //   }
  //   return {
  //     userTestnetBit: userInfo.box?.airdrop?.userTvl,
  //     isTestnetClubOwner: userInfo.box?.airdrop?.clubOwner === IsTestnetClubOwner.YES ? 'YES' : 'NO',
  //     isBindTwitter: userInfo.box?.airdrop?.clubOwner === BoxUserBindTwitter.YES ? 'YES' : 'NO'
  //   }
  // }, [account, userInfo.box?.airdrop?.clubOwner, userInfo.box?.airdrop?.userTvl])

  // const isTaskCompleted = useMemo(() => {
  //   return !!userInfo.user?.twitterSocialId
  // }, [userInfo.user?.twitterSocialId])

  const isSm = useBreakpoint('sm')
  // const isLg = useBreakpoint('lg')
  const theme = useTheme()

  const walletModalToggle = useWalletModalToggle()

  useEffect(() => {
    const { hash } = window.location
    if (hash && hash.startsWith('#jump')) {
      const targetElement = document.getElementById('jump')

      if (targetElement) {
        setTimeout(() => {
          targetElement.scrollIntoView({ behavior: 'smooth' })
        }, 200)
      }
    }
  }, [])

  return (
    <Box>
      <Typography
        id="jump"
        sx={{
          color: 'var(--ps-text-100)',
          fontSize: { xs: 24, md: 40 },
          fontStyle: 'normal',
          fontWeight: '600',
          lineHeight: 1.4
        }}
      >
        Check your eligibility
      </Typography>
      <Typography
        sx={{
          marginTop: 10,
          color: 'var(--ps-text-40)',
          fontSize: { xs: 15, md: 20 },
          fontStyle: 'normal',
          fontWeight: '500',
          lineHeight: 1.3
        }}
      >
        Connect your wallet to check if you can claim a BounceClub.
      </Typography>
      <Element name="get-club">
        <Box
          sx={{
            display: 'flex',
            flexDirection: 'row',
            justifyContent: 'center',
            alignItems: 'center',
            position: 'relative',
            width: '100%',
            height: { lg: 500, sm: 660, xs: 940 },
            mt: { sm: 40, xs: 50 },
            background: `url(${isSm ? ClaimMobileBG.src : ClaimBG.src})`,
            backgroundRepeat: 'no-repeat',
            backgroundSize: 'cover',
            borderRadius: 24
          }}
        >
          <Box
            sx={{
              position: 'absolute',
              left: 0,
              top: 0,
              width: '100%',
              height: '100%',
              background: 'rgba(13, 13, 13, 0.70)',
              ' mix-blend-mode': 'darken',
              zIndex: 1
            }}
          />
          <Box
            sx={{
              position: 'absolute',
              zIndex: 2,
              width: '100%',
              margin: '0 auto',
              display: 'grid',
              gridTemplateColumns: account ? '564px 80px auto' : 'auto',
              [theme.breakpoints.down('lg')]: {
                gridTemplateColumns: '564px auto',
                gap: 20
              },
              [theme.breakpoints.down('md')]: {
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center'
              },
              flexDirection: { xs: 'column', md: 'row' },
              justifyContent: 'center'
            }}
          >
            <Stack spacing={16}>
              <Box
                sx={{
                  display: { lg: 'flex', sm: 'flex', xs: 'grid' },
                  justifyContent: 'center',
                  gap: 24
                }}
              >
                <Stack
                  justifyContent={'center'}
                  alignItems={'center'}
                  sx={{
                    width: isSm ? 'calc(100vw - 80px)' : '270px',
                    minHeight: 336,
                    padding: { xs: 24, md: 32 },
                    position: 'relative'
                  }}
                >
                  <Box
                    sx={{
                      position: 'absolute',
                      left: 0,
                      top: 0,
                      width: '100%',
                      height: '100%',
                      background: 'var(--ps-text-primary-40, rgba(13, 13, 13, 0.40))',
                      backdropFilter: 'blur(5px)',
                      borderRadius: '24px',
                      border: '0.76px solid var(--ps-text-20)'
                    }}
                  />
                  <Stack
                    justifyContent={'center'}
                    alignItems={'center'}
                    sx={{ width: '100%', height: '100%', position: 'absolute', left: 0, top: 0 }}
                  >
                    <Image src={LogoImg.src} width={LogoImg.width} height={LogoImg.height} alt="" />
                    <Stack mt={24} alignItems={'center'}>
                      <Typography
                        sx={{
                          fontFamily: 'IBM Plex Sans',
                          fontSize: 20,
                          fontWeight: 500,
                          lineHeight: 1.3,
                          color: 'var(--ps-text-100)'
                        }}
                      >
                        BounceClub
                      </Typography>
                      <Typography
                        sx={{
                          width: 'max-content',
                          fontFamily: 'IBM Plex Sans',
                          fontSize: 28,
                          fontWeight: 500,
                          lineHeight: 1.4,
                          background:
                            'var(--colorful, linear-gradient(90deg, #FF2626 30.81%, #FF9314 46.29%, #C369FF 67.28%, #7270FF 83.86%))',
                          backgroundClip: 'text',
                          '-webkit-background-clip': 'text',
                          '-webkit-text-fill-color': 'transparent'
                        }}
                      >
                        {!!account
                          ? boxStatus
                            ? Number(boxStatus) === IBoxUserStatus.NOT_OBTAIN
                              ? 'Not Available'
                              : Number(boxStatus) > IBoxUserStatus.UNCLAIMED
                                ? `Club #${userInfo.box?.rewardId}`
                                : 'Available'
                            : '--'
                          : '--'}
                      </Typography>
                      {claimClubInfo?.subTitle}
                    </Stack>
                    <BtnStyle
                      variant="contained"
                      {...claimClubInfo.clubBtn}
                      sx={{
                        mt: claimClubInfo?.subTitle ? 20 : '40px !important'
                      }}
                    />
                  </Stack>
                </Stack>
                {/* <Stack
                  justifyContent={'center'}
                  alignItems={'center'}
                  sx={{
                    width: isSm ? 'calc(100vw - 80px)' : '270px',
                    minHeight: 336,
                    padding: { xs: 24, md: 32 },
                    position: 'relative'
                  }}
                >
                  <Box
                    sx={{
                      position: 'absolute',
                      left: 0,
                      top: 0,
                      width: '100%',
                      height: '100%',
                      background: 'var(--ps-text-primary-40, rgba(13, 13, 13, 0.40))',
                      backdropFilter: 'blur(5px)',
                      borderRadius: '24px',
                      border: '0.76px solid var(--ps-text-20)'
                    }}
                  />
                  <Stack
                    justifyContent={'center'}
                    alignItems={'center'}
                    sx={{ width: '100%', height: '100%', position: 'absolute', left: 0, top: 0 }}
                  >
                    <Image src={LogoImg.src} width={LogoImg.width} height={LogoImg.height} alt="" />
                    <Box textAlign={'center'} mt={24} width={'100%'}>
                      <Typography
                        sx={{
                          fontFamily: 'IBM Plex Sans',
                          fontSize: 20,
                          fontWeight: 500,
                          lineHeight: 1.3,
                          color: 'var(--ps-text-100)'
                        }}
                      >
                        BB Token
                      </Typography>
                      <Typography
                        sx={{
                          margin: '0 auto',
                          width: '100%',
                          padding: '0 10px',
                          fontFamily: 'IBM Plex Sans',
                          fontSize: 28,
                          fontWeight: 500,
                          lineHeight: 1.4,
                          background:
                            'var(--colorful, linear-gradient(90deg, #FF2626 30.81%, #FF9314 46.29%, #C369FF 67.28%, #7270FF 83.86%))',
                          backgroundClip: 'text',
                          '-webkit-background-clip': 'text',
                          '-webkit-text-fill-color': 'transparent'
                        }}
                      >
                        {claimAirdropInfo.tokenAmount}
                      </Typography>
                    </Box>
                    <BtnStyle
                      variant="contained"
                      {...claimAirdropInfo.clubBtn}
                      sx={{ mt: !account ? '40px' : '40px !important', visibility: 'hidden' }}
                    />
                  </Stack>
                </Stack> */}
              </Box>

              <Typography
                sx={{
                  color: 'var(--ps-blue)',
                  fontSize: { xs: 13, md: 15 },
                  fontStyle: 'normal',
                  fontWeight: '500',
                  lineHeight: '100%',
                  cursor: 'pointer',
                  textAlign: 'center'
                }}
                onClick={() => walletModalToggle()}
              >
                Try Another Wallet
              </Typography>

              <Typography
                sx={{
                  width: isSm ? 'calc(100vw - 80px)' : 'aoto',
                  color: 'var(--ps-text-80)',
                  textAlign: 'center',
                  fontSize: { xs: 13, md: 15 },
                  fontStyle: 'normal',
                  fontWeight: '400',
                  lineHeight: '140%'
                }}
              >
                {account ? '' : '*Connect wallet to check you eligibility.'}
              </Typography>
            </Stack>

            {/* {account && (
              <>
                {!isLg && <Box mx={40} sx={{ width: '1px', height: '100%', background: 'var(--ps-text-20)' }} />}{' '}
                <Stack
                  pt={20}
                  spacing={55.8}
                  sx={{
                    width: isSm ? 'calc(100vw - 80px)' : 280,
                    justifyContent: 'end'
                  }}
                >
                  <Stack spacing={20}>
                    <Stack flexDirection={'row'} alignItems={'center'} sx={{ gap: 10 }}>
                      <Typography
                        sx={{
                          color: 'var(--ps-text-100)',
                          fontSize: { xs: 15, md: 20 },
                          fontStyle: 'normal',
                          fontWeight: '500',
                          lineHeight: '130%'
                        }}
                      >
                        Your Dahboard
                      </Typography>

                    </Stack>
                    <Stack spacing={16}>
                      <Typography
                        variant="h5"
                        sx={{
                          borderRadius: '8px',
                          background: 'var(--ps-text-10)',
                          backdropFilter: 'blur(5px)',
                          padding: '8px',
                          color: 'var(--ps-text-80)',
                          fontFamily: 'IBM Plex Sans',
                          maxWidth: 'max-content'
                        }}
                      >
                        Your Testnet BIT:
                        {userTestnetBit}
                      </Typography>
                      <Typography
                        variant="h5"
                        sx={{
                          borderRadius: '8px',
                          background: 'var(--ps-text-10)',
                          backdropFilter: 'blur(5px)',
                          padding: '8px',
                          color: 'var(--ps-text-80)',
                          fontFamily: 'IBM Plex Sans',
                          maxWidth: 'max-content'
                        }}
                      >
                        Club Owner: {isTestnetClubOwner}
                      </Typography>
                      <Typography
                        variant="h5"
                        sx={{
                          borderRadius: '8px',
                          background: 'var(--ps-text-10)',
                          backdropFilter: 'blur(5px)',
                          padding: '8px',
                          color: 'var(--ps-text-80)',
                          fontFamily: 'IBM Plex Sans',
                          maxWidth: 'max-content'
                        }}
                      >
                        Twitter Linked: {isBindTwitter}
                      </Typography>
                    </Stack>
                  </Stack>

                  <Stack>
                    <Typography
                      sx={{
                        width: isSm ? 'calc(100vw - 80px)' : 'aoto',
                        color: 'var(--ps-text-80)',
                        fontSize: { xs: 13, md: 15 },
                        fontStyle: 'normal',
                        fontWeight: '400',
                        lineHeight: '140%'
                      }}
                    >
                      *Calculate the corresponding BB Token airdrop amount based on your data.
                    </Typography>
                  </Stack>
                </Stack>
              </>
            )} */}

            {/* {account && Number(boxStatus) === IBoxUserStatus.NOT_OBTAIN && (
            <>
              {!isLg && <Box mx={40} sx={{ width: '1px', height: '100%', background: 'var(--ps-text-20)' }} />}
              <Stack justifyContent={'center'}>
                <Typography
                  sx={{
                    color: 'var(--ps-text-100)',
                    fontSize: '20px',
                    fontStyle: 'normal',
                    fontWeight: 500,
                    lineHeight: '130%',
                    marginBottom: 20
                  }}
                >
                  {`You can still experience other users' clubs on BounceBit testnet`}
                </Typography>

                {isTaskCompleted && (
                  <TaskItem
                    title="Explore Clubs"
                    click={() => {
                      router.push(startId ? ROUTES.club.cusBox(startId.toString()) : '/')
                    }}
                    btnText="Start"
                  />
                )}
                {
                  // {!isTaskCompleted && (
                  //   <Stack sx={{ gap: 8 }}>
                  //     <BindTwitter />
                  //    <TaskItem
                  //     completed={userInfo.user?.twitterFollower === ITwitterFollower.FOLLOWING}
                  //     title="2. Follow BounceBit Twitter"
                  //     click={() => {}}
                  //     btnText={userInfo.user?.twitterFollower ? 'Following' : 'Follow'}
                  //   />
                  //   </Stack>
                  // )}
                }
              </Stack>
            </>
          )} */}
          </Box>
          {/* </Box> */}
          {/* todo : server render err */}
          {!account && (
            <Box
              onClick={() => {
                if (!account) {
                  WalletModalToggle()
                }
              }}
              sx={{
                cursor: !account ? 'pointer' : 'auto',
                position: 'absolute',
                right: { xs: 8.25, md: 167.344 },
                top: { xs: -60, md: 29.554 },
                transform: 'translate(50%, -50%) rotate(-15deg)',
                borderRadius: '200px',
                border: '1px solid var(--ps-text-10)',
                padding: '16px',
                zIndex: 3,
                [theme.breakpoints.down('sm')]: {
                  transform: 'rotate(-15deg)',
                  transformOrigin: 'bottom'
                }
              }}
            >
              <Stack
                alignItems={'center'}
                justifyContent={'center'}
                sx={{
                  borderRadius: '100px',
                  background: 'var(--ps-text-100)',
                  width: { xs: 100, md: 140 },
                  height: { xs: 100, md: 140 },
                  padding: '8px 16px'
                }}
              >
                <Typography
                  sx={{
                    color: 'var(--ps-text-primary)',
                    textAlign: 'center',
                    fontSize: { xs: 15, md: 20 },
                    fontStyle: 'normal',
                    fontWeight: '500',
                    lineHeight: '130%'
                  }}
                >
                  {tipText}
                </Typography>
              </Stack>
            </Box>
          )}
          {account && (
            <Box>
              <Stack
                justifyContent={'center'}
                alignItems={'center'}
                sx={{
                  width: { xs: 148, md: 208 },
                  height: { xs: 100, md: 140 },
                  padding: '8px 32px',
                  borderRadius: '24px',
                  background: tipTestColor,
                  position: 'absolute',
                  right: { xs: 8.25, md: 134.503 },
                  top: { xs: -44.65, md: -20.754 },
                  transform: 'translate(50%, -50%) rotate(-15deg)',
                  [theme.breakpoints.down('sm')]: {
                    transform: 'rotate(-15deg)',
                    transformOrigin: 'bottom'
                  },
                  zIndex: 3
                }}
              >
                <Typography
                  sx={{
                    color: 'var(--ps-text-primary)',
                    textAlign: 'center',
                    fontSize: { xs: 15, md: 20 },
                    fontStyle: 'normal',
                    fontWeight: '500',
                    lineHeight: '130%'
                  }}
                >
                  {tipText}
                </Typography>
              </Stack>
            </Box>
          )}
        </Box>
      </Element>
    </Box>
  )
}
export default ClaimBoxPanel
