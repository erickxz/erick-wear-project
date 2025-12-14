import { headers } from "next/headers";
import Image from "next/image";
import Link from "next/link";
import { redirect } from "next/navigation";

import { getCart } from "@/actions/get-cart";
import { getOrders } from "@/actions/get-orders";
import { formatCentsToBRL } from "@/app/helpers/money";
import Footer from "@/components/common/footer";
import { Header } from "@/components/common/header";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { db } from "@/db";
import { auth } from "@/lib/auth";

const getOrderStatusLabel = (status: string) => {
  const statusMap: Record<string, string> = {
    pending: "Pendente",
    paid: "Pago",
    shipped: "Enviado",
    delivered: "Entregue",
    cancelled: "Cancelado",
  };
  return statusMap[status] || status;
};

const OrdersPage = async () => {
  const session = await auth.api.getSession({
    headers: await headers(),
  });
  if (!session?.user) {
    redirect("/");
  }

  const orders = await getOrders();
  const categories = await db.query.categoryTable.findMany();

  // Get pending cart
  let pendingCart = null;
  try {
    const cart = await getCart();
    if (cart && cart.items.length > 0 && cart.shippingAddressId) {
      pendingCart = cart;
    }
  } catch (error) {
    // User not logged in or error fetching cart
    console.error("Error fetching cart:", error);
  }

  return (
    <div className="flex min-h-screen flex-col">
      <Header categories={categories} />
      <div className="flex-1 space-y-4 p-5">
        <h1 className="text-2xl font-bold">Meus Pedidos</h1>

        {/* Pending Cart/Order */}
        {pendingCart && (
          <Card className="border-primary/50 bg-primary/5">
            <CardContent className="space-y-4 p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-primary font-semibold">Pedido Pendente</p>
                  <p className="text-muted-foreground text-xs">
                    Complete seu pedido para finalizar a compra
                  </p>
                </div>
                <div className="text-right">
                  <p className="font-semibold">
                    {formatCentsToBRL(pendingCart.totalPriceInCents)}
                  </p>
                  <p className="text-muted-foreground text-xs">
                    {pendingCart.items.length}{" "}
                    {pendingCart.items.length === 1 ? "item" : "itens"}
                  </p>
                </div>
              </div>

              <div className="space-y-2">
                {pendingCart.items.map((item) => (
                  <div key={item.id} className="flex items-center gap-3">
                    <div className="relative h-16 w-16 flex-shrink-0 overflow-hidden rounded">
                      <Image
                        src={item.productVariant.imageUrl}
                        alt={item.productVariant.product.name}
                        fill
                        className="object-cover"
                      />
                    </div>
                    <div className="min-w-0 flex-1">
                      <p className="truncate text-sm font-medium">
                        {item.productVariant.product.name}
                      </p>
                      <p className="text-muted-foreground text-xs">
                        {item.productVariant.name} - Qtd: {item.quantity}
                      </p>
                      <p className="text-xs font-medium">
                        {formatCentsToBRL(
                          item.productVariant.priceInCents * item.quantity,
                        )}
                      </p>
                    </div>
                  </div>
                ))}
              </div>

              <Button asChild className="w-full rounded-full">
                <Link href="/cart/identification">Continuar Pedido</Link>
              </Button>
            </CardContent>
          </Card>
        )}

        {/* Completed Orders */}
        {orders.length === 0 ? (
          <Card>
            <CardContent className="flex flex-col items-center justify-center py-12">
              <p className="text-muted-foreground">
                Você ainda não possui pedidos finalizados
              </p>
            </CardContent>
          </Card>
        ) : (
          <div className="space-y-4">
            {orders.map((order) => (
              <Card key={order.id}>
                <CardContent className="space-y-4 p-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-muted-foreground text-sm">
                        Pedido #{order.id.slice(0, 8)}
                      </p>
                      <p className="text-muted-foreground text-xs">
                        {new Date(order.createdAt).toLocaleDateString("pt-BR", {
                          day: "2-digit",
                          month: "2-digit",
                          year: "numeric",
                        })}
                      </p>
                    </div>
                    <div className="text-right">
                      <p className="font-semibold">
                        {formatCentsToBRL(order.totalPriceInCents)}
                      </p>
                      <p className="text-muted-foreground text-xs">
                        {getOrderStatusLabel(order.status)}
                      </p>
                    </div>
                  </div>

                  <div className="space-y-2">
                    {order.items.map((item) => (
                      <div key={item.id} className="flex items-center gap-3">
                        <div className="relative h-16 w-16 flex-shrink-0 overflow-hidden rounded">
                          <Image
                            src={item.productVariant.imageUrl}
                            alt={item.productVariant.product.name}
                            fill
                            className="object-cover"
                          />
                        </div>
                        <div className="min-w-0 flex-1">
                          <p className="truncate text-sm font-medium">
                            {item.productVariant.product.name}
                          </p>
                          <p className="text-muted-foreground text-xs">
                            {item.productVariant.name} - Qtd: {item.quantity}
                          </p>
                          <p className="text-xs font-medium">
                            {formatCentsToBRL(
                              item.priceInCents * item.quantity,
                            )}
                          </p>
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        )}
      </div>
      <Footer />
    </div>
  );
};

export default OrdersPage;
