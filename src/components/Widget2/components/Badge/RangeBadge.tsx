import { AlertTriangle, Slash } from 'react-feather'
import styled, { useTheme } from 'styled-components'
import { Stack, Typography } from '@mui/material'
import Tooltip from 'components/Tooltip'

const BadgeText = styled.div`
  font-weight: 535;
  font-size: 12px;
  line-height: 14px;
  margin-right: 8px;
`

const LabelText = styled.div<{ color: string }>`
  align-items: center;
  color: ${({ color }) => color};
  display: flex;
  flex-direction: row;
  justify-content: flex-end;
`

export default function RangeBadge({ removed, inRange }: { removed?: boolean; inRange?: boolean }) {
  const theme = useTheme()
  return (
    <Stack direction={'row'} alignItems={'center'}>
      {removed ? (
        <Tooltip title={<>Your position has 0 liquidity, and is not earning fees.</>}>
          <LabelText color={theme.neutral2}>
            <BadgeText>
              <Typography>Closed</Typography>
            </BadgeText>
            <Slash width={12} height={12} />
          </LabelText>
        </Tooltip>
      ) : inRange ? (
        <Tooltip
          title={<>The price of this pool is within your selected range. Your position is currently earning fees.</>}
        >
          <Stack direction={'row'} spacing={8} alignItems={'center'}>
            <Typography color={'#40b66b'}>In range</Typography>
            <div
              style={{
                backgroundColor: '#40b66b',
                borderRadius: '50%',
                height: 8,
                width: 8
              }}
            ></div>
          </Stack>
        </Tooltip>
      ) : (
        <Tooltip
          title={
            <>The price of this pool is outside of your selected range. Your position is not currently earning fees.</>
          }
        >
          <LabelText color={theme.deprecated_accentWarning}>
            <BadgeText>
              <Typography>Out of range</Typography>
            </BadgeText>
            <AlertTriangle width={12} height={12} />
          </LabelText>
        </Tooltip>
      )}
    </Stack>
  )
}
