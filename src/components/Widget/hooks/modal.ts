import { useSelector } from 'react-redux'
import { AppState } from 'state'
import { ApplicationModal } from 'state/application/actions'
import { useToggleModal } from 'state/application/hooks'

export function useModalOpen(modal: ApplicationModal): boolean {
  const openModal = useSelector((state: AppState) => state.swapUser.openModal)
  return openModal === modal
}

export function useToggleSettingsMenu(): () => void {
  return useToggleModal(ApplicationModal.SETTINGS)
}
