import { ChainId } from '@uniswap/sdk-core'
import { useAllTokensMultichain } from 'components/Widget2/hooks/Tokens'
import { TransactionStatus } from 'components/Widget2/lib/uniswap/src/data/graphql/uniswap-data-api/__generated__/types-and-hooks'
import { EllipsisStyle, ThemedText } from 'components/Widget2/theme/components'
import { useFormatter } from 'components/Widget2/utils/formatNumbers'
import { ExplorerDataType, getExplorerLink } from 'components/Widget2/utils/getExplorerLink'
import useENSName from 'hooks/useENSName'
import styled from 'styled-components'
import { AutoColumn } from '../Column'
import { CloseIcon } from 'components/Global'
import { AutoRow, RowBetween } from '../Row'
import AlertTriangleFilled from '../Icons/AlertTriangleFilled'
import { getChainInfo } from 'components/Widget2/constants/chainInfo'
import { useTransaction } from 'components/Widget2/state/transactions/hooks'
import { Activity } from 'components/Widget2/hooks/activities/types'
import { transactionToActivity } from 'components/Widget2/hooks/activities/parseLocal'

const PopupContainer = styled.div<{ padded?: boolean }>`
  display: inline-block;
  width: 100%;
  background-color: ${({ theme }) => theme.surface1};
  position: relative;
  border: 1px solid ${({ theme }) => theme.surface3};
  border-radius: 16px;
  overflow: hidden;
  box-shadow: ${({ theme }) => theme.deprecated_deepShadow};
  transition: ${({ theme }) => `visibility ${theme.transition.duration.fast} ease-in-out`};

  padding: ${({ padded }) => (padded ? '20px 35px 20px 20px' : '2px 0px')};

  ${({ theme }) => theme.deprecated_mediaWidth.deprecated_upToSmall`
  min-width: 290px;
  &:not(:last-of-type) {
    margin-right: 20px;
  }
`}
`

const RowNoFlex = styled(AutoRow)`
  flex-wrap: nowrap;
`

const ColumnContainer = styled(AutoColumn)`
  margin: 0 12px;
`

const PopupAlertTriangle = styled(AlertTriangleFilled)`
  flex-shrink: 0;
  width: 32px;
  height: 32px;
`

export function FailedNetworkSwitchPopup({ chainId, onClose }: { chainId: ChainId; onClose: () => void }) {
  const chainInfo = getChainInfo(chainId)

  return (
    <PopupContainer padded>
      <CloseIcon onClick={onClose} />
      <RowNoFlex gap="12px">
        <PopupAlertTriangle />
        <ColumnContainer gap="sm">
          <ThemedText.SubHeader color="neutral2">Failed to switch networks</ThemedText.SubHeader>

          <ThemedText.BodySmall color="neutral2">
            To use swap on {chainInfo.label}, switch the network in your wallet&apos;s settings.
          </ThemedText.BodySmall>
        </ColumnContainer>
      </RowNoFlex>
    </PopupContainer>
  )
}

const Descriptor = styled(ThemedText.BodySmall)`
  ${EllipsisStyle}
`

type ActivityPopupContentProps = { activity: Activity; onClick: () => void; onClose: () => void }
function ActivityPopupContent({ activity, onClick, onClose }: ActivityPopupContentProps) {
  const success = activity.status === TransactionStatus.Confirmed && !activity.cancelled
  const { ENSName } = useENSName(activity?.otherAccount)

  return (
    <PopupContainer>
      <CloseIcon onClick={onClose} />
      <RowBetween>
        {success ? <></> : <AlertTriangleFilled />}
        <AutoColumn grow onClick={onClick}>
          <ThemedText.SubHeader>{activity.title}</ThemedText.SubHeader>
          <Descriptor color="neutral2">
            {activity.descriptor}
            {ENSName ?? activity.otherAccount}
          </Descriptor>
        </AutoColumn>
      </RowBetween>
    </PopupContainer>
  )
}

export function TransactionPopupContent({
  chainId,
  hash,
  onClose
}: {
  chainId: ChainId
  hash: string
  onClose: () => void
}) {
  const transaction = useTransaction(hash)
  const tokens = useAllTokensMultichain()
  const { formatNumber } = useFormatter()
  if (!transaction) return null

  const activity = transactionToActivity(transaction, chainId, tokens, formatNumber)

  if (!activity) return null

  const onClick = () =>
    window.open(getExplorerLink(activity.chainId, activity.hash, ExplorerDataType.TRANSACTION), '_blank')

  return <ActivityPopupContent activity={activity} onClose={onClose} onClick={onClick} />
}
