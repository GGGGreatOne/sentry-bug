import { Box, Stack, Typography, styled } from '@mui/material'
import { viewControl } from 'views/editBox/modal'
import { useCallback, useMemo } from 'react'
import LinkIcon from 'components/LinkIcon'
import SetBgIcon from 'assets/svg/boxes/setBgIcon.svg'
import ClockIcon from 'assets/svg/boxes/clock.svg'
import ArrowIcon from 'assets/svg/account/arrow.svg'
import Link from 'next/link'
import { IBoxBasicInfoValue, IBoxesJsonData } from 'state/boxes/type'
import useBreakpoint from 'hooks/useBreakpoint'
import { BoxTypes } from 'api/boxes/type'
import { PutOnSellButton } from 'views/activities/MarketForClubs/ClubActions'
const StyledSetBgIcon = styled(SetBgIcon)(() => ({
  transition: '0.5s',
  transform: 'scale(.73)',
  '& path': {
    fill: 'var(--ps-text-primary)'
  }
}))
const StyledClockIcon = styled(ClockIcon)(() => ({
  '& path': {
    fill: 'var(--ps-text-primary)'
  }
}))
const StyledSetArrowIcon = styled(ArrowIcon)(() => ({
  transition: '0.5s',
  transform: 'scale(.8)',
  width: 0,
  '& path': {
    fill: 'var(--ps-text-primary)'
  }
}))

