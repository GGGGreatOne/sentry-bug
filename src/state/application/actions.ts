import { PaletteMode } from '@mui/material'
import { createAction } from '@reduxjs/toolkit'

export type PopupContent = {
  txn: {
    hash: string
    success: boolean
    summary?: string
  }
}

export enum ApplicationModal {
  WALLET,
  SETTINGS,
  MENU,
  SIGN_LOGIN,
  SWITCH_NETWORK
}

export const updateBlockNumber = createAction<{ chainId: number; blockNumber: number }>('application/updateBlockNumber')
export const setOpenModal = createAction<ApplicationModal | null>('application/setOpenModal')
export const addPopup = createAction<{ key?: string; removeAfterMs?: number | null; content: PopupContent }>(
  'application/addPopup'
)
export const removePopup = createAction<{ key: string }>('application/removePopup')
export const updateThemeMode = createAction<{ themeModel: PaletteMode }>('application/updateThemeMode')
export const setCurrentConnectedAccount = createAction<{ account: string | null }>(
  'application/setCurrentConnectedAccount'
)
export const setChainGasPrice = createAction<string | null>('application/setChainGasPrice')
