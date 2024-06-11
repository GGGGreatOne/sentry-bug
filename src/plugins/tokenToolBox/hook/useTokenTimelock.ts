import { useCallback, useMemo } from 'react'
import { CurrencyAmount } from 'constants/token'
import { useActiveWeb3React } from 'hooks'
import { SupportedChainId } from '../constants'
import { useRequest } from 'ahooks'
import { getExchangeList } from 'api/toolbox'
import BigNumber from 'bignumber.js'
import { useSingleCallResult, useSingleContractMultipleData } from 'hooks/multicall'
import {
  useErc721WithDrawContract,
  useToolboxERC20TimelockFactory,
  useToolboxERC20TimelockLineFactory,
  useToolboxERC721TimelockFactory,
  useWithDrawContract,
  useWithDrawVestingContract
} from './useContract'
import { useBoxExecute } from 'hooks/useBoxCallback'
import { viewControl } from 'views/editBox/modal'
import { V2_FACTORY_ADDRESSES } from '@uniswap/sdk-core'

// normal
export function useTokenTimelock(chain: SupportedChainId, boxAddr: string | undefined) {
  const { chainId, account } = useActiveWeb3React()
  const erc20TimelockContract = useToolboxERC20TimelockFactory(chain || chainId)
  const { runWithModal, submitted } = useBoxExecute(
    boxAddr,
    {
      toContract: erc20TimelockContract,
      toFunc: 'deployERC20Timelock',
      toData: []
    },
    {
      key: account,
      summary: 'Lock token',
      action: 'deployERC20Timelock',
      modalSuccessCancel() {
        viewControl.hide('TokenLock')
        boxAddr && viewControl.show('MyLock', { boxAddress: boxAddr, rKey: Math.random() })
      },
      successTipsText: 'You have successfully lock token',
      cancelText: 'Check detail'
    }
  )
  return {
    submitted,
    toLockHandle: useCallback(
      (
        title: string,
        tokenAddress: string,
        accountAddress: string,
        amount: CurrencyAmount | undefined,
        releaseTime: number | undefined
      ) => {
        const isToken1Native = amount?.currency.isNative
        const args = [title, tokenAddress, accountAddress, amount?.raw.toString(), releaseTime]
        runWithModal(args, isToken1Native ? amount?.raw?.toString() : undefined)
      },
      [runWithModal]
    )
  }
}

// stage
export function useTokenTimeStagelock(chain: SupportedChainId, boxAddr: string | undefined) {
  const { chainId, account } = useActiveWeb3React()
  const erc20TimelockContract = useToolboxERC20TimelockFactory(chain || chainId)
  const { runWithModal, submitted } = useBoxExecute(
    boxAddr,
    {
      toContract: erc20TimelockContract,
      toFunc: 'deployERC20MultiTimelock',
      toData: []
    },
    {
      key: account,
      summary: 'Lock token',
      action: 'deployERC20MultiTimelock',
      modalSuccessCancel() {
        viewControl.hide('TokenLock')
        boxAddr && viewControl.show('MyLock', { boxAddress: boxAddr, rKey: Math.random() })
      },
      successTipsText: 'You have successfully lock token',
      cancelText: 'Check detail'
    }
  )
  return {
    submitted,
    toTimeStagelockHandle: useCallback(
      (
        title: string,
        tokenAddress: string,
        accountAddress: string,
        amount: CurrencyAmount | undefined,
        releaseTime: string[][]
      ) => {
        const isToken1Native = amount?.currency.isNative
        const args = [title, tokenAddress, accountAddress, amount?.raw.toString(), releaseTime]
        console.log('🚀 ~ useTokenTimeStagelock ~ args:', args)
        runWithModal(args, isToken1Native ? amount?.raw?.toString() : undefined)
      },
      [runWithModal]
    )
  }
}

// linear
export function useTokenTimeLinearlock(chain: SupportedChainId, boxAddr: string | undefined) {
  const { chainId, account } = useActiveWeb3React()
  const erc20TimelockLineFactoryContract = useToolboxERC20TimelockLineFactory(chain || chainId)
  const { runWithModal, submitted } = useBoxExecute(
    boxAddr,
    {
      toContract: erc20TimelockLineFactoryContract,
      toFunc: 'deployERC20Vesting',
      toData: []
    },
    {
      key: account,
      summary: 'Lock token',
      action: 'deployERC20Vesting',
      modalSuccessCancel() {
        viewControl.hide('TokenLock')
        boxAddr && viewControl.show('MyLock', { boxAddress: boxAddr, rKey: Math.random() })
      },
      successTipsText: 'You have successfully lock token',
      cancelText: 'Check detail'
    }
  )
  return {
    submitted,
    toLockLinearHandle: useCallback(
      (
        title: string,
        tokenAddress: string,
        accountAddress: string,
        startAt: number,
        duration: string,
        amount: CurrencyAmount | undefined
      ) => {
        const isToken1Native = amount?.currency.isNative
        const args = [title, tokenAddress, accountAddress, startAt, duration, amount?.raw.toString()]
        console.log('🚀 ~ useTokenTimeLinearlock ~ args:', args)
        runWithModal(args, isToken1Native ? amount?.raw?.toString() : undefined)
      },
      [runWithModal]
    )
  }
}

