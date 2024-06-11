import { Box, Button, Stack, Typography, styled } from '@mui/material'
import DropDownSvg from '../../assets/drop-down.svg'
import { useGetMarketStats } from '../../hook/useGetMarketStats'
import { QuantosDetails } from '../../hook/useFactory'
import { control } from '../components/dialog/modal'
import { useLeverageStateData } from 'plugins/leverage/state/hooks'
import BigNumber from 'bignumber.js'
import BTCBImg from 'assets/images/boxes/bbtc.png'
import Image from 'components/Image'
const InfoItemStyle = styled(Box)({
  padding: '0 24px',
  borderLeft: '1px solid var(--ps-text10, rgba(255, 255, 255, 0.10))'
})

const TabButton = styled(Button)`
  font-size: 13px;
  font-style: normal;
  font-weight: 500;
  line-height: 100%; /* 13px */
  color: var(--ps-text-40, rgba(255, 255, 255, 0.4));
  border-radius: 100px;
  background-color: transparent !important;

  &.active {
    color: var(--ps-text-primary) !important;
    background-color: var(--ps-text-100) !important;
  }
  &.level2.active {
    color: var(--ps-text-100) !important;
    background-color: var(--ps-neutral2) !important;
  }
  &:hover {
    color: var(--text-100, #fff);
  }
`
export const Tabs = ({
  tabs,
  initTab,
  setTab,
  isLevel2
}: {
  tabs: string[]
  initTab: string
  setTab: (v: string) => void
  isLevel2?: boolean
}) => {
  return (
    <Stack
      flexDirection={'row'}
      sx={{
        width: '100%',
        padding: 4,
        borderRadius: 100,
        background: 'var(--ps-text-primary)',
        '&>button': { flex: 1 }
      }}
    >
      {tabs.map(i => (
        <TabButton
          key={i}
          className={i === initTab ? (isLevel2 ? 'active level2' : 'active') : ''}
          sx={{ borderRadius: 100, background: 'var(--ps-text-100)' }}
          onClick={() => setTab(i)}
          variant="contained"
        >
          {i}
        </TabButton>
      ))}
    </Stack>
  )
}

const Page = ({
  chartTabs,
  curTab,
  quantos,
  boxQuantos,
  changeTab,
  boxContractAdr,
  tradePrice,
  isRise
}: {
  chartTabs: string[]
  curTab: string
  quantos: undefined | QuantosDetails
  boxQuantos: undefined | QuantosDetails[]
  changeTab: (v: string) => void
  boxContractAdr: string
  tradePrice: BigNumber
  isRise: boolean
}) => {
  const { data: Bitleverage } = useLeverageStateData()

  const { borrowLongVal, borrowShortVal, openDaiLong, openDaiShort } = useGetMarketStats(
    Bitleverage?.tradePairIndex ?? 0,
    quantos?.storageT ?? '',
    quantos?.pairInfoT ?? ''
  )

  return (
    <Box sx={{ padding: 12 }}>
      <Stack sx={{ overflow: 'auto' }} flexDirection={'row'} px={12}>
        <Stack
          onClick={() =>
            control.show('SelectToken', { isAddLiquidity: false, allQuantos: boxQuantos, boxAddress: boxContractAdr })
          }
          flexDirection={'row'}
          alignItems={'center'}
          mr={32}
          sx={{ cursor: 'pointer' }}
        >
          <Typography sx={{ color: 'var(--ps-neutral5)', fontSize: 13, lineHeight: 1.4, marginRight: 4 }}>
            Market
          </Typography>
          <DropDownSvg />
        </Stack>
        <Stack flexDirection={'row'} alignItems={'center'} mr={32}>
          <Image src={BTCBImg.src} width={24} style={{ borderRadius: '50%' }} alt="bbtc" />
          <Typography
            ml={8}
            mr={4}
            sx={{ color: isRise ? 'var(--ps-green)' : 'var(--ps-red)', fontSize: 20, fontWeight: 500, lineHeight: 1.3 }}
          >
            {tradePrice.toFormat(2)}
          </Typography>
          {/*<DropDownSvg />*/}
        </Stack>
        <InfoItemStyle>
          <Typography sx={{ color: 'var(--ps-neutral3)', fontSize: 12, lineHeight: 1.4, whiteSpace: 'nowrap' }}>
            Open Interest (L)
          </Typography>
          <Stack flexDirection={'row'} alignItems={'center'}>
            {/*<DropDownRedSvg />*/}
            <Typography ml={4} sx={{ color: 'var(--ps-text-100)', fontSize: 15, lineHeight: 1.4 }}>
              {openDaiLong.toFormat(2)}
            </Typography>
          </Stack>
        </InfoItemStyle>
        <InfoItemStyle>
          <Typography sx={{ color: 'var(--ps-neutral3)', fontSize: 12, lineHeight: 1.4, whiteSpace: 'nowrap' }}>
            Open Interest (S)
          </Typography>
          <Stack flexDirection={'row'} alignItems={'center'}>
            <Typography sx={{ color: 'var(--ps-text-100)', fontSize: 15, lineHeight: 1.4 }}>
              {openDaiShort.toFormat(2)}
            </Typography>
          </Stack>
        </InfoItemStyle>
        <InfoItemStyle>
          <Typography sx={{ color: 'var(--ps-neutral3)', fontSize: 12, lineHeight: 1.4, whiteSpace: 'nowrap' }}>
            Borrowing (L)
          </Typography>
          <Stack flexDirection={'row'} alignItems={'center'}>
            <Typography
              sx={{
                color: openDaiLong.gt(openDaiShort)
                  ? 'var(--ps-green)'
                  : openDaiLong?.toString() === openDaiShort?.toString()
                    ? 'var(--ps-text-100)'
                    : 'var(--ps-red)',
                fontSize: 15,
                lineHeight: 1.4
              }}
            >
              {openDaiShort && openDaiLong?.gt(openDaiShort)
                ? ''
                : openDaiLong?.toString() === openDaiShort?.toString()
                  ? ''
                  : '-'}
              {borrowLongVal?.abs()?.toFixed(4)}%
            </Typography>
          </Stack>
        </InfoItemStyle>
        <InfoItemStyle>
          <Typography sx={{ color: 'var(--ps-neutral3)', fontSize: 12, lineHeight: 1.4, whiteSpace: 'nowrap' }}>
            Borrowing (S)
          </Typography>
          <Stack flexDirection={'row'} alignItems={'center'}>
            <Typography
              sx={{
                color: openDaiLong.gt(openDaiShort)
                  ? 'var(--ps-green)'
                  : openDaiLong?.toString() === openDaiShort?.toString()
                    ? 'var(--ps-text-100)'
                    : 'var(--ps-red)',
                fontSize: 15,
                lineHeight: 1.4
              }}
            >
              {openDaiShort && openDaiLong?.lt(openDaiShort)
                ? ''
                : openDaiLong?.toString() === openDaiShort?.toString()
                  ? ''
                  : '-'}
              {borrowShortVal?.abs()?.toFixed(4)}%
            </Typography>
          </Stack>
        </InfoItemStyle>
      </Stack>
      <Box mt={12}>
        <Tabs tabs={chartTabs} initTab={curTab} setTab={changeTab} />
      </Box>
    </Box>
  )
}
export default Page
