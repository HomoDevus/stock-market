import { ClientEnvelope } from './Models/ClientMessages'
import {
  ClientMessageType,
  Instrument,
  OrderSide,
} from './Enums'
import Decimal from 'decimal.js'
import { fakeURL } from './WSServer'

export default class WSConnector {
  connection: WebSocket | undefined

  constructor() {
    this.connection = undefined
  }

  connect = (onConnected: () => void, onError: (error: Event) => void) => {
    this.connection = new WebSocket(fakeURL)
    this.connection.onclose = () => {
      this.connection = undefined
    }

    this.connection.onerror = error => {
      onError(error)
    }

    this.connection.onopen = () => {
      onConnected()
    }

    // this.connection.onmessage = event => {
    //   try {
    //     const message: ServerEnvelope = JSON.parse(event.data)
    //     let messageData
    //
    //     switch (message.messageType) {
    //       case ServerMessageType.marketDataUpdate:
    //         messageData = (
    //           message as ServerEnvelope<ServerMessageType.marketDataUpdate>
    //         ).message
    //         store.dispatch(marketDataUpdate(messageData))
    //         break
    //       case ServerMessageType.ordersUpdate:
    //         messageData = (
    //           message as ServerEnvelope<ServerMessageType.ordersUpdate>
    //         ).message
    //         store.dispatch(updateOrders(messageData))
    //         break
    //       // case ServerMessageType.success:
    //       //   break
    //       // case ServerMessageType.error:
    //       //   break
    //       // case ServerMessageType.executionReport:
    //       //   break
    //       // case ServerMessageType.marketDataUpdate:
    //       //   break
    //     }
    //   } catch (err) {
    //     console.error(err)
    //   }
    // }
  }

  disconnect = () => {
    this.connection?.close()
  }

  send = (message: ClientEnvelope) => {
    this.connection?.send(JSON.stringify(message))
  }

  subscribeMarketData = (instrument: Instrument) => {
    this.send({
      messageType: ClientMessageType.subscribeMarketData,
      message: {
        instrument,
      },
    })
  }

  unsubscribeMarketData = (subscriptionId: string) => {
    this.send({
      messageType: ClientMessageType.unsubscribeMarketData,
      message: {
        subscriptionId,
      },
    })
  }

  placeOrder = (
    instrument: Instrument,
    side: OrderSide,
    amount: Decimal,
    price: Decimal,
  ) => {
    this.send({
      messageType: ClientMessageType.placeOrder,
      message: {
        instrument,
        side,
        amount,
        price,
      },
    })
  }
}