//  LP v2 normal: ToolboxERC20TimelockFactory.deployUniswapV2Timelock
export function useDeployUniswapV2Timelock(chain: SupportedChainId, boxAddr: string | undefined) {
  const { chainId, account } = useActiveWeb3React()
  const UniswapAddress = V2_FACTORY_ADDRESSES[chainId || SupportedChainId.BB_MAINNET]
  console.log('🚀 ~ useDeployUniswapV2Timelock ~ UniswapAddress:', UniswapAddress)
  const erc20TimelockFactoryContract = useToolboxERC20TimelockFactory(chain || chainId)
  const { runWithModal, submitted } = useBoxExecute(
    boxAddr,
    {
      toContract: erc20TimelockFactoryContract,
      toFunc: 'deployUniswapV2Timelock',
      toData: [],
      value: undefined
    },
    {
      key: account,
      summary: 'Lock token',
      action: 'deployUniswapV2Timelock',
      modalSuccessCancel() {
        viewControl.hide('TokenLock')
        boxAddr && viewControl.show('MyLock', { boxAddress: boxAddr, rKey: Math.random() })
      },
      successTipsText: 'You have successfully lock token',
      cancelText: 'Check detail'
    }
  )
  return {
    submitted,
    toLockV2Handle: useCallback(
      (
        // uniswapAddress: string,
        title: string,
        tokenAddress: string,
        accountAddress: string,
        amount: CurrencyAmount | undefined,
        releaseTime: number | undefined
      ) => {
        const isToken1Native = amount?.currency.isNative
        const args = [UniswapAddress, title, tokenAddress, accountAddress, amount?.raw.toString(), releaseTime]
        console.log('🚀 ~ useDeployUniswapV2Timelock ~ args:', args)
        runWithModal(args, isToken1Native ? amount?.raw?.toString() : undefined)
      },
      [UniswapAddress, runWithModal]
    )
  }
}

//  LP v3 normal: ToolboxERC721TimelockFactory.deployUniswapV3Timelock
export function useDeployUniswapV3Timelock(chain: SupportedChainId, boxAddr: string | undefined) {
  const { chainId, account } = useActiveWeb3React()
  const erc721TimelockFactoryContract = useToolboxERC721TimelockFactory(chain || chainId)
  const { runWithModal } = useBoxExecute(
    boxAddr,
    {
      toContract: erc721TimelockFactoryContract,
      toFunc: 'deployUniswapV3Timelock',
      toData: []
    },
    {
      key: account,
      summary: 'Lock token',
      action: 'deployUniswapV3Timelock',
      modalSuccessCancel() {
        viewControl.hide('TokenLock')
        boxAddr && viewControl.show('MyLock', { boxAddress: boxAddr, rKey: Math.random() })
      },
      successTipsText: 'You have successfully lock token',
      cancelText: 'Check detail'
    }
  )
  return useCallback(
    (
      uniswapAddress: string,
      title: string,
      tokenAddress: string,
      id: string,
      accountAddress: string,
      releaseTime: string
    ) => {
      const args = [uniswapAddress, title, tokenAddress, id, accountAddress, releaseTime]
      runWithModal(args)
    },
    [runWithModal]
  )
}

export function useGetExchangeList(chainId: number, version: number) {
  return useRequest(
    async () => {
      const response = await getExchangeList({
        chainId,
        uniVersion: version,
        limit: 999,
        offset: 0
      })
      return response?.data?.list
    },
    {
      refreshDeps: [chainId, version],
      debounceWait: 100
    }
  )
}

// withdraw erc20 for token lock & lp lock
export function useWithDrawByTokenLock(contractAddress: string, boxAddr: string | undefined, queryChainId?: number) {
  const { account } = useActiveWeb3React()
  const withDrawContract = useWithDrawContract(contractAddress, queryChainId)
  const { runWithModal } = useBoxExecute(
    boxAddr,
    {
      toContract: withDrawContract,
      toFunc: 'release',
      toData: []
    },
    {
      key: account,
      summary: 'withdraw token',
      action: 'release',
      successTipsText: 'You have successfully release token'
    }
  )
  return useCallback(() => {
    runWithModal()
  }, [runWithModal])
}

