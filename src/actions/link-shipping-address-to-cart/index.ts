"use server";

import { eq } from "drizzle-orm";
import { headers } from "next/headers";

import { db } from "@/db";
import { cartTable } from "@/db/schema";
import { auth } from "@/lib/auth";

export const linkShippingAddressToCart = async (shippingAddressId: string) => {
  const session = await auth.api.getSession({
    headers: await headers(),
  });
  
  if (!session?.user) {
    throw ("Usuário não autenticado");
  }

  // Verificar se o endereço de entrega existe e pertence ao usuário
  const shippingAddress = await db.query.shippingAddressTable.findFirst({
    where: (address, { eq, and }) => 
      and(
        eq(address.id, shippingAddressId),
        eq(address.userId, session.user.id)
      ),
  });

  if (!shippingAddress) {
    throw ("Endereço de entrega não encontrado ou não pertence ao usuário");
  }

  // Buscar o carrinho do usuário
  const cart = await db.query.cartTable.findFirst({
    where: (cart, { eq }) => eq(cart.userId, session.user.id),
    with: {
      items: true,
    },
  });

  if (!cart) {
    throw ("Carrinho não encontrado");
  }

  if (cart.items.length === 0) {
    throw ("Não é possível vincular endereço a um carrinho vazio");
  }

  // Verificar se já existe um endereço vinculado
  if (cart.shippingAddressId) {
    if (cart.shippingAddressId === shippingAddressId) {
      return { 
        success: true, 
        message: "Este endereço já está vinculado ao carrinho" 
      };
    }
    
    // Atualizar o carrinho com o novo shippingAddressId
    await db
      .update(cartTable)
      .set({ shippingAddressId })
      .where(eq(cartTable.id, cart.id));

    return { 
      success: true, 
      message: "Endereço de entrega atualizado com sucesso" 
    };
  }

  // Vincular o endereço ao carrinho pela primeira vez
  await db
    .update(cartTable)
    .set({ shippingAddressId })
    .where(eq(cartTable.id, cart.id));

  return { 
    success: true, 
    message: "Endereço de entrega vinculado com sucesso" 
  };
};
