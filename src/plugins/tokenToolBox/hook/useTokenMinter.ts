import { useCallback } from 'react'
import JSBI from 'jsbi'
import { SupportedChainId } from '../constants'
import { useActiveWeb3React } from 'hooks'
import { useMinterContract } from './useContract'
import { useBoxExecute } from 'hooks/useBoxCallback'
import { getEventLog } from 'utils'
import { viewControl } from 'views/editBox/modal'
import { TransactionReceipt } from '@ethersproject/providers'
import { Currency } from 'constants/token'
import { NETWORK_CHAIN_ID } from 'constants/chains'
import { TokenType } from 'api/common/type'

export function useTokenMinter(chain: SupportedChainId, boxAddr: string | undefined) {
  const { chainId, account } = useActiveWeb3React()
  const minterContract = useMinterContract(chain || chainId)

  const toTokenMinter = useCallback(
    async (output: TransactionReceipt | undefined) => {
      console.log('🚀 ~ deployedRes:', output)
      if (minterContract && output?.logs) {
        const contractAddr = await getEventLog(minterContract, output.logs, 'ERC20Deployed', 'contractAddr')
        const decimals = await getEventLog(minterContract, output.logs, 'ERC20Deployed', 'decimals')
        const symbol = await getEventLog(minterContract, output.logs, 'ERC20Deployed', 'symbol')
        const name = await getEventLog(minterContract, output.logs, 'ERC20Deployed', 'name')
        if (contractAddr && decimals && symbol) {
          viewControl.show('TokenInfo', {
            tokenType: TokenType.TOKEN,
            token: new Currency(NETWORK_CHAIN_ID, contractAddr, Number(decimals), symbol, name),
            boxAddress: boxAddr || ''
          })
          viewControl.hide('TokenMinter')
        }
      }
    },
    [boxAddr, minterContract]
  )

  const { runWithModal, submitted } = useBoxExecute(
    boxAddr,
    {
      toContract: minterContract,
      toFunc: 'createERC20',
      toData: []
    },
    {
      key: account,
      summary: 'Minter token',
      action: 'createERC20',
      modalSuccessCancel(output) {
        toTokenMinter(output)
      },
      successTipsText: 'You have successfully minted a new token',
      cancelText: 'Review details'
    }
  )

  return {
    submitted,
    toTokenMinter: useCallback(
      async (name: string, symbol: string, decimals: string, initial_supply: string) => {
        let d = '1'
        for (let i = 0; i < Number(decimals); i++) {
          d = d + '0'
        }
        const decimalsSupply = JSBI.multiply(JSBI.BigInt(d), JSBI.BigInt(initial_supply)).toString()

        const args = [name, symbol, decimals, decimalsSupply]
        await runWithModal(args)
      },
      [runWithModal]
    )
  }
}
