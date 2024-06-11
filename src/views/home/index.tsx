import { Box } from '@mui/material'
import ContainScroll from 'views/home/components/ContainScroll'
import Banner from './components/Banner'
import BounceBoxisPowerful from './components/BounceBoxisPowerful'
// import FamousBoxUser from './components/FamousBoxUser'
// import FeaturedBoxes from '../../views/home/components/FeaturedBoxes'
import HotActivities from './components/HotActivities'
import LatestUpdates from './components/LatestUpdates'
import TrendingPlugins from './components/TrendingPlugins'
import RankBox from 'views/home/components/RankBox'
import { RecommendedClubListResponse } from 'api/home/type'

export default function HomePage({ recommendedClubList }: { recommendedClubList: RecommendedClubListResponse[] }) {
  console.log('recommendedClubList', recommendedClubList)

  return (
    <Box
      sx={{
        overflow: 'hidden'
      }}
    >
      <ContainScroll>
        <Banner recommendedClubList={recommendedClubList} />
        <RankBox whithoutAnimation={true} />
        {/* <FeaturedBoxes whithoutAnimation={true} /> */}
        <HotActivities whithoutAnimation={true} />
        <TrendingPlugins whithoutAnimation={true} />
        <LatestUpdates whithoutAnimation={true} />
      </ContainScroll>
      <Box
        sx={{
          position: 'relative',
          zIndex: 101
        }}
      >
        <BounceBoxisPowerful />
        {/* <FamousBoxUser /> */}
      </Box>
    </Box>
  )
}
