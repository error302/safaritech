const PAYPAL_API_URL = process.env.PAYPAL_API_URL || 'https://api-m.sandbox.paypal.com'
const PAYPAL_CLIENT_ID = process.env.PAYPAL_CLIENT_ID
const PAYPAL_CLIENT_SECRET = process.env.PAYPAL_CLIENT_SECRET
const PAYPAL_USD_TO_KES_RATE = Number(process.env.PAYPAL_USD_TO_KES_RATE || '130')

async function getPayPalAccessToken(): Promise<string> {
  if (!PAYPAL_CLIENT_ID || !PAYPAL_CLIENT_SECRET) {
    throw new Error('PayPal credentials not configured')
  }

  const credentials = Buffer.from(`${PAYPAL_CLIENT_ID}:${PAYPAL_CLIENT_SECRET}`).toString('base64')

  const response = await fetch(`${PAYPAL_API_URL}/v1/oauth2/token`, {
    method: 'POST',
    headers: {
      Authorization: `Basic ${credentials}`,
      'Content-Type': 'application/x-www-form-urlencoded',
    },
    body: 'grant_type=client_credentials',
  })

  if (!response.ok) {
    const errorText = await response.text()
    console.error('PayPal OAuth token error:', errorText)
    throw new Error('Failed to get PayPal access token')
  }

  const data = await response.json()
  return data.access_token
}

export interface PayPalOrderResponse {
  paypalOrderId: string
  approvalUrl: string
}

export async function createPayPalOrder(orderId: string, amountKes: number): Promise<PayPalOrderResponse> {
  const token = await getPayPalAccessToken()
  const usdAmount = (amountKes / PAYPAL_USD_TO_KES_RATE).toFixed(2)

  const response = await fetch(`${PAYPAL_API_URL}/v2/checkout/orders`, {
    method: 'POST',
    headers: {
      Authorization: `Bearer ${token}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      intent: 'CAPTURE',
      purchase_units: [
        {
          reference_id: orderId,
          amount: {
            currency_code: 'USD',
            value: usdAmount,
          },
          description: `Safaritech Order ${orderId}`,
        },
      ],
      application_context: {
        brand_name: 'Safaritech',
        landing_page: 'NO_PREFERENCE',
        user_action: 'PAY_NOW',
        return_url: `${process.env.NEXTAUTH_URL}/checkout/paypal/success?orderId=${orderId}`,
        cancel_url: `${process.env.NEXTAUTH_URL}/checkout?orderId=${orderId}`,
      },
    }),
  })

  if (!response.ok) {
    const errorText = await response.text()
    console.error('PayPal create order error:', errorText)
    throw new Error('Failed to create PayPal order')
  }

  const data = await response.json()
  const approveLink = data.links?.find((link: any) => link.rel === 'approve')

  if (!approveLink) {
    throw new Error('No PayPal approval link found in response')
  }

  return {
    paypalOrderId: data.id,
    approvalUrl: approveLink.href,
  }
}

export async function capturePayPalOrder(paypalOrderId: string): Promise<boolean> {
  const token = await getPayPalAccessToken()

  const response = await fetch(`${PAYPAL_API_URL}/v2/checkout/orders/${paypalOrderId}/capture`, {
    method: 'POST',
    headers: {
      Authorization: `Bearer ${token}`,
      'Content-Type': 'application/json',
    },
  })

  if (!response.ok) {
    const errorText = await response.text()
    console.error('PayPal capture order error:', errorText)
    throw new Error('Failed to capture PayPal order')
  }

  const data = await response.json()
  return data.status === 'COMPLETED'
}
