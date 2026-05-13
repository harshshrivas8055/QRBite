if (!global.sseClients) {
  global.sseClients = new Map()
}

const sseClients = global.sseClients

export function addSSEClient(restaurantId, clientId, controller) {
  if (!sseClients.has(restaurantId)) {
    sseClients.set(restaurantId, new Map())
  }
  sseClients.get(restaurantId).set(clientId, controller)
  console.log(
    `✅ SSE connected: ${clientId} | restaurant: ${restaurantId} | total: ${sseClients.get(restaurantId).size}`
  )
}

export function removeSSEClient(restaurantId, clientId) {
  if (sseClients.has(restaurantId)) {
    sseClients.get(restaurantId).delete(clientId)
    if (sseClients.get(restaurantId).size === 0) {
      sseClients.delete(restaurantId)
    }
  }
  console.log(`🔌 SSE disconnected: ${clientId}`)
}

export function sendSSEEvent(restaurantId, eventType, data) {
  if (!sseClients.has(restaurantId)) {
    console.log(`⚠️ No SSE clients for restaurant: ${restaurantId}`)
    return
  }

  const clients = sseClients.get(restaurantId)
  const message = `event: ${eventType}\ndata: ${JSON.stringify(data)}\n\n`
  console.log(
    `📡 SSE event: "${eventType}" → ${clients.size} client(s)`
  )

  clients.forEach((controller, clientId) => {
    try {
      controller.enqueue(new TextEncoder().encode(message))
    } catch (error) {
      console.error(`❌ SSE send failed for ${clientId}:`, error.message)
      removeSSEClient(restaurantId, clientId)
    }
  })
}

export function getClientCount(restaurantId) {
  return sseClients.get(restaurantId)?.size || 0
}

// // SSE Connection Manager
// // Uses global singleton to survive Next.js hot reloads in dev mode
// // Without this, sseClients Map resets on every file change = all connections lost

// if (!global.sseClients) {
//   global.sseClients = new Map()
// }

// const sseClients = global.sseClients

// // Add a new SSE client connection
// export function addSSEClient(restaurantId, clientId, controller) {
//   if (!sseClients.has(restaurantId)) {
//     sseClients.set(restaurantId, new Map())
//   }
//   sseClients.get(restaurantId).set(clientId, controller)
//   console.log(
//     `✅ SSE client connected: ${clientId} | restaurant: ${restaurantId} | total clients: ${sseClients.get(restaurantId).size}`
//   )
// }

// // Remove SSE client on disconnect
// export function removeSSEClient(restaurantId, clientId) {
//   if (sseClients.has(restaurantId)) {
//     sseClients.get(restaurantId).delete(clientId)
//     if (sseClients.get(restaurantId).size === 0) {
//       sseClients.delete(restaurantId)
//     }
//   }
//   console.log(`🔌 SSE client disconnected: ${clientId}`)
// }

// // Send event to all clients of a restaurant
// export function sendSSEEvent(restaurantId, eventType, data) {
//   if (!sseClients.has(restaurantId)) {
//     console.log(`⚠️ SSE: No clients connected for restaurant: ${restaurantId}`)
//     return
//   }

//   const clients = sseClients.get(restaurantId)
//   const message = `event: ${eventType}\ndata: ${JSON.stringify(data)}\n\n`

//   console.log(
//     `📡 SSE sending event: "${eventType}" to ${clients.size} client(s) for restaurant: ${restaurantId}`
//   )

//   clients.forEach((controller, clientId) => {
//     try {
//       controller.enqueue(new TextEncoder().encode(message))
//     } catch (error) {
//       console.error(`❌ SSE failed to send to client ${clientId}:`, error.message)
//       removeSSEClient(restaurantId, clientId)
//     }
//   })
// }

// // Send ping to keep connections alive
// export function sendPing(restaurantId) {
//   if (!sseClients.has(restaurantId)) return
//   const clients = sseClients.get(restaurantId)
//   const ping = `: ping\n\n`
//   clients.forEach((controller, clientId) => {
//     try {
//       controller.enqueue(new TextEncoder().encode(ping))
//     } catch {
//       removeSSEClient(restaurantId, clientId)
//     }
//   })
// }

// // Get connected client count for a restaurant
// export function getClientCount(restaurantId) {
//   return sseClients.get(restaurantId)?.size || 0
// }