const MPESA_BASE_URL = 'https://api.safaricom.co.ke'
const MPESA_SANDBOX_URL = 'https://sandbox.safaricom.co.ke'

function getBaseUrl() {
  return process.env.NODE_ENV === 'production' ? MPESA_BASE_URL : MPESA_SANDBOX_URL
}

async function getAccessToken(): Promise<string> {
  const consumerKey = process.env.MPESA_CONSUMER_KEY
  const consumerSecret = process.env.MPESA_CONSUMER_SECRET

  if (!consumerKey || !consumerSecret) {
    throw new Error('M-Pesa credentials not configured')
  }

  const credentials = Buffer.from(`${consumerKey}:${consumerSecret}`).toString('base64')

  const response = await fetch(`${getBaseUrl()}/oauth/v1/generate?grant_type=client_credentials`, {
    method: 'GET',
    headers: {
      Authorization: `Basic ${credentials}`,
    },
  })

  const data = await response.json()

  if (data.access_token) {
    return data.access_token
  }

  throw new Error('Failed to get M-Pesa access token')
}

export interface STKPushParams {
  phoneNumber: string
  amount: number
  accountReference: string
  transactionDesc: string
  callbackUrl: string
}

export interface STKPushResponse {
  CheckoutRequestID: string
  MerchantRequestID: string
  ResponseCode: string
  ResponseDescription: string
  CustomerMessage: string
}

export async function initiateSTKPush(params: STKPushParams): Promise<STKPushResponse> {
  const token = await getAccessToken()
  const shortcode = process.env.MPESA_SHORTCODE
  const passkey = process.env.MPESA_PASSKEY

  if (!shortcode || !passkey) {
    throw new Error('M-Pesa shortcode or passkey not configured')
  }

  const timestamp = new Date().toISOString().replace(/[^0-9]/g, '').slice(0, 14)
  const password = Buffer.from(`${shortcode}${passkey}${timestamp}`).toString('base64')

  const requestBody = {
    BusinessShortCode: shortcode,
    Password: password,
    Timestamp: timestamp,
    TransactionType: 'CustomerBuyGoodsOnline',
    Amount: params.amount,
    PartyA: params.phoneNumber.replace('+254', '254'),
    PartyB: shortcode,
    PhoneNumber: params.phoneNumber.replace('+254', '254'),
    CallBackURL: params.callbackUrl,
    AccountReference: params.accountReference,
    TransactionDesc: params.transactionDesc,
  }

  const response = await fetch(`${getBaseUrl()}/mpesa/stkpush/v1/processrequest`, {
    method: 'POST',
    headers: {
      Authorization: `Bearer ${token}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(requestBody),
  })

  const data = await response.json()

  if (data.ResponseCode === '0') {
    return {
      CheckoutRequestID: data.CheckoutRequestID,
      MerchantRequestID: data.MerchantRequestID,
      ResponseCode: data.ResponseCode,
      ResponseDescription: data.ResponseDescription,
      CustomerMessage: data.CustomerMessage,
    }
  }

  throw new Error(data.ResponseDescription || 'STK Push failed')
}

export interface QueryStatusParams {
  checkoutRequestId: string
}

export interface QueryStatusResponse {
  ResponseCode: string
  ResponseDescription: string
  MerchantRequestID: string
  CheckoutRequestID: string
  ResultCode: string
  ResultDesc: string
}

export async function querySTKStatus(params: QueryStatusParams): Promise<QueryStatusResponse> {
  const token = await getAccessToken()
  const shortcode = process.env.MPESA_SHORTCODE
  const passkey = process.env.MPESA_PASSKEY

  if (!shortcode || !passkey) {
    throw new Error('M-Pesa shortcode or passkey not configured')
  }

  const timestamp = new Date().toISOString().replace(/[^0-9]/g, '').slice(0, 14)
  const password = Buffer.from(`${shortcode}${passkey}${timestamp}`).toString('base64')

  const requestBody = {
    BusinessShortCode: shortcode,
    Password: password,
    Timestamp: timestamp,
    CheckoutRequestID: params.checkoutRequestId,
  }

  const response = await fetch(`${getBaseUrl()}/mpesa/stkpushquery/v1/query`, {
    method: 'POST',
    headers: {
      Authorization: `Bearer ${token}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(requestBody),
  })

  return response.json()
}
