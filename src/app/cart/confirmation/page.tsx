import { headers } from "next/headers";
// import Link from "next/link";
import { redirect } from "next/navigation";

import Footer from "@/components/common/footer";
import { Header } from "@/components/common/header";
// import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { db } from "@/db";
import { auth } from "@/lib/auth";

import CartSummary from "../_components/cart-summary";
import FinishOrderButton from "../confirmation/_components/finish-order-button";

const ConfirmationPage = async () => {

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
    const categories = await db.query.categoryTable.findMany();

    const cartTotalPriceInCents = cart.items.reduce((acc, item) => acc + item.productVariant.priceInCents * item.quantity, 0);

    return (
        <div className="min-h-screen flex flex-col">
            <Header categories={categories} />
            <div className="flex-1 p-5 space-y-4">
                <Card>
                    <CardHeader>
                        <CardTitle className="text-m font-bold">Identificação</CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-4">
                        <Card>
                            <CardContent>
                                <div className="flex-1">
                                    <Label htmlFor={cart.shippingAddress?.id} className="cursor-pointer">
                                        <div className="space-y-1">
                                            <div className="font-semibold text-gray-900">
                                                {cart.shippingAddress?.recipientName}
                                            </div>
                                            <div className="text-sm text-gray-700">
                                                {cart.shippingAddress?.street}
                                            </div>
                                            <div className="text-sm text-gray-600">
                                                {cart.shippingAddress?.neighborhood}, {cart.shippingAddress?.city}/{cart.shippingAddress?.state}
                                            </div>
                                            <div className="text-xs text-gray-500">
                                                {cart.shippingAddress?.zipCode}
                                            </div>
                                        </div>
                                    </Label>
                                </div>
                            </CardContent>
                        </Card>
                        <FinishOrderButton />
                    </CardContent>
                </Card>
                <CartSummary 
                    subTotalInCents={cartTotalPriceInCents} 
                    totalInCents={cartTotalPriceInCents} 
                    products={cart.items.map((item) => ({
                        id: item.id,
                        name: item.productVariant.product.name,
                        variantName: item.productVariant.name,
                        imageUrl: item.productVariant.imageUrl,
                        priceInCents: item.productVariant.priceInCents,
                        quantity: item.quantity,
                    }))} 
                />
            </div>
            <Footer />  
        </div>
    );
    
}
 
export default ConfirmationPage;