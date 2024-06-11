import { Box, Typography, Stack } from '@mui/material'
import TagSvg from 'assets/svg/home/tag_icon.svg'
import RightArrowSvg from 'assets/svg/account/arrow.svg'
import useBreakpoint from 'hooks/useBreakpoint'
import { usePluginListDatas } from 'state/pluginListConfig/hooks'
import { useMemo } from 'react'
import { useRouter } from 'next/router'
import { ROUTES } from 'constants/routes'
import { IBoxTypes } from 'api/boxes/type'
import PluginBg1 from 'assets/images/appStore/plugin-bg-1.png'
import PluginBg2 from 'assets/images/appStore/plugin-bg-2.png'
import PluginBg3 from 'assets/images/appStore/plugin-bg-3.png'
import PluginBg4 from 'assets/images/appStore/plugin-bg-4.png'
import styled from '@emotion/styled'
import Image from 'components/Image'
const PluginCard = ({
  category,
  icon,
  title,
  content,
  banner,
  pluginId
}: {
  category: string
  icon: string
  title: string
  content: string
  banner: string
  pluginId: number
}) => {
  const isMd = useBreakpoint('md')
  const router = useRouter()
  return (
    <HoverBox
      onClick={() => router.push(ROUTES.appStore.pluginDetail(pluginId))}
      sx={{
        maxWidth: '588px',
        width: { xs: 300, md: '100%' },
        height: { xs: 300, md: 400 },
        borderRadius: '16px',
        position: 'relative',
        overflow: 'hidden',
        flexShrink: { xs: 0, md: 'unset' },
        display: 'flex',
        flexDirection: 'column'
      }}
    >
      <Box
        width={'100%'}
        height={'max-content'}
        flex={1}
        sx={{
          // background: `url(${banner}) no-repeat`,
          backgroundSize: '100%',
          overflow: 'hidden'
        }}
      >
        <Image src={banner} alt="png" width={'100%'} />
      </Box>

      <Box
        sx={{
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'space-between',
          width: '100%',
          height: '100%',
          position: 'absolute',
          zIndex: 9,
          paddingTop: '24px'
        }}
      >
        <Box
          sx={{
            width: '100%',
            display: 'flex',
            justifyContent: 'space-between',
            padding: '0 24px'
          }}
        >
          <Box
            sx={{
              backgroundColor: 'var(--ps-neutral4)',
              padding: '2px 8px',
              display: 'flex',
              gap: '4px',
              borderRadius: '16px',
              alignItems: 'center'
            }}
          >
            <TagSvg />
            <Typography variant="body2" fontSize={12} color={'var(--ps-neutral)'}>
              {category}
            </Typography>
          </Box>
          <RightArrowSvg />
        </Box>
      </Box>
      <Box
        sx={{
          display: 'flex',
          gap: '20px',
          minHeight: { xs: '140px', md: 'unset' },
          height: { xs: 'auto', md: '140px' },
          padding: '0 20px',
          alignItems: 'center'
        }}
      >
        <Image src={icon} alt="png" width={isMd ? 56 : 80} height={isMd ? 56 : 80} style={{ borderRadius: 13.617 }} />
        <Stack spacing={12}>
          <Typography variant={isMd ? 'h4' : 'h3'}>{title || '--'}</Typography>
          <Typography
            fontSize={{ xs: 12, md: 15 }}
            fontWeight={400}
            lineHeight={1.4}
            maxWidth={{ xs: 180, md: 'unset' }}
            sx={{ display: '-webkit-box', WebkitBoxOrient: 'vertical', overflow: 'hidden', WebkitLineClamp: 4 }}
          >
            {content || '--'}
          </Typography>
        </Stack>
      </Box>
    </HoverBox>
  )
}
const bgArr = [PluginBg1.src, PluginBg3.src, PluginBg4.src, PluginBg2.src]
export default function Index() {
  const { list: _datas } = usePluginListDatas()
  const datas = useMemo(() => {
    return _datas
      .filter(i => i.status === IBoxTypes.Normal)
      .map(i => ({
        category: i.category,
        icon: i.icon,
        title: i.pluginName,
        content: i.introduction,
        banner: bgArr[i.id - 1] ? bgArr[i.id - 1] : i.banner,
        pluginId: i.id
      }))
  }, [_datas])
  const isMd = useBreakpoint('md')
  if (isMd) {
    return (
      <Stack width="100%" spacing={24}>
        <Typography variant="h3">Featured Apps</Typography>

        <Box
          sx={{
            display: 'flex',
            gap: '16px',
            overflowX: 'auto',
            '::-webkit-scrollbar': {
              display: 'none'
            }
          }}
        >
          {datas.map(v => (
            <PluginCard
              category={v.category}
              pluginId={v.pluginId}
              key={v.title}
              icon={v.icon}
              title={v.title}
              content={v.content}
              banner={v.banner}
            />
          ))}
        </Box>
      </Stack>
    )
  }
  return (
    <Stack width="100%" spacing={24}>
      <Typography variant="h3">Featured Apps</Typography>
      <Box
        sx={{
          width: '100%',
          display: 'grid',
          gridTemplateColumns: '1fr 1fr',
          gap: '24px'
        }}
      >
        {datas.map(v => (
          <PluginCard
            category={v.category}
            pluginId={v.pluginId}
            key={v.title}
            icon={v.icon}
            title={v.title}
            content={v.content}
            banner={v.banner}
          />
        ))}
      </Box>
    </Stack>
  )
}

export const HoverBox = styled(Box)<{ isNoHover?: boolean }>`
  cursor: ${({ isNoHover }) => !isNoHover && 'pointer'};

  &:hover {
    background-color: ${({ isNoHover }) => !isNoHover && 'var(--ps-text-10)'};
  }
`
