"use server";

import { eq } from "drizzle-orm";
import { headers } from "next/headers";
import Stripe from "stripe";

import { db } from "@/db";
import { orderItemTable, orderTable } from "@/db/schema";
import { auth } from "@/lib/auth";

import {
  CreateCheckoutSessionSchema,
  createCheckoutSessionSchema,
} from "./schema";

export const createCheckoutSession = async (data: CreateCheckoutSessionSchema) => {
  // ⚠️ Verifica se a chave do Stripe existe
  if (!process.env.STRIPE_SECRET_KEY) {
    throw new Error("Stripe secret key is not set");
  }

  // 🔐 Obtém o usuário autenticado
  const session = await auth.api.getSession({
    headers: await headers(),
  });

  if (!session?.user) {
    throw new Error("Unauthorized");
  }

  // 🧾 Valida os dados recebidos
  const { orderId } = createCheckoutSessionSchema.parse(data);

  const order = await db.query.orderTable.findFirst({
    where: eq(orderTable.id, orderId),
  });

  if (!order) {
    throw new Error("Order not found");
  }

  if (order.userId !== session.user.id) {
    throw new Error("Unauthorized");
  }

  // 🛒 Busca os itens do pedido
  const orderItems = await db.query.orderItemTable.findMany({
    where: eq(orderItemTable.orderId, orderId),
    with: {
      productVariant: { with: { product: true } },
    },
  });

  // 💳 Inicializa o Stripe com a versão da API atual
  const stripe = new Stripe(process.env.STRIPE_SECRET_KEY, {
    apiVersion: "2025-09-30.clover",
  });

  // 🧾 Cria a sessão de checkout
  const checkoutSession = await stripe.checkout.sessions.create({
    mode: "payment",
    payment_method_types: ["card"],
    success_url: `${process.env.NEXT_PUBLIC_APP_URL}/checkout/success?orderId=${orderId}&session_id={CHECKOUT_SESSION_ID}`,
    cancel_url: `${process.env.NEXT_PUBLIC_APP_URL}/`,
    metadata: {
      orderId,
    },
    line_items: orderItems.map((orderItem) => ({
      price_data: {
        currency: "brl",
        product_data: {
          name: `${orderItem.productVariant.product.name} - ${orderItem.productVariant.name}`,
          description: orderItem.productVariant.product.description ?? "",
          images: orderItem.productVariant.imageUrl
            ? [orderItem.productVariant.imageUrl]
            : [],
        },
        // Valor em centavos
        unit_amount: orderItem.priceInCents,
      },
      quantity: orderItem.quantity,
    })),
  });

  // 🔥 Conversão para objeto simples (evita erro no Next)
  return JSON.parse(JSON.stringify(checkoutSession));
};
