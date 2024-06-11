import { Box } from '@mui/material'
import { useState } from 'react'
import YourLiquidity from './YourLiquidity'
import AddLiquidity from './AddLiquidity'
import RemoveLiquidity from './RemoveLiquidity'

export enum LiquidityPage {
  Pool,
  Mint,
  Burn
}

export default function Liquidity({ boxId }: { boxId: string | number }) {
  const [state, setState] = useState<LiquidityPage>(LiquidityPage.Pool)

  return (
    <Box>
      {state === LiquidityPage.Pool && <YourLiquidity setPage={setState} />}
      {state === LiquidityPage.Mint && <AddLiquidity boxId={boxId} setPage={setState} />}
      {state === LiquidityPage.Burn && <RemoveLiquidity boxId={boxId} setPage={setState} />}
    </Box>
  )
}
