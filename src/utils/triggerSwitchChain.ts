import { Web3Provider } from '@ethersproject/providers'
import { SupportedChainId, SupportedChainsInfo } from 'constants/chains'
import BigNumberjs from 'bignumber.js'

export function numberToHex(number: number) {
  return '0x' + new BigNumberjs(number).toString(16)
}

export function triggerSwitchChain(library: Web3Provider | undefined, chainId: SupportedChainId, account: string) {
  library?.send('wallet_switchEthereumChain', [{ chainId: numberToHex(chainId) }, account]).catch(err => {
    if (err?.code === 4001) return
    const params = SupportedChainsInfo[chainId as SupportedChainId]
    const obj: any = {}
    obj.chainId = numberToHex(chainId)
    obj.chainName = params?.name
    obj.nativeCurrency = params?.nativeCurrency
    obj.rpcUrls = params?.rpcUrls.default.http
    obj.blockExplorerUrls = params?.blockExplorers?.default.url

    library?.send('wallet_addEthereumChain', [obj, account])
  })
}
