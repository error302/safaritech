import Stripe from 'stripe'

let stripeInstance: Stripe | null = null

function getStripe() {
  if (!stripeInstance) {
    const key = process.env.STRIPE_SECRET_KEY
    if (!key) {
      throw new Error('STRIPE_SECRET_KEY is not set')
    }
    stripeInstance = new Stripe(key) as unknown as Stripe
  }
  return stripeInstance
}

export async function createPaymentIntent(amount: number, metadata: Record<string, string>) {
  const stripe = getStripe()
  const paymentIntent = await stripe.paymentIntents.create({
    amount,
    currency: 'kes',
    metadata,
    automatic_payment_methods: {
      enabled: true,
    },
  })

  return paymentIntent
}

export async function createCustomer(email: string, name: string) {
  const stripe = getStripe()
  const customer = await stripe.customers.create({
    email,
    name,
  })

  return customer
}

export async function retrievePaymentIntent(paymentIntentId: string) {
  const stripe = getStripe()
  const paymentIntent = await stripe.paymentIntents.retrieve(paymentIntentId)
  return paymentIntent
}

export async function constructWebhookEvent(payload: Buffer, signature: string) {
  const stripe = getStripe()
  const webhookSecret = process.env.STRIPE_WEBHOOK_SECRET || ''
  return stripe.webhooks.constructEvent(payload, signature, webhookSecret)
}
