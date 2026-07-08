/**
 * M-Pesa Daraja STK Push integration
 *
 * Environment variables (set in .env):
 *   MPESA_ENV=sandbox|production
 *   MPESA_CONSUMER_KEY=...
 *   MPESA_CONSUMER_SECRET=...
 *   MPESA_SHORTCODE=174379          (sandbox default)
 *   MPESA_PASSKEY=...
 *   MPESA_CALLBACK_URL=https://yourdomain.com/api/webhooks/mpesa
 *
 * If credentials are missing, the functions fall back to a mock mode
 * that simulates a successful STK push — useful for development.
 */

interface DarajaTokenResponse {
  access_token: string;
  expires_in: string;
}

interface StkPushResponse {
  MerchantRequestID: string;
  CheckoutRequestID: string;
  ResponseCode: string;
  ResponseDescription: string;
  CustomerMessage: string;
}

function isConfigured(): boolean {
  return !!(
    process.env.MPESA_CONSUMER_KEY &&
    process.env.MPESA_CONSUMER_SECRET &&
    process.env.MPESA_SHORTCODE &&
    process.env.MPESA_PASSKEY
  );
}

function getBaseUrl(): string {
  return process.env.MPESA_ENV === "production"
    ? "https://api.safaricom.co.ke"
    : "https://sandbox.safaricom.co.ke";
}

/** Get OAuth access token from Daraja */
export async function getMpesaAccessToken(): Promise<string> {
  if (!isConfigured()) {
    throw new Error("M-Pesa not configured");
  }

  const auth = Buffer.from(
    `${process.env.MPESA_CONSUMER_KEY}:${process.env.MPESA_CONSUMER_SECRET}`
  ).toString("base64");

  const url = `${getBaseUrl()}/oauth/v1/generate?grant_type=client_credentials`;

  const res = await fetch(url, {
    method: "GET",
    headers: {
      Authorization: `Basic ${auth}`,
    },
  });

  if (!res.ok) {
    const body = await res.text();
    throw new Error(`Daraja OAuth failed: ${res.status} ${body}`);
  }

  const data: DarajaTokenResponse = await res.json();
  return data.access_token;
}

/** Generate the password (Base64(Shortcode + Passkey + Timestamp)) */
function generatePassword(): { password: string; timestamp: string } {
  const shortcode = process.env.MPESA_SHORTCODE!;
  const passkey = process.env.MPESA_PASSKEY!;
  const timestamp = new Date()
    .toISOString()
    .replace(/[-:T]/g, "")
    .slice(0, 14);

  const password = Buffer.from(`${shortcode}${passkey}${timestamp}`).toString(
    "base64"
  );

  return { password, timestamp };
}

/** Normalize a Kenyan phone number to 254XXXXXXXXX format */
export function normalizePhone(phone: string): string {
  let p = phone.replace(/\s+/g, "").replace(/^\+/, "");

  // Convert 07XX / 01XX to 2547XX / 2541XX
  if (p.startsWith("0")) {
    p = "254" + p.slice(1);
  }
  // Convert 7XX / 1XX (missing leading 0) to 2547XX / 2541XX
  else if (p.startsWith("7") || p.startsWith("1")) {
    p = "254" + p;
  }
  // Already 254...
  else if (p.startsWith("254")) {
    // ok
  }
  // Handle +254 already stripped
  else {
    p = "254" + p;
  }

  return p;
}

export interface StkPushResult {
  success: boolean;
  merchantRequestId?: string;
  checkoutRequestId?: string;
  customerMessage?: string;
  mock?: boolean;
  error?: string;
}

/**
 * Initiate an STK Push prompt to the customer's phone.
 * Falls back to mock mode if M-Pesa credentials are not configured.
 */
export async function initiateStkPush(params: {
  phone: string;
  amount: number;
  accountReference: string;
  transactionDesc: string;
}): Promise<StkPushResult> {
  const { phone, amount, accountReference, transactionDesc } = params;

  // Mock mode — simulate success for development
  if (!isConfigured()) {
    console.warn(
      "[M-Pesa] Running in MOCK mode. Set MPESA_CONSUMER_KEY, MPESA_CONSUMER_SECRET, " +
        "MPESA_SHORTCODE, MPESA_PASSKEY in .env to enable real Daraja STK Push."
    );
    await new Promise((r) => setTimeout(r, 1500)); // simulate network
    return {
      success: true,
      merchantRequestId: `MOCK-MR-${Date.now()}`,
      checkoutRequestId: `MOCK-CR-${Date.now()}`,
      customerMessage: "Mock STK push sent. (Configure M-Pesa credentials for real prompts.)",
      mock: true,
    };
  }

  try {
    const token = await getMpesaAccessToken();
    const { password, timestamp } = generatePassword();
    const partyA = normalizePhone(phone);
    const shortcode = process.env.MPESA_SHORTCODE!;

    const body = {
      BusinessShortCode: shortcode,
      Password: password,
      Timestamp: timestamp,
      TransactionType: "CustomerPayBillOnline",
      Amount: Math.round(amount),
      PartyA: partyA,
      PartyB: shortcode,
      PhoneNumber: partyA,
      CallBackURL: process.env.MPESA_CALLBACK_URL || "https://safaritech.co.ke/api/webhooks/mpesa",
      AccountReference: accountReference.slice(0, 12),
      TransactionDesc: transactionDesc.slice(0, 13),
    };

    const url = `${getBaseUrl()}/mpesa/stkpush/v1/processrequest`;

    const res = await fetch(url, {
      method: "POST",
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify(body),
    });

    const data: StkPushResponse = await res.json();

    if (data.ResponseCode === "0") {
      return {
        success: true,
        merchantRequestId: data.MerchantRequestID,
        checkoutRequestId: data.CheckoutRequestID,
        customerMessage: data.CustomerMessage,
      };
    }

    return {
      success: false,
      error: data.ResponseDescription || "STK push failed",
    };
  } catch (err) {
    return {
      success: false,
      error: err instanceof Error ? err.message : "M-Pesa request failed",
    };
  }
}

export { isConfigured as isMpesaConfigured };
