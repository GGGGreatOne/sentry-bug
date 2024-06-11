import { Typography, styled } from '@mui/material'
import { useRequest } from 'ahooks'
import { followBox } from 'api/user'
import { useCallback, useState } from 'react'
import { useUserInfo } from 'state/user/hooks'
import { LoadingButton } from '@mui/lab'
import useBreakpoint from 'hooks/useBreakpoint'
import AddIcon from '@mui/icons-material/Add'

const CusButton = styled(LoadingButton)<{ hasShadow: boolean }>(({ hasShadow }) => ({
  boxShadow: hasShadow ? '2px 2px 4px rgba(0, 0, 0, 0.5)' : '',
  padding: '6px 16px',

  'h5:first-of-type': {
    display: 'block'
  },
  'h5:last-child': {
    display: 'none'
  },
  '&:hover h5:first-of-type': {
    display: 'none'
  },
  '&:hover h5:last-child': {
    display: 'block'
  }
}))

const MdCusButton = styled(LoadingButton)<{ hasShadow: boolean; isSuccess?: boolean }>(({ hasShadow, isSuccess }) => ({
  boxShadow: hasShadow ? '2px 2px 4px rgba(0, 0, 0, 0.5)' : '',
  padding: '6px 16px',

  'h5:first-of-type': {
    display: 'block'
  },
  'h5:last-child': {
    display: 'none'
  },

  '@media (hover: none)': {
    '&:hover': {
      backgroundColor: isSuccess ? 'var(--ps-neutral3)' : 'var(--ps-text-100)'
    }
  }
}))

const FollowButton = ({
  isFollower,
  boxId,
  callBack,
  hasShadow = false,
  isOutlined = false
}: {
  isFollower: boolean
  boxId: number
  callBack: () => void
  hasShadow?: boolean
  isOutlined?: boolean
}) => {
  const isMd = useBreakpoint('md')
  const Button = isMd ? MdCusButton : CusButton
  const userInfo = useUserInfo()
  const [isSuccess, setIsSuccess] = useState(isFollower)
  // useEffect(() => {
  //   setIsSuccess(isFollower)
  // }, [isFollower])
  const { run, loading } = useRequest(
    async () => {
      const params = {
        boxId,
        following: isSuccess ? 0 : 1
      }
      const res = followBox(params)
      return res
    },
    {
      manual: true
    }
  )

  const followHandle = useCallback(
    async (e: React.MouseEvent<HTMLButtonElement>) => {
      e.stopPropagation()

      try {
        await run()
        callBack()
        setIsSuccess(!isSuccess)
      } catch (error) {}
    },
    [run, callBack, isSuccess]
  )

  if (userInfo.box?.boxId === boxId.toString()) {
    return null
  }

  return (
    <Button
      size="medium"
      hasShadow={hasShadow}
      variant={isOutlined ? 'outlined' : 'contained'}
      onClick={followHandle}
      loading={loading}
      sx={{
        background: isOutlined ? 'transparent' : isSuccess ? 'var(--ps-neutral3)' : 'var(--ps-text-100)'
      }}
      isSuccess={isSuccess}
    >
      {isOutlined && !isSuccess && <AddIcon sx={{ fontSize: 13, marginRight: 3 }} />}
      <Typography variant="h5">{isSuccess ? 'Following' : 'Follow'}</Typography>
      {<Typography variant="h5">{isSuccess ? 'Unfollow' : 'Follow'}</Typography>}
    </Button>
  )
}
export default FollowButton
