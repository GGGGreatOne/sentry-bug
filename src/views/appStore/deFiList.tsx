import { Box, Stack, Typography, useTheme } from '@mui/material'
import useBreakpoint from 'hooks/useBreakpoint'
import { DeFiListGamesItem, DeFiListItem, DeFiListLayout, GrayLine } from './components/deFiListComps'
import { WithAnimation } from 'components/WithAnimation/WithAnimation'
import { usePluginListDatas } from 'state/pluginListConfig/hooks'
import { IBoxTypes } from 'api/boxes/type'
import { useMemo } from 'react'
import SocialFi1 from 'assets/images/appStore/socialFi1.png'
// import SocialFi4 from 'assets/images/appStore/socialFi4.png'
import SocialFiCampaign from 'assets/images/appStore/SocialFi-Campaign.png'
import SocialFiContribution from 'assets/images/appStore/SocialFi-Contribution.png'
import GamesIcon1 from 'assets/images/appStore/games-icon-1.png'
import GamesIcon2 from 'assets/images/appStore/games-icon-2.png'
import GamesIcon3 from 'assets/images/appStore/games-icon-3.png'
import GamesIcon4 from 'assets/images/appStore/games-icon-4.png'
import GamesIcon5 from 'assets/images/appStore/games-icon-5.png'
import GamesBanner1 from 'assets/images/appStore/games-banner-1.png'
import GamesBanner2 from 'assets/images/appStore/games-banner-2.png'
import GamesBanner3 from 'assets/images/appStore/games-banner-3.png'
import GamesBanner4 from 'assets/images/appStore/games-banner-4.png'
import GamesBanner5 from 'assets/images/appStore/games-banner-5.jpg'
// import AIIcon1 from 'assets/images/appStore/ai-banner-1.png'
// import AIBanner1 from 'assets/images/appStore/ai-icon-1.png'
import { useRouter } from 'next/router'
import { ROUTES } from 'constants/routes'
import { IClubPluginId } from 'state/boxes/type'
interface IDataItem {
  logoSrc: string
  title: string
  subTitle: string
  status: IBoxTypes
  bannerSrc?: string
  click?: () => void
  pluginId: IClubPluginId | null
}

