import { Box, Stack, Typography } from '@mui/material'
import Image from 'next/image'
import { useState } from 'react'
import { TeamValueItem, IBoxAboutSectionTypeTeamValue } from 'state/boxes/type'
import Avatar from 'assets/svg/boxes/avatar.svg'
import ArrowIcon from 'assets/svg/account/arrow.svg'
import useBreakpoint from 'hooks/useBreakpoint'
import PersonIcon from '@mui/icons-material/Person'
const TeamItem = ({ item, width, isMd }: { item: TeamValueItem; width: string; isMd: boolean }) => {
  return (
    <Stack
      width={width}
      gap={24}
      flexDirection={'column'}
      alignItems={'center'}
      sx={{ background: 'var(--ps-neutral)', padding: '32px 0', borderRadius: isMd ? 8 : 16 }}
    >
      <Box
        sx={{
          width: isMd ? 80 : 125,
          height: isMd ? 80 : 125,
          borderRadius: '50%',
          border: '2px solid var(--ps-neutral4)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center'
        }}
      >
        {item.avatar ? (
          <Image
            width={isMd ? 76 : 121}
            height={isMd ? 76 : 121}
            src={item.avatar}
            alt={''}
            style={{ borderRadius: 'inherit' }}
          />
        ) : (
          <Avatar style={{ margin: '0 auto' }} />
        )}
      </Box>
      <Stack width={'80%'} flexDirection={'column'} alignItems={'center'}>
        <Typography
          variant="h3"
          sx={{
            fontSize: isMd ? 20 : 28,
            color: 'var(--ps-text-100)',
            fontWeight: 500,
            lineHeight: isMd ? '28px' : '39.2px',
            fontStyle: 'normal',
            textAlign: 'center',
            marginBottom: 10,
            width: '90%',
            whiteSpace: 'nowrap',
            overflow: 'Hidden',
            textOverflow: 'ellipsis'
          }}
        >
          {item.name}
        </Typography>
        <Typography
          variant="h4"
          sx={{
            height: isMd ? '19.5px' : '26px',
            color: 'var(--ps-text-80)',
            fontWeight: 500,
            fontSize: isMd ? 15 : 20,
            lineHeight: isMd ? '19.5px' : '26px',
            fontStyle: 'normal',
            textAlign: 'center',
            width: '100%',
            whiteSpace: 'nowrap',
            overflow: 'Hidden',
            textOverflow: 'ellipsis'
          }}
        >
          {item.position}
        </Typography>
      </Stack>
    </Stack>
  )
}

const TeamItem2 = ({ item, width, isMd }: { item: TeamValueItem; width: string; isMd: boolean }) => {
  return (
    <Stack
      height={312}
      width={width}
      flexDirection={'column'}
      alignItems={'center'}
      justifyContent={'end'}
      sx={{
        position: 'relative',
        background: item.avatar ? 'none' : 'var(--ps-neutral3)',
        backgroundImage: `url(${item.avatar})`,
        backgroundSize: '100% 100%',
        borderRadius: isMd ? 8 : 16
      }}
    >
      {!item.avatar && (
        <PersonIcon
          sx={{
            fontSize: 123,
            color: 'var(--ps-text-20)',
            position: 'absolute',
            top: '50%',
            left: '50%',
            transform: 'translate(-50%,-65%)'
          }}
        />
      )}
      <Stack
        gap={2}
        width={'90%'}
        flexDirection={'column'}
        alignItems={'center'}
        sx={{
          borderRadius: 100,
          border: '1px solid #000000',
          padding: '6px 24px 2px',
          marginBottom: 10,
          background: 'var(--ps-text-100)'
        }}
      >
        <Typography
          variant="h3"
          sx={{
            fontSize: isMd ? 15 : 20,
            color: 'var(--ps-text-primary)',
            fontWeight: 500,
            lineHeight: isMd ? '19.5px' : '26px',
            fontStyle: 'normal',
            textAlign: 'center',
            width: '90%',
            whiteSpace: 'nowrap',
            overflow: 'Hidden',
            textOverflow: 'ellipsis'
          }}
        >
          {item.name}
        </Typography>
        <Typography
          variant="h4"
          sx={{
            height: isMd ? '21px' : '22.4px',
            color: 'var(--ps-text-primary)',
            fontWeight: 400,
            fontSize: isMd ? 15 : 16,
            lineHeight: isMd ? '21px' : '22.4px',
            fontStyle: 'normal',
            textAlign: 'center',
            width: '100%',
            whiteSpace: 'nowrap',
            overflow: 'Hidden',
            textOverflow: 'ellipsis'
          }}
        >
          {item.position}
        </Typography>
      </Stack>
    </Stack>
  )
}

