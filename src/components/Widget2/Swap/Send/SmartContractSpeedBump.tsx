import { Dialog } from '../../components/Dialog/Dialog'
import AlertTriangleFilled from '../../components/Icons/AlertTriangleFilled'
import styled from 'styled-components'

const StyledAlertIcon = styled(AlertTriangleFilled)`
  path {
    fill: ${({ theme }) => theme.neutral2};
  }
`

export const SmartContractSpeedBumpModal = ({
  onCancel,
  onConfirm
}: {
  onCancel: () => void
  onConfirm: () => void
}) => {
  return (
    <Dialog
      isVisible={true}
      icon={<StyledAlertIcon size="28px" />}
      title={<>Is this a wallet address?</>}
      description={
        <>
          You&apos;re about to send tokens to a special type of address - a smart contract. Double-check it&apos;s the
          address you intended to send to. If it&apos;s wrong, your tokens could be lost forever.
        </>
      }
      onCancel={onCancel}
      buttonsConfig={{
        left: {
          title: <>Cancel</>,
          onClick: onCancel
        },
        right: {
          title: <>Continue</>,
          onClick: onConfirm
        }
      }}
    />
  )
}
