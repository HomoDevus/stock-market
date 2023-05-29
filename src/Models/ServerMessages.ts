import { Instrument, OrderStatus, ServerMessageType } from '../Enums'
import { Order, Quote } from './Base'

export type ServerEnvelope<T extends ServerMessageType = ServerMessageType> = {
  messageType: T
  message: ServerMessage<T>
}

export type ServerMessage<T extends ServerMessageType = ServerMessageType> =
  T extends ServerMessageType.success
    ? SuccessInfo
    : T extends ServerMessageType.marketDataUpdate
    ? MarketDataUpdate
    : T extends ServerMessageType.executionReport
    ? ExecutionReport
    : T extends ServerMessageType.error
    ? ErrorInfo
    : T extends ServerMessageType.ordersUpdate
    ? Orders
    : never

export interface ErrorInfo {
  reason: string
}

export interface ExecutionReport {
  orderId: string
  orderStatus: OrderStatus
}

export interface MarketDataUpdate {
  subscriptionId: string
  instrument: Instrument
  quotes: [Quote]
}

export interface SuccessInfo {
  subscriptionId: string
}

export type Orders = Order[]