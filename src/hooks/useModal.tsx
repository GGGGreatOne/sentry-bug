import { useContext } from 'react'
import { ModalContext } from '../provider/ModalProvider'

export default function useModal() {
  const context = useContext(ModalContext)
  if (context === undefined) {
    throw new Error('useModal must be used within a provider')
  }

  return context
}
