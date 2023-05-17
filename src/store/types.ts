import { Instrument, OrderSide, OrderStatus } from '../Enums'

export type MarketItem = {
  id: string
  creationTime?: Date
  changeTime?: Date
  status?: OrderStatus
  side?: OrderSide
  price?: number
  amount?: number
  instrument?: Instrument
}

export type StockMarketInitialState = {
  subscribedMarkets: MarketItem[]
  currentMarket: {
    instrument: string
    amount: number
    buyPrice: number
    sellPrice: number
  } | null
}
