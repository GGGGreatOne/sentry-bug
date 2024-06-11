import { Accordion, AccordionDetails, AccordionSummary, Box, Stack, Tab, Tabs, Typography, styled } from '@mui/material'
import { ReactNode, useCallback, useMemo, useState } from 'react'
import ExpandMoreIcon from '@mui/icons-material/ExpandMore'
// import useTotalAssets from 'hooks/useTotalAssets'
// import { formatGroupNumber } from 'utils'
// import BigNumber from 'bignumber.js'
import MainDashboard from './MainDashboard'
import TokenToolBox from '../../../plugins/tokenToolBox/pages/components/TokenToolBox'
import Whitelist from './Whitelist'
import ExportMoreSvg from 'assets/svg/export_more.svg'
import { viewControl } from '../modal'
import { useClubAuthCallback } from 'hooks/boxes/useClubAuthCallback'
import { ClubMemberMode } from 'hooks/boxes/types'
import useBreakpoint from 'hooks/useBreakpoint'
import { Swiper, SwiperSlide } from 'swiper/react'
import 'swiper/swiper-bundle.css'
import { IBoxesJsonData } from 'state/boxes/type'

export enum TabStatus {
  MainDashboard,
  TokenToolBox,
  Whitelist
}

const StyleExportButton = styled(Box)(() => ({
  width: 20,
  height: 20,
  background: '#282828',
  borderRadius: '4.5px',
  display: 'flex',
  justifyContent: 'center',
  alignItems: 'center',
  cursor: 'pointer',
  svg: {
    transform: 'scale(0.5)'
  }
}))

const PortfolioItem = ({ label, value, labelMore }: { label: string; labelMore?: ReactNode; value: ReactNode }) => {
  const isMd = useBreakpoint('md')

  return (
    <Stack
      className={label === 'Access' ? 'project-step2' : ''}
      flex={1}
      p={16}
      gap={12}
      minWidth={100}
      justifyContent={'space-between'}
      sx={{
        background: 'var(--ps-neutral)',
        borderRadius: 12
      }}
    >
      <Stack flexDirection={'row'} gap={12}>
        <Typography
          fontFamily={'IBM Plex Sans'}
          fontSize={isMd ? 12 : 15}
          lineHeight={isMd ? 1.3 : 1.4}
          color="var(--ps-neutral3)"
        >
          {label}
        </Typography>
        {labelMore}
      </Stack>
      <Box>{value}</Box>
    </Stack>
  )
}

