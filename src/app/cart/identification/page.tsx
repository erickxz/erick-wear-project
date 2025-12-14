import { eq } from "drizzle-orm";
import { headers } from "next/headers";
import { redirect } from "next/navigation";

import { getCart } from "@/actions/get-cart";
import Footer from "@/components/common/footer";
import { Header } from "@/components/common/header";
import { db } from "@/db";
import { shippingAddressTable } from "@/db/schema";
import { auth } from "@/lib/auth";

import CartSummary from "../_components/cart-summary";
import Addresses from "./_components/addresses";

const IdentificationPage = async() => {

    const session = await auth.api.getSession({
        headers: await headers(),
    });
    if (!session?.user) {
        redirect("/");
    }
    const cart = await db.query.cartTable.findFirst({
        where: (cart, { eq }) => eq(cart.userId, session.user.id),
        with: {
          shippingAddress: true,
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
    if (!cart || cart.items.length === 0) {
        redirect("/");
    }

    const shippingAddress = await db.query.shippingAddressTable.findMany({
        where: eq(shippingAddressTable.userId, session.user.id),
    });
    const categories = await db.query.categoryTable.findMany();

    const cartTotalPriceInCents = cart.items.reduce((acc, item) => acc + item.productVariant.priceInCents * item.quantity, 0);
  return (
   <>
   <Header categories={categories} />
   <div className="p-5 space-y-4">
   <Addresses shippingAddresses={shippingAddress} initialCart={cart as unknown as Awaited<ReturnType<typeof getCart>>} />

   <CartSummary subTotalInCents={cartTotalPriceInCents} totalInCents={cartTotalPriceInCents} products={cart.items.map((item) => ({
    id: item.id,
    name: item.productVariant.product.name,
    variantName: item.productVariant.name,
    imageUrl: item.productVariant.imageUrl,
    priceInCents: item.productVariant.priceInCents,
    quantity: item.quantity,
   }))} />
   </div>
   <Footer />
   </>
  )
}

export default IdentificationPage;