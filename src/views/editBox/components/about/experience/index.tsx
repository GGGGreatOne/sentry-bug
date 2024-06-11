import { Box, Stack, Typography } from '@mui/material'
import Image from 'next/image'
import { IBoxAboutSectionTypeExperienceValue } from 'state/boxes/type'
import ExperienceIcon from 'assets/svg/boxes/experience.svg'
import useBreakpoint from 'hooks/useBreakpoint'

const Experience = ({ data }: { data: IBoxAboutSectionTypeExperienceValue }) => {
  const isMd = useBreakpoint('md')
  return (
    <Stack gap={32} flexDirection={'column'} alignItems={'center'} width={'100%'}>
      {data.experienceItem.map((item, index) => {
        return (
          <Stack key={index} flexDirection={'column'} width={'100%'}>
            <Stack
              flexDirection={'row'}
              alignItems={'center'}
              gap={16}
              sx={{
                width: '100%',
                paddingBottom: 16,
                borderBottom: '1px solid var(--ps-text-20)'
              }}
            >
              <Box
                sx={{
                  width: isMd ? 64 : 80,
                  height: isMd ? 64 : 80,
                  borderRadius: '50%',
                  border: '2px solid var(--ps-neutral4)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center'
                }}
              >
                {item.picture ? (
                  <Image
                    width={isMd ? 60 : 76}
                    height={isMd ? 60 : 76}
                    src={item.picture}
                    alt={''}
                    style={{ borderRadius: 'inherit' }}
                  />
                ) : (
                  <Stack alignItems={'center'} justifyContent={'center'} width={isMd ? 60 : 76} height={isMd ? 60 : 76}>
                    <ExperienceIcon style={{ margin: '0 auto' }} />
                  </Stack>
                )}
              </Box>
              <Stack width={'88%'} flex={1} gap={6} flexDirection={'column'}>
                <Typography
                  variant="h3"
                  noWrap
                  sx={{
                    width: isMd ? 'calc(100vw - 152px)' : 1,
                    fontSize: isMd ? 15 : 16,
                    color: 'var(--ps-text-80)',
                    fontWeight: 400,
                    lineHeight: isMd ? '21px' : '22.4px',
                    fontStyle: 'normal',
                    whiteSpace: 'nowrap',
                    overflow: 'Hidden',
                    textOverflow: 'ellipsis'
                  }}
                >
                  {item.name}
                </Typography>
                <Typography
                  variant="h4"
                  noWrap
                  sx={{
                    width: isMd ? 'calc(100vw - 152px)' : 1,
                    color: 'var(--ps-text-80)',
                    fontWeight: 500,
                    fontSize: isMd ? 13 : 15,
                    lineHeight: isMd ? '13px' : '15px',
                    fontStyle: 'normal',
                    whiteSpace: 'nowrap',
                    overflow: 'Hidden',
                    textOverflow: 'ellipsis'
                  }}
                >
                  {item.title}
                </Typography>
                <Typography
                  variant="h4"
                  noWrap
                  sx={{
                    width: isMd ? 'calc(100vw - 152px)' : 1,
                    color: 'var(--ps-text-60)',
                    fontWeight: 500,
                    fontSize: isMd ? 12 : 13,
                    lineHeight: isMd ? '12px' : '13px',
                    fontStyle: 'normal',
                    whiteSpace: 'nowrap',
                    overflow: 'Hidden',
                    textOverflow: 'ellipsis'
                  }}
                >
                  {item.description}
                </Typography>
              </Stack>
            </Stack>
          </Stack>
        )
      })}
    </Stack>
  )
}

export default Experience
