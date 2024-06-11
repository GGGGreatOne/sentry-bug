import { Box, Button, Stack, Typography } from '@mui/material'
import { viewControl } from '../../../views/editBox/modal'
import LiquityPoolCard from 'plugins/liquity/pages/components/stabilityPool/LiquityPoolCard'
import StablecoinPoolCard from 'plugins/liquity/pages/components/stabilityPool/StablecoinPoolCard'
import { useCallback, useEffect, useMemo, useState } from 'react'
import { TroveStep, useLiquityInfo, useQueryStablecoinContractAddr } from 'plugins/liquity/hooks/useLiquityInfo'
import { useActiveWeb3React } from 'hooks'
import { TROVE_FACTORY_ADDRESS } from 'plugins/liquity/addresses'
import { SupportedChainId } from 'constants/chains'
import { ZERO_ADDRESS } from '../../../constants'
import { useEditBoxPluginBitstableData } from 'state/boxes/hooks'
import LoadingAnimation from 'components/Loading'
import { IBoxValue, IPluginNameType } from 'state/boxes/type'
import { useGetClubPluginData } from 'hooks/useGetClubPluginDataCallback'
import dynamic from 'next/dynamic'
import useBreakpoint from 'hooks/useBreakpoint'
import Nodata from 'assets/images/boxes/no-data-content.png'
import Image from 'components/Image'

const OpenTrove = dynamic(() => import('../../../plugins/liquity/pages/components/openTrove'), {
  loading: () => <p>Loading...</p>,
  ssr: false
})
const AdjustTrove = dynamic(() => import('../../../plugins/liquity/pages/components/adjustTrove'), {
  loading: () => <p>Loading...</p>,
  ssr: false
})
const CloseTrove = dynamic(() => import('../../../plugins/liquity/pages/components/closeTrove'), {
  loading: () => <p>Loading...</p>,
  ssr: false
})
const RiskyTroves = dynamic(() => import('../../../plugins/liquity/pages/components/riskyTroves'), {
  loading: () => <p>Loading...</p>,
  ssr: false
})
const CollateralRatioContent = dynamic(() => import('../../../plugins/liquity/pages/components/userCollateralPanel'), {
  loading: () => <p>Loading...</p>,
  ssr: false
})

