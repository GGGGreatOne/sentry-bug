import { Box, Stack, styled, Typography } from '@mui/material'
import { useGetRoomList } from './hooks'
import { useUserInfo } from 'state/user/hooks'
// import GamesIcon1 from 'assets/images/appStore/games-icon-1.png'
// import GamesIcon2 from 'assets/images/appStore/games-icon-2.png'
// import GamesIcon3 from 'assets/images/appStore/games-icon-3.png'
// import GamesIcon4 from 'assets/images/appStore/games-icon-4.png'
// import GamesIcon5 from 'assets/images/appStore/games-icon-5.png'
// import GamesBanner1 from 'assets/images/appStore/games-banner-1.png'
// import GamesBanner2 from 'assets/images/appStore/games-banner-2.png'
// import GamesBanner3 from 'assets/images/appStore/games-banner-3.png'
// import GamesBanner4 from 'assets/images/appStore/games-banner-4.png'
// import GamesBanner5 from 'assets/images/appStore/games-banner-5.jpg'
import { EnablePluginListResult } from 'api/boxes/type'
import { useRouter } from 'next/router'
import IframeWithLoading from './components/IframeWithLoading'
import useBreakpoint from 'hooks/useBreakpoint'
import { useMemo } from 'react'

export enum GameType {
  GOBANG = 11,
  LINK = 12,
  PUZZLE = 13,
  BOX = 14,
  TETRIS = 15
}
// type GamesData = {
//   [key in GameType]: GameInfo
// }
// type GameInfo = {
//   logoSrc: string
//   title: string
//   subTitle: string
//   status: IBoxTypes
//   bannerSrc: string
//   link?: string
// }

// const _gamesData: GamesData = {
//   [GameType.GOBANG]: {
//     logoSrc: GamesIcon5.src,
//     title: 'five-in-a-row',
//     subTitle:
//       'five-in-a-row, a duel of intellect and strategy, where two players compete on who can connect five pieces on the board before the other one does. It is a exciting battle that requires precise calculations and deep thought.',
//     status: IBoxTypes.ComingSoom,
//     bannerSrc: GamesBanner5.src,
//     link: 'http://game.v2.cocos.i-ii.top/?code=ZXlKMGVYQWlPaUpLVjFRaUxDSmhiR2NpT2lKSVV6STFOaUo5LmV5SnBZWFFpT2pFM01USTFOamt5TVRNc0ltVjRjQ0k2TVRrek16UXdOell4TXl3aU1pSTZJak0wTkRVME1pSXNJakVpT2lJeU9EYzJOaUlzSWpNaU9qUjkueGp3NVcwMEdNaGZfY2dHM1RDSlZJZ3BRT0VjaFRYTWZLUUlaYlE1dmQ3cw'
//   },
//   [GameType.LINK]: {
//     logoSrc: GamesIcon3.src,
//     title: 'Shisen-Sho',
//     subTitle:
//       'Shisen-Sho, is a treasure-hunting journey to find hidden pairs. Quickly identify and eliminate all identical patterns as fast as you can. This challenge will put your visual acuity and reaction speed to test.',
//     status: IBoxTypes.ComingSoom,
//     bannerSrc: GamesBanner3.src
//   },
//   [GameType.PUZZLE]: {
//     logoSrc: GamesIcon4.src,
//     title: 'Jigsaw Puzzle',
//     subTitle:
//       'Jigsaw Puzzle, is a journey of putting together exciting puzzles. Place fragments together piece by piece to create a completed picture. This game puts your observation skills and spatial imagination to test.',
//     status: IBoxTypes.ComingSoom,
//     bannerSrc: GamesBanner4.src
//   },
//   [GameType.BOX]: {
//     logoSrc: GamesIcon1.src,
//     title: 'Box Stack',
//     subTitle: `"Box Stack" is an adventure challenging gravity. Cleverly stack boxes of various shapes to build your tower as high as possible. Use your skills to prevent the tower from collapsing.`,
//     status: IBoxTypes.Normal,
//     bannerSrc: GamesBanner1.src
//   },
//   [GameType.TETRIS]: {
//     logoSrc: GamesIcon2.src,
//     title: 'Falling Blocks',
//     subTitle:
//       'Falling Blocks, a game of skill and quickness. Align falling blocks in a way that they form lines and give you points. Blocks come in various shapes. Put your reaction speed and strategy to the test.',
//     status: IBoxTypes.ComingSoom,
//     bannerSrc: GamesBanner2.src
//   }
// }

const GamePinal = ({ tabItem, appId }: { tabItem: EnablePluginListResult | undefined; appId: string | undefined }) => {
  const isMd = useBreakpoint('md')
  const router = useRouter()
  const userInfo = useUserInfo()
  const params = {
    clubId: router.query.clubId?.toString() || userInfo.box?.boxId || '',
    pluginId: tabItem?.id || appId || ''
  }
  const { data } = useGetRoomList(params)

  // eslint-disable-next-line react-hooks/exhaustive-deps
  const devicePixelRatio = useMemo(() => {
    const viewportWidth = window.innerWidth || document.documentElement.clientWidth || document.body.clientWidth
    const outerWidth = window.outerWidth || window.screen.availWidth
    const zoomLevel = outerWidth / viewportWidth
    return 1 / zoomLevel
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [window.innerWidth])

  if (data?.code === 500) {
    return (
      <Container devicePixelRatio={devicePixelRatio}>
        <Stack height={300} alignItems={'center'} justifyContent={'center'}>
          <Typography fontSize={isMd ? 16 : 24} color={'var(--ps-text-40)'}>
            {data.msg}
          </Typography>
        </Stack>
      </Container>
    )
  }
  return (
    <Container devicePixelRatio={devicePixelRatio}>
      <IframeWithLoading
        src={data?.data.link || ''}
        width={isMd ? '100%' : 1044}
        minHeight={isMd ? 200 : 640}
        margin={isMd ? '39px auto' : '0 auto'}
      ></IframeWithLoading>
    </Container>
  )
}
const Container = styled(Box)<{ devicePixelRatio: number }>`
  max-width: 1200px;
  margin: 0 auto;
  transform: ${props => `scale(${props.devicePixelRatio})`};
  transform-origin: top center;
`
export default GamePinal
