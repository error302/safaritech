import { NextResponse } from 'next/server'
import { prisma } from '@/server/db'
import { createPayPalOrder } from '@/lib/paypal'

export async function POST(req: Request) {
  try {
    const { orderId, amount } = await req.json()

    if (!orderId || !amount) {
      return NextResponse.json(
        { error: 'Order ID and amount are required' },
        { status: 400 }
      )
    }

    // Get order details
    const order = await prisma.order.findUnique({
      where: { id: orderId },
    })

    if (!order) {
      return NextResponse.json(
        { error: 'Order not found' },
        { status: 404 }
      )
    }

    // Initiate PayPal order creation
    const { paypalOrderId, approvalUrl } = await createPayPalOrder(order.id, Number(amount))

    // Update order with PayPal order ID
    await prisma.order.update({
      where: { id: orderId },
      data: {
        paypalOrderId: paypalOrderId,
      },
    })

    return NextResponse.json({ url: approvalUrl })
  } catch (error: any) {
    console.error('PayPal checkout creation error:', error)
    return NextResponse.json(
      { error: error.message || 'Failed to create PayPal checkout session' },
      { status: 500 }
    )
  }
}
