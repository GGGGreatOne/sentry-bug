import { Box, styled, Typography } from '@mui/material'
import { PoolStatus } from 'api/type'
const DotColor: Record<PoolStatus, string> = {
  [PoolStatus.Upcoming]: '#F60',
  [PoolStatus.Live]: '#30AD44',
  [PoolStatus.Closed]: 'rgba(255, 255, 255, 0.5)',
  [PoolStatus.Finish]: 'rgba(255, 255, 255, 0.5)',
  [PoolStatus.Cancelled]: 'rgba(255, 255, 255, 0.5)'
}
const TextColor: Record<PoolStatus, string> = {
  [PoolStatus.Upcoming]: 'var(--ps-text-100)',
  [PoolStatus.Live]: 'var(--ps-text-100)',
  [PoolStatus.Closed]: 'var(--ps-text-100)',
  [PoolStatus.Finish]: 'var(--ps-text-100)',
  [PoolStatus.Cancelled]: 'var(--ps-text-100)'
}
const Value: Record<PoolStatus, string> = {
  [PoolStatus.Upcoming]: 'Coming Soon',
  [PoolStatus.Live]: 'Live',
  [PoolStatus.Closed]: 'Closed',
  [PoolStatus.Finish]: 'Finish',
  [PoolStatus.Cancelled]: 'Cancelled'
}

const StatusBox = styled(Box)`
  display: flex;
  padding: 3px 8px;
  align-items: center;
  gap: 6px;
  border-radius: 100px;
  background: var(--ps-neutral2);
`
const Dot = styled(Box)`
  width: 4px;
  height: 4px;
  border-radius: 100%;
`
const StatusItem = ({ status }: { status: PoolStatus }) => {
  return (
    <StatusBox>
      <Dot sx={{ background: DotColor[status] }} />
      <Typography fontSize={12} lineHeight={'140%'} color={TextColor[status]}>
        {Value[status]}
      </Typography>
    </StatusBox>
  )
}
export default StatusItem
