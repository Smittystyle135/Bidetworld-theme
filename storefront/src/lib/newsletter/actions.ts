"use server";

import { randomBytes } from "node:crypto";
import { shopifyFetch } from "@/lib/shopify/client";

export type SubscribeState = { status: "idle" | "success" | "error"; message?: string };

const CUSTOMER_CREATE = /* GraphQL */ `
  mutation NewsletterSignup($input: CustomerCreateInput!) {
    customerCreate(input: $input) {
      customer {
        id
      }
      customerUserErrors {
        code
        message
      }
    }
  }
`;

export async function subscribeAction(_prev: SubscribeState, formData: FormData): Promise<SubscribeState> {
  const email = String(formData.get("email") ?? "").trim();
  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
    return { status: "error", message: "Please enter a valid email address." };
  }

  try {
    const data = await shopifyFetch<{
      customerCreate: { customer: { id: string } | null; customerUserErrors: { code: string; message: string }[] };
    }>({
      query: CUSTOMER_CREATE,
      variables: {
        input: { email, password: randomBytes(24).toString("base64url"), acceptsMarketing: true },
      },
      revalidate: false,
    });

    const errors = data.customerCreate.customerUserErrors;
    if (errors.some((e) => e.code === "TAKEN")) {
      return { status: "success", message: "You're already on the list. Use code NEWCUSTOMER at checkout." };
    }
    if (errors.length) {
      return { status: "error", message: errors[0].message };
    }
    return { status: "success", message: "You're in! Use code NEWCUSTOMER at checkout for 10% off." };
  } catch {
    return { status: "error", message: "Something went wrong. Please try again in a moment." };
  }
}
