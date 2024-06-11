import { ETHER, Currency, CurrencyAmount, Pair, TokenAmount, Percent } from '@uniswap/sdk'
import { BigNumber, Contract } from 'ethers'
import { useActiveWeb3React } from 'hooks'
import { useCallback, useMemo, useState } from 'react'
import { ApprovalState, useApproveCallback } from './useApproveCallback'
import { usePairContract } from './useContract'
import TransacitonPendingModal from 'components/Modal/TransactionModals/TransactionPendingModal'
import { Field } from 'state/widget/mint/actions'
import { Field as BurnField } from 'state/widget/burn/actions'
import { ROUTER_ADDRESS } from '../constant'
import { BytesLike, splitSignature } from 'ethers/lib/utils'
import useTransactionDeadline from './useTransactionDeadline'
import { useUserSlippageTolerance } from 'state/widget/swapUser/hooks'
import { wrappedCurrency } from '../utils/wrappedCurrency'
import { calculateSlippageAmount, getRouterContract } from '../utils'
import { calculateGasMargin } from 'utils/contract'
import useModal from 'hooks/useModal'
import { checkChainId } from '../utils/utils'

export function useMintCallback({
  currencyA,
  currencyB,
  parsedAmounts,
  noLiquidity
}: {
  currencyA: Currency | undefined
  currencyB: Currency | undefined
  parsedAmounts: {
    [field in Field]?: CurrencyAmount
  }
  noLiquidity?: boolean
}) {
  const { chainId, library, account } = useActiveWeb3React()

  const [allowedSlippage] = useUserSlippageTolerance()
  const deadline = useTransactionDeadline()

  const addLiquidityCb = useCallback(async () => {
    const checkedChainId = checkChainId(chainId)
    if (!checkedChainId || !library || !account || !currencyA || !currencyB) return

    const router = getRouterContract(checkedChainId, library, account)

    const { [Field.CURRENCY_A]: parsedAmountA, [Field.CURRENCY_B]: parsedAmountB } = parsedAmounts
    if (!parsedAmountA || !parsedAmountB || !currencyA || !currencyB || !deadline) {
      return
    }

    const amountsMin = {
      [Field.CURRENCY_A]: calculateSlippageAmount(parsedAmountA, noLiquidity ? 0 : allowedSlippage)[0],
      [Field.CURRENCY_B]: calculateSlippageAmount(parsedAmountB, noLiquidity ? 0 : allowedSlippage)[0]
    }

    let // estimate,
      // method: (...args: any) => Promise<TransactionResponse>,
      executeData: BytesLike,
      args: Array<string | string[] | number | Array<string | number>>,
      value: BigNumber | null,
      methodName: string

    if (currencyA === ETHER || currencyB === ETHER) {
      const tokenBIsETH = currencyB === ETHER
      // estimate = router.estimateGas.addLiquidityETH
      // method = router.addLiquidityETH
      methodName = 'addLiquidityETH'
      args = [
        wrappedCurrency(tokenBIsETH ? currencyA : currencyB, checkedChainId)?.address ?? '', // token
        (tokenBIsETH ? parsedAmountA : parsedAmountB).raw.toString(), // token desired
        amountsMin[tokenBIsETH ? Field.CURRENCY_A : Field.CURRENCY_B].toString(), // token min
        amountsMin[tokenBIsETH ? Field.CURRENCY_B : Field.CURRENCY_A].toString(), // eth min
        account,
        deadline.toHexString()
      ]
      value = BigNumber.from((tokenBIsETH ? parsedAmountB : parsedAmountA).raw.toString())
      executeData = router.interface.encodeFunctionData(methodName, args)
    } else {
      // estimate = router.estimateGas.addLiquidity
      // method = router.addLiquidity
      methodName = 'addLiquidity'
      args = [
        wrappedCurrency(currencyA, checkedChainId)?.address ?? '',
        wrappedCurrency(currencyB, checkedChainId)?.address ?? '',
        parsedAmountA.raw.toString(),
        parsedAmountB.raw.toString(),
        amountsMin[Field.CURRENCY_A].toString(),
        amountsMin[Field.CURRENCY_B].toString(),
        account,
        deadline.toHexString()
      ]
      value = null
      executeData = router.interface.encodeFunctionData(methodName, args)
    }
    const estimatedGasLimit = await library.estimateGas({
      from: account,
      to: router.address,
      data: executeData,
      value: value ? value.toString() : undefined
    })

    return library.getSigner().sendTransaction({
      from: account,
      to: router.address,
      data: executeData,
      value: value ? value.toString() : undefined,
      gasLimit: calculateGasMargin(estimatedGasLimit)
    })
  }, [account, allowedSlippage, chainId, currencyA, currencyB, deadline, library, noLiquidity, parsedAmounts])

  return useMemo(
    () => ({
      addLiquidityCb
    }),
    [addLiquidityCb]
  )
}

