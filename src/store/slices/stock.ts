import { createAsyncThunk, createSlice, PayloadAction } from '@reduxjs/toolkit'
import { StockMarketInitialState } from '../types'
import { client, waitForSubscribeResponse } from '../helpers'
import { MarketDataUpdate, Orders } from '../../Models/ServerMessages'
import { Instrument } from '../../Enums'
import { PlaceOrder } from '../../Models/ClientMessages'

const initialState: StockMarketInitialState = {
  orders: [],
  currentMarket: {},
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
  async (orderData: PlaceOrder) => {
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
  reducers: {
    changeInstrument(state, action: PayloadAction<Instrument>) {
      state.currentMarket = {}
      state.currentMarket.instrument = action.payload

      return state
    },
    marketDataUpdate(state, action: PayloadAction<MarketDataUpdate>) {
      const { subscriptionId, instrument, quotes } = action.payload
      // TODO: Give user ability to choose from different exchanges
      const { bid, offer, minAmount, maxAmount } = quotes[0]

      state.currentMarket = {
        id: subscriptionId,
        instrument,
        buyPrice: offer,
        sellPrice: bid,
        minAmount,
        maxAmount,
      }

      return state
    },
    updateOrders(state, action: PayloadAction<Orders>) {
      state.orders = action.payload

      return state
    }
  },
  extraReducers: builder => {
    builder
      .addCase(subscribeMarketData.fulfilled, (state, action) => {
        state.currentMarket = { id: action.payload.subscriptionId }
      })
      .addCase(unsubscribeMarketData.fulfilled, (state) => {
        state.currentMarket = {}
      })
      .addCase(placeOrder.fulfilled, () => {})
  },
})

const { reducer, actions } = stockMarketSlice

export const { changeInstrument, marketDataUpdate, updateOrders } = actions

export default reducer
