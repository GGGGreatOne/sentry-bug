import { createReducer } from '@reduxjs/toolkit'
import { updateVersion } from '../../global/actions'
import {
  updateUserExpertMode,
  updateUserSlippageTolerance,
  updateUserDeadline,
  toggleURLWarning,
  updateUserSingleHopOnly,
  setOpenModal
} from './actions'
import { DEFAULT_DEADLINE_FROM_NOW, INITIAL_ALLOWED_SLIPPAGE } from 'components/Widget/constant'
import { ApplicationModal } from 'state/application/actions'

const currentTimestamp = () => new Date().getTime()

export interface UserState {
  // the timestamp of the last updateVersion action
  lastUpdateVersionTimestamp?: number

  userExpertMode: boolean

  userSingleHopOnly: boolean // only allow swaps on direct pairs

  // user defined slippage tolerance in bips, used in all txns
  userSlippageTolerance: number

  // deadline set by user in minutes, used in all txns
  userDeadline: number

  timestamp: number
  URLWarningVisible: boolean
  readonly openModal: ApplicationModal | null
}

export const initialState: UserState = {
  userExpertMode: false,
  userSingleHopOnly: false,
  userSlippageTolerance: INITIAL_ALLOWED_SLIPPAGE,
  userDeadline: DEFAULT_DEADLINE_FROM_NOW,
  openModal: null,
  timestamp: currentTimestamp(),
  URLWarningVisible: true
}

export default createReducer(initialState, builder =>
  builder
    .addCase(updateVersion, state => {
      // slippage isnt being tracked in local storage, reset to default
      // noinspection SuspiciousTypeOfGuard
      if (typeof state.userSlippageTolerance !== 'number') {
        state.userSlippageTolerance = INITIAL_ALLOWED_SLIPPAGE
      }

      // deadline isnt being tracked in local storage, reset to default
      // noinspection SuspiciousTypeOfGuard
      if (typeof state.userDeadline !== 'number') {
        state.userDeadline = DEFAULT_DEADLINE_FROM_NOW
      }

      state.lastUpdateVersionTimestamp = currentTimestamp()
    })

    .addCase(updateUserExpertMode, (state, action) => {
      state.userExpertMode = action.payload.userExpertMode
      state.timestamp = currentTimestamp()
    })
    .addCase(updateUserSlippageTolerance, (state, action) => {
      state.userSlippageTolerance = action.payload.userSlippageTolerance
      state.timestamp = currentTimestamp()
    })
    .addCase(updateUserDeadline, (state, action) => {
      state.userDeadline = action.payload.userDeadline
      state.timestamp = currentTimestamp()
    })
    .addCase(updateUserSingleHopOnly, (state, action) => {
      state.userSingleHopOnly = action.payload.userSingleHopOnly
    })
    .addCase(toggleURLWarning, state => {
      state.URLWarningVisible = !state.URLWarningVisible
    })
    .addCase(setOpenModal, (state, action) => {
      state.openModal = action.payload
    })
)
