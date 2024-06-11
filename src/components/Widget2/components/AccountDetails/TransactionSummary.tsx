import { Fraction, TradeType } from '@uniswap/sdk-core'
import { BigNumber } from 'ethers/lib/ethers'
import JSBI from 'jsbi'
import { nativeOnChain } from '../../constants/tokens'
import { useCurrency, useToken } from '../../hooks/Tokens'
import {
  AddLiquidityV2PoolTransactionInfo,
  AddLiquidityV3PoolTransactionInfo,
  ApproveTransactionInfo,
  ClaimTransactionInfo,
  CollectFeesTransactionInfo,
  CreateV3PoolTransactionInfo,
  DelegateTransactionInfo,
  ExactInputSwapTransactionInfo,
  ExactOutputSwapTransactionInfo,
  ExecuteTransactionInfo,
  MigrateV2LiquidityToV3TransactionInfo,
  QueueTransactionInfo,
  RemoveLiquidityV3TransactionInfo,
  SendTransactionInfo,
  TransactionInfo,
  TransactionType,
  // VoteTransactionInfo,
  WrapTransactionInfo
} from '../../state/transactions/types'
import useENSName from 'hooks/useENSName'
import { Typography } from '@mui/material'

function formatAmount(amountRaw: string, decimals: number, sigFigs: number): string {
  return new Fraction(amountRaw, JSBI.exponentiate(JSBI.BigInt(10), JSBI.BigInt(decimals))).toSignificant(sigFigs)
}

function FormattedCurrencyAmount({
  rawAmount,
  symbol,
  decimals,
  sigFigs
}: {
  rawAmount: string
  symbol: string
  decimals: number
  sigFigs: number
}) {
  return (
    <>
      {formatAmount(rawAmount, decimals, sigFigs)} {symbol}
    </>
  )
}

function FormattedCurrencyAmountManaged({
  rawAmount,
  currencyId,
  sigFigs = 6
}: {
  rawAmount: string
  currencyId: string
  sigFigs: number
}) {
  const currency = useCurrency(currencyId)
  return currency ? (
    <FormattedCurrencyAmount
      rawAmount={rawAmount}
      decimals={currency.decimals}
      sigFigs={sigFigs}
      symbol={currency.symbol ?? '???'}
    />
  ) : null
}

function ClaimSummary({ info: { recipient, uniAmountRaw } }: { info: ClaimTransactionInfo }) {
  const { ENSName } = useENSName()
  return typeof uniAmountRaw === 'string' ? (
    <Typography>
      Claim <FormattedCurrencyAmount rawAmount={uniAmountRaw} symbol="UNI" decimals={18} sigFigs={4} /> for{' '}
      {ENSName ?? recipient}
    </Typography>
  ) : (
    <Typography>Claim UNI reward for {ENSName ?? recipient}</Typography>
  )
}

function SubmitProposalTransactionSummary() {
  return <Typography>Submit new proposal</Typography>
}

function ApprovalSummary({ info }: { info: ApproveTransactionInfo }) {
  const token = useToken(info.tokenAddress)

  return BigNumber.from(info.amount)?.eq(0) ? (
    <Typography>Revoke {token?.symbol}</Typography>
  ) : (
    <Typography>Approve {token?.symbol}</Typography>
  )
}

// function VoteSummary({ info }: { info: VoteTransactionInfo }) {
//   const proposalKey = `${info.governorAddress}/${info.proposalId}`
//   if (info.reason && info.reason.trim().length > 0) {
//     switch (info.decision) {
//       case VoteOption.For:
//         return <Typography>Vote for proposal {proposalKey}</Typography>
//       case VoteOption.Abstain:
//         return <Typography>Vote to abstain on proposal {proposalKey}</Typography>
//       case VoteOption.Against:
//         return <Typography>Vote against proposal {proposalKey}</Typography>
//     }
//     return null
//   } else {
//     switch (info.decision) {
//       case VoteOption.For:
//         return (
//           <Typography>
//             Vote for proposal {proposalKey} with reason &quot;{info.reason}&quot;
//           </Typography>
//         )
//       case VoteOption.Abstain:
//         return (
//           <Typography>
//             Vote to abstain on proposal {proposalKey} with reason &quot;{info.reason}&quot;
//           </Typography>
//         )
//       case VoteOption.Against:
//         return (
//           <Typography>
//             Vote against proposal {proposalKey} with reason &quot;{info.reason}&quot;
//           </Typography>
//         )
//     }
//     return null
//   }
// }

