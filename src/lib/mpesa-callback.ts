import { normalizePhone } from "@/lib/mpesa";

export interface MpesaCallbackItem {
  Name: string;
  Value?: string | number;
}

function metadataValue(
  items: MpesaCallbackItem[],
  name: string
): string | number | undefined {
  return items.find((item) => item.Name === name)?.Value;
}

export function validateMpesaPayment(
  items: MpesaCallbackItem[],
  expectedAmount: number,
  expectedPhone: string
): { receipt: string; amount: number; phone: string } | null {
  const receiptValue = metadataValue(items, "MpesaReceiptNumber");
  const amountValue = metadataValue(items, "Amount");
  const phoneValue = metadataValue(items, "PhoneNumber");
  const receipt = typeof receiptValue === "string" ? receiptValue.trim() : "";
  const amount = Number(amountValue);

  let phone: string;
  try {
    phone = normalizePhone(String(phoneValue ?? ""));
  } catch {
    return null;
  }

  if (
    !receipt ||
    !Number.isSafeInteger(amount) ||
    amount !== expectedAmount ||
    phone !== expectedPhone
  ) {
    return null;
  }

  return { receipt, amount, phone };
}
