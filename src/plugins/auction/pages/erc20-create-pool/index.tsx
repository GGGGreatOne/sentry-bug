import { Box, Typography } from '@mui/material'
import { useCreateParams } from './provider'
import ActiveTab from 'plugins/auction/components/create-pool/components/activeTab'
import BasicInfo from '../../components/create-pool/basicInfo'
// import Confirm from '../../components/create-pool/confirm'
import { AuctionType } from 'plugins/auction/plugins/fixed-price/constants/type'
import { useEffect, useMemo } from 'react'
import CreateFixedPricePage from '../../plugins/fixed-price/pages/create-fixed-price/index'
import CreateStakePage from '../../plugins/stake/pages/create-stake'
import ParticipantSettings from '../../components/create-pool/participantSettings'
import { useRouter } from 'next/router'
import { useRequest } from 'ahooks'
import { getAuctionPoolInfo } from 'plugins/auction/api'
import { IBasicInformation, ProviderDispatchActionType } from './type'
import { IAuctionDetail } from 'plugins/auction/api/type'
import { parseBanner } from 'plugins/auction/utils'
const poolPageMap: Record<AuctionType, JSX.Element> = {
  [AuctionType.FIXED_PRICE]: <CreateFixedPricePage />,
  [AuctionType.STAKING_AUCTION]: <CreateStakePage />
}
export default function Page() {
  const { state } = useCreateParams()
  useSetFormValues()
  const curPoolPage = useMemo(() => {
    return poolPageMap[state.poolInfo.auctionType]
  }, [state.poolInfo.auctionType])
  return (
    <Box
      sx={{
        width: '100%',
        maxWidth: 1200,
        margin: '0 auto',
        mt: 70,
        padding: { xs: '0 10px', md: 0 }
      }}
    >
      <Typography
        sx={{
          pb: { xs: 30, md: 80 },
          pt: { xs: 30, md: 54 },
          color: '#FFFFE5',
          fontSize: { xs: 40, md: 56 },
          fontStyle: 'normal',
          fontWeight: 600,
          lineHeight: '130%',
          letterSpacing: '-0.56px'
        }}
      >
        Create a Token Launchpad
      </Typography>
      <Box
        sx={{
          display: 'grid',
          gridTemplateColumns: { xs: '1fr', md: 'minmax(200px,370px) minmax(500px, 800px)' },
          justifyContent: 'space-between'
        }}
      >
        <ActiveTab />
        <Box sx={{ paddingTop: { xs: 20, md: 0 } }}>
          {state.activeTab.tabs[state.activeTab.index] === 'BASIC_INFO' && <BasicInfo />}
          {state.activeTab.tabs[state.activeTab.index] === 'AUCTION_DETAIL' && curPoolPage}
          {state.activeTab.tabs[state.activeTab.index] === 'PARTICIPANT_SETTINGS' && <ParticipantSettings />}
        </Box>
      </Box>
    </Box>
  )
}

function useSetFormValues() {
  const router = useRouter()
  const { dispatch } = useCreateParams()
  const id = useMemo(() => {
    const _id = router.query?.id
    if (!_id) {
      return
    }
    if (Array.isArray(_id)) {
      return _id[0]
    }
    return _id
  }, [router.query?.id])
  const { data } = useRequest(
    async () => {
      try {
        const res = await getAuctionPoolInfo(id as string)
        return res.data
      } catch (error) {
        return null
      }
    },
    { ready: !!id, refreshDeps: [id] }
  )

  useEffect(() => {
    if (id && data?.auction && dispatch) {
      const info = parseValues(data.auction)
      dispatch({ type: ProviderDispatchActionType.setBasicInfo, payload: { basicInfo: info } })
    }
  }, [data?.auction, dispatch, id])
}

const parseValues = (d: IAuctionDetail): IBasicInformation => {
  const { MobileBannerUrl, PCbannerUrl } = parseBanner(d.banner)
  return {
    auctionName: d.name,
    dec: d.description,
    attachments: d.attachements,
    MobileBannerUrl,
    PCbannerUrl,
    id: d.id
  } as IBasicInformation
}
