import { ErrorTips } from './components/openTrove'
import { useLiquityInfo } from '../hooks/useLiquityInfo'
import { Button, Stack, Typography } from '@mui/material'
import { useActiveWeb3React } from 'hooks'
import BigNumber from 'bignumber.js'

export interface Props {
  stableTokenAddr: string
  borrowContractAddr: string
  activePoolContractAddr: string
  defaultPoolContractAddr: string
  hintHelperContractAddr: string
  sortedTrovesContractAddr: string
  priceFeedContractAddr: string
  troveManagerContractAddr: string
}

function Liquity({
  stableTokenAddr,
  borrowContractAddr,
  activePoolContractAddr,
  defaultPoolContractAddr,
  hintHelperContractAddr,
  sortedTrovesContractAddr,
  priceFeedContractAddr,
  troveManagerContractAddr
}: Props) {
  const { account } = useActiveWeb3React()
  const troveInfo = useLiquityInfo(
    stableTokenAddr,
    borrowContractAddr,
    activePoolContractAddr,
    defaultPoolContractAddr,
    hintHelperContractAddr,
    sortedTrovesContractAddr,
    priceFeedContractAddr,
    troveManagerContractAddr
  )

  return (
    <Stack
      spacing={16}
      sx={{
        padding: '32px 40px',
        background: 'var(--ps-neutral2)',
        borderRadius: '12px'
      }}
    >
      {troveInfo.userDebtAmount && troveInfo.userDebtAmount.equalTo('0') && (
        <ErrorTips
          text={`You haven't borrowed any ${troveInfo.stableToken.symbol?.toLocaleUpperCase()} yet .You can borrow ${troveInfo.stableToken.symbol?.toLocaleUpperCase()} against BBTC collateral by opening a Trove.`}
        />
      )}
      <Stack
        spacing={16}
        sx={{
          background: 'var(--ps-neutral)',
          borderRadius: '16px',
          padding: '16px 24px'
        }}
      >
        <Typography>Your Trove</Typography>
        <Stack
          display={'grid'}
          gridTemplateColumns={'32% 32% 32%'}
          direction={'row'}
          justifyContent={'space-between'}
          alignItems={'center'}
        >
          <Stack
            spacing={8}
            sx={{
              border: '1px solid #FFFFFF33',
              borderRadius: '12px',
              padding: 16
            }}
          >
            <Typography fontSize={13} color={'#FFFFFF99'}>
              Debt
            </Typography>
            <Typography>${(troveInfo.userDebtAmount && troveInfo.userDebtAmount.toSignificant(2)) || '--'}</Typography>
          </Stack>
          <Stack
            spacing={8}
            sx={{
              border: '1px solid #FFFFFF33',
              borderRadius: '12px',
              padding: 16
            }}
          >
            <Typography fontSize={13} color={'#FFFFFF99'}>
              Collateral
            </Typography>
            <Typography>
              {(troveInfo.userCollateralAmount && troveInfo.userCollateralAmount.toSignificant(2)) || '--'} BBTC
            </Typography>
          </Stack>
          <Stack
            spacing={8}
            sx={{
              border: '1px solid #FFFFFF33',
              borderRadius: '12px',
              padding: 16
            }}
          >
            <Typography fontSize={13} color={'#FFFFFF99'}>
              CR
            </Typography>
            {(troveInfo.userDebtAmount?.equalTo('0') || !troveInfo.userDebtAmount) && (
              <Typography color={'#1FC64E'} fontSize={20} fontWeight={500}>
                --%
              </Typography>
            )}
            {troveInfo.userDebtAmount?.greaterThan('0') &&
              troveInfo.userCollateralRatio &&
              new BigNumber(troveInfo.userCollateralRatio?.toExact())?.times(100)?.gt(150) && (
                <Typography color={'#1FC64E'} fontSize={20} fontWeight={500}>
                  {troveInfo.userCollateralRatio.mul(100).toFixed(2)}%
                </Typography>
              )}
            {troveInfo.userDebtAmount?.greaterThan('0') &&
              troveInfo.userCollateralRatio &&
              new BigNumber(troveInfo.userCollateralRatio?.toExact())?.times(100)?.lt(110) && (
                <Typography color={'#D12A1F'} fontSize={20} fontWeight={500}>
                  {troveInfo.userCollateralRatio.mul(100).toFixed(2)}%
                </Typography>
              )}
            {troveInfo.userDebtAmount?.greaterThan('0') &&
              troveInfo.userCollateralRatio?.mul(100)?.greaterThan('110') &&
              troveInfo.userCollateralRatio?.mul(100)?.lessThan('150') && (
                <Typography color={'#F7931B'} fontSize={20} fontWeight={500}>
                  {troveInfo.userCollateralRatio.mul(100).toFixed(2)}%
                </Typography>
              )}
          </Stack>
        </Stack>
      </Stack>
      <Stack mt={12} direction={'row'} display={'grid'} gridTemplateColumns={'1fr 1fr'} spacing={16}>
        <Stack
          mt={12}
          sx={{
            background: 'var(--ps-neutral)',
            borderRadius: '16px',
            padding: '16px 24px'
          }}
        >
          <div className="flex items-center justify-between">
            <span className="text-center c-#fff text-[24px] line-height-5">Stake BBTC</span>
            {troveInfo.userDebtAmount && troveInfo.userDebtAmount?.greaterThan('0') && (
              <Button variant="outlined">Close Trove</Button>
            )}
            {((troveInfo.userDebtAmount && troveInfo.userDebtAmount?.equalTo('0')) || !account) && (
              <Button variant="contained">Open Trove</Button>
            )}
          </div>
          <div className="flex items-center justify-between  mt-[12px]">
            <span className="text-center c-#fff text-[24px] line-height-5">
              Build {troveInfo.stableToken.symbol?.toLocaleUpperCase()} Stablecoin
            </span>
            {troveInfo.userDebtAmount && troveInfo.userDebtAmount?.greaterThan('0') && (
              <Button variant="contained" sx={{ width: '100%' }}>
                Adjust Trove
              </Button>
            )}
          </div>
        </Stack>
        <Stack
          mt={12}
          sx={{
            background: 'var(--ps-neutral)',
            borderRadius: '16px',
            padding: '16px 24px'
          }}
        >
          <div className="pt-4 border border-#fff border-opacity-10 w-25 h-25 b-rd-50% border-style-solid m-auto mb-6 flex flex-col justify-center flex-items-center gap-2">
            <div className="flex flex-row justify-center gap-1"></div>
            <p className="text-3">Rank</p>
          </div>
          <p className="text-center c-#fff text-3.5 line-height-5">To view the entire</p>
          <p className="text-center c-#fff text-3.5 line-height-5 mb-15">system debt</p>
          <div className="relative cursor-pointer">
            <Button variant="contained" sx={{ width: '100%' }}>
              Risky Troves
            </Button>
          </div>
        </Stack>
      </Stack>
    </Stack>
  )
}
export default Liquity
