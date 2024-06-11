import { useErc721SwapContract } from './useContract'
import { ZERO_ADDRESS } from '../constants'
import { useRequest } from 'ahooks'
// import { isAddressEqual } from 'viem'
import { useNFTApproveAllCallback } from './useNFTApproveAllCallback'
import { useActiveWeb3React } from 'hooks'
import { ERC721_NFT_ADDRESSES } from 'constants/addresses'
import { SupportedChainId } from 'constants/chains'
import { calculateGasMargin } from 'utils/contract'
import { useTransactionAdder } from 'state/transactions/hooks'
import { GetBuyerSign } from 'api/activities'

type Erc721ListProps = {
  tokenId: number
  sellAmount: string
  sellToken?: string
}

export function useNFTSwapApproveState() {
  const { chainId } = useActiveWeb3React()
  const token = ERC721_NFT_ADDRESSES[chainId as SupportedChainId]
  const contract = useErc721SwapContract()
  return useNFTApproveAllCallback(token, contract?.address)
}

export function useErc721List() {
  const { chainId } = useActiveWeb3React()
  const token = ERC721_NFT_ADDRESSES[chainId as SupportedChainId]
  const contract = useErc721SwapContract()
  const addTransaction = useTransactionAdder()

  // List NFT
  return useRequest(
    async ({ tokenId, sellAmount, sellToken = ZERO_ADDRESS }: Erc721ListProps) => {
      try {
        if (!contract) throw new Error('Contract not found')

        const estimatedGas = await contract.estimateGas.list(token, tokenId, sellToken, sellAmount)

        const tx = await contract.list?.(token, tokenId, sellToken, sellAmount, {
          gasLimit: calculateGasMargin(estimatedGas)
        })
        addTransaction(tx, {
          summary: `List club #${tokenId}`
        })
        return tx?.wait()
      } catch (err) {
        return Promise.reject(err)
      }
    },
    {
      manual: true,
      ready: !!contract,
      refreshDeps: [contract?.list, addTransaction]
    }
  )
}

export function useErc721UnList() {
  const contract = useErc721SwapContract()
  const addTransaction = useTransactionAdder()

  // UnList NFT
  return useRequest(
    async ({ orderId, id }: { orderId: number; id: number }) => {
      try {
        if (!contract) throw new Error('Contract not found')

        const estimatedGas = await contract?.estimateGas.unList(orderId)

        const tx = await contract?.unList?.(orderId, {
          gasLimit: calculateGasMargin(estimatedGas)
        })
        addTransaction(tx, {
          summary: `Unlist club #${id}`
        })
        return tx?.wait()
      } catch (err) {
        return Promise.reject(err)
      }
    },
    {
      manual: true,
      ready: !!contract,
      refreshDeps: [contract?.list, addTransaction]
    }
  )
}

export function useErc721Fullfil() {
  const contract = useErc721SwapContract()
  const addTransaction = useTransactionAdder()

  // Fullfil NFT
  return useRequest(
    async ({ orderId, value, id }: { id: number; orderId: number; value: string }) => {
      try {
        if (!contract) throw new Error('Contract not found')
        const { data, msg } = await GetBuyerSign()
        if (!data?.sign) throw new Error(msg)
        const estimatedGas = await contract?.estimateGas.fullfil(orderId, data.expiredTime, `0x${data.sign}`, { value })
        const tx = await contract?.fullfil(orderId, data.expiredTime, `0x${data.sign}`, {
          value,
          gasLimit: calculateGasMargin(estimatedGas)
        })

        addTransaction(tx, {
          summary: `Purchase club #${id}`
        })

        return tx?.wait()
      } catch (err) {
        return Promise.reject(err)
      }
    },
    {
      manual: true,
      ready: !!contract,
      refreshDeps: [contract?.list]
    }
  )
}