function QueueSummary({ info }: { info: QueueTransactionInfo }) {
  const proposalKey = `${info.governorAddress}/${info.proposalId}`
  return <Typography>Queue proposal {proposalKey}.</Typography>
}

function ExecuteSummary({ info }: { info: ExecuteTransactionInfo }) {
  const proposalKey = `${info.governorAddress}/${info.proposalId}`
  return <Typography>Execute proposal {proposalKey}.</Typography>
}

function DelegateSummary({ info: { delegatee } }: { info: DelegateTransactionInfo }) {
  const { ENSName } = useENSName(delegatee)
  return <Typography>Delegate voting power to {ENSName ?? delegatee}</Typography>
}

function WrapSummary({ info: { chainId, currencyAmountRaw, unwrapped } }: { info: WrapTransactionInfo }) {
  const native = chainId ? nativeOnChain(chainId) : undefined

  if (unwrapped) {
    return (
      <Typography>
        Unwrap{' '}
        <FormattedCurrencyAmount
          rawAmount={currencyAmountRaw}
          symbol={native?.wrapped?.symbol ?? 'WETH'}
          decimals={18}
          sigFigs={6}
        />{' '}
        to {native?.symbol ?? 'ETH'}
      </Typography>
    )
  } else {
    return (
      <Typography>
        Wrap{' '}
        <FormattedCurrencyAmount
          rawAmount={currencyAmountRaw}
          symbol={native?.symbol ?? 'ETH'}
          decimals={18}
          sigFigs={6}
        />{' '}
        to {native?.wrapped?.symbol ?? 'WETH'}
      </Typography>
    )
  }
}

function DepositLiquidityStakingSummary() {
  // not worth rendering the tokens since you can should no longer deposit liquidity in the staking contracts
  // todo: deprecate and delete the code paths that allow this, show user more information
  return <Typography>Deposit liquidity</Typography>
}

function WithdrawLiquidityStakingSummary() {
  return <Typography>Withdraw deposited liquidity</Typography>
}

function MigrateLiquidityToV3Summary({
  info: { baseCurrencyId, quoteCurrencyId }
}: {
  info: MigrateV2LiquidityToV3TransactionInfo
}) {
  const baseCurrency = useCurrency(baseCurrencyId)
  const quoteCurrency = useCurrency(quoteCurrencyId)

  return (
    <Typography>
      Migrate {baseCurrency?.symbol}/{quoteCurrency?.symbol} liquidity to V3
    </Typography>
  )
}

function CreateV3PoolSummary({ info: { quoteCurrencyId, baseCurrencyId } }: { info: CreateV3PoolTransactionInfo }) {
  const baseCurrency = useCurrency(baseCurrencyId)
  const quoteCurrency = useCurrency(quoteCurrencyId)

  return (
    <Typography>
      Create {baseCurrency?.symbol}/{quoteCurrency?.symbol} V3 pool
    </Typography>
  )
}

function CollectFeesSummary({ info: { currencyId0, currencyId1 } }: { info: CollectFeesTransactionInfo }) {
  const currency0 = useCurrency(currencyId0)
  const currency1 = useCurrency(currencyId1)

  return (
    <Typography>
      Collect {currency0?.symbol}/{currency1?.symbol} fees
    </Typography>
  )
}

function RemoveLiquidityV3Summary({
  info: { baseCurrencyId, quoteCurrencyId, expectedAmountBaseRaw, expectedAmountQuoteRaw }
}: {
  info: RemoveLiquidityV3TransactionInfo
}) {
  return (
    <Typography>
      Remove{' '}
      <FormattedCurrencyAmountManaged rawAmount={expectedAmountBaseRaw} currencyId={baseCurrencyId} sigFigs={3} /> and{' '}
      <FormattedCurrencyAmountManaged rawAmount={expectedAmountQuoteRaw} currencyId={quoteCurrencyId} sigFigs={3} />
    </Typography>
  )
}

function AddLiquidityV3PoolSummary({
  info: { createPool, quoteCurrencyId, baseCurrencyId }
}: {
  info: AddLiquidityV3PoolTransactionInfo
}) {
  const baseCurrency = useCurrency(baseCurrencyId)
  const quoteCurrency = useCurrency(quoteCurrencyId)

  return createPool ? (
    <Typography>
      Create pool and add {baseCurrency?.symbol}/{quoteCurrency?.symbol} V3 liquidity
    </Typography>
  ) : (
    <Typography>
      Add {baseCurrency?.symbol}/{quoteCurrency?.symbol} V3 liquidity
    </Typography>
  )
}

