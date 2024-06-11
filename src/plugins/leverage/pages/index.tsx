import { Box } from '@mui/material'
import LiquidityPools from './liquidityPools'
import TradePanel from './tradePanel'
import { QuantosDetails } from '../hook/useFactory'
import { useMemo } from 'react'
import { useLeverageStateData } from '../state/hooks'

const Page = ({
  boxContractAdr,
  editing,
  boxQuantos,
  allQuantos,
  boxId
}: {
  boxContractAdr: string
  editing: boolean
  boxQuantos: QuantosDetails[]
  allQuantos: QuantosDetails[]
  boxId: number | string
}) => {
  const { data: bitleverageData } = useLeverageStateData()

  const tradeQuantos = useMemo(() => {
    if (!boxQuantos) return undefined
    else return boxQuantos[bitleverageData.tradeQuantosIndex || 0]
  }, [bitleverageData.tradeQuantosIndex, boxQuantos])
  return (
    <Box sx={{ width: '100%', maxWidth: 1200, margin: '0 auto' }}>
      <LiquidityPools
        boxQuantos={boxQuantos}
        boxContractAdr={boxContractAdr}
        editing={editing}
        allQuantos={allQuantos}
      />
      <TradePanel tradeQuantos={tradeQuantos} boxContractAdr={boxContractAdr} boxQuantos={boxQuantos} boxId={boxId} />
    </Box>
  )
}
export default Page
