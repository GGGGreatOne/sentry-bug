import { Stack, Typography, styled } from '@mui/material'
import ColorfulFlags from 'assets/svg/boxes/colorfulFlags.svg'
import LineSvg from 'assets/svg/boxes/line.svg'
import Line2Svg from 'assets/svg/boxes/line2.svg'
import { useMemo } from 'react'
import { IBoxAboutSectionTypeRoadmapValue, RoadmapDataType } from 'state/boxes/type'
import dayjs from 'dayjs'
import useBreakpoint from 'hooks/useBreakpoint'
export const StyledLineSvg = styled(LineSvg)<{ color: string }>(({ color }) => ({
  cursor: 'pointer',
  '& path': {
    stroke: color
  }
}))
const StyledLine2Svg = styled(Line2Svg)<{ color: string }>(({ color }) => ({
  cursor: 'pointer',
  '& path': {
    stroke: color
  }
}))

const monthNames = [
  'January',
  'February',
  'March',
  'April',
  'May',
  'June',
  'July',
  'August',
  'September',
  'October',
  'November',
  'December'
]

const getDateName = (date: string) => {
  const year = date.split('-')[0].trim()
  const month = date.split('-')[1].trim()
  return monthNames[parseInt(month, 10) - 1].toUpperCase() + ' ' + year
}

const getFeature = (date: string) => {
  const data = dayjs(new Date()).format('YYYY-MM')
  if (dayjs(date) > dayjs(data)) {
    return true
  } else {
    return false
  }
}

const getNow = (date: string) => {
  const data = dayjs(new Date()).format('YYYY-MM')
  if (date === data) {
    return true
  } else {
    return false
  }
}

const RoadmapBox = ({ roadmapData }: { roadmapData: RoadmapDataType[] }) => {
  const isMd = useBreakpoint('md')
  return (
    <>
      {isMd ? (
        <Stack flexDirection={'column'}>
          {roadmapData.map((item, index) => {
            return (
              <Stack key={index} gap={16} flexDirection={'row'} alignItems={'flex-start'}>
                <Stack gap={4} flexDirection={'column'} alignItems={'center'}>
                  <Stack
                    alignItems={'center'}
                    justifyContent={'center'}
                    sx={{
                      width: 30,
                      height: 30,
                      background: 'var(--ps-neutral)',
                      border: `1px solid ${item.future ? 'transparent' : 'var(--ps-text-80)'}`,
                      borderRadius: '50%'
                    }}
                  >
                    <ColorfulFlags transform="scale(.6)" />
                  </Stack>
                  {index + 1 < roadmapData.length && (
                    <StyledLine2Svg
                      color={
                        item.future
                          ? 'var(--ps-neutral)'
                          : getNow(item.date)
                            ? 'var(--ps-neutral)'
                            : 'var(--ps-neutral5)'
                      }
                    />
                  )}
                </Stack>

                <Stack gap={8} flexDirection={'column'} alignItems={'flex-start'} justifyContent={'flex-start'}>
                  <Typography
                    variant="subtitle1"
                    maxWidth={'calc(100vw - 120px)'}
                    width={'100%'}
                    sx={{
                      fontWeight: 400,
                      lineHeight: '16.8px',
                      fontStyle: 'normal',
                      color: 'var(--ps-text-60)'
                    }}
                  >
                    {getDateName(item.date)}
                  </Typography>
                  <Typography
                    variant="body1"
                    maxWidth={'calc(100vw - 120px)'}
                    sx={{
                      height: 44.8,
                      fontSize: 16,
                      fontWeight: 500,
                      lineHeight: '22.4px',
                      fontStyle: 'normal',
                      color: item.future ? 'var(--ps-text-40)' : 'var(--ps-text-100)',
                      overflow: 'auto',
                      wordBreak: 'break-word',
                      '&::-webkit-scrollbar': {
                        display: 'none'
                      }
                    }}
                  >
                    {item.eventName}
                  </Typography>
                  <Typography
                    variant="body2"
                    maxWidth={'calc(100vw - 120px)'}
                    sx={{
                      height: 60,
                      fontWeight: 400,
                      lineHeight: 1.4,
                      fontStyle: 'normal',
                      color: item.future ? 'var(--ps-text-40)' : 'var(--ps-text-60)',
                      overflow: 'auto',
                      wordBreak: 'break-word',
                      '&::-webkit-scrollbar': {
                        display: 'none'
                      }
                    }}
                  >
                    {item.description}
                  </Typography>
                </Stack>
              </Stack>
            )
          })}
        </Stack>
      ) : (
        <Stack
          flexDirection={'row'}
          sx={{
            width: '100%',
            overflow: 'auto',
            paddingBottom: 30,
            '&::-webkit-scrollbar': {
              height: 6
            },
            '&::-webkit-scrollbar-thumb': {
              backgroundColor: 'var(--ps-neutral3)',
              borderRadius: '4px'
            },
            '&::-webkit-scrollbar-thumb:hover': {
              backgroundColor: 'var(--ps-text-40)'
            },
            '&::-webkit-scrollbar-track': {
              backgroundColor: 'transparent'
            }
          }}
        >
          {roadmapData.map((item, index) => {
            return (
              <Stack key={index} flexDirection={'column'} alignItems={'flex-start'} width={231}>
                <Typography
                  variant="subtitle1"
                  width={183}
                  sx={{
                    fontWeight: 400,
                    lineHeight: 1.4,
                    fontStyle: 'normal',
                    color: 'var(--ps-text-60)',
                    marginBottom: 16,
                    whiteSpace: 'nowrap',
                    overflow: 'hidden',
                    textOverflow: 'ellipsis'
                  }}
                >
                  {getDateName(item.date)}
                </Typography>
                <Stack gap={4} flexDirection={'row'} alignItems={'center'}>
                  <Stack
                    alignItems={'center'}
                    justifyContent={'center'}
                    sx={{
                      width: 48,
                      height: 48,
                      background: 'var(--ps-neutral)',
                      border: `2px solid ${item.future ? 'transparent' : 'var(--ps-text-80)'}`,
                      borderRadius: '50%'
                    }}
                  >
                    <ColorfulFlags />
                  </Stack>
                  {index + 1 < roadmapData.length && (
                    <StyledLineSvg
                      color={
                        item.future
                          ? 'var(--ps-neutral)'
                          : getNow(item.date)
                            ? 'var(--ps-neutral)'
                            : 'var(--ps-neutral5)'
                      }
                    />
                  )}
                </Stack>
                <Typography
                  variant="body1"
                  width={183}
                  sx={{
                    height: 42,
                    fontWeight: 500,
                    lineHeight: 1.4,
                    fontStyle: 'normal',
                    color: item.future ? 'var(--ps-text-40)' : 'var(--ps-text-100)',
                    margin: '32px 0 16px',
                    overflow: 'auto',
                    wordBreak: 'break-word',
                    '&::-webkit-scrollbar': {
                      display: 'none'
                    }
                  }}
                >
                  {item.eventName}
                </Typography>
                <Typography
                  variant="body2"
                  width={183}
                  sx={{
                    height: 72,
                    fontWeight: 400,
                    lineHeight: 1.4,
                    fontStyle: 'normal',
                    color: item.future ? 'var(--ps-text-40)' : 'var(--ps-text-60)',
                    overflow: 'auto',
                    wordBreak: 'break-word',
                    '&::-webkit-scrollbar': {
                      display: 'none'
                    }
                  }}
                >
                  {item.description}
                </Typography>
              </Stack>
            )
          })}
        </Stack>
      )}
    </>
  )
}

