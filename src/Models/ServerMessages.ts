import { Instrument, OrderSide, OrderStatus } from '../Enums'
import { Envelope, Message, Quote } from './Base'
import Decimal from 'decimal.js'

export interface ServerEnvelope extends Envelope {
  messageType: ServerMessage
}

export interface ServerMessage extends Message {}

export interface ErrorInfo extends ServerMessage {
  reason: string
}

export interface SuccessInfo extends ServerMessage {}

export interface ExecutionReport extends ServerMessage {
  orderId: string
  orderStatus: OrderStatus
}

export interface MarketDataUpdate extends ServerMessage {
  subscriptionId: string
  instrument: Instrument
  quotes: [Quote]
}

export interface SubscribeMarketDataSuccess extends ServerEnvelope {
  message: { subscriptionId: string }
}

export interface PlaceOrderRequest {
  instrument: Instrument
  amount: Decimal
  side: OrderSide
  price: Decimal
}
