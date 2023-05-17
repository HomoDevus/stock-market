import { ServerMessageType } from '../Enums'
import { SubscribeMarketDataSuccess } from '../Models/ServerMessages'
import WSConnector from '../WSClient'

export const client = new WSConnector()

export function waitForResponse(
  messageType: ServerMessageType,
): Promise<SubscribeMarketDataSuccess> {
  return new Promise((resolve, reject) => {
    client.connection?.addEventListener('message', event => {
      try {
        const message: SubscribeMarketDataSuccess = JSON.parse(event.data)

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

export async function waitForSubscribeResponse() {
  const response = await Promise.race([
    waitForResponse(ServerMessageType.success),
    waitForResponse(ServerMessageType.error),
  ])

  if (response.messageType === ServerMessageType.success) {
    return response.message.subscriptionId
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
