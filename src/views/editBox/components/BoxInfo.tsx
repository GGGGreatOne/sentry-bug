import { Alert, Box, Button, IconButton, Stack, Tooltip, Typography } from '@mui/material'
import { viewControl } from 'views/editBox/modal'
import Image from 'next/image'
import { useBoxEditStatus } from 'state/boxes/hooks'
import { useCallback, useMemo, useState } from 'react'
// import TeslaIcon from 'assets/svg/boxes/tesla.svg'
import DefaultAvatar from 'assets/images/boxes/default-avatar.jpg'
import VerifiedIcon from 'assets/svg/verifyIcon.svg'
import SmVerifiedIcon from 'assets/svg/verifiedIconSm.svg'
import { useRequest } from 'ahooks'
import { LoadingButton } from '@mui/lab'
import { publishBox } from 'api/boxes'
import { toast } from 'react-toastify'
import { IBoxBasicAnotherInfoValue, IBoxBasicInfoValue, IBoxesJsonData } from 'state/boxes/type'
import { useUserInfo } from 'state/user/hooks'
import FollowButton from 'views/clubs/components/FollowButton'
import useBreakpoint from 'hooks/useBreakpoint'
import { globalDialogControl } from 'components/Dialog/modal'
// import BigNumber from 'bignumber.js'
// import { formatGroupNumber } from 'utils'
import toCopy from 'copy-to-clipboard'
import { ROUTES } from 'constants/routes'
import ShareIcon from '@mui/icons-material/Share'
import { CancelSaleButton } from 'views/activities/MarketForClubs/ClubActions/CancelSaleButton'
// const StyledTeslaIcon = styled(TeslaIcon)`
//   cursor: pointer;
//   & g {
//     stroke: ${({ theme }) => theme.palette.text.primary};
//   }
// `

const FollowersTools = ({
  boxId,
  isShow,
  isFollow,
  callBack,
  isMd,
  copyShare,
  shareLink
}: {
  boxId: string | number
  isShow: boolean
  isFollow: boolean
  callBack: () => void
  isMd: boolean
  copyShare: () => void
  shareLink: string
}) => {
  return (
    <Stack
      direction={'row'}
      spacing={isMd ? 0 : 24}
      alignItems={'center'}
      justifyContent={isMd ? 'center' : 'flex-start'}
      width={isMd ? '100%' : 'auto'}
    >
      <Stack direction={'row'} gap={5}>
        {isShow && <FollowButton boxId={Number(boxId)} isFollower={isFollow} callBack={callBack} isOutlined />}
        <Tooltip arrow title={shareLink}>
          <Button variant="outlined" onClick={copyShare} sx={{ width: 84, padding: '8px 16px' }}>
            <ShareIcon sx={{ fontSize: 13, marginRight: 3 }} />
            Share
          </Button>
        </Tooltip>
      </Stack>
    </Stack>
  )
}

const ListingAlert = ({ club, onRefresh }: { club: any; onRefresh?: () => void }) => {
  const isMd = useBreakpoint('md')
  const [show, setShow] = useState(true)
  if (!show) return null
  return (
    <Alert
      sx={{
        alignItems: 'center',
        justifyContent: 'space-between',
        minWidth: isMd ? `calc(100vw - 40px)` : `1200px`,
        padding: '0 16px',
        borderRadius: 5,
        lineHeight: '20px',
        zIndex: 10,
        my: 16,
        bgcolor: 'var(--ps-text-10)',
        '.MuiAlert-message': {
          flex: 1
        }
      }}
      variant="filled"
      severity="info"
      onClose={() => setShow(false)}
    >
      <Stack
        spacing={16}
        direction={{ xs: 'column', md: 'row' }}
        alignItems="center"
        justifyContent="space-between"
        sx={{ width: '100%' }}
      >
        <Typography fontSize={14}>Your club is for sale, you cannot perform club operations now</Typography>
        <CancelSaleButton club={club} onRefresh={onRefresh} />
      </Stack>
    </Alert>
  )
}

