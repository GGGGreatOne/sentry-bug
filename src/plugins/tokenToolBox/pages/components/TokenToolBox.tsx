import { Card } from 'views/editBox/components/MainDashboard'
import MinterSvg from 'plugins/tokenToolBox/assets/toolBox/minter.svg'
import DisperseSvg from 'plugins/tokenToolBox/assets/toolBox/disperse.svg'
import LockerSvg from 'plugins/tokenToolBox/assets/toolBox/locker.svg'
import { Box, Grid, Stack, Typography, styled } from '@mui/material'
import { viewControl } from 'views/editBox/modal'
import { ReactNode } from 'react'
import BlueArrow from 'plugins/tokenToolBox/assets/toolBox/blue_arrow.svg'
import useBreakpoint from 'hooks/useBreakpoint'
import { IBoxesJsonData } from 'state/boxes/type'
import { useActiveWeb3React } from 'hooks'
import { useWalletModalToggle } from 'state/application/hooks'

export interface ModulesConfigParams {
  logoImg: ReactNode
  title: string
  subTitle: string
  button: ReactNode
  fn: () => void
  isShow: boolean
}

const TokenToolBox = ({
  draftInfo,
  boxAddress,
  isMine,
  editing
}: {
  draftInfo?: IBoxesJsonData | null | undefined
  isMine: boolean
  boxAddress: string
  editing?: boolean
}) => {
  const { account, chainId } = useActiveWeb3React()
  const WalletModalToggle = useWalletModalToggle()
  const isMd = useBreakpoint('md')
  const modulesConfig: ModulesConfigParams[] = [
    {
      logoImg: <MinterSvg />,
      title: 'Mint Tokens',
      subTitle: 'Mint tokens by specifying the token’s name, symbol and total supply.',
      button: (
        <Stack flexDirection={'row'} alignItems={'center'}>
          <Typography fontSize={15} fontWeight={500} lineHeight={1} fontFamily={'IBM Plex Sans'} color={'#4E6EF3'}>
            Start
          </Typography>
          <Box sx={{ transform: 'translateY(3px)' }}>
            <BlueArrow />
          </Box>
        </Stack>
      ),
      fn: () => {
        if (!account || !chainId) {
          return WalletModalToggle()
        }
        viewControl.show('TokenMinter', { draftInfo, boxAddress })
      },
      isShow: isMine && editing ? true : false
    },
    {
      logoImg: <DisperseSvg />,
      title: 'Distribute Tokens',
      subTitle: 'Distribute tokens to one or multiple addresses.',
      button: (
        <Stack flexDirection={'row'} alignItems={'center'}>
          <Typography fontSize={15} fontWeight={500} lineHeight={1} fontFamily={'IBM Plex Sans'} color={'#4E6EF3'}>
            View More
          </Typography>
          <Box sx={{ transform: 'translateY(3px)' }}>
            <BlueArrow />
          </Box>
        </Stack>
      ),
      fn: () => {
        if (!account || !chainId) {
          return WalletModalToggle()
        }
        viewControl.show('MyDisperse', { boxAddress: boxAddress, rKey: Math.random() })
      },
      isShow: true
    },
    {
      logoImg: <LockerSvg />,
      title: 'Lock Tokens',
      subTitle: 'Create a locker and safely store your tokens for your desired duration. ',
      button: (
        <Stack flexDirection={'row'} alignItems={'center'}>
          <Typography fontSize={15} fontWeight={500} lineHeight={1} fontFamily={'IBM Plex Sans'} color={'#4E6EF3'}>
            View More
          </Typography>
          <Box sx={{ transform: 'translateY(3px)' }}>
            <BlueArrow />
          </Box>
        </Stack>
      ),
      fn: () => {
        if (!account || !chainId) {
          return WalletModalToggle()
        }
        viewControl.show('MyLock', { boxAddress: boxAddress, rKey: Math.random() })
      },
      isShow: true
    }
    // {
    //   logoImg: Locker,
    //   title: 'My LP Locker',
    //   subTitle: 'Explain what is a LP locker ........',
    //   fn: () => router.push(ROUTES.tokenToolBox.tokenLocker({ tokenType: 'lp', version: 'v2' }))
    // }
  ]
  return (
    <Grid container columnSpacing={24} gap={isMd ? 16 : 0}>
      {modulesConfig.map(
        item =>
          item.isShow && (
            <Grid key={item.title} item xs={isMd ? 12 : 4}>
              <ToolCard>
                <Stack width={'100%'} alignItems={'center'}>
                  {item.logoImg}
                  <Typography
                    mt={16}
                    color="var(--ps-white)"
                    fontSize={20}
                    fontWeight={500}
                    lineHeight={1.3}
                    fontFamily={'IBM Plex Sans'}
                  >
                    {item.title}
                  </Typography>
                  <Typography
                    minHeight={42}
                    mt={4}
                    textAlign={'center'}
                    color="var(--ps-grey-03)"
                    fontSize={15}
                    fontWeight={400}
                    lineHeight={1.4}
                    fontFamily={'IBM Plex Sans'}
                  >
                    {item.subTitle}
                  </Typography>

                  <Box
                    mt={24}
                    sx={{ cursor: 'pointer' }}
                    onClick={() => {
                      item.fn && item.fn()
                    }}
                  >
                    {item.button}
                  </Box>
                </Stack>
              </ToolCard>
            </Grid>
          )
      )}
    </Grid>
  )
}

const ToolCard = styled(Card)`
  display: flex;
  padding: 40px 24px;
  flex-direction: column;
  align-items: center;
  gap: 24px;
  flex: 1 0 0;
  border-radius: 12px;
  background: #1b1b1b;
`
export default TokenToolBox
