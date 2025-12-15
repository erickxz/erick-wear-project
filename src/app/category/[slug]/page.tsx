import { eq } from "drizzle-orm";
import { notFound } from "next/navigation";

import { Header } from "@/components/common/header";
import ProductItem from "@/components/common/product-item";
import { db } from "@/db";
import { categoryTable, productTable } from "@/db/schema";

import { CategoryFilters } from "./_components/category-filters";

export const dynamic = "force-dynamic";

interface CategoryPageProps {
  params: Promise<{ slug: string }>;
  searchParams: Promise<{ q?: string; minPrice?: string; maxPrice?: string }>;
}

const CategoryPage = async ({ params, searchParams }: CategoryPageProps) => {
  const { slug } = await params;
  const { q, minPrice, maxPrice } = await searchParams;

  const category = await db.query.categoryTable.findFirst({
    where: eq(categoryTable.slug, slug),
  });

  if (!category) {
    notFound();
  }

  const allProducts = await db.query.productTable.findMany({
    where: eq(productTable.categoryId, category.id),
    with: {
      variants: true,
    },
  });

  // Filter products based on search params
  const products = allProducts.filter((product) => {
    // Text Search
    if (q) {
      const searchLower = q.toLowerCase();
      const matchesName = product.name.toLowerCase().includes(searchLower);
      if (!matchesName) return false;
    }

    // Price Filter
    if (minPrice || maxPrice) {
      const min =
        minPrice && !isNaN(parseFloat(minPrice))
          ? parseFloat(minPrice) * 100
          : 0;
      const max =
        maxPrice && !isNaN(parseFloat(maxPrice))
          ? parseFloat(maxPrice) * 100
          : Infinity;

      // Check if ANY variant matches the price range
      const hasVariantInPriceRange = product.variants.some((variant) => {
        return variant.priceInCents >= min && variant.priceInCents <= max;
      });

      if (!hasVariantInPriceRange) return false;
    }

    return true;
  });

  const categories = await db.query.categoryTable.findMany();

  return (
    <>
      <Header categories={categories} />
      <div className="space-y-6 px-5 py-6">
        <div className="space-y-4">
          <h2 className="text-2xl font-bold">{category.name}</h2>
          <CategoryFilters />
        </div>

        {products.length === 0 ? (
          <div className="text-muted-foreground py-12 text-center">
            Nenhum produto encontrado com esses filtros.
          </div>
        ) : (
          <div className="grid grid-cols-2 gap-4 md:grid-cols-3 lg:grid-cols-4">
            {products.map((product) => (
              <ProductItem
                key={product.id}
                product={product}
                textContainerClassName="max-w-full"
              />
            ))}
          </div>
        )}
      </div>
    </>
  );
};

export default CategoryPage;
