import { eq } from "drizzle-orm";
import Image from "next/image";
import { notFound } from "next/navigation";

import { formatCentsToBRL } from "@/app/helpers/money";
import Footer from "@/components/common/footer";
import { Header } from "@/components/common/header";
import ProductList from "@/components/common/products-list";
import { db } from "@/db";
import { productTable, productVariantTable } from "@/db/schema";

import ProductActions from "./components/product-actions";
import VariantSelector from "./components/variant-select";

interface ProductVariantPageProps { 
  params: Promise<{ slug: string }>;
}

const ProductVariantPage = async ({ params }: ProductVariantPageProps) => {
  const { slug } = await params;
  const productVariant = await db.query.productVariantTable.findFirst({
    where: eq(productVariantTable.slug, slug),
    with: {
      product: {
        with: {
          variants: true,
        },
      },
    },
  });
  if (!productVariant) {
    notFound();
  }

  const likelyProducts = await db.query.productTable.findMany({
    where: eq(productTable.categoryId, productVariant.product.categoryId),
    with: {
      variants: true,
    },
  });
  const categories = await db.query.categoryTable.findMany();

  return ( 
    <>
    <Header categories={categories} />
    <div className="flex flex-col space-y-4">
      <Image src={productVariant.imageUrl} alt={productVariant.name} width={0} height={0} sizes="100vw" className="h-auto w-full rounded-3xl px-2" />

    {/* Variants */}
    <div className="px-5">
      <VariantSelector selectedVariantSlug={productVariant.slug} variants={productVariant.product.variants} />
    </div>
    
    <div className="px-5">
      <div className="flex flex-col space-y-1">
        <h2 className="text-lg font-bold">{productVariant.product.name}</h2>
        <h3 className="text-sm text-muted-foreground">{productVariant.name}</h3>
        <h3 className="text-lg font-semibold">{formatCentsToBRL(productVariant.priceInCents)}</h3>
      </div>
      </div>



      <ProductActions productVariantId={productVariant.id} />


<div className="px-5">
  <p className="text-sm text-muted-foreground">{productVariant.product.description}</p>
</div>

  <ProductList products={likelyProducts} title="Você também pode gostar" />
</div>
<div className="mt-10">
<Footer />
</div>
    </>
   );
}
 
export default ProductVariantPage;