import { createAction } from '@reduxjs/toolkit'
import { ApplicationModal } from 'state/application/actions'

export interface SerializedToken {
  chainId: number
  address: string
  decimals: number
  symbol?: string
  name?: string
}

export const updateMatchesDarkMode = createAction<{ matchesDarkMode: boolean }>('swapUser/updateMatchesDarkMode')
export const updateUserDarkMode = createAction<{ userDarkMode: boolean }>('swapUser/updateUserDarkMode')
export const updateUserExpertMode = createAction<{ userExpertMode: boolean }>('swapUser/updateUserExpertMode')
export const updateUserSingleHopOnly = createAction<{ userSingleHopOnly: boolean }>('user/updateUserSingleHopOnly')
export const updateUserSlippageTolerance = createAction<{ userSlippageTolerance: number }>(
  'swapUser/updateUserSlippageTolerance'
)
export const updateUserDeadline = createAction<{ userDeadline: number }>('user/updateUserDeadline')

export const setOpenModal = createAction<ApplicationModal | null>('swapUser/setOpenModal')
export const toggleURLWarning = createAction<void>('app/toggleURLWarning')
