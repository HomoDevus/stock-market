import { createAsyncThunk, createSlice } from '@reduxjs/toolkit'
import { StockMarketInitialState } from '../types'
import { client, waitForSubscribeResponse } from '../helpers'
import { PlaceOrderRequest } from '../../Models/ServerMessages'

const initialState: StockMarketInitialState = {
  subscribedMarkets: [],
  currentMarket: null,
}

export const subscribeMarketData = createAsyncThunk(
  'stockMarket/subscribeMarketData',
  async (instrument: number) => {
    client.subscribeMarketData(instrument)

    return await waitForSubscribeResponse()
  },
)

export const unsubscribeMarketData = createAsyncThunk(
  'stockMarket/unsubscribeMarketData',
  async (subscriptionId: string) => {
    client.unsubscribeMarketData(subscriptionId)

    return await waitForSubscribeResponse()
  },
)

export const placeOrder = createAsyncThunk(
  'stockMarket/placeOrder',
  async (orderData: PlaceOrderRequest) => {
    client.placeOrder(
      orderData.instrument,
      orderData.side,
      orderData.amount,
      orderData.price,
    )

    return await waitForSubscribeResponse()
  },
)

const stockMarketSlice = createSlice({
  name: 'stockMarket',
  initialState: initialState,
  reducers: {},
  extraReducers: builder => {
    builder
      .addCase(subscribeMarketData.fulfilled, (state, action) => {
        state.subscribedMarkets.push({ id: action.payload })
      })
      .addCase(unsubscribeMarketData.fulfilled, (state, action) => {
        state.subscribedMarkets.filter(
          marketItem => marketItem.id !== action.payload,
        )
      })
  },
})

const { reducer } = stockMarketSlice

export default reducer