const ClubPortfolio = ({
  boxAddress,
  draftInfo,
  isMine = true,
  feeAndReward,
  editing,
  followers,
  isListing
}: {
  boxAddress: string
  draftInfo?: IBoxesJsonData | null | undefined
  isMine?: boolean
  feeAndReward: { fee: string }
  editing?: boolean
  followers?: number
  isListing?: boolean
}) => {
  const isMd = useBreakpoint('md')

  const { isFreeMode, memberMode, paymentTokenAmount } = useClubAuthCallback(boxAddress)

  const isWhitelistMode = useMemo(() => {
    return memberMode === ClubMemberMode.WHITELIST_MODE
  }, [memberMode])

  const isPayMode = useMemo(() => {
    return memberMode === ClubMemberMode.PAYMENT_MODE
  }, [memberMode])

  const openEditClubAccessModal = useCallback(() => {
    if (isWhitelistMode) {
      viewControl.show('EditClubWhiteListModal', { clubAddress: boxAddress })
      return
    }
    if (isFreeMode) {
      viewControl.show('EditClubAccessModal', { clubAddress: boxAddress })
      return
    }
  }, [boxAddress, isFreeMode, isWhitelistMode])

  const portfolioItemList = useMemo(() => {
    return [
      // {
      //   label: 'Net Value',
      //   labelMore: null,
      //   value: (
      //     <Typography color={'var(--ps-text-100)'} fontSize={16} lineHeight={1.375}>
      //       {totalAssets?.toFixed(4) || 0}
      //     </Typography>
      //   )
      // },
      // {
      //   label: 'BIT',
      //   labelMore: null,
      //   value: (
      //     <Typography color={'var(--ps-text-100)'} fontSize={16} lineHeight={1.375}>
      //       {`${formatGroupNumber(userInfo.box?.tvl ? new BigNumber(userInfo.box.tvl).toNumber() : 0, '', 2)} BIT`}
      //     </Typography>
      //   )
      // },
      {
        label: 'Followers',
        labelMore: null,
        value: (
          <Typography
            color={'#30AD44'}
            fontWeight={500}
            fontSize={isMd ? 15 : 20}
            lineHeight={1.3}
            fontFamily={'IBM Plex Sans'}
          >
            {followers !== undefined ? followers : '--'}
          </Typography>
        )
      },
      // {
      //   label: 'Total Income',
      //   labelMore: null,
      //   value: (
      //     <Typography
      //       color={'#30AD44'}
      //       fontWeight={500}
      //       fontSize={isMd ? 15 : 20}
      //       lineHeight={1.3}
      //       fontFamily={'IBM Plex Sans'}
      //     >
      //       --
      //     </Typography>
      //   )
      // },
      {
        label: 'Access',
        labelMore:
          editing && !isPayMode && memberMode !== undefined && !isListing ? (
            <StyleExportButton
              onClick={e => {
                e?.stopPropagation()
                openEditClubAccessModal()
              }}
            >
              <ExportMoreSvg />
            </StyleExportButton>
          ) : null,
        value: (
          <Typography
            color={'#30AD44'}
            fontWeight={500}
            fontSize={isMd ? 15 : 20}
            lineHeight={1.3}
            fontFamily={'IBM Plex Sans'}
          >
            {isPayMode
              ? `${paymentTokenAmount?.toExact() || '--'} ${paymentTokenAmount?.currency.symbol || '--'}`
              : isWhitelistMode
                ? 'Whitelist'
                : isFreeMode && memberMode !== undefined
                  ? 'Free'
                  : '--'}
          </Typography>
        )
      }
    ]
  }, [
    isMd,
    followers,
    editing,
    isPayMode,
    isListing,
    memberMode,
    paymentTokenAmount,
    isFreeMode,
    isWhitelistMode,
    openEditClubAccessModal
  ])

  const [tabValue, setTabValue] = useState(() => TabStatus.MainDashboard)
  const handleChange = (event: React.SyntheticEvent, newValue: number) => {
    setTabValue(newValue)
  }
  const TabData = [TabStatus.MainDashboard, TabStatus.TokenToolBox]
  // memberMode === ClubMemberMode.WHITELIST_MODE
  //   ? [TabStatus.MainDashboard, TabStatus.TokenToolBox, TabStatus.Whitelist]
  //   : [TabStatus.MainDashboard, TabStatus.TokenToolBox]

  const TabDatatatusValue = {
    [TabStatus.MainDashboard]: 'Main Dashboard',
    [TabStatus.TokenToolBox]: 'Token ToolBox',
    [TabStatus.Whitelist]: 'Whitelist'
  }
  const a11yProps = useCallback((index: number) => {
    return {
      id: `simple-tab-${index}`,
      'aria-controls': `simple-tabpanel-${index}`
    }
  }, [])

  return (
    <Container>
      <CusAccordion defaultExpanded>
        <CusAccordionSummary expandIcon={<ExpandMoreIcon />} aria-controls="panel1bh-content" id="panel1bh-header">
          <Stack width={'100%'}>
            <Stack width={'100%'} flexDirection={'row'} justifyContent={'space-between'} alignItems={'center'}>
              <Typography
                fontFamily={'IBM Plex Sans'}
                fontWeight={500}
                color={'var(--ps-text-100)'}
                fontSize={isMd ? 15 : 20}
                lineHeight={1.3}
              >
                Club Portfolio
              </Typography>
            </Stack>
            <PortfolioItemsBox>
              {!isMd && portfolioItemList.map(item => <PortfolioItem key={item.label} {...item}></PortfolioItem>)}
              {isMd && (
                <Swiper observeParents={true} observer={true} slidesPerView={2} spaceBetween={'16px'}>
                  {portfolioItemList.map(item => {
                    return (
                      <SwiperSlide key={'swiper' + item.label}>
                        <PortfolioItem key={item.label} {...item}></PortfolioItem>
                      </SwiperSlide>
                    )
                  })}
                </Swiper>
              )}
            </PortfolioItemsBox>
            <Box margin="24px 0 6px" />
          </Stack>
        </CusAccordionSummary>
        <CusAccordionDetails>
          <Box
            sx={{
              width: '100%',
              height: '1px',
              background: 'var(--ps-neutral2)',
              margin: '0 0 6px'
            }}
          ></Box>

          <Box
            className="project-step3"
            sx={{
              border: 'unset !important'
            }}
          >
            <CustomTabs value={tabValue} onChange={handleChange}>
              {TabData.map((_, index) => (
                <CustomTab
                  className={TabDatatatusValue[_] === 'Token ToolBox' ? 'project-step4' : ''}
                  key={_ + index}
                  label={TabDatatatusValue[_]}
                  value={_}
                  {...a11yProps(_)}
                />
              ))}
            </CustomTabs>
            <PinalContainer>
              {tabValue === TabStatus.MainDashboard && (
                <MainDashboard
                  editing={editing}
                  draftInfo={draftInfo}
                  feeAndReward={feeAndReward}
                  boxAddress={boxAddress}
                  isMine={isMine}
                />
              )}
              {tabValue === TabStatus.TokenToolBox && (
                <TokenToolBox editing={editing} draftInfo={draftInfo} isMine={isMine} boxAddress={boxAddress} />
              )}
              {tabValue === TabStatus.Whitelist && <Whitelist />}
            </PinalContainer>
          </Box>
        </CusAccordionDetails>
      </CusAccordion>
    </Container>
  )
}
const Container = styled(Box)`
  max-width: 1200px;
  margin: 0 auto;
  width: 100%;
  margin-top: 20px;

  ${props => props.theme.breakpoints.down('md')} {
    padding: 0 20px;
  }
`

