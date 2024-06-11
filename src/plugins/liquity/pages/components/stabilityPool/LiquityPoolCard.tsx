import { Button, Stack, Typography, styled } from '@mui/material'
import { TroveInfoProps, TroveStep } from 'plugins/liquity/hooks/useLiquityInfo'
import { SetStateAction } from 'react'
import BigNumber from 'bignumber.js'
import BTCIcon from 'assets/images/boxes/bbtc.png'
import Image from 'components/Image'
import useBreakpoint from 'hooks/useBreakpoint'

export const RowAlignStack = styled(Stack)({
  gap: 8,
  display: 'flex',
  flexDirection: 'row',
  justifyContent: 'space-between',
  alignItems: 'center'
})

export interface Props {
  setTroveStep: React.Dispatch<SetStateAction<TroveStep>>
  boxContractAddr?: string
  troveInfo?: TroveInfoProps
}

export default function Page({ setTroveStep, boxContractAddr, troveInfo }: Props) {
  console.log('🚀 ~ troveInfo:11', troveInfo, boxContractAddr)
  const isMd = useBreakpoint('md')

  return (
    <Stack
      spacing={16}
      sx={{
        width: isMd ? 'calc(100vw - 80px)' : '50%',
        height: 474,
        borderRadius: '16px',
        background: 'var(--ps-neutral)',
        padding: '24px 16px'
      }}
    >
      <Stack direction={'row'} justifyContent={'flex-start'} alignItems={'center'} spacing={16}>
        <Image src={BTCIcon.src} width={24} height={24} style={{ borderRadius: '50%' }} alt="bbtc" />
        <Typography fontSize={20} fontWeight={500}>
          {troveInfo?.btcToken?.symbol?.toLocaleUpperCase()}-{troveInfo?.stableToken?.symbol?.toLocaleUpperCase()}{' '}
          Liquidity
        </Typography>
      </Stack>
      <Stack sx={{ width: '100%', border: '0.5px solid #FFFFFF1A' }}></Stack>
      <Stack justifyContent={'flex-start'} alignItems={'center'} spacing={16}>
        <Stack
          spacing={8}
          sx={{
            width: '100%',
            border: '1px solid #FFFFFF33',
            borderRadius: '12px',
            padding: 16
          }}
        >
          <Typography fontSize={14} color={'#FFFFFF99'}>
            Debt
          </Typography>
          <Typography fontSize={16} fontWeight={700}>
            ${(troveInfo?.userDebtAmount && troveInfo.userDebtAmount.toSignificant()) || '--'}
          </Typography>
        </Stack>
        <Stack
          spacing={8}
          sx={{
            width: '100%',
            border: '1px solid #FFFFFF33',
            borderRadius: '12px',
            padding: 16
          }}
        >
          <Typography fontSize={14} color={'#FFFFFF99'}>
            Collateral
          </Typography>
          <Typography fontSize={16} fontWeight={700}>
            {(troveInfo?.userCollateralAmount && troveInfo.userCollateralAmount.toSignificant()) || '--'} BBTC
          </Typography>
        </Stack>
        <Stack
          spacing={8}
          sx={{
            width: '100%',
            border: '1px solid #FFFFFF33',
            borderRadius: '12px',
            padding: 16
          }}
        >
          <Typography fontSize={14} color={'#FFFFFF99'}>
            CR
          </Typography>
          {(troveInfo?.userDebtAmount?.equalTo('0') || !troveInfo?.userDebtAmount) && (
            <Typography color={'#1FC64E'} fontSize={16} fontWeight={700}>
              --%
            </Typography>
          )}
          {troveInfo?.userDebtAmount?.greaterThan('0') &&
            troveInfo.userCollateralRatio &&
            new BigNumber(troveInfo.userCollateralRatio?.toExact())?.times(100)?.gt(150) && (
              <Typography color={'#1FC64E'} fontSize={16} fontWeight={700}>
                {troveInfo.userCollateralRatio.mul(100).toFixed(2)}%
              </Typography>
            )}
          {troveInfo?.userDebtAmount?.greaterThan('0') &&
            troveInfo.userCollateralRatio &&
            new BigNumber(troveInfo.userCollateralRatio?.toExact())?.times(100)?.lt(110) && (
              <Typography color={'#D12A1F'} fontSize={16} fontWeight={700}>
                {troveInfo.userCollateralRatio.mul(100).toFixed(2)}%
              </Typography>
            )}
          {troveInfo?.userDebtAmount?.greaterThan('0') &&
            troveInfo.userCollateralRatio?.mul(100)?.greaterThan('110') &&
            troveInfo.userCollateralRatio?.mul(100)?.lessThan('150') && (
              <Typography color={'#F7931B'} fontSize={16} fontWeight={700}>
                {troveInfo.userCollateralRatio.mul(100).toFixed(2)}%
              </Typography>
            )}
        </Stack>
      </Stack>
      {troveInfo?.userCollateralAmount?.greaterThan('0') ? (
        <RowAlignStack sx={{ marginTop: 'auto !important' }}>
          <Button
            variant="outlined"
            sx={{ marginTop: 'auto !important', width: '50%' }}
            onClick={() => setTroveStep(TroveStep.ADJUST_TROVE)}
          >
            Adjust Trove
          </Button>
          <Button variant="contained" sx={{ width: '50%' }} onClick={() => setTroveStep(TroveStep.CLOSE_TROVE)}>
            Close Trove
          </Button>
        </RowAlignStack>
      ) : (
        <Button
          variant="contained"
          sx={{ marginTop: 'auto !important', width: '100%' }}
          onClick={() => setTroveStep(TroveStep.OPEN_TROVE)}
        >
          Open Trove
        </Button>
      )}
    </Stack>
  )
}
