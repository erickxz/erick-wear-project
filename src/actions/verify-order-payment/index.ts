"use server";

import { eq } from "drizzle-orm";
import Stripe from "stripe";

import { db } from "@/db";
import { orderTable } from "@/db/schema";

export const verifyOrderPayment = async (sessionId: string) => {
  if (!process.env.STRIPE_SECRET_KEY) {
    throw new Error("Stripe secret key is not set");
  }

  const stripe = new Stripe(process.env.STRIPE_SECRET_KEY);

  try {
    const session = await stripe.checkout.sessions.retrieve(sessionId);

    if (session.payment_status === "paid") {
      const orderId = session.metadata?.orderId;

      if (!orderId) {
        throw new Error("Order ID not found in session metadata");
      }

      await db
        .update(orderTable)
        .set({ status: "paid" })
        .where(eq(orderTable.id, orderId));

      return { success: true };
    }
  } catch (error) {
    console.error("Error verifying payment:", error);
  }

  return { success: false };
};
