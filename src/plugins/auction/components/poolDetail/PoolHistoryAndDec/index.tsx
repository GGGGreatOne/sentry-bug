import { Box, Stack, styled } from '@mui/material'
import AuctionHistory from '../ActionHistory'
import { useMemo, useState } from 'react'
import { IAuctionDetail } from 'plugins/auction/api/type'
import ReactMarkdown from 'react-markdown'
const LeftTab = styled(Stack)`
  width: 100%;
  flex-direction: row;
  align-items: center;
  gap: 16px;
  padding: 24px;
  border-radius: 16px;
  cursor: pointer;
  color: #e6e6ce;
  font-family: 'IBM Plex Sans';
  font-style: normal;
  font-weight: 500;
  line-height: 130%;
  &.active,
  &:hover {
    background: linear-gradient(
        0deg,
        var(--text-10, rgba(230, 230, 206, 0.1)) 0%,
        var(--text-10, rgba(230, 230, 206, 0.1)) 100%
      ),
      var(--Neutral-1, #1c1c19);
  }
  & .num {
    align-items: center;
    justify-content: center;
    width: 32px;
    height: 32px;
    border-radius: 100px;
    border: 1px solid rgba(230, 230, 206, 0.1);
    font-size: 15px;
  }
  & .name {
    font-size: 20px;
  }
`
interface IProps {
  auction: IAuctionDetail | undefined
  swapRatio: string | undefined
  hideHistory?: boolean
}
enum Tabs {
  'AuctionHistory' = 'Auction History',
  'AuctionDescription' = 'Auction Description'
}
export default function PoolHistoryAndDec({ auction, swapRatio, hideHistory = false }: IProps) {
  const [tabs, setTabs] = useState(hideHistory ? Tabs.AuctionDescription : Tabs.AuctionHistory)
  const AuctionDescriptionTab = ({ num }: { num: number }) => {
    return (
      <LeftTab
        className={tabs === Tabs.AuctionDescription ? 'active' : ''}
        onClick={() => setTabs(Tabs.AuctionDescription)}
      >
        <Stack className="num">{num}</Stack>
        <Box className="name">{Tabs.AuctionDescription}</Box>
      </LeftTab>
    )
  }
  const AuctionHistoryTab = ({ num }: { num: number }) => {
    return (
      <LeftTab className={tabs === Tabs.AuctionHistory ? 'active' : ''} onClick={() => setTabs(Tabs.AuctionHistory)}>
        <Stack className="num">{num}</Stack>
        <Box className="name">{Tabs.AuctionHistory}</Box>
      </LeftTab>
    )
  }
  // history tab need stay first
  const tabsArr = useMemo(
    () =>
      !hideHistory
        ? [<AuctionHistoryTab num={1} key={1} />, <AuctionDescriptionTab num={2} key={2} />]
        : [<AuctionDescriptionTab num={1} key={1} />],
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [hideHistory, tabs]
  )
  return (
    <Box sx={{ background: '#000', width: '100%', padding: { xs: 32, md: 64 } }}>
      <Box
        sx={{
          display: 'grid',
          gridTemplateColumns: { xs: '1fr', md: 'minmax(200px,360px) 1fr' },
          gridColumnGap: 20,
          width: '100%',
          maxWidth: 1200,
          margin: '0 auto',
          height: { xs: '100%', md: 692 }
          // padding: { xs: 20, md: '20px 72px' }
        }}
      >
        <Stack
          sx={{
            height: 'fit-content',
            gap: 10,
            borderRadius: 24,
            background: ' #1C1C19',
            p: 8,
            pb: { xs: 44, md: 88 },
            '&>div': { padding: { xs: 12, md: 24 } },
            '& .name': {
              fontSize: { xs: 14, md: 20 }
            }
          }}
        >
          {tabsArr}
        </Stack>
        <Box
          sx={{
            height: { xs: 'fit-content', md: '100%' },
            mt: { xs: 20, md: 0 },
            overflowY: 'scroll',
            padding: { xs: '20px 20px 40px', md: '40px 40px 120px' },
            backgroundColor: 'rgba(230, 230, 206, 0.10)',
            borderRadius: 20
          }}
        >
          {tabs === Tabs.AuctionDescription && (
            <Box
              sx={{
                paddingLeft: 10,
                color: '#E6E6CE'
              }}
            >
              {/* eslint-disable-next-line react/no-children-prop */}
              <ReactMarkdown children={auction?.description || ''} />
            </Box>
          )}
          {tabs === Tabs.AuctionHistory && !hideHistory && (
            <AuctionHistory swapRatio={swapRatio} poolId={auction?.id} />
          )}
        </Box>
      </Box>
    </Box>
  )
}
