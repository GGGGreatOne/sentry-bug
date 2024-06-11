import { useEffect, useMemo, useRef, useState } from 'react'
import Tab from '@mui/material/Tab'
import TabContext from '@mui/lab/TabContext'
import TabList from '@mui/lab/TabList'
import TabPanel from '@mui/lab/TabPanel'
import { Stack, Box, Button, styled, Typography } from '@mui/material'
import {
  IBoxPluginBasicItemData,
  IBoxValue,
  IBoxesJsonData,
  IClubPluginId,
  IPluginNameType,
  IsLogin
} from 'state/boxes/type'
import AboutCard from 'views/editBox/tabs/about'
import { viewControl } from 'views/editBox/modal'
import { useGetPluginInfo } from 'state/pluginListConfig/hooks'
import useBreakpoint from 'hooks/useBreakpoint'
import dynamic from 'next/dynamic'
import { useUserInfo } from 'state/user/hooks'
import BoxTip from './BoxTip'
import MenuButton from 'assets/svg/boxes/menu_button.svg'
import CloseButton from 'assets/svg/boxes/close_button.svg'
import TabLine from 'assets/svg/boxes/line3.svg'
import Chatroom from 'assets/images/appStore/socialFi1.png'
import AboutPng from 'assets/images/appStore/about_128.png'
import { CSSTransition } from 'react-transition-group'
import useDebounce from 'hooks/useDebounce'
import { EnablePluginListResult } from 'api/boxes/type'
import GamePinal from './GamePinal'
import ChevronLeftIcon from '@mui/icons-material/ChevronLeft'
import ChevronRightIcon from '@mui/icons-material/ChevronRight'
import { getAppPluginId } from 'constants/index'
const Bitstaking = dynamic(() => import('plugins/bitFarm/pages'))

const Bitswap = dynamic(() => import('views/editBox/tabs/Bitswap'))
// const Bitstaking = dynamic(() => import('plugins/farm/pages'))
const BitAuctionList = dynamic(() => import('views/auction/list'))
const StablecoinCard = dynamic(() => import('views/editBox/tabs/stablecoin'))
const BitLeverage = dynamic(() => import('views/editBox/tabs/BitLeverage'))
const ChatroomCard = dynamic(() => import('views/editBox/tabs/chatroom'))
const Image = styled('img')(() => ({}))
const TooltipBox = styled(Box)(() => ({
  position: 'relative',
  cursor: 'pointer',
  width: 64,
  height: 64,
  p: {
    transition: '.3s'
  },
  '&:hover p': {
    display: 'block'
  },
  '& svg, & img, & div': {
    transition: '.2s linear'
  },
  '&:hover svg, &:hover img': {
    transform: 'translate(0, -10px)'
  },
  '&:hover div': {
    bottom: -2
  }
}))

const Tooltips = styled(Typography)(() => ({
  // width: 'fit-content',
  display: 'none',
  position: 'fixed',
  top: -48,
  // left: '50%',
  // transform: 'translateX(-50%)',
  padding: '4px 12px',
  borderRadius: 8,
  background: 'var(--ps-text-primary-80)',
  color: 'var(--ps-text-100)',
  border: '1px solid var(--ps-neutral3)',
  fontSize: 16,
  fontWeight: 400,
  lineHeight: '22.4px',
  textAlign: 'center',
  whiteSpace: 'nowrap'
}))

const ActivePoint = styled(Box)(() => ({
  width: 6,
  height: 6,
  position: 'absolute',
  bottom: -12,
  left: '50%',
  transform: 'translateX(-50%)',
  borderRadius: '50%',
  background: 'white'
}))

const TabScrollBox = styled(Box)(() => ({
  width: 24,
  height: 24,
  cursor: 'pointer',
  position: 'absolute',
  zIndex: 100,
  borderRadius: '50%',
  background: 'var(--ps-text-10)',
  display: 'none',
  '& :hover': {
    borderRadius: '50%',
    background: 'var(--ps-text-20)'
  }
}))