function AddLiquidityV2PoolSummary({
  info: { quoteCurrencyId, expectedAmountBaseRaw, expectedAmountQuoteRaw, baseCurrencyId }
}: {
  info: AddLiquidityV2PoolTransactionInfo
}) {
  return (
    <Typography>
      Add <FormattedCurrencyAmountManaged rawAmount={expectedAmountBaseRaw} currencyId={baseCurrencyId} sigFigs={3} />{' '}
      and <FormattedCurrencyAmountManaged rawAmount={expectedAmountQuoteRaw} currencyId={quoteCurrencyId} sigFigs={3} />{' '}
      to Uniswap V2
    </Typography>
  )
}

function SendSummary({ info }: { info: SendTransactionInfo }) {
  return (
    <Typography>
      Sent
      <FormattedCurrencyAmountManaged rawAmount={info.amount} currencyId={info.currencyId} sigFigs={6} /> to{' '}
      {info.recipient}
    </Typography>
  )
}

function SwapSummary({ info }: { info: ExactInputSwapTransactionInfo | ExactOutputSwapTransactionInfo }) {
  if (info.tradeType === TradeType.EXACT_INPUT) {
    return (
      <Typography>
        Swap exactly{' '}
        <FormattedCurrencyAmountManaged
          rawAmount={info.inputCurrencyAmountRaw}
          currencyId={info.inputCurrencyId}
          sigFigs={6}
        />{' '}
        for{' '}
        <FormattedCurrencyAmountManaged
          rawAmount={info.settledOutputCurrencyAmountRaw ?? info.expectedOutputCurrencyAmountRaw}
          currencyId={info.outputCurrencyId}
          sigFigs={6}
        />
      </Typography>
    )
  } else {
    return (
      <Typography>
        Swap{' '}
        <FormattedCurrencyAmountManaged
          rawAmount={info.expectedInputCurrencyAmountRaw}
          currencyId={info.inputCurrencyId}
          sigFigs={6}
        />{' '}
        for exactly{' '}
        <FormattedCurrencyAmountManaged
          rawAmount={info.outputCurrencyAmountRaw}
          currencyId={info.outputCurrencyId}
          sigFigs={6}
        />
      </Typography>
    )
  }
}

export function TransactionSummary({ info }: { info: TransactionInfo }) {
  switch (info.type) {
    case TransactionType.ADD_LIQUIDITY_V3_POOL:
      return <AddLiquidityV3PoolSummary info={info} />

    case TransactionType.ADD_LIQUIDITY_V2_POOL:
      return <AddLiquidityV2PoolSummary info={info} />

    case TransactionType.CLAIM:
      return <ClaimSummary info={info} />

    case TransactionType.DEPOSIT_LIQUIDITY_STAKING:
      return <DepositLiquidityStakingSummary />

    case TransactionType.WITHDRAW_LIQUIDITY_STAKING:
      return <WithdrawLiquidityStakingSummary />

    case TransactionType.SWAP:
      return <SwapSummary info={info} />

    case TransactionType.APPROVAL:
      return <ApprovalSummary info={info} />

    // case TransactionType.VOTE:
    //   return <VoteSummary info={info} />

    case TransactionType.DELEGATE:
      return <DelegateSummary info={info} />

    case TransactionType.WRAP:
      return <WrapSummary info={info} />

    case TransactionType.CREATE_V3_POOL:
      return <CreateV3PoolSummary info={info} />

    case TransactionType.MIGRATE_LIQUIDITY_V3:
      return <MigrateLiquidityToV3Summary info={info} />

    case TransactionType.COLLECT_FEES:
      return <CollectFeesSummary info={info} />

    case TransactionType.REMOVE_LIQUIDITY_V3:
      return <RemoveLiquidityV3Summary info={info} />

    case TransactionType.QUEUE:
      return <QueueSummary info={info} />

    case TransactionType.EXECUTE:
      return <ExecuteSummary info={info} />

    case TransactionType.SUBMIT_PROPOSAL:
      return <SubmitProposalTransactionSummary />

    case TransactionType.SEND:
      return <SendSummary info={info} />

    default:
      return null
  }
}
