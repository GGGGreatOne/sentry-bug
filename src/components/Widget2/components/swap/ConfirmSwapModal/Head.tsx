import Row from '../../../components/Row'
import { ThemedText } from '../../../theme/components'
import { FadePresence } from '../../../theme/components/FadePresence'
import { Box } from '@mui/material'
import CloseSvg from 'assets/svg/close-light.svg'

// const CloseIcon = styled(X)<{ onClick: () => void }>`
//   color: ${({ theme }) => theme.neutral1};
//   cursor: pointer;
//   ${ClickableStyle}
// `
export function SwapHead({ onDismiss, isLimitTrade }: { onDismiss: () => void; isLimitTrade: boolean }) {
  return (
    <>
      <Row width="100%" align="center">
        <Row justify="left">
          <FadePresence>
            <ThemedText.SubHeader>{isLimitTrade ? <>Review limit</> : <>Swap Summary</>}</ThemedText.SubHeader>
          </FadePresence>
        </Row>

        <Row justify="right" gap="10px">
          <></>
          <Box
            sx={{
              cursor: 'pointer',
              'svg>rect': {
                fill: '#717171'
              }
            }}
            onClick={onDismiss}
            data-testid="confirmation-close-icon"
          >
            <CloseSvg />
          </Box>
        </Row>
      </Row>{' '}
      <hr style={{ border: 'none', borderTop: '1px solid #626262' }} />
    </>
  )
}