const StyleMenuButton = styled(MenuButton)(() => ({
  cursor: 'pointer',
  ':hover': {
    opacity: 0.9
  }
}))

const TabLineSvg = styled(TabLine)`
  & g {
    stroke:'#fff;
  }
`

export default function BoxTab({
  boxData,
  draftInfo,
  editing,
  boxAddress,
  appId,
  handleTabIntoView,
  enablePluginList,
  roomId,
  onSubmit,
  boxType
}: {
  boxData: IBoxValue
  draftInfo?: IBoxesJsonData | null
  editing: boolean
  boxAddress: string
  appId?: string
  roomId?: string
  handleTabIntoView?: () => void
  enablePluginList: EnablePluginListResult[]
  onSubmit?: () => void
  boxType?: number
}) {
  const isMd = useBreakpoint('md')
  const userInfo = useUserInfo()
  const [tab, setTab] = useState('')
  const [tabItem, setTabItem] = useState<EnablePluginListResult | undefined>()
  const [show, setShow] = useState(false)
  const [scrollRight, setScrollRight] = useState(0)
  const [scrollLeft, setScrollLeft] = useState(0)
  const tabRef = useRef<HTMLImageElement>(null)
  const tabAllRef = useRef<HTMLImageElement>(null)
  const tooltipsRef = useRef<any[]>([])
  const [elementWidth, setElementWidth] = useState(0)
  const [isShowMenu, setIsShowMenu] = useState<boolean>(true)
  const pluginNameList = useMemo(
    () =>
      enablePluginList
        .sort((a, b) => boxData.pluginList.indexOf(Number(a.id)) - boxData.pluginList.indexOf(Number(b.id)))
        .filter(_ => _)
        .filter(v => Number(v.id) !== IClubPluginId.SendingMe) as unknown as EnablePluginListResult[],
    [enablePluginList, boxData.pluginList]
  )

  useEffect(() => {
    pluginNameList.length > 8 && setScrollRight((pluginNameList.length - 8) * 88)
  }, [pluginNameList])

  useEffect(() => {
    if (appId && pluginNameList.length) {
      const data = pluginNameList.filter(item => item.id === appId)
      setTabItem(data[0])
    }
  }, [appId, pluginNameList])

  const countScroll = (text: string) => {
    if (!tabRef.current) return
    if (text === 'right') {
      if (scrollRight < 880) {
        tabRef.current.scrollLeft += scrollRight
        setScrollLeft(scrollLeft + scrollRight)
        setScrollRight(0)
      } else {
        tabRef.current.scrollLeft += 880
        setScrollLeft(scrollLeft + 880)
        setScrollRight(scrollRight - 880)
      }
    } else {
      if (scrollLeft < 880) {
        tabRef.current.scrollLeft -= scrollLeft
        setScrollRight(scrollLeft + scrollRight)
        setScrollLeft(0)
      } else {
        tabRef.current.scrollLeft -= 880
        setScrollRight(scrollRight + 880)
        setScrollLeft(scrollLeft - 880)
      }
    }
  }
  const [tipTab, setTipTab] = useState(0)
  const pluginId = useMemo(() => {
    if (appId) {
      return Number(appId)
    }
    return undefined
  }, [appId])

  const PluginInfo = useGetPluginInfo(pluginId)
  // const iconList = useMemo(
  //   () => boxData.pluginList.map(i => pluginList.find(_ => _.id === i)).filter(_ => _),
  //   [boxData.pluginList, pluginList]
  // )

  useEffect(() => {
    if (PluginInfo?.id !== undefined) {
      setTab(`${PluginInfo?.id}`)
    } else {
      setTab('About')
    }
  }, [PluginInfo?.id, PluginInfo?.pluginName, appId])

  const appTokenListData = useMemo(() => {
    const ret: { [x in IClubPluginId]?: IBoxPluginBasicItemData[] } = {}
    for (const item of boxData.pluginData) {
      if (!ret?.[item.pluginId]) {
        ret[item.pluginId] = [item]
      } else {
        ret[item.pluginId]?.push(item)
      }
    }
    return ret
  }, [boxData.pluginData])

  useEffect(() => {
    if (tab !== 'About') {
      if (userInfo.user === null) {
        setTipTab(IsLogin.Unlogin)
      } else {
        // if (userInfo.user?.twitterSocialId || userInfo.user?.boxStatus !== -1) {
        setTipTab(IsLogin.Permissions)
        // } else {
        //   setTipTab(IsLogin.UnPermissions)
        // }
      }
    }
  }, [tab, tipTab, userInfo.user, userInfo.user?.boxStatus, userInfo.user?.twitterSocialId])

  const handleIconChange = (value: string) => {
    if (handleTabIntoView) handleTabIntoView()
    setTab(value)
  }
  // const handleChange = useCallback(
  //   (event: React.SyntheticEvent, value: string) => {
  //     if (handleTabIntoView) handleTabIntoView()
  //     setTab(value)
  //   },
  //   [handleTabIntoView]
  // )
  useEffect(() => {
    if (pluginNameList.length) {
      setShow(true)
      return
    }
    if (!boxData.pluginList.length) {
      setShow(true)
      return
    }
    if (boxData.pluginList.length === 1 && boxData.pluginList.includes(IClubPluginId.SendingMe)) {
      setShow(true)
    }
  }, [boxData.pluginList, boxData.pluginList.length, pluginNameList.length])
  const isShow = useDebounce(show, 500)

  const [windowWidth, setWindowWidth] = useState(window.innerWidth)

  useEffect(() => {
    const handleResize = () => {
      setWindowWidth(window.innerWidth)
    }
    window.addEventListener('resize', handleResize)
    return () => {
      window.removeEventListener('resize', handleResize)
    }
  }, [])
  useEffect(() => {
    const clientWidth = tabAllRef?.current?.clientWidth
    if (clientWidth && !isMd && isShow) {
      setElementWidth(clientWidth)
    }
  }, [isMd, isShow, tabAllRef.current?.clientWidth, isShowMenu, editing])
  const [tabLeft, setTabLeft] = useState(0)
  const handleHover = (event: any) => {
    const target = event.target
    const rect = target.getBoundingClientRect()
    const distanceToLeft = rect.left
    setTabLeft(distanceToLeft)
  }
  const countTabLeft = (tabLeftWidth: number, iconWidth: number, index?: number) => {
    if (index !== undefined && tooltipsRef.current[index]) {
      return (
        tabLeftWidth - (windowWidth - elementWidth) / 2 + (iconWidth - tooltipsRef.current[index].offsetWidth + 14) / 2
      )
    }
    // if (tooltipsWidth) {
    //   return tabLeftWidth - (windowWidth - elementWidth) / 2 + (iconWidth - tooltipsWidth + 12) / 2
    // }
    return tabLeftWidth - (windowWidth - elementWidth) / 2
  }

  return (
    <TabContext value={tab}>
      {isMd ? (
        <Box style={{ width: '100%', margin: isMd ? '4px auto 16px' : '40px auto 0' }}>
          <Stack
            className="project-step5"
            maxWidth={isMd ? 'calc(100vw - 40px)' : '1200px'}
            margin={'auto'}
            flexDirection={'row'}
            justifyContent={editing ? 'space-between' : 'center'}
            alignItems={'center'}
          >
            <TabList
              // onChange={handleChange}
              aria-label="lab API tabs example"
              variant="scrollable"
              sx={{
                '& .MuiTab-root': {
                  padding: isMd ? '4px 0' : '32px 24px',
                  fontSize: isMd ? 13 : 20,
                  fontWeight: 500,
                  lineHeight: isMd ? '13px' : '26px',
                  color: 'var(--ps-text-100)',
                  textTransform: 'initial',
                  fontFamily: 'Inter',
                  fontStyle: 'normal',
                  minWidth: 'auto'
                },
                '& .MuiTabs-flexContainer': {
                  gap: 20
                }
              }}
            >
              <Tab
                className="project-step6"
                key={-1}
                label={'About'}
                value={'About'}
                onClick={() => {
                  setTabItem(undefined)
                  handleIconChange('About')
                }}
              />
              <Tab
                key={-3}
                label={'Chatroom'}
                value={'Chatroom'}
                onClick={() => {
                  setTabItem(undefined)
                  handleIconChange('Chatroom')
                }}
              />
              {pluginNameList.map((item, index) => {
                return (
                  <Tab
                    key={index}
                    label={item.pluginName}
                    value={`${item.id}`}
                    onClick={() => {
                      if (item) {
                        setTabItem(item)
                        handleIconChange(`${item.id}`)
                      }
                    }}
                  />
                )
              })}
            </TabList>
          </Stack>
          {editing && isMd && (
            <Button
              variant="contained"
              disabled={draftInfo?.listingStatus}
              onClick={() => {
                viewControl.show('AddPlugin', {
                  cb: onSubmit,
                  boxType: boxType
                })
              }}
              sx={{
                width: isMd ? 'calc(100vw - 40px)' : '100',
                margin: isMd ? '16px 20px 0' : '16px 0 0',
                fontSize: 14
              }}
            >
              + Add An App
            </Button>
          )}
        </Box>
      ) : (
        <CSSTransition in={isShow} timeout={200} classNames="tab-transition" unmountOnExit>
          <Stack
            ref={tabAllRef}
            className="applenav project-step5"
            gap={!isShowMenu && !editing ? 0 : 24}
            flexDirection={'row'}
            alignItems={'center'}
            sx={{
              borderRadius: 16,
              position: 'fixed',
              bottom: 16,
              left: '50%',
              transform: 'translateX(-50%)',
              zIndex: 99,
              background: 'var(--ps-text-20)',
              backdropFilter: 'blur(12px)',
              px: '24px',
              '& .tabScrollBox': {
                display: 'block'
              }
            }}
          >
            {!isShowMenu ? (
              <TooltipBox
                sx={{
                  width: 'max-content',
                  height: 'max-content'
                }}
                onMouseOver={handleHover}
              >
                <Tooltips ref={ref => (tooltipsRef.current[0] = ref)} sx={{ left: countTabLeft(tabLeft, 42, 0) }}>
                  Menu
                </Tooltips>
                <StyleMenuButton onClick={() => setIsShowMenu(true)} />
              </TooltipBox>
            ) : (
              <TooltipBox
                sx={{
                  width: 'max-content',
                  height: 'max-content'
                }}
                onMouseOver={handleHover}
              >
                <Tooltips ref={ref => (tooltipsRef.current[1] = ref)} sx={{ left: countTabLeft(tabLeft, 44, 1) }}>
                  Close
                </Tooltips>
                <CloseButton onClick={() => setIsShowMenu(false)} />
              </TooltipBox>
            )}

            <Stack
              direction={'row'}
              spacing={!isShowMenu ? 0 : 24}
              sx={{
                maxWidth: 'max-content',
                width: '100%',
                alignItems: 'center'
              }}
            >
              <Box
                sx={{
                  maxWidth: 'max-content',
                  position: 'relative',
                  width: '100%',
                  display: 'flex',
                  alignItems: 'center'
                }}
              >
                <Stack
                  ref={tabRef}
                  flexDirection={'row'}
                  alignItems={'center'}
                  gap={24}
                  sx={{
                    maxWidth: !isShowMenu ? 0 : 860,
                    transition: 'all 0.5s',
                    overflow: 'auto',
                    padding: '16px 0',
                    scrollBehavior: 'smooth',
                    '&::-webkit-scrollbar': {
                      display: 'none'
                    }
                  }}
                >
                  <TooltipBox
                    className="project-step6"
                    onMouseOver={handleHover}
                    onClick={() => {
                      setTabItem(undefined)
                      handleIconChange('About')
                    }}
                  >
                    <Tooltips ref={ref => (tooltipsRef.current[2] = ref)} sx={{ left: countTabLeft(tabLeft, 64, 2) }}>
                      About
                    </Tooltips>
                    <Image src={AboutPng.src} height={64} width={64} style={{ borderRadius: 14 }} alt="" />
                    {tab === 'About' && <ActivePoint />}
                  </TooltipBox>
                  <TooltipBox
                    onMouseOver={handleHover}
                    onClick={() => {
                      setTabItem(undefined)
                      handleIconChange('Chatroom')
                    }}
                  >
                    <Tooltips ref={ref => (tooltipsRef.current[3] = ref)} sx={{ left: countTabLeft(tabLeft, 64, 3) }}>
                      Chatroom
                    </Tooltips>
                    <Image src={Chatroom.src} height={64} width={64} alt="" />
                    {tab === 'Chatroom' && <ActivePoint />}
                  </TooltipBox>
                  {pluginNameList.map((item, index) => {
                    return (
                      <TooltipBox
                        key={index}
                        onMouseOver={handleHover}
                        onClick={() => {
                          if (item) {
                            setTabItem(item)
                            handleIconChange(`${item.id}`)
                          }
                        }}
                      >
                        {item && (
                          <>
                            <Tooltips
                              ref={ref => (tooltipsRef.current[index + 4] = ref)}
                              sx={{ left: countTabLeft(tabLeft, 64, index + 4) }}
                            >
                              {item.pluginName}
                            </Tooltips>
                            <Image
                              src={item.icon}
                              width={64}
                              height={64}
                              alt="png"
                              style={{
                                borderRadius: 14
                              }}
                            />
                            {tab === `${item.id}` && <ActivePoint />}
                          </>
                        )}
                      </TooltipBox>
                    )
                  })}
                </Stack>
                {isShowMenu && scrollLeft !== 0 && (
                  <TabScrollBox
                    className="tabScrollBox"
                    sx={{
                      left: -10
                    }}
                    onClick={() => {
                      countScroll('left')
                    }}
                  >
                    <ChevronLeftIcon />
                  </TabScrollBox>
                )}
                {isShowMenu && scrollRight !== 0 && (
                  <TabScrollBox
                    className="tabScrollBox"
                    sx={{
                      right: -10
                    }}
                    onClick={() => {
                      countScroll('right')
                    }}
                  >
                    <ChevronRightIcon />
                  </TabScrollBox>
                )}
              </Box>
            </Stack>
            {/* {editing && <Box sx={{ width: '1px', height: 64, background: 'var(--ps-text-40)' }} />} */}
            {editing && <TabLineSvg />}
            {editing && (
              <Button
                variant="contained"
                disabled={draftInfo?.listingStatus}
                sx={{
                  width: 145,
                  fontSize: 15,
                  fontWeight: 500,
                  lineHeight: '26px',
                  marginRight: 24
                }}
                onClick={() => {
                  viewControl.show('AddPlugin', {
                    cb: onSubmit,
                    boxType: boxType
                  })
                }}
              >
                + Add An App
              </Button>
            )}
          </Stack>
        </CSSTransition>
      )}
      <Box
        className="BoxTabChildOne"
        // id={'BoxTabTopChild'}
        sx={{
          backgroundColor: '#1C1C19',
          padding: isMd ? '13px 17px 60px' : '48px 0 120px',
          marginTop: isMd ? 0 : 60
        }}
      >
        <TabPanel value={'About'}>
          <AboutCard draftInfo={draftInfo} editing={editing} data={boxData.about} />
        </TabPanel>
        {tipTab !== IsLogin.Unlogin && (
          <>
            <TabPanel value="Chatroom">
              <ChatroomCard
                roomId={boxData.roomId ?? roomId}
                boxId={boxData.boxBasicInfo.boxId}
                userJoinRoom={boxData.isJoinRoom}
              />
            </TabPanel>
          </>
        )}
        {tipTab === IsLogin.Permissions && (
          <>
            <TabPanel value={`${getAppPluginId(IPluginNameType.Bitswap)}`}>
              {boxAddress && boxData && (
                <Bitswap
                  draftInfo={draftInfo}
                  boxData={boxData}
                  editing={editing}
                  supportedTokenData={appTokenListData?.[IClubPluginId.BITSWAP] || []}
                />
              )}
            </TabPanel>
            <TabPanel value={`${getAppPluginId(IPluginNameType.Bitstable)}`}>
              {boxAddress && boxData && (
                <StablecoinCard _boxContractAddr={boxAddress} editing={editing} boxData={boxData} />
              )}
            </TabPanel>
            <TabPanel value={`${getAppPluginId(IPluginNameType.Bitleverage)}`}>
              {boxAddress && (
                <BitLeverage
                  boxContractAdr={boxAddress}
                  editing={editing}
                  boxData={boxData}
                  supportedTokenData={appTokenListData?.[IClubPluginId.BITLEVERAGE] || []}
                />
              )}
            </TabPanel>
            <TabPanel value={`${getAppPluginId(IPluginNameType.Bitstaking)}`}>
              {boxAddress && (
                <Bitstaking
                  boxContactAddr={boxAddress}
                  editing={editing}
                  boxId={boxData.boxBasicInfo.boxId}
                  pluginId={pluginId}
                  listing={draftInfo?.listingStatus}
                />
              )}
            </TabPanel>
            {![
              'About',
              'Chatroom',
              `${getAppPluginId(IPluginNameType.Bitstaking)}`,
              `${getAppPluginId(IPluginNameType.Bitleverage)}`,
              `${getAppPluginId(IPluginNameType.Bitstable)}`,
              `${getAppPluginId(IPluginNameType.Bitswap)}`
            ].includes(tab) &&
              tabItem &&
              !!tabItem.url && (
                <Stack
                  mt={20}
                  height={isMd ? '100%' : 500}
                  sx={{
                    maxWidth: isMd ? 'calc(100vw - 40px)' : 924,
                    width: '100%',
                    margin: '20px auto 0',
                    cursor: 'pointer',
                    borderRadius: '12px'
                  }}
                  onClick={() => {
                    window.open(tabItem.url, '_blank')
                  }}
                >
                  <Image width={'100%'} height={'100%'} src={tabItem.banner} alt=" " />
                </Stack>
              )}
            <TabPanel value={`${getAppPluginId(IPluginNameType.FiveInARow)}`}>
              <GamePinal tabItem={tabItem} appId={appId} />
            </TabPanel>
            <TabPanel value={`${getAppPluginId(IPluginNameType.ShisenSho)}`}>
              <GamePinal tabItem={tabItem} appId={appId} />
            </TabPanel>
            <TabPanel value={`${getAppPluginId(IPluginNameType.JigsawPuzzle)}`}>
              <GamePinal tabItem={tabItem} appId={appId} />
            </TabPanel>
            <TabPanel value={`${getAppPluginId(IPluginNameType.BoxStack)}`}>
              <GamePinal tabItem={tabItem} appId={appId} />
            </TabPanel>
            <TabPanel value={`${getAppPluginId(IPluginNameType.FallingBlocks)}`}>
              <GamePinal tabItem={tabItem} appId={appId} />
            </TabPanel>
            <TabPanel value={`${getAppPluginId(IPluginNameType.Auction)}`}>
              {boxAddress && (
                <BitAuctionList boxData={boxData} editing={editing} listing={!!draftInfo?.listingStatus} />
              )}
            </TabPanel>
          </>
        )}
        {tipTab === IsLogin.Unlogin && (
          <>
            <TabPanel value="Chatroom">
              <BoxTip tipTab={tipTab} />
            </TabPanel>
          </>
        )}
        {(tipTab === IsLogin.Unlogin || tipTab === IsLogin.UnPermissions) && (
          <>
            {pluginNameList.map((item, index) => (
              <TabPanel key={index} value={`${item.id}`}>
                <BoxTip tipTab={tipTab} />
              </TabPanel>
            ))}
          </>
        )}
      </Box>
    </TabContext>
  )
}