const _socialFiData: IDataItem[] = [
  {
    logoSrc: SocialFi1.src,
    title: 'SendingMe',
    subTitle:
      'SendingMe is a decentralized and encrypted super-app that combines chat, socializing, and trade, giving you complete control over your social layer.',
    status: IBoxTypes.Normal,
    pluginId: IClubPluginId.SendingMe
  },
  {
    logoSrc: SocialFiCampaign.src,
    title: 'Campaign',
    subTitle:
      'BounceBit revolutionizes digital campaigns through a blockchain-based credential system, offering users complete control over their achievements and privacy. Utilizing Zero-Knowledge Proof technology, participants can selectively share their credentials without compromising personal information. This platform enables seamless participation in diverse campaigns, with secure and transparent reward distribution. BounceBit empowers users to leverage their achievements across platforms, redefining user engagement and reward mechanisms in the digital realm.',
    status: IBoxTypes.ComingSoom,
    pluginId: null
  },
  {
    logoSrc: SocialFiContribution.src,
    title: 'Proof of Contribution',
    subTitle:
      'Proof of Contribution (PoC) for BounceBit is a protocol that ensures trust and fairness in a decentralized network by verifying and rewarding contributions from all participants. It uses smart contracts for secure payments, relies on staking and reputation to incentivize honest participation, and employs permissioning to control access to tasks. This mechanism fosters a transparent, efficient, and cooperative environment within the BounceBit ecosystem, ensuring that contributions are accurately validated and compensated.',
    status: IBoxTypes.ComingSoom,
    pluginId: null
  }
  // {
  //   logoSrc: SocialFi4.src,
  //   title: 'FriendTech',
  //   subTitle: `BounceBit introduces an innovative approach to digital interactions with its unique chat room feature, designed to deepen the connection between content creators and their audience in a decentralized environment. This platform operates on a novel system where users can acquire access to exclusive chat rooms by purchasing 'keys'—a digital token representing their investment in a particular creator's content. These keys not only unlock a private communication channel but also enable participants to engage with exclusive content, fostering a more intimate and value-driven relationship between creators and their community. With BounceBit, creators can monetize their influence and content directly, while supporters gain a closer look into the creative process and enjoy personalized interactions, enhancing the digital social experience in a secure and transparent manner.`,
  //   status: IBoxTypes.ComingSoom
  // }
]
const _gamesData: IDataItem[] = [
  {
    logoSrc: GamesIcon1.src,
    title: 'Box Stack',
    subTitle: `"Box Stack" is an adventure challenging gravity. Cleverly stack boxes of various shapes to build your tower as high as possible. Use your skills to prevent the tower from collapsing.`,
    status: IBoxTypes.Normal,
    bannerSrc: GamesBanner1.src,
    pluginId: IClubPluginId.BOX
  },
  {
    logoSrc: GamesIcon2.src,
    title: 'Falling Blocks',
    subTitle:
      'Falling Blocks, a game of skill and quickness. Align falling blocks in a way that they form lines and give you points. Blocks come in various shapes. Put your reaction speed and strategy to the test.',
    status: IBoxTypes.Normal,
    bannerSrc: GamesBanner2.src,
    pluginId: IClubPluginId.TETRIS
  },
  {
    logoSrc: GamesIcon3.src,
    title: 'Shisen-Sho',
    subTitle:
      'Shisen-Sho, is a treasure-hunting journey to find hidden pairs. Quickly identify and eliminate all identical patterns as fast as you can. This challenge will put your visual acuity and reaction speed to test.',
    status: IBoxTypes.Normal,
    bannerSrc: GamesBanner3.src,
    pluginId: IClubPluginId.LINK
  },
  {
    logoSrc: GamesIcon4.src,
    title: 'Jigsaw Puzzle',
    subTitle:
      'Jigsaw Puzzle, is a journey of putting together exciting puzzles. Place fragments together piece by piece to create a completed picture. This game puts your observation skills and spatial imagination to test.',
    status: IBoxTypes.Normal,
    bannerSrc: GamesBanner4.src,
    pluginId: IClubPluginId.PUZZLE
  },
  {
    logoSrc: GamesIcon5.src,
    title: 'Five-in-a-row',
    subTitle:
      'Five-in-a-row, a duel of intellect and strategy, where two players compete on who can connect five pieces on the board before the other one does. It is an exciting battle that requires precise calculations and deep thought.',
    status: IBoxTypes.Normal,
    bannerSrc: GamesBanner5.src,
    pluginId: IClubPluginId.GOBANG
  }
]
// const _aiData: IDataItem[] = [
//   {
//     logoSrc: AIIcon1.src,
//     title: 'Informance AI',
//     subTitle:
//       'Stack the Boxes, a gravity-defying adventure. Players will need to skillfully stack boxes of various shapes to create stunning towers while keeping them from collapsing.',
//     status: IBoxTypes.ComingSoom,
//     bannerSrc: AIBanner1.src
//   }
// ]
export default function Page() {
  const theme = useTheme()
  const isSm = useBreakpoint('sm')
  const pluginListDatas = usePluginListDatas()
  const router = useRouter()
  const deFiDatas = useMemo(() => {
    const pluginArr = pluginListDatas.list
      .filter(v => v.category.toUpperCase() === 'DEFI')
      .map<IDataItem>(i => {
        let click: undefined | (() => void) = undefined
        if (i.status === IBoxTypes.Normal) {
          click = () => router.push(ROUTES.appStore.pluginDetail(i.id))
        }
        return {
          logoSrc: i.icon,
          status: i.status,
          subTitle: i.introduction,
          title: i.pluginName,
          pluginId: i.id,
          click
        }
      })
    return pluginArr
  }, [pluginListDatas.list, router])
  return (
    <Box className="plBox" sx={{ width: '100%' }}>
      <WithAnimation>
        <Stack
          pb={isSm ? 24 : 40}
          sx={{
            [theme.breakpoints.up('md')]: {
              flexDirection: 'row',
              justifyContent: 'space-between',
              alignItems: 'flex-end'
            }
          }}
        >
          <Typography
            sx={{
              color: 'var(--ps-text-100)',
              fontFamily: 'SF Pro Display',
              fontSize: { xs: 36, md: 64 },
              fontStyle: 'normal',
              fontWeight: 500,
              lineHeight: '100%',
              span: {
                background:
                  'var(--colorful, linear-gradient(90deg, #FF2626 30.81%, #FF9314 46.29%, #C369FF 67.28%, #7270FF 83.86%))',
                backgroundClip: 'text',
                WebkitBackgroundClip: 'text',
                WebkitTextFillColor: 'transparent'
              }
            }}
          >
            All <span>Apps</span>
          </Typography>
        </Stack>
        <GrayLine />
      </WithAnimation>
      <DeFiListLayout title="DeFi">
        <Box
          sx={{
            display: 'grid',
            gridTemplateColumns: { xs: '1fr', md: '1fr 1fr' },
            gap: 24,
            [theme.breakpoints.down('sm')]: {
              display: 'flex',
              paddingRight: 20
            }
          }}
        >
          {deFiDatas.map(i => (
            <DeFiListItem
              key={i.title}
              imgSrc={i.logoSrc}
              title={i.title}
              subTitle={i.subTitle}
              boxStatus={i.status}
              click={i.click}
            />
          ))}
        </Box>
      </DeFiListLayout>
      <DeFiListLayout title="SocialFi">
        <Box
          sx={{
            display: 'grid',
            gridTemplateColumns: '1fr 1fr',
            gap: 24,
            [theme.breakpoints.down('sm')]: {
              display: 'flex',
              paddingRight: 20
            }
          }}
        >
          {_socialFiData.map(i => (
            <DeFiListItem
              key={i.title}
              imgSrc={i.logoSrc}
              title={i.title}
              subTitle={i.subTitle}
              boxStatus={i.status}
              click={() => {
                if (i.pluginId && i.status === IBoxTypes.Normal) {
                  router.push(ROUTES.appStore.pluginDetail(i.pluginId))
                }
              }}
            />
          ))}
        </Box>
      </DeFiListLayout>
      <DeFiListLayout title="Games">
        <Stack spacing={{ md: 32, xs: 24 }} pr={{ xs: 20, md: 0 }}>
          {_gamesData.map(i => (
            <DeFiListGamesItem
              key={i.title}
              logoSrc={i.logoSrc}
              title={i.title}
              subTitle={i.subTitle}
              boxStatus={i.status}
              bannerSrc={i.bannerSrc || ''}
              click={() => {
                if (i.pluginId && i.status === IBoxTypes.Normal) {
                  router.push(ROUTES.appStore.pluginDetail(i.pluginId))
                }
              }}
            />
          ))}
        </Stack>
      </DeFiListLayout>
      {/* <DeFiListLayout title="AI" showLine={false}>
        <Stack pr={_aiData.length === 1 ? 20 : 0}>
          {_aiData.map(i => (
            <DeFiListGamesItem
              maxW={_aiData.length === 1}
              key={i.title}
              logoSrc={i.logoSrc}
              title={i.title}
              subTitle={i.subTitle}
              boxStatus={i.status}
              bannerSrc={i.bannerSrc || ''}
            />
          ))}
        </Stack>
      </DeFiListLayout> */}
    </Box>
  )
}
