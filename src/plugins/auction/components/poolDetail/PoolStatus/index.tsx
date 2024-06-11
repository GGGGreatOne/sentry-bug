import { Stack, Typography, styled } from '@mui/material'
import React from 'react'
import { useCountDown } from 'ahooks'
import { PoolStatus } from 'api/type'
import { useActiveWeb3React } from 'hooks'
import WarningIcon from '../../../assets/svg/warning-icon.svg'
export interface PoolStatusBoxProps {
  status?: PoolStatus
  openTime: number
  closeTime: number
  claimAt: number
  onEnd?: () => void
  style?: React.CSSProperties
  showCreatorClaim?: boolean
  showParticipantClaim?: boolean
  hideUpcomingCountdown?: boolean
}

const StatusContainer = styled(Stack)`
  display: flex;
  flex-direction: row;
  padding: 4px 12px;
  align-items: center;
  gap: 10px;
  border-radius: 100px;
  backdrop-filter: blur(2px);
`
const UpcomingTitle = styled(Typography)`
  color: #4f5ffc;
  text-align: center;
  font-family: Inter;
  font-size: 12px;
  font-style: normal;
  font-weight: 400;
  line-height: 140%;
`
const LiveTitle = styled(Typography)`
  color: #30a359;
  text-align: center;
  font-family: Inter;
  font-size: 12px;
  font-style: normal;
  font-weight: 400;
  line-height: 140%; /* 16.8px */
`
const ClosedTitle = styled(Typography)`
  color: var(--red-nagative, #fd3333);
  text-align: center;

  /* D/small */
  font-family: Inter;
  font-size: 12px;
  font-style: normal;
  font-weight: 400;
  line-height: 140%; /* 16.8px */
`
const PoolStatusBox = ({
  status,
  openTime,
  closeTime,
  claimAt,
  onEnd,
  style,
  hideUpcomingCountdown,
  showCreatorClaim,
  showParticipantClaim
}: PoolStatusBoxProps): JSX.Element => {
  const { account } = useActiveWeb3React()
  const [countdown, { days, hours, minutes, seconds }] = useCountDown({
    targetDate:
      status === PoolStatus.Upcoming
        ? openTime * 1000
        : status === PoolStatus.Live
          ? closeTime * 1000
          : status === PoolStatus.Closed
            ? claimAt * 1000
            : undefined,
    onEnd
  })

  switch (status) {
    case PoolStatus.Upcoming:
      return (
        <StatusContainer
          style={{
            background: '#DBDEFF',
            backdropFilter: 'blur(2px)',
            ...style
          }}
        >
          <UpcomingTitle>Upcoming</UpcomingTitle>
          {countdown > 0 && !hideUpcomingCountdown && (
            <UpcomingTitle sx={{ whiteSpace: 'nowrap' }}>
              &nbsp;{days}d : {hours}h : {minutes}m: {seconds}
            </UpcomingTitle>
          )}
        </StatusContainer>
      )

    case PoolStatus.Live:
      return (
        <StatusContainer style={{ background: 'var(--green, #CFF8D1)', ...style }}>
          <LiveTitle>Live</LiveTitle>
          {countdown > 0 && (
            <LiveTitle>
              &nbsp;{days}d : {hours}h : {minutes}m : {seconds}s
            </LiveTitle>
          )}
        </StatusContainer>
      )

    case PoolStatus.Closed:
      return (
        <StatusContainer sx={{ background: 'var(--red, #F9E3DA)', ...style }}>
          <ClosedTitle variant="body1" color="#2663FF">
            Closed
          </ClosedTitle>

          {showParticipantClaim && account && (
            <Stack flexDirection={'row'} alignContent={'center'}>
              {countdown > 0 && (
                <>
                  <WarningIcon style={{ marginRight: '4px', verticalAlign: 'middle' }} />
                  <ClosedTitle>
                    {days}d : {hours}h : {minutes}m : {seconds}s
                  </ClosedTitle>
                </>
              )}

              {countdown <= 0 && (
                <>
                  <WarningIcon style={{ marginRight: '4px', verticalAlign: 'middle' }} />
                  <ClosedTitle>Claimable</ClosedTitle>
                </>
              )}
            </Stack>
          )}
          {showCreatorClaim && account && status === PoolStatus.Closed && (
            <StatusContainer sx={{ background: 'var(--red, #F9E3DA)', ...style }}>
              <WarningIcon style={{ marginRight: '4px', verticalAlign: 'middle' }} />
              <ClosedTitle>Claimable</ClosedTitle>
            </StatusContainer>
          )}
        </StatusContainer>
      )
    case PoolStatus.Cancelled:
      return (
        <StatusContainer sx={{ background: 'var(--red, #F9E3DA)', ...style }}>
          <ClosedTitle variant="body1" color="#2663FF">
            Cancelled
          </ClosedTitle>
        </StatusContainer>
      )

    default:
      return <></>
  }
}

export default PoolStatusBox
