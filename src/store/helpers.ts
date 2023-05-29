import { Instrument, OrderSide, OrderStatus, ServerMessageType } from '../Enums'
import { ServerEnvelope, SuccessInfo } from '../Models/ServerMessages'
import uuid from 'uuidv4'
import Decimal from 'decimal.js';
import { Order } from '../Models/Base';
import WSConnector from '../WSClient';

export const client = new WSConnector()

export function waitForResponse(
  messageType: ServerMessageType,
): Promise<ServerEnvelope<ServerMessageType>> {
  return new Promise((resolve, reject) => {
    client.connection?.addEventListener('message', (event: MessageEvent) => {
      try {
        const message: ServerEnvelope = JSON.parse(event.data)

        if (message.messageType === messageType) {
          resolve(message)
        }
      } catch (err) {
        console.error(err)
        reject(err)
      }
    })
  })
}

export async function waitForSubscribeResponse(): Promise<SuccessInfo> {
  const response = await Promise.race([
    waitForResponse(ServerMessageType.success),
    waitForResponse(ServerMessageType.error),
  ])

  if (response.messageType === ServerMessageType.success) {
    return (response as ServerEnvelope<ServerMessageType.success>).message
  } else {
    throw Error(response.message.toString()) // TODO: Fix type
  }
}

export function connect() {
  return new Promise<void>((resolve, reject) =>
    client.connect(
      () => resolve(),
      () => reject(),
    ),
  )
}

export function createOrder(
  side: OrderSide,
  amount: Decimal,
  instrument: Instrument,
  price: Decimal
): Order {
  const currentDate = new Date().toISOString()

  return {
    id: uuid(),
    creationDate: currentDate,
    changeDate: currentDate,
    status: OrderStatus.active,
    side,
    amount,
    instrument,
    price
  }
}