const CusAccordion = styled(Accordion)`
  background-color: transparent;
  background-image: none;
`

const CusAccordionSummary = styled(AccordionSummary)`
  width: 100%;
  background-color: transparent;
  background-image: none;
  border-bottom: 1px solid var(--ps-neutral2);
  min-height: 44px !important;

  &[aria-expanded='true'] {
    border-bottom: 1px solid transparent;
  }

  &.MuiPaper-root {
    height: 30px;
  }

  & {
    .MuiAccordionSummary-content {
      width: 100%;
      margin: 0;
    }
    .MuiAccordionSummary-expandIconWrapper {
      position: absolute;
      top: 16px;
      right: 0;
      /* margin-right: 8px; */
    }
  }
`
const CusAccordionDetails = styled(AccordionDetails)``

const PortfolioItemsBox = styled(Box)`
  width: 100%;
  display: flex;
  gap: 16px;
  margin-top: 16px;
  margin-bottom: 8px;
  justify-content: center;
  align-items: center;

  ${props => props.theme.breakpoints.down('md')} {
    width: calc(100vw - 40px);
  }
`

const CustomTab = styled(Tab)`
  color: var(--ps-text-40);
  font-family: 'SF Pro Display';
  font-size: 15px;
  font-style: normal;
  font-weight: 400;
  line-height: 100%;
  text-transform: none;
  padding: 8px 17px;
  min-height: min-content;
  margin: 0 8px;
  &.Mui-selected {
    color: var(--ps-text-100);
    border-radius: 8px;
    /* background: var(--ps-neutral); */
  }

  ${props => props.theme.breakpoints.down('md')} {
    font-size: 13px;
    padding: 0;
    margin: 0;
    line-height: 130%;
  }
`

const CustomTabs = styled(Tabs)`
  width: max-content;
  min-height: 34px;
  margin-top: 20px;

  & .MuiTabs-scroller {
    height: min-content;
  }

  & .Mui-selected {
    background: none;
  }
  & .MuiTabs-flexContainer {
    /* background-color: var(--ps-neutral2); */
    border-radius: 8px !important;
    background: none;
  }
  & .MuiTabs-indicator {
    height: 0.8px;
    /* background: none; */
  }

  ${props => props.theme.breakpoints.down('md')} {
    & .MuiTabs-flexContainer {
      gap: 20px;
    }
  }
`

const PinalContainer = styled(Box)`
  margin-top: 24px;
  padding-bottom: 32px;
`

export default ClubPortfolio
