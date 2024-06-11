import { Box, Stack, styled, Typography } from '@mui/material'
import useBreakpoint from 'hooks/useBreakpoint'
import { useCreateParams } from 'plugins/auction/pages/erc20-create-pool/provider'

const TabContainer = styled(Stack)`
  width: 100%;
  padding: 24px;
  flex-direction: row;
  justify-items: center;
  align-items: center;
  gap: 16px;
  border-radius: 16px;
  &.selected {
    background: linear-gradient(
        0deg,
        var(--text-10, rgba(255, 255, 229, 0.1)) 0%,
        var(--text-10, rgba(255, 255, 229, 0.1)) 100%
      ),
      var(--Neutral-1, #1c1c19);
  }
  & p {
    color: var(--text-100, #ffffe5);
    font-family: 'IBM Plex Sans';
    font-size: 20px;
    font-style: normal;
    font-weight: 500;
    line-height: 130%;
  }
  & .num-round {
    width: 32px;
    height: 32px;
    display: flex;
    justify-content: center;
    align-items: center;
    border-radius: 100px;
    border: 1px solid var(--text-10, rgba(255, 255, 229, 0.1));
    color: var(--text-100, #ffffe5);
    font-family: 'IBM Plex Sans';
    font-size: 15px;
    font-style: normal;
    font-weight: 500;
    line-height: 140%; /* 21px */
  }
  @media (max-width: ${({ theme }) => theme.breakpoints.values.md}px) {
    padding: 12px;
    & p {
      font-size: 16px;
    }
  }
`
export default function Page() {
  const { state } = useCreateParams()
  const isSelect = (i: number) => {
    if (state.activeTab.index === i) {
      return 'selected'
    }
    return ''
  }
  const isMd = useBreakpoint('md')
  return (
    <Stack
      justifyContent={'center'}
      sx={{ width: '100%', height: 'fit-content', padding: 8, borderRadius: 24, background: '#1B1B1B', gap: 8 }}
    >
      {state.activeTab.tabs.map((item, index) => {
        if (!index) {
          if (isMd && !isSelect(index)) {
            return null
          }
          return (
            <TabContainer key={item + index} className={isSelect(index)}>
              <Box className="num-round">
                <span>{index + 1}</span>
              </Box>
              <Typography>Basic Information</Typography>
            </TabContainer>
          )
        }
        if (index === 1) {
          if (isMd && !isSelect(index)) {
            return null
          }
          return (
            <TabContainer key={item + index} className={isSelect(index)}>
              <Box className="num-round">
                <span>{index + 1}</span>
              </Box>
              <Typography>Auction Information</Typography>
            </TabContainer>
          )
        }
        if (isMd && !isSelect(index)) {
          return null
        }
        return (
          <TabContainer key={item + index} className={isSelect(index)}>
            <Box className="num-round">
              <span>{index + 1}</span>
            </Box>
            <Typography>Distribution Setting</Typography>
          </TabContainer>
        )
      })}
    </Stack>
  )
}
