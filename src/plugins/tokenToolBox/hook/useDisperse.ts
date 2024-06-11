import { useCallback } from 'react'
import { useActiveWeb3React } from 'hooks'
import { SupportedChainId } from '../constants'
import { useDisperseContract } from './useContract'
import { useBoxExecute } from 'hooks/useBoxCallback'
import { NETWORK_CHAIN_ID } from 'constants/chains'
import { viewControl } from 'views/editBox/modal'

export function useDisperseEther(chain: SupportedChainId, boxContractAddr: string | undefined) {
  const { chainId, account } = useActiveWeb3React()
  const disperseContract = useDisperseContract(chain || chainId)
  const { runWithModal, submitted } = useBoxExecute(
    boxContractAddr,
    {
      toContract: disperseContract,
      toFunc: 'disperseEther',
      toData: []
    },
    {
      key: account,
      summary: 'Disperse Ether',
      action: 'disperseEther',
      successTipsText: 'You have successfully disperse',
      cancelText: 'Check detail',
      modalSuccessCancel() {
        viewControl.hide('Disperse')
        boxContractAddr &&
          viewControl.show('MyDisperse', {
            boxAddress: boxContractAddr,
            rKey: Math.random()
          })
      }
    }
  )
  return {
    disperseEther: useCallback(
      (amount: string, recipients: string[], values: string[]) => {
        const args = [recipients, values]
        console.log('🚀 ~ useDisperseEther ~ args:', args, amount)
        runWithModal(args, amount)
      },
      [runWithModal]
    ),
    submitted
  }
}

export function useDisperseToken(boxContractAddr: string | undefined) {
  const { chainId, account } = useActiveWeb3React()
  const disperseContract = useDisperseContract(chainId || NETWORK_CHAIN_ID)
  const { runWithModal, submitted } = useBoxExecute(
    boxContractAddr,
    {
      toContract: disperseContract,
      toFunc: 'disperseToken',
      toData: []
    },
    {
      key: account,
      summary: 'Disperse Token',
      action: 'disperseToken',
      successTipsText: 'You have successfully disperse',
      cancelText: 'Check detail',
      modalSuccessCancel() {
        viewControl.hide('Disperse')
        boxContractAddr &&
          viewControl.show('MyDisperse', {
            boxAddress: boxContractAddr,
            rKey: Math.random()
          })
      }
    },
    true
  )
  return {
    submitted,
    disperseToken: useCallback(
      (token: string, recipients: string[], values: string[]) => {
        const args = [token, recipients, values]
        console.log('🚀 ~ useDisperseToken ~ args:', args)
        runWithModal(args)
      },
      [runWithModal]
    )
  }
}
