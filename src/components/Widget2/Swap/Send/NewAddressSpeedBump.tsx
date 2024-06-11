import { ColumnCenter } from '../../components/Column'
import { Dialog } from '../../components/Dialog/Dialog'
import Row from '../../components/Row'
import { useSendContext } from '../../state/send/SendContext'
import styled from 'styled-components'
import { ThemedText } from '../../theme/components'

// const StyledUserIcon = styled(UserIcon)`
//   width: 28px;
//   height: 28px;
// `

const RecipientInfo = styled(ColumnCenter)`
  padding: 20px 16px;
  border: 1px solid ${({ theme }) => theme.surface3};
  gap: 8px;
  border-radius: 20px;
`

export const NewAddressSpeedBumpModal = ({ onCancel, onConfirm }: { onCancel: () => void; onConfirm: () => void }) => {
  const {
    derivedSendInfo: { recipientData }
  } = useSendContext()

  return (
    <Dialog
      isVisible={true}
      icon={<></>}
      // icon={<StyledUserIcon fill={theme.neutral2} />}
      title={'New address'}
      description={`You haven&apos;t transacted with this address before. Make sure it&apos;s the correct address before
          continuing.`}
      body={
        <RecipientInfo>
          <Row justify="center" align="center" gap="xs">
            <ThemedText.BodyPrimary lineHeight="24px">
              {recipientData?.ensName ?? recipientData?.address}
            </ThemedText.BodyPrimary>
          </Row>
          {recipientData?.ensName && (
            <ThemedText.LabelMicro lineHeight="16px">{recipientData?.address}</ThemedText.LabelMicro>
          )}
        </RecipientInfo>
      }
      onCancel={onCancel}
      buttonsConfig={{
        left: {
          title: 'Cancel',
          onClick: onCancel
        },
        right: {
          title: 'Continue',
          onClick: onConfirm
        }
      }}
    />
  )
}
