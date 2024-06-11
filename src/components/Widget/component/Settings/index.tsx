import React, { useRef, useState } from 'react'

import { Box, Typography, styled } from '@mui/material'
import { /*useUserSingleHopOnly,*/ useUserSlippageTolerance, useUserTransactionTTL } from 'state/widget/swapUser/hooks'
import { useModalOpen } from 'state/application/hooks'
import { useToggleSettingsMenu } from 'components/Widget/hooks/modal'
// import SwitchToggle from '../SwitchToggle'
import { ApplicationModal } from 'state/application/actions'
import TransactionSettings from './TransactionSettings'
// import QuestionHelper from 'components/essential/QuestionHelper'
import { Settings } from 'components/Widget/assets/svg'
import Close from '@mui/icons-material/Close'
import Modal from 'components/Modal'
import Divider from 'components/Divider'

const StyledMenuIcon = styled(Settings)`
  height: 20px;
  width: 20px;

  > * {
    stroke: #000000;
  }

  :hover {
    opacity: 0.7;
  }
`

const StyledCloseIcon = styled(Close)`
  height: 20px;
  width: 20px;
  :hover {
    cursor: pointer;
  }

  > * {
    stroke: #000000;
  }
`

const StyledMenuButton = styled('button')`
  position: relative;
  width: 100%;
  height: 100%;
  border: none;
  background-color: transparent;
  margin: 0;
  padding: 0;
  height: 35px;

  padding: 0.15rem 0.5rem;
  border-radius: 0.5rem;

  :hover,
  :focus {
    cursor: pointer;
    outline: none;
  }

  svg {
    margin-top: 2px;
  }
`

const StyledMenu = styled('div')`
  margin-left: 0.5rem;
  display: flex;
  justify-content: center;
  align-items: center;
  position: relative;
  border: none;
  text-align: left;
`

const MenuFlyout = styled('span')`
  min-width: 20.125rem;
  background-color: #1b1b1b;
  border-radius: 12px;
  display: flex;
  flex-direction: column;
  font-size: 1rem;
  top: 3rem;
  right: 0rem;
  width: 100%;
`

const Break = styled('div')`
  width: 100%;
  height: 1px;
`

const ModalContentWrapper = styled('div')`
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 2rem 0;
  border-radius: 20px;
`

export default function SettingsTab() {
  const node = useRef<HTMLDivElement>()
  const open = useModalOpen(ApplicationModal.SETTINGS)
  const toggle = useToggleSettingsMenu()

  const [userSlippageTolerance, setUserslippageTolerance] = useUserSlippageTolerance()

  const [ttl, setTtl] = useUserTransactionTTL()

  // const [singleHopOnly, setSingleHopOnly] = useUserSingleHopOnly()

  // show confirmation view before turning on
  const [showConfirmation, setShowConfirmation] = useState(false)

  return (
    <StyledMenu ref={node as any}>
      <Modal customIsOpen={showConfirmation} customOnDismiss={() => setShowConfirmation(false)}>
        <ModalContentWrapper>
          <Box gap="lg">
            <Box display={'flex'} justifyContent={'space-between'} style={{ padding: '0 2rem' }}>
              <div />
              <Typography fontWeight={500} fontSize={20}>
                Are you sure?
              </Typography>
              <StyledCloseIcon onClick={() => setShowConfirmation(false)} />
            </Box>
            <Break />
            <Box display="grid" gap="lg" style={{ padding: '0 2rem' }}>
              <Typography fontWeight={500} fontSize={20}>
                Expert mode turns off the confirm transaction prompt and allows high slippage trades that often result
                in bad rates and lost funds.
              </Typography>
              <Typography fontWeight={600} fontSize={20}>
                ONLY USE THIS MODE IF YOU KNOW WHAT YOU ARE DOING.
              </Typography>
            </Box>
          </Box>
        </ModalContentWrapper>
      </Modal>
      <StyledMenuButton onClick={toggle} id="open-settings-dialog-button">
        <StyledMenuIcon />
      </StyledMenuButton>
      <Modal customIsOpen={open} customOnDismiss={toggle}>
        <MenuFlyout>
          <Box display="grid" gap="md" style={{ padding: '1rem' }}>
            <Typography fontWeight={600} fontSize={14}>
              Transaction Settings
            </Typography>
            <Divider sx={{ my: 20 }} />
            <TransactionSettings
              rawSlippage={userSlippageTolerance}
              setRawSlippage={setUserslippageTolerance}
              deadline={ttl}
              setDeadline={setTtl}
            />
            {/* <Typography fontWeight={600} fontSize={14}>
              Interface Settings
            </Typography>
            <Box display={'flex'}>
              <Typography fontWeight={400} fontSize={14}>
                Toggle Expert Mode
              </Typography>
              <QuestionHelper text="Bypasses confirmation modals and allows high slippage trades. Use at your own risk." />
            </Box>
            <Box display={'flex'}>
              <Box display={'flex'}>
                <Typography fontWeight={400} fontSize={14}>
                  Disable Multihops
                </Typography>
                <QuestionHelper text="Restricts swaps to direct pairs only." />
              </Box>
              <SwitchToggle
                checked={singleHopOnly}
                onChange={() => {
                  setSingleHopOnly(!singleHopOnly)
                }}
              />
            </Box> */}
          </Box>
        </MenuFlyout>
      </Modal>
    </StyledMenu>
  )
}
