import { useRouter } from 'next/router'
import { WRAPPED_NATIVE_CURRENCY } from '../../constants/tokens'
import AddLiquidity from './index'
import { useActiveWeb3React } from 'hooks'
import { Box } from '@mui/material'

export default function AddLiquidityWithTokenRedirects({ boxId }: { boxId: string }) {
  // const { currencyIdA, currencyIdB } = useParams<{ currencyIdA: string; currencyIdB: string; feeAmount?: string }>()
  const currencyIdA: any = ''
  const currencyIdB: any = ''
  const router = useRouter()
  const { chainId } = useActiveWeb3React()

  // prevent weth + eth
  const isETHOrWETHA =
    currencyIdA === 'ETH' || (chainId !== undefined && currencyIdA === WRAPPED_NATIVE_CURRENCY[chainId]?.address)
  const isETHOrWETHB =
    currencyIdB === 'ETH' || (chainId !== undefined && currencyIdB === WRAPPED_NATIVE_CURRENCY[chainId]?.address)

  if (
    currencyIdA &&
    currencyIdB &&
    (currencyIdA.toLowerCase() === currencyIdB.toLowerCase() || (isETHOrWETHA && isETHOrWETHB))
  ) {
    return <Box onClick={() => router.push(`/add/${currencyIdA}`)}></Box>
  }
  return <AddLiquidity boxId={boxId} />
}