// withdraw erc721 for lp lock (v3)
export function useWithDrawBy721TokenLock(contractAddress: string, boxAddr: string | undefined, queryChainId?: number) {
  const { account } = useActiveWeb3React()
  const erc721WithDrawContract = useErc721WithDrawContract(contractAddress, queryChainId)
  const { runWithModal } = useBoxExecute(
    boxAddr,
    {
      toContract: erc721WithDrawContract,
      toFunc: 'release',
      toData: []
    },
    {
      key: account,
      summary: 'withdraw token',
      action: 'release',
      successTipsText: 'You have successfully release token',
      cancelText: 'Check detail'
    }
  )
  return useCallback(() => {
    runWithModal()
  }, [runWithModal])
}

// token lock normal stage，[can releasAmount] = releasableAmount - releasedAmount, ToolboxERC20Timelock
export const useReleasableERC20 = (contractAddress: string, queryChainId?: number): string => {
  const erc20TimelockContract = useWithDrawContract(contractAddress, queryChainId)
  const releasable = useSingleCallResult(queryChainId, erc20TimelockContract, 'releasableAmount').result
  const released = useSingleCallResult(queryChainId, erc20TimelockContract, 'releasedAmount').result
  console.log('🚀 ~ useReleasableERC20 ~ releasable:', releasable?.toString(), released?.toString())

  return useMemo(() => {
    const releasableAmount = releasable?.toString() || '0'
    const releasedAmount = released?.toString() || '0'
    console.log(
      'BigNumber(releasableAmount).minus(releasedAmount).toString()',
      BigNumber(releasableAmount).minus(releasedAmount).toString()
    )

    return BigNumber(releasableAmount).minus(releasedAmount).toString()
  }, [releasable, released])
}

// token lock normal stage releasa time
export const useReleasaNoLiearData = (
  contractAddress: string,
  queryChainId?: number
): {
  noLiearData: {
    releaseTime: number
    ratio: number
    released: boolean
  }[]
  linearData: {
    startAt: number
    endAt: number
    duration: number
    released: number
  } | null
} => {
  const erc20TimelockContract = useWithDrawContract(contractAddress, queryChainId)
  const getTimelockLength = useSingleCallResult(queryChainId, erc20TimelockContract, 'getTimelockLength').result
  const inputs = getTimelockLength
    ? Array.from({ length: Number(getTimelockLength?.toString() || 0) }, (_, index) => [index])
    : [[0]]

  const timelockList = useSingleContractMultipleData(queryChainId, erc20TimelockContract, 'timelockList', inputs)
  return {
    noLiearData: useMemo(() => {
      return timelockList.map(_ => {
        return {
          releaseTime: Number(_.result?.releaseTime.toString()),
          ratio: Number(_.result?.ratio.toString()),
          released: _.result?.released
        }
      })
    }, [timelockList]),
    linearData: null
  }
}

// token lock Linear， Releasable - useWithDrawVestingContract
export const useReleasableVestingERC20 = (contractAddress: string, queryChainId?: number): string => {
  const erc20VestingFactoryABI = useWithDrawVestingContract(contractAddress, queryChainId)
  const res = useSingleCallResult(queryChainId, erc20VestingFactoryABI, 'releasable').result
  return res?.toString() || '0'
}

// token lock Linear， start、duration - useWithDrawVestingContract
export const useReleasaData = (
  contractAddress: string,
  queryChainId?: number
): {
  noLiearData: {
    releaseTime: number
    ratio: number
    released: boolean
  }[]
  linearData: {
    startAt: number
    endAt: number
    duration: number
    released: number
  } | null
} => {
  const erc20VestingFactoryABI = useWithDrawVestingContract(contractAddress, queryChainId)
  const start = useSingleCallResult(queryChainId, erc20VestingFactoryABI, 'start').result
  const duration = useSingleCallResult(queryChainId, erc20VestingFactoryABI, 'duration').result
  const released = useSingleCallResult(queryChainId, erc20VestingFactoryABI, 'released').result
  return {
    noLiearData: useMemo(() => {
      return []
    }, []),
    linearData: useMemo(() => {
      return {
        startAt: Number(start?.toString()),
        endAt: Number(start?.toString()) + Number(duration?.toString()),
        duration: Number(duration?.toString()),
        released: Number(released?.toString())
      }
    }, [duration, released, start])
  }
}
