import { createAsyncThunk, createSlice } from '@reduxjs/toolkit'
import { getTokenList } from 'api/common'
import { ITokenListItem } from 'api/common/type'

export const fetchPluginTokenListConfig: any = createAsyncThunk('config/pluginTokenListConfig', async () => {
  const res = await getTokenList({})
  return res.data
})

const pluginTokenListConfig = createSlice({
  name: 'pluginTokenListConfig',
  initialState: {
    pluginTokenList: [] as ITokenListItem[],
    total: 0
  },
  reducers: {
    setPluginTokenList(state, { payload }) {
      state.pluginTokenList = payload.data
      state.total = payload.total
    }
  },
  extraReducers: builder => {
    builder.addCase(fetchPluginTokenListConfig.fulfilled, (state, { payload }) => {
      state.pluginTokenList = payload?.data || []
    })
  }
})

export default pluginTokenListConfig.reducer
