import { Server } from 'mock-socket'
import { ClientEnvelope } from './Models/ClientMessages'
import { ClientMessageType, ServerMessageType } from './Enums'
import uuid from 'uuidv4'
import { MARKETS } from './mockConsts'
import { createOrder } from './store/helpers'
import { Orders } from './Models/ServerMessages'

export const fakeURL = 'ws://mock/'
const mockServer = new Server(fakeURL)
let subscribedMarkets: { intervalId: number; marketId: string }[] = []
const orders: Orders = []

function createMessage(messageType: ServerMessageType, message: object) {
  return JSON.stringify({ messageType: messageType, message: message })
}

mockServer.on('connection', socket => {
  setTimeout(() => socket.send(createMessage(ServerMessageType.ordersUpdate, orders)), 100)
  // socket.send(createMessage(ServerMessageType.ordersUpdate, orders))
  console.log('CONNECTED')

  socket.on('message', data => {
    if (typeof data !== 'string') {
      return socket.send(
        createMessage(ServerMessageType.error, {
          reason: 'Wrong message data format',
        }),
      )
    }

    let parsedData: ClientEnvelope = JSON.parse(data)
    let id: string

    switch (parsedData.messageType) {
      case ClientMessageType.subscribeMarketData:
        id = uuid()
        const marketUpdateIntervalId = setInterval(
          () => {
            socket.send(
              createMessage(ServerMessageType.marketDataUpdate, {
                subscriptionId: id,
                instrument: (
                  parsedData as ClientEnvelope<ClientMessageType.subscribeMarketData>
                ).message.instrument,
                quotes: [
                  MARKETS[
                    (
                      parsedData as ClientEnvelope<ClientMessageType.subscribeMarketData>
                    ).message.instrument
                  ],
                ],
              }),
            )
          },
          10000,
          true,
        )

        subscribedMarkets.push({
          intervalId: marketUpdateIntervalId,
          marketId: id,
        })

        socket.send(
          createMessage(ServerMessageType.success, { subscriptionId: id }),
        )
        break
      case ClientMessageType.unsubscribeMarketData:
        id = (
          parsedData as ClientEnvelope<ClientMessageType.unsubscribeMarketData>
        ).message.subscriptionId
        subscribedMarkets.filter(market => {
          const isUnsubscribeItem = market.marketId !== id

          if (isUnsubscribeItem) {
            clearInterval(market.intervalId)
          }

          return isUnsubscribeItem
        })
        socket.send(createMessage(ServerMessageType.success, {}))
        break
      case ClientMessageType.placeOrder:
        const { message } =
          parsedData as ClientEnvelope<ClientMessageType.placeOrder>
        const order = createOrder(
          message.side,
          message.amount,
          message.instrument,
          message.price,
        )

        orders.push(order)
        socket.send(
          createMessage(ServerMessageType.executionReport, {
            orderId: order.id,
            orderStatues: order.status,
          }),
        )
        socket.send(createMessage(ServerMessageType.ordersUpdate, orders))
        break
    }
  })

  mockServer.on('close', () => {
    for (const market of subscribedMarkets) {
      clearInterval(market.intervalId)
    }
    subscribedMarkets = []
  })
})
