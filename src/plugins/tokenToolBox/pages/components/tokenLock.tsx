import BaseDialog from 'components/Dialog/baseDialog'
import { SupportedChainId } from 'constants/chains'
import dynamic from 'next/dynamic'
import { Currency } from 'constants/token'
import { TokenType } from 'api/common/type'
import { Stack } from '@mui/material'
import Spinner from 'components/Spinner'
const TokenLockerForm = dynamic(() => import('plugins/tokenToolBox/pages/components/tokenLockerForm'), {
  ssr: false,
  loading: () => (
    <Stack alignItems={'center'} justifyContent={'center'} height={650}>
      <Spinner />
    </Stack>
  )
})
// const TokenLPLockerForm = dynamic(() => import('plugins/tokenToolBox/pages/components/tokenLPLockerForm'), {
//   ssr: false,
//   loading: () => (
//     <Stack alignItems={'center'} justifyContent={'center'} height={650}>
//       <Spinner />
//     </Stack>
//   )
// })

interface Props {
  tokenType?: TokenType
  chainId?: SupportedChainId
  token?: Currency
  LockInfo: LockInfo
  boxAddress: string
  rKey: number
}

const TokenLock = ({ boxAddress, chainId, token, rKey }: Props) => {
  return (
    <BaseDialog key={rKey} mt={0} minWidth={650} title={'Token Lock'} onClose={() => {}}>
      <TokenLockerForm boxAddress={boxAddress} chainId={chainId} token={token} />
      {/* {(tokenType === TokenType.V2LP || tokenType === TokenType.V3LP) && (
        <TokenLPLockerForm lockInfo={LockInfo} chainId={chainId} token={token} tokenType={tokenType} />
      )} */}
    </BaseDialog>
  )
}

export default TokenLock
