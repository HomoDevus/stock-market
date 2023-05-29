import { Instrument } from './Enums';

type Market = {
  [key in Instrument]: {
    bid: number,
    offer: number
    minAmount: number
    maxAmount: number
  }
}

export const MARKETS: Market = {
  [Instrument.eur_rub]: {
    bid: 86.3,
    offer: 86.32,
    minAmount: 1,
    maxAmount: 5000000
  },
  [Instrument.eur_usd]: {
    bid: 1.0771,
    offer: 1.0772,
    minAmount: 1,
    maxAmount: 1000000
  },
  [Instrument.usd_rub]: {
    bid: 80.0740,
    offer: 80.0840,
    minAmount: 1,
    maxAmount: 5000000
  }
}