export default function Page({
  _boxContractAddr,
  editing,
  boxData
}: {
  _boxContractAddr: string
  editing: boolean
  boxData: IBoxValue
}) {
  const isMd = useBreakpoint('md')
  const { account, chainId } = useActiveWeb3React()
  const troveFactoryAddr = TROVE_FACTORY_ADDRESS[chainId || SupportedChainId.BB_MAINNET]
  const pluginData = useGetClubPluginData(boxData?.boxBasicInfo?.boxId?.toString(), IPluginNameType.Bitstable, boxData)
  const boxContractAddr = useMemo(() => {
    return _boxContractAddr || (pluginData.length && pluginData[pluginData.length - 1].sourceBoxAddress) || undefined
  }, [_boxContractAddr, pluginData])
  const info = useQueryStablecoinContractAddr(troveFactoryAddr, boxContractAddr)
  const { stableData, updateBoxPluginStableDataCallback } = useEditBoxPluginBitstableData()
  const [troveStep, setTroveStep] = useState(TroveStep.RICKY_TROVE_LIST)
  const [boxAddress, setBoxAddress] = useState<string | undefined>()
  const [selectedStablecoin, setSelectedStablecoin] = useState<any>()
  const [stablecoinName, setStablecoinName] = useState('')

  const cb = useCallback(() => {
    viewControl.hide('CreateStablecoin')
  }, [])
  useEffect(() => {
    if (selectedStablecoin) {
      viewControl.show('CreateStablecoin', {
        selectedStablecoin,
        setSelectedStablecoin,
        setBoxAddress,
        setStablecoinName,
        boxId: boxData.boxBasicInfo.boxId,
        boxContractAddr: boxContractAddr,
        troveFactoryAddr: troveFactoryAddr,
        cb
      })
    }
  }, [boxContractAddr, boxData.boxBasicInfo.boxId, cb, selectedStablecoin, troveFactoryAddr])
  const troveInfo = useLiquityInfo(
    info.btcTokenAddr,
    info.stableTokenAddr,
    info.borrowContractAddr,
    info.activePoolContractAddr,
    info.defaultPoolContractAddr,
    info.hintHelperContractAddr,
    info.sortedTrovesContractAddr,
    info.priceFeedContractAddr,
    info.troveManagerContractAddr
  )
  console.log('🚀 ~ editing:', editing, troveInfo.stableToken)

  useEffect(() => {
    setTroveStep(TroveStep.RICKY_TROVE_LIST)
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [account])

  // update by club owner customize
  useEffect(() => {
    if (!stableData && editing && info.stableTokenAddr && info.stableTokenAddr !== ZERO_ADDRESS && stablecoinName) {
      updateBoxPluginStableDataCallback('add', {
        token0: info.stableTokenAddr,
        token0Name: stablecoinName
      })
    }
  }, [editing, info.stableTokenAddr, stableData, stablecoinName, updateBoxPluginStableDataCallback])
  // update by using other's club stablecoin
  useEffect(() => {
    if (!stableData && editing && boxAddress) {
      updateBoxPluginStableDataCallback('add', {
        sourceBoxAddress: boxAddress
      })
    }
  }, [boxAddress, editing, stableData, updateBoxPluginStableDataCallback])

  if (!troveInfo)
    return (
      <Box
        sx={{
          display: 'grid',
          placeContent: 'center',
          width: 220,
          height: 220,
          margin: '0 auto'
        }}
      >
        <LoadingAnimation />
      </Box>
    )

  return (
    <Stack width={'100%'} justifyContent={'center'} spacing={16}>
      <Stack
        direction={'row'}
        alignItems={'center'}
        justifyContent={'space-between'}
        sx={{
          width: '100%',
          maxWidth: 1216,
          margin: '0 auto !important',
          background: 'var(--ps-neutral2)',
          borderRadius: '12px',
          padding: isMd ? '10px 16px' : '32px 40px'
        }}
      >
        <Typography fontSize={28} fontWeight={500}>
          Welcome to Bitstable
        </Typography>
        {troveInfo.btcToken.address && troveInfo.btcToken.address === ZERO_ADDRESS && editing ? (
          <Button
            variant="contained"
            sx={{ width: 180 }}
            onClick={() => {
              viewControl.show('CreateStablecoin', {
                selectedStablecoin,
                setSelectedStablecoin,
                setBoxAddress,
                setStablecoinName,
                boxId: boxData.boxBasicInfo.boxId,
                boxContractAddr: boxContractAddr,
                troveFactoryAddr: troveFactoryAddr,
                cb
              })
            }}
          >
            Create StableCoin
          </Button>
        ) : (
          <></>
        )}
      </Stack>
      {troveInfo.stableToken.address && troveInfo.stableToken.address !== ZERO_ADDRESS && (
        <Stack
          direction={'row'}
          spacing={16}
          justifyContent={'center'}
          display={'grid'}
          width={'100%'}
          gridTemplateColumns={isMd ? '1fr' : 'auto 876px'}
        >
          <CollateralRatioContent troveInfo={troveInfo} stablePoolContractAddr={info.stabilityPoolContractAddr} />
          <Stack
            spacing={20}
            margin={'0 auto'}
            sx={{
              marginLeft: isMd ? '0 !important' : 'unset',
              marginTop: isMd ? '16px !important' : 'unset'
            }}
          >
            {troveStep === TroveStep.RICKY_TROVE_LIST && (
              <Stack
                sx={{
                  width: isMd ? 'fit-content' : '100%',
                  background: 'var(--ps-neutral2)',
                  borderRadius: '12px',
                  padding: isMd ? '10px 16px' : '32px 40px'
                }}
              >
                <Stack width={'100%'} direction={isMd ? 'column' : 'row'} spacing={20}>
                  <LiquityPoolCard
                    setTroveStep={setTroveStep}
                    boxContractAddr={boxContractAddr}
                    troveInfo={troveInfo}
                  />
                  <StablecoinPoolCard
                    stabilityPoolContractAddr={info.stabilityPoolContractAddr}
                    boxContractAddr={boxContractAddr}
                    troveInfo={troveInfo}
                  />
                </Stack>
              </Stack>
            )}
            {troveStep === TroveStep.RICKY_TROVE_LIST && boxData.boxBasicInfo.boxId && (
              <RiskyTroves boxId={boxData.boxBasicInfo.boxId} troveInfo={troveInfo} setTroveStep={setTroveStep} />
            )}
            {troveStep === TroveStep.OPEN_TROVE && (
              <OpenTrove boxContractAddr={boxContractAddr} troveInfo={troveInfo} setTroveStep={setTroveStep} />
            )}
            {troveStep === TroveStep.ADJUST_TROVE && (
              <AdjustTrove boxContractAddr={boxContractAddr} troveInfo={troveInfo} setTroveStep={setTroveStep} />
            )}
            {troveStep === TroveStep.CLOSE_TROVE && (
              <CloseTrove boxContractAddr={boxContractAddr} troveInfo={troveInfo} setTroveStep={setTroveStep} />
            )}
          </Stack>
        </Stack>
      )}
      {troveInfo.stableToken.address && troveInfo.stableToken.address === ZERO_ADDRESS && !editing && (
        <Stack direction={'column'} spacing={20} justifyContent={'center'} width={'100%'}>
          <Image src={Nodata.src} width={isMd ? '100%' : 400} style={{ margin: '0 auto' }} alt="img" />
          <Typography
            width={isMd ? '100%' : 500}
            margin={'20px auto 0 !important'}
            fontSize={isMd ? 14 : 28}
            fontWeight={700}
            textAlign={'center'}
          >
            This club does not have any content yet, please stay tuned!{' '}
          </Typography>
        </Stack>
      )}
    </Stack>
  )
}
