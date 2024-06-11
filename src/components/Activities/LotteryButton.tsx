import { Button, styled, Typography, Box } from '@mui/material'
import { useMemo } from 'react'
import { useActiveWeb3React } from '../../hooks'
import JoinedSvg from '../../assets/svg/activeties/joined.svg'
import dayjs from 'dayjs'

const StyledJoinedSvg = styled(JoinedSvg)(({ theme }) => ({
  cursor: 'pointer',
  '& path': {
    fill: theme.palette.background.default
  }
}))

const LotteryButton = ({
  userIsBet,
  userIsWon,
  bet,
  currentEpoch
}: {
  userIsBet: boolean
  userIsWon: boolean
  bet: (...params: any[]) => Promise<unknown>
  currentEpoch: number
}) => {
  const { account } = useActiveWeb3React()
  const lotteryBtnDisable = useMemo(() => {
    return !account
  }, [account])
  const isProgress = useMemo(() => {
    if (dayjs().format('YYYY-MM-DD') !== dayjs(currentEpoch * 1000).format('YYYY-MM-DD')) return false
    return true
  }, [currentEpoch])
  return (
    <Box>
      {!userIsBet && !userIsWon ? (
        <Button variant="contained" disabled={lotteryBtnDisable} size="large" onClick={bet}>
          Lock 10 $BB to Join
        </Button>
      ) : (
        <Button variant="contained" disabled size="large">
          You are in the draw <StyledJoinedSvg />
        </Button>
      )}
      {userIsBet && !userIsWon && isProgress && (
        <Typography variant="h5" mt={20}>
          Lottery drawing in progress…
        </Typography>
      )}
    </Box>
  )
}

export default LotteryButton
