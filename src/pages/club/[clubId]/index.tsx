import { Stack, Box, CircularProgress, Backdrop } from '@mui/material'
import { useRouter } from 'next/router'
import BoxTab from 'views/editBox/components/BoxTab'
import BoxInfo from 'views/editBox/components/BoxInfo'
import BoxMain from 'views/editBox/components/BoxMain'
import { useGetBoxInfo } from 'hooks/boxes/useGetBoxInfo'
import { useEffect, useMemo, useState } from 'react'
// import useBreakpoint from 'hooks/useBreakpoint'
import Head from 'next/head'
import { useClubAuthCallback } from 'hooks/boxes/useClubAuthCallback'
import { ClubMemberMode } from 'hooks/boxes/types'
import { viewControl } from 'views/editBox/modal'
import { useGetEnablePluginList } from 'hooks/boxes/useGetClubPlugin'
import ClubPortfolio from 'views/editBox/components/clubPortfolio'
// import { useGetBoxDraftInfo } from 'state/boxes/hooks'
import useGetBoxAddress from 'hooks/boxes/useGetBoxAddress'
import { useActiveWeb3React } from 'hooks'

export default function Page() {
  const router = useRouter()
  const boxId = useMemo(() => (router.query.clubId ? router.query.clubId.toString() : undefined), [router.query.clubId])
  const { data: enablePluginList } = useGetEnablePluginList(boxId)
  const { account } = useActiveWeb3React()
  const { data: _data, loading } = useGetBoxInfo(boxId)
  const { boxAddress: clubAddress } = useGetBoxAddress(boxId)
  const boxAddress = _data?.boxAddress || clubAddress
  const data = useMemo(() => (_data ? Object.assign(_data, { boxAddress }) : undefined), [_data, boxAddress])
  const { isFreeMode, memberMode, isMembers, isClubOwner: _isClubOwner } = useClubAuthCallback(boxAddress)
  // const { data: draftInfo } = useGetBoxDraftInfo(boxId)

  // const isMd = useBreakpoint('md')
  const [followers, setFollowers] = useState<number>(0)
  useEffect(() => {
    if (data?.anotherInfo.followCount) {
      setFollowers(data?.anotherInfo.followCount)
    }
  }, [data?.anotherInfo.followCount])
  const appId = useMemo(() => (router.query.appId ? router.query.appId.toString() : undefined), [router.query.appId])
  const isClubOwner = _isClubOwner || _data?.ownerAddress?.toLocaleLowerCase() === account?.toLocaleLowerCase()

  useEffect(() => {
    if (appId && !loading) {
      setTimeout(() => {
        const section = document.getElementById('pluginSection')
        if (section) {
          section.scrollIntoView({ behavior: 'smooth' })
        }
      }, 1000)
    }
  }, [appId, loading])

  useEffect(() => {
    if (!isClubOwner && !isMembers && !isFreeMode) {
      viewControl.show('ClubAccessModal', {
        clubAddress: boxAddress,
        isPayMode: memberMode === ClubMemberMode.PAYMENT_MODE,
        links: data?.boxBasicInfo.links
      })
    }
  }, [boxAddress, data?.boxBasicInfo.links, isClubOwner, isFreeMode, isMembers, memberMode])

  useEffect(() => {
    if (isMembers || isClubOwner) {
      viewControl.hide('ClubAccessModal')
    }
  }, [isClubOwner, isMembers])

  const handleTabIntoView = () => {
    const section = document.getElementById('pluginSection')
    if (section) {
      const offsetTop = section.offsetTop
      setTimeout(() => {
        window.scrollTo({ top: offsetTop - 20, behavior: 'smooth' })
      }, 100)
    }
  }

  return (
    <Stack sx={{ minHeight: `calc(100vh - 70px - 128px )` }} direction={'column'}>
      <Head>
        <title>BounceClub - Club</title>
      </Head>
      <Backdrop sx={{ color: '#fff', zIndex: theme => theme.zIndex.drawer + 1 }} open={loading}>
        <CircularProgress color="inherit" />
      </Backdrop>
      {!loading && data && data.boxAddress && enablePluginList && _data && (
        <Box>
          <BoxMain boxBasicInfo={data.boxBasicInfo} editing={false} />
          <BoxInfo
            isVerified={_data.verified}
            boxBasicInfo={data.boxBasicInfo}
            isFollow={data.isFollow}
            isShowCus={true}
            rewardId={data.rewardId}
            anotherInfo={data.anotherInfo}
            isListing={false}
            isFollowers={e => {
              if (e) {
                setFollowers(followers - 1)
              } else {
                setFollowers(followers + 1)
              }
            }}
          />
          <ClubPortfolio
            followers={followers}
            feeAndReward={{ fee: data.fee || '' }}
            boxAddress={data.boxAddress}
            isMine={false}
          />
          <Box id="pluginSection" width={'100%'}></Box>
          <BoxTab
            boxData={data}
            editing={false}
            boxAddress={data.boxAddress}
            appId={appId}
            handleTabIntoView={handleTabIntoView}
            enablePluginList={enablePluginList}
          />
        </Box>
      )}
    </Stack>
  )
}