const getWidth = (index: number, length: number) => {
  if (length % 3 === 0) {
    return '32%'
  } else if (length % 3 === 1) {
    if (length < 3) {
      return '100%'
    } else {
      if (index < length) {
        return '32%'
      } else {
        return '100%'
      }
    }
  } else {
    if (length < 3) {
      return '49%'
    } else {
      if (index < length - 1) {
        return '32%'
      } else {
        return '49%'
      }
    }
  }
}

const getAppWidth = (index: number, length: number) => {
  if (length % 2 === 0) {
    return '47%'
  } else {
    if (length < 2) {
      return '100%'
    } else {
      if (index < length) {
        return '47%'
      } else {
        return '100%'
      }
    }
  }
}

const Team = ({ data }: { data: IBoxAboutSectionTypeTeamValue }) => {
  const isMd = useBreakpoint('md')
  const [show, setShow] = useState(false)

  const TeamItemMoudle = ({
    item,
    isMd,
    index,
    min,
    max
  }: {
    item: TeamValueItem
    isMd: boolean
    index: number
    min: number
    max: number
  }) => {
    if (data.style === '0') {
      return (
        <TeamItem
          isMd={isMd}
          item={item}
          width={
            isMd
              ? getAppWidth(index + 1, data.teamItem.slice(min, max).length)
              : getWidth(index + 1, data.teamItem.slice(min, max).length)
          }
        />
      )
    } else {
      return (
        <TeamItem2
          isMd={isMd}
          item={item}
          width={isMd ? '100%' : getWidth(index + 1, data.teamItem.slice(min, max).length)}
        />
      )
    }
  }
  return (
    <Stack gap={16} flexDirection={'column'} alignItems={'center'}>
      <Stack gap={16} flexDirection={'row'} alignItems={'center'} width={'100%'} flexWrap={'wrap'}>
        {data.teamItem.slice(0, 6).map((item, index) => {
          return <TeamItemMoudle key={index} isMd={isMd} item={item} index={index} min={0} max={6} />
        })}
      </Stack>
      {show && (
        <Stack gap={16} flexDirection={'row'} alignItems={'center'} width={'100%'}>
          {data.teamItem.slice(6, data.teamItem.length).map((item, index) => {
            return (
              <TeamItemMoudle key={index} isMd={isMd} item={item} index={index} min={6} max={data.teamItem.length} />
            )
          })}
        </Stack>
      )}
      {data.teamItem.length > 6 && (
        <Stack
          flexDirection={'row'}
          alignItems={'center'}
          sx={{
            '& svg': {
              transform: show ? 'rotate(-90deg)' : 'rotate(90deg)'
            }
          }}
          onClick={() => {
            setShow(!show)
          }}
        >
          <Typography
            variant="h5"
            sx={{
              marginRight: 3,
              fontSize: 15,
              fontWeight: 500,
              lineHeight: '15px',
              color: 'var(--ps-text-80)'
            }}
          >
            {show ? 'Hide' : 'Show More'}
          </Typography>
          <ArrowIcon />
        </Stack>
      )}
    </Stack>
  )
}

export default Team
