"use server";

import { desc } from "drizzle-orm";
import { headers } from "next/headers";

import { db } from "@/db";
import { orderTable } from "@/db/schema";
import { auth } from "@/lib/auth";

export const getOrders = async () => {
  const session = await auth.api.getSession({
    headers: await headers(),
  });
  if (!session?.user) {
    throw new Error("Unauthorized");
  }
  const orders = await db.query.orderTable.findMany({
    where: (order, { eq }) => eq(order.userId, session.user.id),
    orderBy: [desc(orderTable.createdAt)],
    with: {
      items: {
        with: {
          productVariant: {
            with: {
              product: true,
            },
          },
        },
      },
    },
  });
  return orders;
};
