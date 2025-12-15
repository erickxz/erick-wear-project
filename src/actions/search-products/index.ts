"use server";

import { ilike, sql } from "drizzle-orm";

import { db } from "@/db";
import { productTable } from "@/db/schema";

export const searchProducts = async (query: string) => {
  if (!query || query.length < 2) {
    return [];
  }

  try {
    // Tenta buscar ignorando acentos (requer extensão unaccent no Postgres)
    return await db.query.productTable.findMany({
      where: sql`unaccent(${productTable.name}) ILIKE unaccent(${`%${query}%`})`,
      with: {
        variants: {
          limit: 1,
        },
      },
      limit: 5,
    });
  } catch {
    // Fallback para busca normal caso a extensão não exista
    return await db.query.productTable.findMany({
      where: ilike(productTable.name, `%${query}%`),
      with: {
        variants: {
          limit: 1,
        },
      },
      limit: 5,
    });
  }
};