const BoxInfo = ({
  draftInfo,
  isVerified,
  club,
  boxBasicInfo,
  isShowCus,
  isFollow,
  isListing,
  rewardId,
  anotherInfo,
  onSubmit,
  setRun,
  onRefresh,
  isFollowers
}: {
  draftInfo?: IBoxesJsonData | null | undefined
  club?: any
  isVerified?: boolean
  boxBasicInfo: IBoxBasicInfoValue
  isShowCus: boolean
  isFollow: boolean
  isListing: boolean
  rewardId?: null | number
  anotherInfo: IBoxBasicAnotherInfoValue
  onSubmit?: () => void
  setRun?: (e: boolean) => void
  onRefresh?: () => void
  isFollowers?: (e: boolean) => void
}) => {
  const isMd = useBreakpoint('md')
  const { editing, updateBoxEditStatusCallback } = useBoxEditStatus()
  const userInfo = useUserInfo()

  const isShow = useMemo(() => {
    if (userInfo.box) {
      if (userInfo.box?.boxId === boxBasicInfo.boxId) {
        return false
      } else {
        return true
      }
    }
    return false
  }, [boxBasicInfo.boxId, userInfo.box])

  const [isFollower, setIsFollower] = useState(isFollow)
  const [showAlert, setShowAlert] = useState(true)

  const showEditAvatarModalClick = useCallback(() => {
    if (isShowCus) return
    viewControl.show('EditAvatar', boxBasicInfo)
  }, [boxBasicInfo, isShowCus])

  const shareLink = useMemo(() => {
    if (typeof window !== 'undefined') {
      return window?.location.origin + ROUTES.club.cusBox(boxBasicInfo.boxId || boxBasicInfo.id)
    } else {
      return ''
    }
  }, [boxBasicInfo.boxId, boxBasicInfo.id])

  const copyShare = useCallback(() => {
    const ret = toCopy(shareLink)
    if (ret) {
      toast.success('Successfully copied sharing link.')
    } else {
      toast.warning('Failed to copy sharing link.')
    }
  }, [shareLink])

  const { runAsync, loading } = useRequest(
    async () => {
      const { code, msg } = await publishBox(boxBasicInfo.boxId)
      if (code === 200) {
        toast('Submit success')
        globalDialogControl.show('ResultTipDialog', {
          iconType: 'success',
          title: 'Congratulations!',
          subTitle: `Submit successfully`,
          cancelBtn: 'OK'
        })
        if (onSubmit) {
          onSubmit()
        }
      } else {
        toast.error(msg)
        throw msg
      }
    },
    { manual: true }
  )

  return (
    <Stack
      maxWidth={isMd ? 'calc(100vw - 40px)' : '1200px'}
      width={'100%'}
      margin={'0 auto'}
      direction={'column'}
      spacing={40}
      pt={16}
      id="BoxInfo"
      position={'relative'}
    >
      {!isShowCus && !editing && (
        <Alert
          sx={{
            minWidth: isMd ? `calc(100vw - 40px)` : `1200px`,
            padding: '0 16px',
            position: isMd ? 'unset' : 'fixed',
            borderRadius: 5,
            lineHeight: '20px',
            right: '50%',
            transform: isMd ? 'none' : 'translateX(50%)',
            top: 72,
            zIndex: 10
          }}
          variant="filled"
          severity="info"
          onClose={() => {
            updateBoxEditStatusCallback(true)
            setShowAlert(true)
          }}
        >
          Preview mode
        </Alert>
      )}
      {!isShowCus && editing && showAlert && (
        <Alert
          sx={{
            minWidth: isMd ? `calc(100vw - 40px)` : `1200px`,
            padding: '0 16px',
            position: isMd ? 'unset' : 'fixed',
            borderRadius: 5,
            lineHeight: '20px',
            right: '50%',
            transform: isMd ? 'none' : 'translateX(50%)',
            top: 72,
            zIndex: 10,
            background: 'linear-gradient(90deg, #FF2626 30.81%, #FF9314 46.29%, #C369FF 67.28%, #7270FF 83.86%)'
          }}
          variant="filled"
          severity="info"
          onClose={() => setShowAlert(false)}
        >
          You need to submit your changes to update your club information!
        </Alert>
      )}

      <Box style={{ width: '100%', margin: '0 auto' }}>
        {isListing && <ListingAlert club={club} onRefresh={onRefresh} />}

        <Stack
          gap={isMd ? 24 : 0}
          direction={isMd ? 'column' : 'row'}
          justifyContent={isMd ? 'center' : 'space-between'}
          alignItems={isMd ? 'flex-start' : 'center'}
        >
          <Stack
            className="home-step6"
            width={isMd ? '100%' : 'auto'}
            direction={'row'}
            alignItems={'center'}
            spacing={20}
            position={'relative'}
            padding={isMd ? '0 16px' : 0}
          >
            <IconButton
              sx={{
                width: isMd ? 40 : 72,
                height: isMd ? 40 : 72,
                borderRadius: '50%',
                border: '1px solid var(--ps-text-100)',
                overflow: 'hidden'
              }}
              disabled={isShowCus || !editing}
              onClick={showEditAvatarModalClick}
            >
              <Image
                src={boxBasicInfo.avatar ? boxBasicInfo.avatar : DefaultAvatar}
                width={isMd ? 40 : 72}
                height={isMd ? 40 : 72}
                alt=""
              />
            </IconButton>
            {isVerified && !isMd && <VerifiedIcon width={24} style={{ position: 'absolute', bottom: 0, left: 34 }} />}
            {isVerified && isMd && <SmVerifiedIcon width={17} style={{ position: 'absolute', bottom: 12, left: 24 }} />}
            <Stack gap={isMd ? 6 : 16} width={isMd ? '80%' : 'auto'}>
              <Stack direction={'row'} alignItems={'center'} justifyContent={'flex-start'} gap={isMd ? 10 : 20}>
                <Typography
                  sx={{
                    maxWidth: isMd ? '50%' : 300,
                    fontSize: isMd ? 20 : 28,
                    color: 'var(--ps-text-100)',
                    fontWeight: 500,
                    lineHeight: '39.2px',
                    whiteSpace: 'nowrap',
                    overflow: 'Hidden',
                    textOverflow: 'ellipsis'
                  }}
                >
                  {boxBasicInfo.projectName}
                </Typography>
                <Typography
                  sx={{ fontSize: isMd ? 20 : 28, color: 'var(--ps-text-100)', fontWeight: 500, lineHeight: '39.2px' }}
                >
                  #{rewardId}
                </Typography>
              </Stack>
              <Stack direction={'row'} gap={20}>
                <Box
                  sx={{
                    padding: '3px 8px',
                    borderRadius: 100,
                    background: 'var(--ps-neutral2)',
                    color: 'var(--ps-text-100)',
                    fontSize: 12,
                    fontStyle: 'normal',
                    fontSeight: 400,
                    lineHeight: '16.8px',
                    textAlign: 'center'
                  }}
                >
                  Rank {anotherInfo.rank ? anotherInfo.rank : '--'}
                </Box>
                {/* <Typography fontSize={16} color={'var(--ps-neutral5)'}>
                  {anotherInfo.tvl ? formatGroupNumber(new BigNumber(anotherInfo.tvl).toNumber(), '', 2) : '0'} BIT
                </Typography> */}
              </Stack>
            </Stack>
          </Stack>

          {isShowCus ? (
            <FollowersTools
              isMd={isMd}
              boxId={boxBasicInfo.boxId}
              isFollow={isFollower}
              shareLink={shareLink}
              copyShare={copyShare}
              isShow={isShow}
              callBack={() => {
                isFollowers?.(isFollower)
                setIsFollower(!isFollower)
              }}
            />
          ) : (
            <>
              {!editing && (
                <FollowersTools
                  isMd={isMd}
                  boxId={boxBasicInfo.boxId}
                  isFollow={isFollower}
                  isShow={isShow}
                  shareLink={shareLink}
                  copyShare={copyShare}
                  callBack={() => {
                    isFollowers?.(isFollower)
                    setIsFollower(!isFollower)
                  }}
                />
              )}
              {editing && (
                <Stack
                  direction={'row'}
                  spacing={16}
                  alignItems={'center'}
                  justifyContent={'center'}
                  width={isMd ? '100%' : 'auto'}
                >
                  <Button
                    sx={{
                      minWidth: isMd ? 'auto' : 126,
                      padding: isMd ? '12px 18px' : '12px 24px',
                      fontSize: isMd ? 13 : 15,
                      height: isMd ? 36 : 44
                    }}
                    variant="outlined"
                    onClick={() => {
                      setRun && viewControl.show('GuidanceModal', { setIsOpen: setRun })
                    }}
                  >
                    Quick Tour
                  </Button>
                  <Button
                    sx={{
                      minWidth: isMd ? 'auto' : 126,
                      padding: isMd ? '12px 18px' : '12px 24px',
                      fontSize: isMd ? 13 : 15,
                      height: isMd ? 36 : 44
                    }}
                    variant="outlined"
                    onClick={() => {
                      updateBoxEditStatusCallback(false)
                    }}
                  >
                    Preview
                  </Button>
                  <LoadingButton
                    loading={loading}
                    disabled={draftInfo?.listingStatus}
                    sx={{
                      minWidth: isMd ? 'auto' : 126,
                      padding: isMd ? '12px 18px' : '12px 24px',
                      fontSize: isMd ? 13 : 15,
                      height: isMd ? 36 : 44
                    }}
                    variant="contained"
                    onClick={runAsync}
                  >
                    Submit Club
                  </LoadingButton>
                </Stack>
              )}
            </>
          )}
        </Stack>
        <Box mt={24} sx={{ width: '100%', height: '1px', background: 'var(--ps-neutral2)' }}></Box>
      </Box>
    </Stack>
  )
}
export default BoxInfo
