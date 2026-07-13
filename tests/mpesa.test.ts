import assert from "node:assert/strict";
import test from "node:test";
import { initiateStkPush, normalizePhone } from "../src/lib/mpesa";
import { validateMpesaPayment } from "../src/lib/mpesa-callback";

const credentialKeys = [
  "MPESA_CONSUMER_KEY",
  "MPESA_CONSUMER_SECRET",
  "MPESA_SHORTCODE",
  "MPESA_PASSKEY",
  "MPESA_CALLBACK_URL",
  "MPESA_CALLBACK_SECRET",
] as const;

test("normalizes valid Kenyan phones and rejects invalid numbers", () => {
  assert.equal(normalizePhone("0712 345 678"), "254712345678");
  assert.throws(() => normalizePhone("12345"));
});

test("M-Pesa fails closed in production and only mocks when explicitly enabled", async () => {
  const originalNodeEnv = process.env.NODE_ENV;
  const originalMock = process.env.MPESA_ALLOW_MOCK;
  const originals = new Map(
    credentialKeys.map((key) => [key, process.env[key]])
  );
  for (const key of credentialKeys) delete process.env[key];

  Object.assign(process.env, { NODE_ENV: "production" });
  process.env.MPESA_ALLOW_MOCK = "true";
  const production = await initiateStkPush({
    phone: "0712345678",
    amount: 1_000,
    accountReference: "SFT-TEST",
    transactionDesc: "Test payment",
  });
  assert.equal(production.success, false);

  Object.assign(process.env, { NODE_ENV: "test" });
  process.env.MPESA_ALLOW_MOCK = "true";
  const development = await initiateStkPush({
    phone: "0712345678",
    amount: 1_000,
    accountReference: "SFT-TEST",
    transactionDesc: "Test payment",
  });
  assert.equal(development.success, true);
  assert.equal(development.mock, true);

  if (originalNodeEnv === undefined) Reflect.deleteProperty(process.env, "NODE_ENV");
  else Object.assign(process.env, { NODE_ENV: originalNodeEnv });
  if (originalMock === undefined) delete process.env.MPESA_ALLOW_MOCK;
  else process.env.MPESA_ALLOW_MOCK = originalMock;
  for (const [key, value] of originals) {
    if (value === undefined) delete process.env[key];
    else process.env[key] = value;
  }
});

test("validates callback amount, phone, and receipt", () => {
  const valid = validateMpesaPayment(
    [
      { Name: "Amount", Value: 5_000 },
      { Name: "MpesaReceiptNumber", Value: "ABC123" },
      { Name: "PhoneNumber", Value: 254712345678 },
    ],
    5_000,
    "254712345678"
  );
  assert.deepEqual(valid, {
    receipt: "ABC123",
    amount: 5_000,
    phone: "254712345678",
  });
  assert.equal(
    validateMpesaPayment(
      [
        { Name: "Amount", Value: 4_999 },
        { Name: "MpesaReceiptNumber", Value: "ABC123" },
        { Name: "PhoneNumber", Value: 254712345678 },
      ],
      5_000,
      "254712345678"
    ),
    null
  );
});
