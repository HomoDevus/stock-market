import { Action, configureStore, ThunkAction } from '@reduxjs/toolkit'
import stockMarketReducer, {
  marketDataUpdate,
  updateOrders,
} from './slices/stock'
import { client, connect } from './helpers';
import { ServerEnvelope } from '../Models/ServerMessages';
import { ServerMessageType } from '../Enums';

const connectWSMiddleware =
  (store: any) => {
  return (next: any) => async (action: any) => {
      if (client.connection?.readyState !== 1) {
        await connect()

        if (!client.connection) throw Error('Attempt to connect socket failed')

        client.connection.onmessage = (event: MessageEvent) => {
          try {
            const message: ServerEnvelope = JSON.parse(event.data)
            let messageData

            console.log(message)
            switch (message.messageType) {
              case ServerMessageType.marketDataUpdate:
                messageData = (
                  message as ServerEnvelope<ServerMessageType.marketDataUpdate>
                ).message
                store.dispatch(marketDataUpdate(messageData))
                break
              case ServerMessageType.ordersUpdate:
                messageData = (
                  message as ServerEnvelope<ServerMessageType.ordersUpdate>
                ).message
                store.dispatch(updateOrders(messageData))
                break
            }
          } catch (err) {
            console.error(err)
          }

        }
      }
      next(action)
    }
  }

export const store = configureStore({
  reducer: {
    stockMarketSlice: stockMarketReducer,
  },
  middleware: getDefaultMiddleware =>
    getDefaultMiddleware().concat(connectWSMiddleware)
})

export type RootState = ReturnType<typeof store.getState>
export type AppDispatch = typeof store.dispatch
export type AppThunk<ReturnType = void> = ThunkAction<
  ReturnType,
  RootState,
  unknown,
  Action<string>
>
