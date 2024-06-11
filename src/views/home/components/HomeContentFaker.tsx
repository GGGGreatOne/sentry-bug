import { Box } from '@mui/material'
import { useEffect, useState } from 'react'
// import FeaturedBoxes from './FeaturedBoxes'
import HotActivities from './HotActivities'
import LatestUpdates from './LatestUpdates'
import TrendingPlugins from './TrendingPlugins'
import RankBox from './RankBox'
const HomeContentFaker = () => {
  const [offsetTop, setOffsetTop] = useState(0)
  useEffect(() => {
    const handleScroll = (event: { srcElement: any }) => {
      const top = event.srcElement.documentElement.scrollTop
      console.log('event.target.scrollTop>>>', top)
      setOffsetTop(top)
    }
    window.addEventListener('scroll', handleScroll)
    return () => {
      window.removeEventListener('scroll', handleScroll)
    }
  }, [])
  return (
    <Box
      sx={{
        position: 'fixed',
        bottom: 0,
        left: 0,
        width: '100%',
        height: '150px',
        zIndex: 4,
        transformStyle: 'flat',
        //   transform: `translateZ(-100px)`,
        perspective: `2750px`
      }}
    >
      <Box
        sx={{
          position: 'fixed',
          bottom: 0,
          left: '50%',
          width: '100vw',
          height: '100vh',
          padding: '5vh',
          boxSizing: 'border-box',
          overflowX: 'hidden',
          backgroundRepeat: 'repeat',
          backgroundSize: '2vw 2vw',
          transition: `all .5s`,
          transform: `rotateX(78deg) translateZ(-50vh) translateX(-50%)`,
          overflow: 'hidden',
          background: '#0D0D0D'
        }}
      >
        <Box
          sx={{
            transition: 'opacity .3s',
            opacity: `${offsetTop - 65 >= 0 ? 1 : 0}`,
            transform: `scaleX(1.265) translateY(-${offsetTop - 65 >= 0 ? offsetTop - 65 : Math.abs(offsetTop - 65)}px)`
          }}
        >
          <RankBox whithoutAnimation={true} />
          {/* <FeaturedBoxes whithoutAnimation={true} /> */}
          <HotActivities whithoutAnimation={true} />
          <TrendingPlugins whithoutAnimation={true} />
          <LatestUpdates whithoutAnimation={true} />
        </Box>
      </Box>
    </Box>
  )
}
export default HomeContentFaker
