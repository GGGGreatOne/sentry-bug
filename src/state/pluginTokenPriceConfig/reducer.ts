import { createAsyncThunk, createSlice } from '@reduxjs/toolkit'
import { GetTokenPrice } from 'api/boxes'
import { TokenPriceInfo } from 'api/boxes/type'

export const fetchPluginTokenPriceListConfig: any = createAsyncThunk('config/pluginTokenPriceListConfig', async () => {
  const res = await GetTokenPrice()
  return res.data
})

const pluginTokenPriceListConfig = createSlice({
  name: 'pluginTokenPriceListConfig',
  initialState: {
    pluginTokenPriceList: [] as TokenPriceInfo[]
  },
  reducers: {
    setPluginTokenPriceList(state, { payload }) {
      state.pluginTokenPriceList = payload.pluginTokenPriceList
    }
  },
  extraReducers: builder => {
    builder.addCase(fetchPluginTokenPriceListConfig.fulfilled, (state, { payload }) => {
      state.pluginTokenPriceList = payload || []
    })
  }
})

export default pluginTokenPriceListConfig.reducer
