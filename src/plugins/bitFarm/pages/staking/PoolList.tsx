import { Box, styled } from '@mui/material'
import { PoolCard } from './PoolCard'
import { StakePoolListResult } from 'api/boxes/type'

const StyleBox = styled(Box)(({ theme }) => ({
  width: '100%',
  height: '100%',
  minHeight: 490,
  display: 'grid',
  gap: 20,
  gridTemplateColumns: '1fr 1fr 1fr',
  [theme.breakpoints.down('md')]: {
    gridTemplateColumns: '1fr 1fr',
    minHeight: 380
  },
  [theme.breakpoints.down('sm')]: {
    gridTemplateColumns: '1fr',
    minHeight: 380
  }
}))

const PoolList = ({
  boxContactAddr,
  poolList,
  editing,
  listing,
  isPermission
}: {
  boxContactAddr?: string | undefined
  poolList?: StakePoolListResult | undefined
  editing?: boolean | undefined
  listing?: boolean
  isPermission?: boolean
}) => {
  return (
    <StyleBox>
      {/* <DoubleTokenCard /> */}
      {poolList?.list.map((item, index) => {
        return (
          <PoolCard
            boxAddress={boxContactAddr}
            key={item.instanceAddress + 'key' + index}
            poolInfo={item}
            editing={editing}
            listing={listing}
            isPermission={isPermission}
          />
        )
      })}
    </StyleBox>
  )
}

export default PoolList
