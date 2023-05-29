import Decimal from 'decimal.js'
import { ClientMessage } from './ClientMessages'
import { ServerMessage } from './ServerMessages'
import { Instrument, OrderSide, OrderStatus } from '../Enums'

export interface Envelope {
  messageType: ClientMessage | ServerMessage
  message: object
}

export interface Message {}

export interface Quote {
  bid: Decimal
  offer: Decimal
  minAmount: Decimal
  maxAmount: Decimal
}

export interface Order {
  id: string
  instrument: Instrument
  side: OrderSide
  amount: Decimal
  price: Decimal
  status: OrderStatus
  changeDate: string
  creationDate: string
}
