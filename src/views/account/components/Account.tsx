import { Box, styled, Typography, IconButton, Button } from '@mui/material'
import Image from 'next/image'
import DefaultAvatar from 'assets/images/account/default_followings_item.png'
import Pen from 'assets/svg/account/pen.svg'
import PenGray from 'assets/svg/account/pen_gray.svg'
// import X from 'assets/svg/account/x.svg'
import MenberSvg from 'assets/svg/account/menber.svg'
// import Mail from 'assets/svg/account/mail.svg'
// import Arrow from 'assets/svg/account/arrow.svg'
import Wallet from 'assets/svg/account/wallet.svg'
import Ticket from 'assets/svg/account/ticket.svg'
import Dollar from 'assets/svg/account/dollar.svg'
import Square from 'assets/svg/account/square.svg'
import BounceBitSvg from 'assets/svg/account/bounce_bit.svg'
import { Swiper, SwiperSlide, useSwiper } from 'swiper/react'
import { formatGroupNumber, isAddress, shortenAddress } from 'utils'
import { useActiveWeb3React } from 'hooks'
import { ReactNode, useCallback, useMemo, useState } from 'react'
import { useRequest } from 'ahooks'
import { GetActivitiesCount } from 'api/user'
import { useUserInfo } from 'state/user/hooks'
import { IBoxUserStatus } from 'api/user/type'
import useTotalAssets from 'hooks/useTotalAssets'
import useBreakpoint from 'hooks/useBreakpoint'
import BigNumber from 'bignumber.js'
import { viewControl } from 'views/editBox/modal'
import { useRouter } from 'next/router'
import { ROUTES } from 'constants/routes'
import { useETHBalance } from 'hooks/useToken'
import { Currency } from 'constants/token'
import { EditInfoType } from 'views/editBox/components/editUserInfo'
import { EllipsisTypography } from '../profile/components/FollowerCarItem'
import 'swiper/swiper-bundle.css'
import useGetBoxAddress from 'hooks/boxes/useGetBoxAddress'
import { ZERO_ADDRESS } from '../../../constants'

interface ItemBoxProps {
  icon?: ReactNode
  title?: string | number | undefined
  subTitle?: string
  children?: ReactNode
  callBack?: () => void
}

const AccountContainer = styled(Box)`
  position: sticky;
  top: 100px;
  display: flex;
  width: 334px;
  min-height: 662px;
  padding: 24px;
  flex-direction: column;
  align-items: flex-start;
  gap: 20px;
  border-radius: 20px;
  background: var(--ps-neutral);
  z-index: 99;

  ${props => props.theme.breakpoints.down('md')} {
    position: static;
    width: 100%;
    margin-top: 100px;
    border-radius: 0px;
    padding: 20px;
    min-height: 0px;
    z-index: 0;
  }
`
const InfoBox = styled(Box)`
  width: 100%;
  display: flex;
  justify-content: space-between;
  align-items: center;
`
const ProfileFrame = styled(Box)`
  position: relative;
  width: 60px;
  height: 60px;
  border-radius: 60px;
  overflow: hidden;
  transition: filter 0.5s ease;

  & > svg {
    position: absolute;
    top: 50%;
    left: 50%;
    transform: translate(-50%, -50%);
    opacity: 0;
    transition: opacity 0.5s ease;
  }

  &:hover {
    cursor: pointer;
    filter: brightness(0.7);

    & > svg {
      opacity: 1;
    }
  }
`

const IconBox = styled(Box)`
  display: flex;
  width: 40px;
  height: 40px;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  border-radius: 100px;
  background: var(--ps-text-10);
`

const CarBox = styled(Box)`
  width: 100%;
  display: flex;
  border-radius: 12px;
  background: var(--ps-neutral2);

  ${props => props.theme.breakpoints.down('md')} {
    flex-direction: column;
    &:hover button {
      opacity: 1;
    }
  }
`

