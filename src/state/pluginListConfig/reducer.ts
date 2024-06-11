import { createSlice } from '@reduxjs/toolkit'
import { IPluginListResult } from 'api/boxes/type'

export const pluginListConfig = createSlice({
  name: 'pluginListConfig',
  initialState: {
    pluginList: {
      list: [],
      total: 0
    } as IPluginListResult
  },
  reducers: {
    setPluginList: (state, { payload }) => {
      state.pluginList = payload.pluginList
    }
  }
})

export default pluginListConfig.reducer
