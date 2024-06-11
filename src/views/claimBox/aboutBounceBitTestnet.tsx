import { Accordion, AccordionDetails, AccordionSummary, Box, Typography } from '@mui/material'
import ArrowSvg from 'assets/svg/claimBox/arrow.svg'
import useBreakpoint from 'hooks/useBreakpoint'
const AccordionComp = ({ title, subTitle }: { title: string; subTitle: string | JSX.Element }) => {
  return (
    <Accordion
      sx={{
        '&.MuiPaper-root': {
          background: 'transparent',
          margin: 0,
          '&:before': {
            backgroundColor: 'transparent'
          },
          '&.MuiAccordion-root.Mui-expanded:before': { opacity: 1 },
          borderTop: '1px solid  var(--ps-text-10)',
          '&:first-of-type': {
            borderTop: 'none'
          }
        },
        '&.MuiAccordion-root': {
          boxShadow: 'none'
        },
        '& .MuiAccordionSummary-content': {
          padding: { xs: '20px 0', md: '40px 0' },
          margin: 0,
          '&.Mui-expanded': { margin: 0 }
        }
      }}
    >
      <AccordionSummary expandIcon={<ArrowSvg />} aria-controls="panel1-content" id="panel1-header">
        <Typography
          sx={{
            color: 'var(--ps-text-100)',
            fontFamily: 'SF Pro Display',
            fontSize: { xs: 20, md: 28 },
            fontStyle: 'normal',
            fontWeight: '500',
            lineHeight: '140%'
          }}
        >
          {title}
        </Typography>
      </AccordionSummary>
      <AccordionDetails sx={{ paddingBottom: 40 }}>
        <Typography
          sx={{
            maxWidth: 900,
            color: 'var(--ps-text-60)',
            fontFamily: 'SF Pro Display',
            fontSize: { xs: 15, md: 16 },
            fontStyle: 'normal',
            fontWeight: '400',
            lineHeight: '140%'
          }}
        >
          {subTitle}
        </Typography>
      </AccordionDetails>
    </Accordion>
  )
}
export default function Page() {
  const isSm = useBreakpoint('sm')
  return (
    <Box>
      <Typography
        sx={{
          color: 'var(--ps-neutral3)',
          textAlign: 'center',
          fontFamily: 'SF Pro Display',
          fontSize: { xs: 30, md: 56 },
          fontStyle: 'normal',
          fontWeight: '500',
          lineHeight: '140%',
          '& .w': {
            color: 'var(--ps-text-100)'
          }
        }}
      >
        About {isSm && <br />} <span className="w"> BounceBit Mainnet</span>
      </Typography>
      <Box sx={{ width: '100%', maxWidth: 1200, margin: '0 auto', mt: 60 }}>
        <AccordionComp
          title="Philosophy"
          subTitle={
            <>
              <span>
                {`In contrast to other public blockchains, BounceBit embraces Apple's ecosystem model for ecosystem development and technological advancement. Similar to Apple's approach, developers are required to apply and submit their applications to the App Store before distributing them to Apple devices.`}
              </span>
              <br />
              <span>
                In the case of BounceBit, developers must first update their smart contracts or applications on the App
                Store. Only smart contracts available on the App Store can be deployed on BounceBit. Configuration and
                deployment of apps from the App Store are exclusive to BounceClub owners. Once a Club is fully
                customized, its owners can invite others to join and participate within their Club.
              </span>
            </>
          }
        />
        <AccordionComp
          title="What is the BounceBit Chain?"
          subTitle={`BounceBit’s restaking infrastructure provides a foundational layer for different restaking products, secured by the regulated custody of Mainnet Digital and Ceffu. The BounceBit chain, designed as a showcase of a restaking product within the BounceBit ecosystem, is a PoS Layer 1 secured by validators staking both BTC and BounceBit’s native token – A dual-token system leveraging native Bitcoin’s security, liquidity and low volatility. Unlike existing Layer 2 solutions, the BounceBit network interacts with Bitcoin only on the asset level instead of the protocol level, taking a Layer 1 Proof of Stake approach. BTC Restaking provides shared security to infrastructure and DApps on BounceBit, e.g. bridges and oracles will be validated by restaked BTC.`}
        />
        <AccordionComp
          title="What is BounceClub?"
          subTitle={`The guiding philosophy of BounceBit is deeply motivated by Apple Inc.’s spirit of innovation and commitment to user-centric design. Apple’s success is attributed not only to the functionality of their products but also to their elegant design and user-friendly interface. Inspired by Apple’s business model, BounceBit aims to simplify smart contract deployment for everyone and minimize DApp redundancy by introducing BounceClub. BounceClub is an onchain Web3 universe that empowers everyone to customize, launch, and engage with decentralized applications. BounceClub owners are enabled to personalize their clubs and integrate decentralized applications by easily selecting from a variety of plugins featured on the BounceBit App Store. Users who do not own a BounceClub can browse existing BounceClubs and engage in various Web3 activities to earn yield. `}
        />
        <AccordionComp
          title="What is BounceBit App Store?"
          subTitle={`Integral to BounceClub is the BounceBit App Store, a library of diverse Web3 plugins. Developers are welcome to submit their applications, just like publishing apps on iOS's App Store. BounceClub owners are enabled to personalize their clubs and provide club members with Web3 activities by selecting from the diverse array of plugins featured on the BounceBit App Store. Users who do not own a BounceClub can browse existing BounceClubs and engage in various Web3 activities to earn yield.`}
        />
        {/* <AccordionComp
          title="How to participate in BounceBit’s Testnet Event?"
          subTitle={
            <>
              <span>
                BounceBit introduced The Water Margin event on January 29, offering users early access to staking on
                BounceBit and earning BounceBit points. The launch of the BounceBit Testnet is designed to reward early
                access users with a firsthand experience of our BounceClub feature. 
              </span>
              <br />
              <br />
              <span>
                By registering on https://bouncebit.io and depositing a minimum of $10, you’re eligible to create a
                BounceClub as a Club Owner and build your own DeFi space by selecting apps from the BounceBit App Store.
                Alternatively, as a Club User, you can still explore various Clubs and participate in DeFi activities to
                generate yield. Assets used during the BounceBit Testnet Event are mirrored from users’ staked assets on
                The Water Margin Event on https://bouncebit.io. 
              </span>
               
            </>
          }
        />
        <AccordionComp
          title="What are the benefits? "
          subTitle={
            <>
              <span>
                There will be two separate leaderboards tracking the level of engagement. BounceClub Owners are ranked
                based on the Total Value Locked (BIT) in their Clubs, whereas BounceClub Users are ranked based on their
                activeness within the Clubs.
              </span>
              <br />
              <br />
              <span>
                Advancing on the leaderboards brings various rewards, such as airdrops. Additionally, the top 6000
                BounceClub Owners on the Testnet leaderboard will be awarded 6000 BounceClub during the BounceBit
                Mainnet Launch scheduled in April. 
              </span>
            </>
          }
        /> */}
      </Box>
    </Box>
  )
}
