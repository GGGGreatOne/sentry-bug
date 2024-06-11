import { Box, styled, Typography } from '@mui/material'

const RankBox = styled(Box)`
  display: flex;
  padding: 3px 8px;
  align-items: center;
  gap: 6px;
  border-radius: 100px;
  background: var(--ps-neutral2);
`

const RankItem = ({ rank }: { rank: number | null }) => {
  return (
    <RankBox>
      <Typography fontSize={12} lineHeight={'140%'} color={'var(--ps-text-100)'}>
        Rank {rank || '--'}
      </Typography>
    </RankBox>
  )
}
export default RankItem