const RoadmapBox2 = ({ roadmapData }: { roadmapData: RoadmapDataType[] }) => {
  const isMd = useBreakpoint('md')
  return (
    <Stack
      gap={16}
      flexDirection={isMd ? 'column' : 'row'}
      sx={{
        width: '100%',
        maxHeight: 'auto',
        overflow: isMd ? 'unset' : 'auto',
        paddingBottom: isMd ? 0 : 30,
        '&::-webkit-scrollbar': {
          height: 6,
          width: 6
        },
        '&::-webkit-scrollbar-thumb': {
          backgroundColor: 'var(--ps-neutral3)',
          borderRadius: '4px'
        },
        '&::-webkit-scrollbar-thumb:hover': {
          backgroundColor: 'var(--ps-text-40)'
        },
        '&::-webkit-scrollbar-track': {
          backgroundColor: 'transparent'
        }
      }}
    >
      {roadmapData.map((item, index) => {
        return (
          <Stack
            key={index}
            flexDirection={'column'}
            alignItems={'flex-start'}
            width={isMd ? '100%' : 247}
            sx={{
              borderLeft: `4px solid ${item.future ? 'var(--ps-text-40)' : 'var(--ps-text-100)'}`,
              padding: isMd ? '0 32px' : '0 16px 0 32px'
            }}
          >
            <Typography
              variant="h1"
              sx={{
                fontSize: isMd ? 40 : 64,
                lineHeight: isMd ? '30px' : '47.6px',
                fontWeight: 500,
                marginBottom: 12,
                color: item.future ? 'var(--ps-text-40)' : 'var(--ps-text-100)'
              }}
            >
              0{index + 1}
            </Typography>
            <Typography
              variant="subtitle1"
              width={183}
              sx={{
                fontWeight: 400,
                lineHeight: 1.4,
                fontStyle: 'normal',
                color: item.future ? 'var(--ps-text-40)' : 'var(--ps-text-60)',
                whiteSpace: 'nowrap',
                overflow: 'hidden',
                textOverflow: 'ellipsis'
              }}
            >
              {getDateName(item.date)}
            </Typography>
            <Typography
              variant={isMd ? 'h5' : 'body1'}
              width={isMd ? '100%' : 183}
              sx={{
                height: 44.8,
                fontWeight: 500,
                lineHeight: '22.4px',
                fontStyle: 'normal',
                color: item.future ? 'var(--ps-text-40)' : 'var(--ps-text-100)',
                margin: isMd ? '20px 0 12px' : '32px 0 12px',
                overflow: 'auto',
                wordBreak: 'break-word',
                '&::-webkit-scrollbar': {
                  display: 'none'
                }
              }}
            >
              {item.eventName}
            </Typography>
            <Typography
              variant={isMd ? 'caption' : 'body2'}
              width={isMd ? '100%' : 183}
              sx={{
                height: isMd ? 50.4 : 54.6,
                fontWeight: 400,
                lineHeight: isMd ? '16.8px' : '18.2px',
                fontStyle: 'normal',
                color: item.future ? 'var(--ps-text-40)' : 'var(--ps-text-60)',
                overflow: 'auto',
                wordBreak: 'break-word',
                '&::-webkit-scrollbar': {
                  display: 'none'
                }
              }}
            >
              {item.description}
            </Typography>
          </Stack>
        )
      })}
    </Stack>
  )
}

const Roadmap = ({ data }: { data: IBoxAboutSectionTypeRoadmapValue }) => {
  const roadmapData: RoadmapDataType[] = useMemo(() => {
    return data.roadmapItem.map(item => {
      return {
        date: item.date,
        eventName: item.eventName,
        description: item.description,
        future: getFeature(item.date)
      }
    })
  }, [data])
  return (
    <>{data.style === '0' ? <RoadmapBox roadmapData={roadmapData} /> : <RoadmapBox2 roadmapData={roadmapData} />}</>
  )
}

export default Roadmap