export function useBurnCallback({
  currencyA,
  currencyB,
  parsedAmounts,
  pair
}: {
  currencyA: Currency | undefined
  currencyB: Currency | undefined
  parsedAmounts: {
    [BurnField.LIQUIDITY_PERCENT]: Percent
    [BurnField.LIQUIDITY]?: TokenAmount
    [BurnField.CURRENCY_A]?: CurrencyAmount
    [BurnField.CURRENCY_B]?: CurrencyAmount
  }
  pair: Pair | undefined | null
}) {
  // allowance handling
  const [signatureData, setSignatureData] = useState<{ v: number; r: string; s: string; deadline: number } | null>(null)

  const { showModal, hideModal } = useModal()
  const { chainId, library, account } = useActiveWeb3React()
  const [allowedSlippage] = useUserSlippageTolerance()
  const deadline = useTransactionDeadline()

  const [approval, approveCallback] = useApproveCallback(parsedAmounts[BurnField.LIQUIDITY], ROUTER_ADDRESS)

  // pair contract
  const pairContract: Contract | null = usePairContract(pair?.liquidityToken?.address)

  const burnCallback = useCallback(async () => {
    const checkedChainId = checkChainId(chainId)
    if (!checkedChainId || !library || !account || !deadline) throw new Error('missing dependencies')
    const { [Field.CURRENCY_A]: currencyAmountA, [Field.CURRENCY_B]: currencyAmountB } = parsedAmounts
    if (!currencyAmountA || !currencyAmountB) {
      throw new Error('missing currency amounts')
    }

    const router = getRouterContract(checkedChainId, library, account)

    const amountsMin = {
      [Field.CURRENCY_A]: calculateSlippageAmount(currencyAmountA, allowedSlippage)[0],
      [Field.CURRENCY_B]: calculateSlippageAmount(currencyAmountB, allowedSlippage)[0]
    }
    if (!currencyA || !currencyB) throw new Error('missing tokens')
    const liquidityAmount = parsedAmounts[BurnField.LIQUIDITY]
    if (!liquidityAmount) throw new Error('missing liquidity amount')

    const currencyBIsETH = currencyB === ETHER
    const oneCurrencyIsETH = currencyA === ETHER || currencyBIsETH

    const [tokenA, tokenB] = [wrappedCurrency(currencyA, checkedChainId), wrappedCurrency(currencyB, checkedChainId)]

    if (!tokenA || !tokenB) throw new Error('could not wrap')

    let methodNames: string[], args: Array<string | string[] | number | boolean>
    // we have approval, use normal remove liquidity
    if (approval === ApprovalState.APPROVED) {
      // removeLiquidityETH
      if (oneCurrencyIsETH) {
        methodNames = ['removeLiquidityETH', 'removeLiquidityETHSupportingFeeOnTransferTokens']
        args = [
          currencyBIsETH ? tokenA.address : tokenB.address,
          liquidityAmount.raw.toString(),
          amountsMin[currencyBIsETH ? Field.CURRENCY_A : Field.CURRENCY_B].toString(),
          amountsMin[currencyBIsETH ? Field.CURRENCY_B : Field.CURRENCY_A].toString(),
          account,
          deadline.toHexString()
        ]
      }
      // removeLiquidity
      else {
        methodNames = ['removeLiquidity']
        args = [
          tokenA.address,
          tokenB.address,
          liquidityAmount.raw.toString(),
          amountsMin[Field.CURRENCY_A].toString(),
          amountsMin[Field.CURRENCY_B].toString(),
          account,
          deadline.toHexString()
        ]
      }
    }
    // we have a signataure, use permit versions of remove liquidity
    else if (signatureData !== null) {
      // removeLiquidityETHWithPermit
      if (oneCurrencyIsETH) {
        methodNames = ['removeLiquidityETHWithPermit', 'removeLiquidityETHWithPermitSupportingFeeOnTransferTokens']
        args = [
          currencyBIsETH ? tokenA.address : tokenB.address,
          liquidityAmount.raw.toString(),
          amountsMin[currencyBIsETH ? Field.CURRENCY_A : Field.CURRENCY_B].toString(),
          amountsMin[currencyBIsETH ? Field.CURRENCY_B : Field.CURRENCY_A].toString(),
          account,
          signatureData.deadline,
          false,
          signatureData.v,
          signatureData.r,
          signatureData.s
        ]
      }
      // removeLiquidityWithPermit
      else {
        methodNames = ['removeLiquidityWithPermit']
        args = [
          tokenA.address,
          tokenB.address,
          liquidityAmount.raw.toString(),
          amountsMin[Field.CURRENCY_A].toString(),
          amountsMin[Field.CURRENCY_B].toString(),
          account,
          signatureData.deadline,
          false,
          signatureData.v,
          signatureData.r,
          signatureData.s
        ]
      }
    } else {
      throw new Error('Attempting to confirm without approval or a signature. Please contact support.')
    }

    const safeGasEstimates: (BigNumber | undefined)[] = await Promise.all(
      methodNames.map(methodName => {
        const executeData = router.interface.encodeFunctionData(methodName, args)

        return library
          .estimateGas({ from: account, to: router.address, data: executeData })
          .then(calculateGasMargin)
          .catch(error => {
            console.error(`estimateGas failed`, methodName, args, error)
            throw new Error(error)
            // return undefined
          })
      })
    )

    const indexOfSuccessfulEstimation = safeGasEstimates.findIndex(safeGasEstimate =>
      BigNumber.isBigNumber(safeGasEstimate)
    )

    // all estimations failed...
    if (indexOfSuccessfulEstimation === -1) {
      console.error('This transaction would fail. Please contact support.')
      return null
    } else {
      const methodName = methodNames[indexOfSuccessfulEstimation]
      const safeGasEstimate = safeGasEstimates[indexOfSuccessfulEstimation]

      const executeData = router.interface.encodeFunctionData(methodName, args)

      return library
        .getSigner()
        .sendTransaction({ from: account, to: router.address, data: executeData, gasLimit: safeGasEstimate })
    }
  }, [
    account,
    allowedSlippage,
    approval,
    chainId,
    currencyA,
    currencyB,
    deadline,
    library,
    parsedAmounts,
    signatureData
  ])

  const burnApproveCallback = useCallback(async () => {
    if (!pairContract || !pair || !library || !deadline) throw new Error('missing dependencies')
    const liquidityAmount = parsedAmounts[BurnField.LIQUIDITY]
    if (!liquidityAmount) throw new Error('missing liquidity amount')

    // try to gather a signature for permission
    const nonce = await pairContract.nonces(account)

    const EIP712Domain = [
      { name: 'name', type: 'string' },
      { name: 'version', type: 'string' },
      { name: 'chainId', type: 'uint256' },
      { name: 'verifyingContract', type: 'address' }
    ]
    const domain = {
      name: 'Bitswap V2',
      version: '1',
      chainId: chainId,
      verifyingContract: pair.liquidityToken.address
    }
    const Permit = [
      { name: 'owner', type: 'address' },
      { name: 'spender', type: 'address' },
      { name: 'value', type: 'uint256' },
      { name: 'nonce', type: 'uint256' },
      { name: 'deadline', type: 'uint256' }
    ]
    const message = {
      owner: account,
      spender: ROUTER_ADDRESS,
      value: liquidityAmount.raw.toString(),
      nonce: nonce.toHexString(),
      deadline: deadline.toNumber()
    }
    const data = JSON.stringify({
      types: {
        EIP712Domain,
        Permit
      },
      domain,
      primaryType: 'Permit',
      message
    })
    showModal(<TransacitonPendingModal />)
    library
      .send('eth_signTypedData_v4', [account, data])
      .then(splitSignature)
      .then(signature => {
        hideModal()
        setSignatureData({
          v: signature.v,
          r: signature.r,
          s: signature.s,
          deadline: deadline.toNumber()
        })
      })
      .catch(error => {
        // for all errors other than 4001 (EIP-1193 user rejected request), fall back to manual approve
        if (error?.code !== 4001) {
          approveCallback()
        }
      })
  }, [account, approveCallback, chainId, deadline, hideModal, library, pair, pairContract, parsedAmounts, showModal])

  return { burnCallback, burnApproveCallback, setSignatureData, approval, signatureData }
}
