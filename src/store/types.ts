import { Instrument } from '../Enums'
import Decimal from 'decimal.js';
import { Order } from '../Models/Base';

export type StockMarketInitialState = {
  orders: Order[]
  currentMarket: {
    id?: string
    instrument?: Instrument
    amount?: Decimal
    buyPrice?: Decimal
    sellPrice?: Decimal
    minAmount?: Decimal
    maxAmount?: Decimal
  }
}
