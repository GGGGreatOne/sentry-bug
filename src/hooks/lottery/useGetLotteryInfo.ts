import { useBoxLotteryContract } from '../useContract'
import { useActiveWeb3React } from '../index'
import { useSingleCallResult } from '../multicall'
import { useMemo } from 'react'
import BigNumber from 'bignumber.js'

export const useGetLotteryInfo = () => {
  const { chainId, account } = useActiveWeb3React()
  const contract = useBoxLotteryContract(chainId)
  const currentEpochReq = useSingleCallResult(chainId, contract, 'currentEpoch', [], undefined)
  const currentEpoch = useMemo(() => {
    if (currentEpochReq?.result?.[0]) return new BigNumber(currentEpochReq.result?.[0]._hex)
    else return new BigNumber(0)
  }, [currentEpochReq.result])
  const currentParticipantsReq = useSingleCallResult(chainId, contract, 'numBetted', [], undefined)
  const currentParticipants = useMemo(() => {
    if (currentParticipantsReq?.result?.[0]) return new BigNumber(currentParticipantsReq.result?.[0]._hex)
    else return new BigNumber(0)
  }, [currentParticipantsReq.result])

  const winnerOfReq = useSingleCallResult(chainId, contract, 'winnerOf', [currentEpoch.toString()], undefined)
  const winnerOf = useMemo(() => {
    if (winnerOfReq?.result?.[0]) return winnerOfReq.result?.[0]
    else return ''
  }, [winnerOfReq.result])

  const paymentReq = useSingleCallResult(chainId, contract, 'payment', [], undefined)
  const payment = useMemo(() => {
    if (paymentReq?.result?.[0]) return paymentReq.result
    else return ''
  }, [paymentReq.result])

  const isBetReq = useSingleCallResult(chainId, contract, 'isBetted ', [account], undefined)
  const isBet = useMemo(() => {
    if (!account) return false
    if (isBetReq?.result?.[0]) return isBetReq.result?.[0]
    else return false
  }, [account, isBetReq.result])

  const isWonReq = useSingleCallResult(chainId, contract, 'isWon ', [account], undefined)
  const isWon = useMemo(() => {
    if (!account) return false
    if (isWonReq?.result?.[0]) return isWonReq.result?.[0]
    else return false
  }, [account, isWonReq.result])

  console.log('currentParticipants', currentParticipants)
  console.log('winnerOf', winnerOf)
  console.log('payment', payment)
  console.log('currentEpoch', currentEpoch.toNumber())
  console.log('priceInToken', new BigNumber(payment?.[1]?._hex).toString())
  console.log('isBet', isBet)
  console.log('isWon', isWon)
  return {
    currentEpoch: currentEpoch,
    currentParticipants: currentParticipants,
    winnerOf: winnerOf,
    userIsBet: isBet,
    userIsWon: isWon,
    paymentTokenAddress: (payment?.[0] as string) ?? '',
    paymentInToken: new BigNumber(payment?.[1]?._hex ?? '1000000000000000000') as BigNumber
  }
}
