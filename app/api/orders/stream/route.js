import { addSSEClient, removeSSEClient } from "@/lib/sse"

export const runtime = "nodejs"
export const dynamic = "force-dynamic"

export async function GET(req) {
  const { searchParams } = new URL(req.url)
  const restaurantId = searchParams.get("restaurantId")

  if (!restaurantId) {
    return new Response("Restaurant ID required", { status: 400 })
  }

  const clientId = `${restaurantId}-${Date.now()}-${Math.random()}`

  const stream = new ReadableStream({
    start(controller) {
      // Register this client
      addSSEClient(restaurantId, clientId, controller)

      // Send initial connection message
      const connectMsg = `event: connected\ndata: ${JSON.stringify({
        message: "SSE connected",
        clientId,
      })}\n\n`
      controller.enqueue(new TextEncoder().encode(connectMsg))

      // Keep-alive ping every 30 seconds
      const pingInterval = setInterval(() => {
        try {
          controller.enqueue(new TextEncoder().encode(`: ping\n\n`))
        } catch {
          clearInterval(pingInterval)
          removeSSEClient(restaurantId, clientId)
        }
      }, 30000)

      // Cleanup on close
      req.signal.addEventListener("abort", () => {
        clearInterval(pingInterval)
        removeSSEClient(restaurantId, clientId)
      })
    },
  })

  return new Response(stream, {
    headers: {
      "Content-Type": "text/event-stream",
      "Cache-Control": "no-cache",
      Connection: "keep-alive",
      "Access-Control-Allow-Origin": "*",
    },
  })
}