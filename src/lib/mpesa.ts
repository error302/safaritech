/**
 * M-Pesa Daraja STK Push integration
 *
 * Environment variables (set in .env):
 *   MPESA_ENVIRONMENT=sandbox|production
 *   MPESA_CONSUMER_KEY=...
 *   MPESA_CONSUMER_SECRET=...
 *   MPESA_SHORTCODE=174379          (sandbox default)
 *   MPESA_PASSKEY=...
 *   MPESA_CALLBACK_URL=https://yourdomain.com/api/webhooks/mpesa
 *   MPESA_CALLBACK_SECRET=...
 *   MPESA_ALLOW_MOCK=true             (development only)
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
  const environment = process.env.MPESA_ENVIRONMENT;
  return !!(
    (environment === "sandbox" || environment === "production") &&
    process.env.MPESA_CONSUMER_KEY &&
    process.env.MPESA_CONSUMER_SECRET &&
    process.env.MPESA_SHORTCODE &&
    process.env.MPESA_PASSKEY &&
    process.env.MPESA_CALLBACK_URL &&
    process.env.MPESA_CALLBACK_SECRET
  );
}

function getBaseUrl(): string {
  return process.env.MPESA_ENVIRONMENT === "production"
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
    throw new Error(`Daraja OAuth failed with status ${res.status}`);
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
  let p = phone.replace(/[^\d+]/g, "").replace(/^\+/, "");

  // Convert 07XX / 01XX to 2547XX / 2541XX
  if (p.startsWith("0")) {
    p = "254" + p.slice(1);
  }
  // Convert 7XX / 1XX (missing leading 0) to 2547XX / 2541XX
  else if (p.startsWith("7") || p.startsWith("1")) {
    p = "254" + p;
  }
  if (!/^254[17]\d{8}$/.test(p)) {
    throw new Error("Enter a valid Kenyan mobile phone number");
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
 */
export async function initiateStkPush(params: {
  phone: string;
  amount: number;
  accountReference: string;
  transactionDesc: string;
}): Promise<StkPushResult> {
  const { phone, amount, accountReference, transactionDesc } = params;

  if (!isConfigured()) {
    if (
      process.env.NODE_ENV !== "production" &&
      process.env.MPESA_ALLOW_MOCK === "true"
    ) {
      return {
        success: true,
        merchantRequestId: `MOCK-MR-${Date.now()}`,
        checkoutRequestId: `MOCK-CR-${Date.now()}`,
        customerMessage: "Development mock STK push sent.",
        mock: true,
      };
    }
    return {
      success: false,
      error: "M-Pesa is not configured",
    };
  }

  try {
    if (!Number.isSafeInteger(amount) || amount <= 0) {
      return { success: false, error: "Invalid payment amount" };
    }

    const token = await getMpesaAccessToken();
    const { password, timestamp } = generatePassword();
    const partyA = normalizePhone(phone);
    const shortcode = process.env.MPESA_SHORTCODE!;

    const callbackUrl = new URL(process.env.MPESA_CALLBACK_URL!);
    if (
      process.env.MPESA_ENVIRONMENT === "production" &&
      callbackUrl.protocol !== "https:"
    ) {
      return { success: false, error: "M-Pesa callback URL must use HTTPS" };
    }
    callbackUrl.searchParams.set("token", process.env.MPESA_CALLBACK_SECRET!);

    const body = {
      BusinessShortCode: shortcode,
      Password: password,
      Timestamp: timestamp,
      TransactionType: "CustomerPayBillOnline",
      Amount: Math.round(amount),
      PartyA: partyA,
      PartyB: shortcode,
      PhoneNumber: partyA,
      CallBackURL: callbackUrl.toString(),
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
