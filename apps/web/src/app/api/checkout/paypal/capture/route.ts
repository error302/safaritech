import { NextResponse } from 'next/server'
import { prisma } from '@/server/db'
import { capturePayPalOrder } from '@/lib/paypal'

export async function POST(req: Request) {
  try {
    const { orderId, paypalOrderId } = await req.json()

    if (!orderId || !paypalOrderId) {
      return NextResponse.json(
        { error: 'Order ID and PayPal Order ID are required' },
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

    if (order.paypalOrderId !== paypalOrderId) {
      return NextResponse.json(
        { error: 'PayPal Order ID mismatch' },
        { status: 400 }
      )
    }

    if (order.paymentStatus === 'PAID') {
      return NextResponse.json({ success: true, message: 'Order is already paid' })
    }

    // Capture the PayPal payment
    const captureResult = await capturePayPalOrder(paypalOrderId)

    if (captureResult) {
      // Update order status to paid
      await prisma.order.update({
        where: { id: orderId },
        data: {
          paymentStatus: 'PAID',
          status: 'PROCESSING',
        },
      })

      return NextResponse.json({ success: true })
    } else {
      await prisma.order.update({
        where: { id: orderId },
        data: {
          paymentStatus: 'FAILED',
        },
      })
      return NextResponse.json(
        { error: 'PayPal payment capture failed or was not completed' },
        { status: 400 }
      )
    }
  } catch (error: any) {
    console.error('PayPal capture error:', error)
    return NextResponse.json(
      { error: error.message || 'Failed to capture PayPal payment' },
      { status: 500 }
    )
  }
}