const BoxMain = ({
  draftInfo,
  boxBasicInfo,
  editing,
  isPublish,
  isListing,
  maxWidth = '100%',
  boxType,
  clubInfo,
  onRefresh
}: {
  draftInfo?: IBoxesJsonData | null | undefined
  boxBasicInfo: IBoxBasicInfoValue
  editing: boolean
  isPublish?: boolean
  isListing?: boolean
  maxWidth?: string | number
  boxType?: number
  clubInfo?: any
  onRefresh?: () => void
}) => {
  const isMd = useBreakpoint('md')
  const boxInfo = useMemo(() => {
    if (boxType === BoxTypes.USER) {
      return Object.assign({ ...boxBasicInfo, boxType: BoxTypes.USER })
    } else {
      return Object.assign({ ...boxBasicInfo, boxType: BoxTypes.PROJECT })
    }
  }, [boxBasicInfo, boxType])

  const showEditBasicInfoModalClick = useCallback(() => {
    if (draftInfo?.listingStatus) return
    viewControl.show('EditBasicInfoModal', boxInfo)
  }, [boxInfo, draftInfo?.listingStatus])
  const showClubHistoryModal = useCallback(() => {
    viewControl.show('ClubHistoryModal', boxBasicInfo)
  }, [boxBasicInfo])
  const bgImg = useMemo(() => {
    if (isMd) {
      return boxBasicInfo.backgroundMobileImg || boxBasicInfo.backgroundImg
    } else {
      return boxBasicInfo.backgroundImg
    }
  }, [boxBasicInfo.backgroundImg, boxBasicInfo.backgroundMobileImg, isMd])

  return (
    <Stack
      id="BoxMain"
      maxWidth={maxWidth}
      alignItems={'center'}
      justifyContent={'flex-end'}
      sx={{
        backgroundImage: `url(${bgImg})`,
        backgroundSize: 'cover',
        backgroundRepeat: 'no-repeat',
        backgroundPosition: 'center center',
        width: '100%',
        height: '100%',
        minHeight: isMd ? 360 : 300,
        overflow: 'hidden'
      }}
    >
      <Box
        sx={{
          position: 'relative',
          width: isMd ? 'calc(100vw - 40px)' : '1200px'
        }}
      >
        {boxBasicInfo.backgroundImg && (
          <Stack gap={isMd ? 16 : 24} mb={isMd ? 76 : 20}>
            {boxBasicInfo.introduction && (
              <Typography
                sx={{
                  width: '100%',
                  height: isMd ? 63 : 45,
                  textAlign: isMd ? 'center' : 'left',
                  color: boxBasicInfo.textColor ? boxBasicInfo.textColor : 'var(--ps-text-primary)',
                  fontWeight: 400,
                  fontSize: isMd ? 15 : 16,
                  lineHeight: isMd ? '21px' : '22.4px',
                  padding: isMd ? '0 20px' : '0',
                  overflow: 'auto',
                  '&::-webkit-scrollbar': {
                    display: 'none'
                  }
                }}
              >
                {boxBasicInfo.introduction}
              </Typography>
            )}

            <Typography
              sx={{
                width: '100%',
                height: isMd ? 67.2 : 40,
                textAlign: isMd ? 'center' : 'left',
                color: boxBasicInfo.textColor ? boxBasicInfo.textColor : 'var(--ps-text-primary)',
                fontWeight: 700,
                fontSize: isMd ? 24 : 40,
                lineHeight: isMd ? '33.6px' : 1,
                padding: isMd ? '0 20px' : '0',
                overflow: 'auto',
                '&::-webkit-scrollbar': {
                  display: 'none'
                }
              }}
            >
              {boxBasicInfo.title1}
            </Typography>

            <Stack gap={16} flexDirection={'row'} alignItems={'center'} justifyContent={isMd ? 'center' : 'flex-start'}>
              {boxBasicInfo.links.map((item, index) => {
                if (!item.url) return <Box key={index} height={40}></Box>
                return (
                  <Link key={item.typeName + index} href={item.url} target="_blank">
                    <Stack
                      alignItems={'center'}
                      justifyContent={'center'}
                      sx={{
                        width: 40,
                        height: 40,
                        background: 'var(--ps-text-10)',
                        borderRadius: '50%',
                        cursor: 'pointer',
                        '&:hover': {
                          opacity: 0.8
                        }
                      }}
                    >
                      <LinkIcon
                        type={item.typeName}
                        color={boxBasicInfo.textColor ? boxBasicInfo.textColor : '0D0D0D'}
                        isMd={isMd}
                      />
                    </Stack>
                  </Link>
                )
              })}
            </Stack>
          </Stack>
        )}

        <Stack
          direction="row"
          spacing={16}
          sx={{
            position: 'absolute',
            bottom: isMd ? 20 : 20,
            right: isMd ? '50%' : '0',
            transform: `translateX(${isMd ? '50%' : '0'})`
          }}
        >
          {editing && isPublish && !isListing && <PutOnSellButton club={clubInfo} onRefresh={onRefresh} />}

          {editing && (
            <Stack
              className="project-step"
              direction={'row'}
              onClick={showEditBasicInfoModalClick}
              sx={{
                width: 150,
                height: isMd ? 36 : 44,
                borderRadius: '100px',
                background: 'var(--ps-text-100)',
                padding: '12px 20px',
                justifyContent: 'center',
                alignItems: 'center',
                cursor: 'pointer',
                '&:hover svg:first-of-type': {
                  width: 0,
                  opacity: 0
                },
                '&:hover svg:last-child': {
                  width: 20
                },
                '&:hover h5': {
                  padding: '0 6px 0 0'
                }
              }}
            >
              <StyledSetBgIcon />
              <Typography
                variant="h5"
                sx={{
                  transition: '0.5s',
                  color: 'var(--ps-text-primary)',
                  fontSize: isMd ? 13 : 15,
                  fontWeight: 500,
                  paddingLeft: 6
                }}
              >
                Set Banner
              </Typography>
              <StyledSetArrowIcon />
            </Stack>
          )}
        </Stack>

        {!editing && (
          <Stack
            direction={'row'}
            onClick={showClubHistoryModal}
            sx={{
              width: 150,
              height: isMd ? 36 : 44,
              position: 'absolute',
              bottom: isMd ? 20 : 20,
              right: isMd ? '50%' : '0',
              transform: `translateX(${isMd ? '50%' : '0'})`,
              borderRadius: '100px',
              background: 'var(--ps-text-100)',
              padding: '12px 20px',
              justifyContent: 'center',
              alignItems: 'center',
              cursor: 'pointer'
            }}
          >
            <StyledClockIcon />
            <Typography
              variant="h5"
              sx={{
                transition: '0.5s',
                color: 'var(--ps-text-primary)',
                fontSize: isMd ? 13 : 15,
                fontWeight: 500,
                paddingLeft: 6
              }}
            >
              Club History
            </Typography>
          </Stack>
        )}
      </Box>
    </Stack>
  )
}
export default BoxMain
