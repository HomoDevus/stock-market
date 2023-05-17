import { Action, configureStore, ThunkAction } from '@reduxjs/toolkit'
import stockMarketReducer from './slices/stock'
import { client, connect } from './helpers'

const connectWSMiddleware =
  () => (next: any) => async (action: any) => {
    if (client.connection?.readyState === 1) return
    await connect()
    return next(action)
  }

export const store = configureStore({
  reducer: {
    stockMarketSlice: stockMarketReducer,
  },
  middleware: getDefaultMiddleware =>
    getDefaultMiddleware().concat(connectWSMiddleware),
})

export type RootState = ReturnType<typeof store.getState>
export type AppDispatch = typeof store.dispatch
export type AppThunk<ReturnType = void> = ThunkAction<
  ReturnType,
  RootState,
  unknown,
  Action<string>
>