const BounceBitBox = styled(Box)`
  display: flex;
  padding: 8px;
  align-items: center;
  gap: 4px;
  border-radius: 10px;
  background: var(--ps-neutral);
`

const SwiperSlideBox = styled(Box)`
  display: flex;
  padding: 16px;
  flex-direction: column;
  justify-content: center;
  align-items: flex-start;
  gap: 12px;
  border-radius: 12px;
  background: var(--ps-neutral2);
`
const HoverBtnBox = styled(Box)<{ isHover: boolean }>`
  width: 100%;
  cursor: ${props => (props.isHover ? 'pointer' : '')};
  button {
    transition: all 0.2s;
    opacity: 0;
  }

  &:hover button {
    opacity: 1;
  }

  ${props => props.theme.breakpoints.down('md')} {
    button {
      opacity: 1;
    }
  }
`

const ItemBox = ({ icon, title, subTitle, children, callBack }: ItemBoxProps) => {
  const isMd = useBreakpoint('md')
  return (
    <HoverBtnBox isHover={!!callBack}>
      <CarBox height={'100%'} gap={12} justifyContent={'space-between'} alignItems={'center'}>
        <Box width={'100%'} display={'flex'} height={'100%'} flexDirection={isMd ? 'column' : 'row'} gap={12}>
          <IconBox>{icon}</IconBox>
          <Box
            width={'max-content'}
            display={'flex'}
            flexDirection={'column'}
            justifyContent={'center'}
            gap={isMd ? 12 : 4}
          >
            <Typography fontSize={isMd ? 28 : 15} lineHeight={isMd ? '140%' : '100%'} color={'var(--ps-text-100)'}>
              {title}
            </Typography>
            <Typography fontSize={13} lineHeight={'100%'} color={'var(--ps-text-40)'}>
              {subTitle}
            </Typography>
          </Box>
          {isMd && <Box height={49}></Box>}
        </Box>
        <Box display={'flex'} justifyContent={'flex-end'} width={'100%'}>
          {children}
        </Box>
      </CarBox>
    </HoverBtnBox>
  )
}

