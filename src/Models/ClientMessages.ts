import { ClientMessageType, Instrument, OrderSide } from '../Enums'
import Decimal from 'decimal.js'

export type ClientEnvelope<T extends ClientMessageType = ClientMessageType> = {
  messageType: T
  message: ClientMessage<T>
}

export type ClientMessage<T extends ClientMessageType = ClientMessageType> =
  T extends ClientMessageType.placeOrder
    ? PlaceOrder
    : T extends ClientMessageType.subscribeMarketData
    ? SubscribeMarketData
    : T extends ClientMessageType.unsubscribeMarketData
    ? UnsubscribeMarketData
    : never

export interface SubscribeMarketData {
  instrument: Instrument
}

export interface UnsubscribeMarketData {
  subscriptionId: string
}

export interface PlaceOrder {
  instrument: Instrument
  side: OrderSide
  amount: Decimal
  price: Decimal
}
