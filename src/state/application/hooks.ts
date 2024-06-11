import { SupportedChainId } from 'constants/chains'
import { useCallback, useEffect, useMemo } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { useActiveWeb3React } from '../../hooks'
import { AppDispatch, AppState } from '../index'
import {
  addPopup,
  ApplicationModal,
  PopupContent,
  removePopup,
  setCurrentConnectedAccount,
  setOpenModal,
  updateThemeMode
} from './actions'
import { PaletteMode } from '@mui/material'
import { DEFAULT_THEME } from '../../constants'
import { useWeb3Modal, useWeb3ModalState } from '@web3modal/wagmi/react'

export function useBlockNumber(chainId?: SupportedChainId): number | undefined {
  const { chainId: curChainId } = useActiveWeb3React()

  return useSelector((state: AppState) => state.application.blockNumber[chainId || curChainId || -1])
}

export function useModalOpen(modal: ApplicationModal): boolean {
  const openModal = useSelector((state: AppState) => state.application.openModal)
  return openModal === modal
}

export function useToggleModal(modal: ApplicationModal): () => void {
  const open = useModalOpen(modal)
  const dispatch = useDispatch<AppDispatch>()
  return useCallback(() => dispatch(setOpenModal(open ? null : modal)), [dispatch, modal, open])
}

export function useOpenModal(modal: ApplicationModal): () => void {
  const dispatch = useDispatch<AppDispatch>()
  return useCallback(() => dispatch(setOpenModal(modal)), [dispatch, modal])
}

export function useCloseModals(): () => void {
  const dispatch = useDispatch<AppDispatch>()
  return useCallback(() => dispatch(setOpenModal(null)), [dispatch])
}

export function useWalletModalToggle(): () => void {
  // return useToggleModal(ApplicationModal.WALLET)
  // const { open, setOpen } = useConnectkitModal()
  const { open } = useWeb3ModalState()
  const { open: setOpen, close: setClose } = useWeb3Modal()
  return useCallback(() => (open ? setClose() : setOpen()), [open, setClose, setOpen])
}

export function useSwitchNetworkModalControl() {
  const dispatch = useDispatch<AppDispatch>()
  return {
    open: useCallback(() => {
      dispatch(setOpenModal(ApplicationModal.SWITCH_NETWORK))
    }, [dispatch]),
    close: useCallback(() => dispatch(setOpenModal(null)), [dispatch])
  }
}

export function useSignLoginModalControl() {
  const dispatch = useDispatch<AppDispatch>()
  return {
    open: useCallback(() => {
      dispatch(setOpenModal(ApplicationModal.SIGN_LOGIN))
    }, [dispatch]),
    close: useCallback(() => dispatch(setOpenModal(null)), [dispatch])
  }
}

// export function useSignLoginModalToggle(): () => void {
//   return useToggleModal(ApplicationModal.SIGN_LOGIN)
// }

export function useSettingsModalToggle(): () => void {
  return useToggleModal(ApplicationModal.SETTINGS)
}

// returns a function that allows adding a popup
export function useAddPopup(): (content: PopupContent, key?: string) => void {
  const dispatch = useDispatch()

  return useCallback(
    (content: PopupContent, key?: string) => {
      dispatch(addPopup({ content, key }))
    },
    [dispatch]
  )
}

// returns a function that allows removing a popup via its key
export function useRemovePopup(): (key: string) => void {
  const dispatch = useDispatch()
  return useCallback(
    (key: string) => {
      dispatch(removePopup({ key }))
    },
    [dispatch]
  )
}

// get the list of active popups
export function useActivePopups(): AppState['application']['popupList'] {
  const list = useSelector((state: AppState) => state.application.popupList)
  return useMemo(() => list.filter(item => item.show), [list])
}

export function useUpdateThemeMode() {
  const dispatch = useDispatch<AppDispatch>()
  const mode = useSelector((state: AppState) => state.application.themeModel)

  const LOCAL_THEME_NAME = 'LOCAL_THEME_NAME'

  const toggleThemeMode = useCallback(() => {
    const themeModel = mode === 'dark' ? 'light' : 'dark'
    dispatch(updateThemeMode({ themeModel }))
    localStorage.setItem(LOCAL_THEME_NAME, themeModel)
  }, [dispatch, mode])

  const setThemeMode = useCallback(
    (themeModel: PaletteMode) => {
      dispatch(updateThemeMode({ themeModel }))
      localStorage.setItem(LOCAL_THEME_NAME, themeModel)
    },
    [dispatch]
  )

  const getLocalThemeMode = (): PaletteMode => {
    const str = localStorage.getItem(LOCAL_THEME_NAME)
    if (!str || !['dark', 'light'].includes(str)) {
      return DEFAULT_THEME
    }
    return str as PaletteMode
  }

  return { mode, toggleThemeMode, setThemeMode, getLocalThemeMode }
}

export function useSetCurrentConnectedAddress() {
  const { account } = useActiveWeb3React()
  const dispatch = useDispatch()

  useEffect(() => {
    dispatch(setCurrentConnectedAccount({ account: account || null }))
  }, [account, dispatch])
}