const Account = () => {
  const route = useRouter()
  const isMd = useBreakpoint('md')
  const { account, chainId } = useActiveWeb3React()
  const myETH = useETHBalance(account || undefined)
  const userInfo = useUserInfo()
  const { boxAddressRaw } = useGetBoxAddress(userInfo.box?.rewardId || undefined)
  const { totalAssets } = useTotalAssets()
  const isNomal = useMemo(() => {
    const boxStatus = userInfo.user?.boxStatus
    if (Number(boxStatus) == IBoxUserStatus.CREATED) {
      return false
    }
    return true
  }, [userInfo])
  console.log('userInfo--', userInfo)

  const { data: accountDatas } = useRequest(
    async () => {
      try {
        const activitiesRes = await GetActivitiesCount()

        return {
          pluginTotalCount: activitiesRes.data.totalCount,
          pluginList: activitiesRes.data.pluginList
        }
      } catch (error) {
        return undefined
      }
    },
    {
      manual: false
    }
  )
  console.log('Account->accountDatas', accountDatas)

  const itemDatas = useMemo(() => {
    if (isNomal) {
      return [
        {
          icon: <Square />,
          title: `${userInfo.box?.rewardId ? '#' + userInfo.box?.rewardId : '-'}`,
          subTitle: 'My BounceClub',
          btnText: '',
          callBack: null
        }
      ]
    } else {
      return [
        {
          icon: <Square />,
          title: `${userInfo.box?.rewardId ? '#' + userInfo.box?.rewardId : '-'}`,
          subTitle: 'My BounceClub',
          btnText: 'Design',
          callBack: () => {
            if (boxAddressRaw && boxAddressRaw === ZERO_ADDRESS) {
              route.push('/club/createClub')
              return
            }
            route.push(ROUTES.club.editClub)
          }
        },
        {
          icon: <Dollar />,
          title: `${formatGroupNumber(userInfo.box?.tvl ? new BigNumber(userInfo.box.tvl).toNumber() : 0, '', 2)} TVL`,
          subTitle: 'TVL',
          btnText: '',
          callBack: null
        },
        {
          icon: <Ticket />,
          title: userInfo.box?.rank ? userInfo.box?.rank : 0,
          subTitle: 'Ranks',
          btnText: '',
          callBack: null
        }
      ]
    }
  }, [boxAddressRaw, isNomal, route, userInfo.box?.rank, userInfo.box?.rewardId, userInfo?.box?.tvl])

  const swiper = useSwiper()
  const [swiperInstance, setSwiperInstance] = useState(swiper)
  console.log('swiperInstance', swiperInstance)
  console.log('itemDatas', itemDatas)
  console.log('userInfo', userInfo)

  const showEditUserInfoModalClick = useCallback(
    (type: EditInfoType) => {
      viewControl.show('EditUserInfo', {
        userName: userInfo.user?.userName ? userInfo.user?.userName : '',
        avatar: userInfo.user?.avatar ? userInfo.user?.avatar : '',
        type: type
      })
    },
    [userInfo.user?.avatar, userInfo.user?.userName]
  )

  const isAccount = useMemo(() => route.route === ROUTES.account.myAssets, [route.route])
  return (
    <AccountContainer>
      <InfoBox>
        <Box display={'flex'} gap={8}>
          <ProfileFrame onClick={() => showEditUserInfoModalClick(EditInfoType.AVATAR)}>
            {userInfo.user && userInfo.user.avatar ? (
              <Image
                alt=""
                width={60}
                height={60}
                src={userInfo.user.avatar}
                onError={(e: any) => {
                  e.target.onerror = null
                  e.target.src = DefaultAvatar.src
                }}
                style={{
                  objectFit: 'cover'
                }}
              ></Image>
            ) : (
              <Image
                alt=""
                width={60}
                height={60}
                src={DefaultAvatar.src}
                onError={(e: any) => {
                  e.target.onerror = null
                  e.target.src = DefaultAvatar.src
                }}
                style={{
                  objectFit: 'cover'
                }}
              ></Image>
            )}
            <Pen />
          </ProfileFrame>
          <Box display={'flex'} flexDirection={'column'} justifyContent={'center'} gap={isMd ? 0.5 : 2.5}>
            <Box display={'flex'} flexDirection={'row'} gap={4}>
              {account && (
                <>
                  <EllipsisTypography
                    sx={{
                      maxWidth: 200,
                      color: 'var(--ps-text-100)',
                      fontSize: '15px',
                      fontWeight: 500,
                      lineHeight: '20px'
                    }}
                  >
                    {userInfo.user?.userName && isAddress(userInfo.user?.userName)
                      ? shortenAddress(userInfo.user?.userName)
                      : userInfo.user?.userName}
                  </EllipsisTypography>
                  <IconButton
                    onClick={() => showEditUserInfoModalClick(EditInfoType.USERNAME)}
                    sx={{
                      width: 20,
                      height: 20,
                      padding: 0
                    }}
                  >
                    <PenGray />
                  </IconButton>
                </>
              )}
            </Box>
            <Box display={'flex'} flexDirection={'row'} gap={4} height={20}>
              {/* <IconButton
                sx={{
                  width: 20,
                  height: 20,
                  padding: 0
                }}
              >
                <Mail />
              </IconButton>
              <IconButton
                sx={{
                  width: 20,
                  height: 20,
                  padding: 0
                }}
              >
                <X />
              </IconButton> */}
            </Box>
          </Box>
        </Box>
        <IconButton
          sx={{
            width: 20,
            height: 20,
            padding: 0
          }}
        >
          {/* <Arrow /> */}
        </IconButton>
      </InfoBox>

      {isMd ? (
        <>
          <Box width={'100%'}>
            <Swiper
              observeParents={true}
              observer={true}
              onSwiper={setSwiperInstance}
              slidesPerView={1.7}
              spaceBetween={'16px'}
            >
              <SwiperSlide>
                <SwiperSlideBox>
                  <CarBox gap={12} flexDirection={'column'}>
                    <IconBox>
                      <Wallet />
                    </IconBox>
                    <Box display={'flex'} flexDirection={'column'} gap={12}>
                      <Typography fontSize={'28px'} lineHeight={'140%'} color={'var(--ps-text-100)'}>
                        ${totalAssets?.toFixed(4) || 0}
                      </Typography>
                      <Typography fontSize={'13px'} lineHeight={'100%'} color={'var(--ps-text-40)'}>
                        My Assets
                      </Typography>
                    </Box>
                    <BounceBitBox>
                      <BounceBitSvg />
                      <Typography fontSize={15} lineHeight={'100%'} color={'--ps-text-100'}>
                        {myETH?.toSignificant() || '-'} {Currency.getNativeCurrency(chainId).symbol}
                      </Typography>
                    </BounceBitBox>
                    {isAccount ? (
                      <Box height={36}></Box>
                    ) : (
                      <Button
                        size="small"
                        onClick={() => {
                          route.push(ROUTES.account.myAssets)
                        }}
                        sx={{ padding: '6px 16px', fontSize: 12 }}
                        variant="contained"
                      >
                        Enter
                      </Button>
                    )}
                  </CarBox>
                </SwiperSlideBox>
              </SwiperSlide>
              {itemDatas.map((_, index) => (
                <SwiperSlide
                  style={{
                    height: '100%'
                  }}
                  key={index}
                >
                  <SwiperSlideBox>
                    <ItemBox icon={_.icon} title={_.title} subTitle={_.subTitle}>
                      {_.callBack ? (
                        <Box height={36} width={'100%'} display="flex" justifyContent={'center'}>
                          <Button
                            onClick={() => {
                              _.callBack && _.callBack()
                            }}
                            size="small"
                            sx={{ padding: '6px 16px', width: '100%', fontSize: 12 }}
                            variant="contained"
                          >
                            {_.btnText}
                          </Button>
                        </Box>
                      ) : (
                        <Box height={36}></Box>
                      )}
                    </ItemBox>
                  </SwiperSlideBox>
                </SwiperSlide>
              ))}
            </Swiper>
          </Box>
          <CarBox py={12} px={16}>
            {isNomal ? (
              <Box display={'flex'} flexDirection={'row'} gap={12}>
                <IconBox>
                  <MenberSvg />
                </IconBox>
                <Box display={'flex'} flexDirection={'column'} justifyContent={'center'} gap={4}>
                  <Typography fontSize={15} lineHeight={'100%'} color={'var(--ps-text-100)'}>
                    {userInfo?.follow?.following}
                  </Typography>
                  <Typography fontSize={13} lineHeight={'100%'} color={'var(--ps-text-40)'}>
                    Followings
                  </Typography>
                </Box>
              </Box>
            ) : (
              <Box display={'flex'} flexDirection={'row'} gap={12}>
                <Box display={'flex'} flexDirection={'column'} gap={4} flex={1} alignItems={'center'}>
                  <Typography fontSize={'15px'} lineHeight={'100%'} color={'var(--ps-text-100)'}>
                    {userInfo?.follow?.followers ? userInfo?.follow?.followers : '-'}
                  </Typography>
                  <Typography fontSize={'13px'} lineHeight={'100%'} color={'var(--ps-text-40)'}>
                    Followers
                  </Typography>
                </Box>
                <Box
                  width={'1px'}
                  height={'32px'}
                  sx={{
                    backgroundColor: 'var(--ps-text-10)'
                  }}
                ></Box>
                <Box display={'flex'} flexDirection={'column'} gap={4} flex={1} alignItems={'center'}>
                  <Typography fontSize={'15px'} lineHeight={'100%'} color={'var(--ps-text-100)'}>
                    {userInfo?.follow?.following}
                  </Typography>
                  <Typography fontSize={'13px'} lineHeight={'100%'} color={'var(--ps-text-40)'}>
                    Followings
                  </Typography>
                </Box>
              </Box>
            )}
          </CarBox>
        </>
      ) : (
        <>
          <HoverBtnBox width={'100%'} isHover={false}>
            <CarBox padding={16} gap={16} flexDirection={'column'}>
              <IconBox>
                <Wallet />
              </IconBox>
              <Box display={'flex'} flexDirection={'column'} gap={12}>
                <Typography fontSize={'28px'} lineHeight={'140%'} color={'var(--ps-text-100)'}>
                  ${totalAssets?.toFixed(4) || 0}
                </Typography>
                <Typography fontSize={'13px'} lineHeight={'100%'} color={'var(--ps-text-40)'}>
                  My Assets
                </Typography>
              </Box>
              <BounceBitBox>
                <BounceBitSvg />
                <Typography fontSize={15} lineHeight={'100%'} color={'--ps-text-100'}>
                  {myETH?.toSignificant() || '-'} {Currency.getNativeCurrency(chainId).symbol}
                </Typography>
              </BounceBitBox>
              {!isAccount && (
                <Button
                  onClick={() => {
                    if (isAccount) return
                    route.push(ROUTES.account.myAssets)
                  }}
                  size="small"
                  sx={{ padding: '6px 16px', fontSize: 12 }}
                  variant="contained"
                >
                  Enter
                </Button>
              )}
            </CarBox>
          </HoverBtnBox>

          <CarBox padding={16} gap={16} flexDirection={'column'}>
            {itemDatas.map((_, index) => (
              <HoverBtnBox key={index} isHover={!!_.callBack}>
                <ItemBox key={index} icon={_.icon} title={_.title} subTitle={_.subTitle}>
                  {_.btnText && (
                    <Button
                      onClick={() => {
                        _.callBack && _.callBack()
                      }}
                      sx={{ padding: '6px 16px', fontSize: 12 }}
                      size="small"
                      variant="contained"
                    >
                      {_.btnText}
                    </Button>
                  )}
                </ItemBox>
              </HoverBtnBox>
            ))}
          </CarBox>
          {isNomal ? (
            <CarBox p={12} flexDirection={'row'}>
              <Box display={'flex'} flexDirection={'row'} gap={12}>
                <IconBox>
                  <MenberSvg />
                </IconBox>
                <Box display={'flex'} flexDirection={'column'} justifyContent={'center'} gap={4}>
                  <Typography fontSize={15} lineHeight={'100%'} color={'var(--ps-text-100)'}>
                    {userInfo?.follow?.following}
                  </Typography>
                  <Typography fontSize={13} lineHeight={'100%'} color={'var(--ps-text-40)'}>
                    Followings
                  </Typography>
                </Box>
              </Box>
            </CarBox>
          ) : (
            <CarBox py={12} flexDirection={'row'} gap={12}>
              <Box display={'flex'} flexDirection={'column'} gap={4} flex={1} alignItems={'center'}>
                <Typography fontSize={'15px'} lineHeight={'100%'} color={'var(--ps-text-100)'}>
                  {userInfo?.follow?.followers ? userInfo?.follow?.followers : '-'}
                </Typography>
                <Typography fontSize={'13px'} lineHeight={'100%'} color={'var(--ps-text-40)'}>
                  Followers
                </Typography>
              </Box>
              <Box
                width={'1px'}
                height={'32px'}
                sx={{
                  backgroundColor: 'var(--ps-text-10)'
                }}
              ></Box>
              <Box display={'flex'} flexDirection={'column'} gap={4} flex={1} alignItems={'center'}>
                <Typography fontSize={'15px'} lineHeight={'100%'} color={'var(--ps-text-100)'}>
                  {userInfo?.follow?.following}
                </Typography>
                <Typography fontSize={'13px'} lineHeight={'100%'} color={'var(--ps-text-40)'}>
                  Followings
                </Typography>
              </Box>
            </CarBox>
          )}
        </>
      )}
    </AccountContainer>
  )
}
export default Account
