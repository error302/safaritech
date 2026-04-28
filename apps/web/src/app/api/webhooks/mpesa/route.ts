import { NextResponse } from 'next/server'
import { prisma } from '@/server/db'

interface MpesaCallback {
  Body: {
    stkCallback: {
      CheckoutRequestID: string
      MerchantRequestID: string
      ResultCode: number
      ResultDesc: string
      CallbackMetadata?: {
        Item: Array<{
          Name: string
          Value: string | number
        }>
      }
    }
  }
}

export async function POST(req: Request) {
  try {
    const body: MpesaCallback = await req.json()
    const { stkCallback } = body.Body

    const order = await prisma.order.findFirst({
      where: { mpesaRef: stkCallback.CheckoutRequestID },
    })

    if (!order) {
      console.error('Order not found for M-Pesa callback:', stkCallback.CheckoutRequestID)
      return NextResponse.json({ error: 'Order not found' }, { status: 404 })
    }

    if (stkCallback.ResultCode === 0) {
      const metadata = stkCallback.CallbackMetadata?.Item || []
      const receiptNumber = metadata.find((item) => item.Name === 'MpesaReceiptNumber')?.Value

      await prisma.order.update({
        where: { id: order.id },
        data: {
          paymentStatus: 'PAID',
          status: 'PROCESSING',
          mpesaRef: String(receiptNumber || stkCallback.CheckoutRequestID),
        },
      })

      console.log(`Payment successful for order ${order.id}`)
    } else {
      await prisma.order.update({
        where: { id: order.id },
        data: {
          paymentStatus: 'FAILED',
        },
      })

      console.log(`Payment failed for order ${order.id}:`, stkCallback.ResultDesc)
    }

    return NextResponse.json({ received: true })
  } catch (err) {
    console.error('M-Pesa webhook error:', err)
    return NextResponse.json({ error: 'Webhook error' }, { status: 400 })
  }
}
