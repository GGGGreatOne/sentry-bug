import { createSlice } from '@reduxjs/toolkit'

export interface ILeverageData {
  tradePairIndex: number
  tradeQuantosIndex: number
}

const initialState: ILeverageData = {
  tradePairIndex: 0,
  tradeQuantosIndex: 0
}

export const leverageData = createSlice({
  name: 'leverageData',
  initialState,
  reducers: {
    saveLeverageData: (state, { payload }: { payload: ILeverageData }) => {
      state.tradePairIndex = payload.tradePairIndex
      state.tradeQuantosIndex = payload.tradeQuantosIndex
    }
  },
  extraReducers: {}
})

export const { saveLeverageData } = leverageData.actions
export default leverageData.reducer
