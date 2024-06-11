import { ChainId, Percent } from '@uniswap/sdk-core'
import { WETH_ADDRESS as getWethAddress } from '@uniswap/universal-router-sdk'
import { BIPS_BASE, ZERO_PERCENT } from '../constants/misc'
import { useEffect, useState } from 'react'
import FOT_DETECTOR_ABI from '../lib/uniswap/src/abis/fee-on-transfer-detector.json'
import { FeeOnTransferDetector } from '../lib/uniswap/src/abis/types/FeeOnTransferDetector'
import { useContract } from 'hooks/useContract'
import { useActiveWeb3React } from 'hooks'
import { SupportedChainId } from 'constants/chains'

const FEE_ON_TRANSFER_DETECTOR_ADDRESS = '0x19C97dc2a25845C7f9d1d519c8C2d4809c58b43f'

function useFeeOnTransferDetectorContract(): FeeOnTransferDetector | null {
  const contract = useContract<FeeOnTransferDetector>(FEE_ON_TRANSFER_DETECTOR_ADDRESS, FOT_DETECTOR_ABI)

  return contract
}

// TODO(WEB-2787): add tax-fetching for other chains
const WETH_ADDRESS = getWethAddress(ChainId.MAINNET)
const AMOUNT_TO_BORROW = 10000 // smallest amount that has full precision over bps

const FEE_CACHE: { [address in string]?: { sellTax?: Percent; buyTax?: Percent } } = {}

async function getSwapTaxes(
  fotDetector: FeeOnTransferDetector,
  inputTokenAddress: string | undefined,
  outputTokenAddress: string | undefined
) {
  const addresses = []
  if (inputTokenAddress && FEE_CACHE[inputTokenAddress] === undefined) {
    addresses.push(inputTokenAddress)
  }

  if (outputTokenAddress && FEE_CACHE[outputTokenAddress] === undefined) {
    addresses.push(outputTokenAddress)
  }

  try {
    if (addresses.length) {
      const data = await fotDetector.callStatic.batchValidate(addresses, WETH_ADDRESS, AMOUNT_TO_BORROW)

      addresses.forEach((address, index) => {
        const { sellFeeBps, buyFeeBps } = data[index]
        const sellTax = new Percent(sellFeeBps.toNumber(), BIPS_BASE)
        const buyTax = new Percent(buyFeeBps.toNumber(), BIPS_BASE)

        FEE_CACHE[address] = { sellTax, buyTax }
      })
    }
  } catch (e) {
    console.warn('Failed to get swap taxes for token(s):', addresses, e)
  }

  const inputTax = (inputTokenAddress ? FEE_CACHE[inputTokenAddress]?.sellTax : ZERO_PERCENT) ?? ZERO_PERCENT
  const outputTax = (outputTokenAddress ? FEE_CACHE[outputTokenAddress]?.buyTax : ZERO_PERCENT) ?? ZERO_PERCENT

  return { inputTax, outputTax }
}

export function useSwapTaxes(inputTokenAddress?: string, outputTokenAddress?: string) {
  const fotDetector = useFeeOnTransferDetectorContract()
  const [{ inputTax, outputTax }, setTaxes] = useState({ inputTax: ZERO_PERCENT, outputTax: ZERO_PERCENT })
  const { chainId } = useActiveWeb3React()

  useEffect(() => {
    // if (!fotDetector || chainId !== ChainId.MAINNET) return
    if (!fotDetector || chainId !== SupportedChainId.BIT_DEVNET) return
    getSwapTaxes(fotDetector, inputTokenAddress, outputTokenAddress).then(setTaxes)
  }, [fotDetector, inputTokenAddress, outputTokenAddress, chainId])

  return { inputTax, outputTax }
}
