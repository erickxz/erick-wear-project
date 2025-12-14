import { headers } from "next/headers";
import Image from "next/image";
import { redirect } from "next/navigation";

import { getOrders } from "@/actions/get-orders";
import { formatCentsToBRL } from "@/app/helpers/money";
import Footer from "@/components/common/footer";
import { Header } from "@/components/common/header";
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

  return (
    <div className="min-h-screen flex flex-col">
      <Header categories={categories} />
      <div className="flex-1 p-5 space-y-4">
        <h1 className="text-2xl font-bold">Meus Pedidos</h1>
        
        {orders.length === 0 ? (
          <Card>
            <CardContent className="flex flex-col items-center justify-center py-12">
              <p className="text-muted-foreground">Você ainda não possui pedidos</p>
            </CardContent>
          </Card>
        ) : (
          <div className="space-y-4">
            {orders.map((order) => (
              <Card key={order.id}>
                <CardContent className="p-4 space-y-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm text-muted-foreground">
                        Pedido #{order.id.slice(0, 8)}
                      </p>
                      <p className="text-xs text-muted-foreground">
                        {new Date(order.createdAt).toLocaleDateString("pt-BR", {
                          day: "2-digit",
                          month: "2-digit",
                          year: "numeric",
                        })}
                      </p>
                    </div>
                    <div className="text-right">
                      <p className="font-semibold">{formatCentsToBRL(order.totalPriceInCents)}</p>
                      <p className="text-xs text-muted-foreground">
                        {getOrderStatusLabel(order.status)}
                      </p>
                    </div>
                  </div>

                  <div className="space-y-2">
                    {order.items.map((item) => (
                      <div key={item.id} className="flex items-center gap-3">
                        <div className="relative w-16 h-16 rounded overflow-hidden flex-shrink-0">
                          <Image
                            src={item.productVariant.imageUrl}
                            alt={item.productVariant.product.name}
                            fill
                            className="object-cover"
                          />
                        </div>
                        <div className="flex-1 min-w-0">
                          <p className="font-medium text-sm truncate">
                            {item.productVariant.product.name}
                          </p>
                          <p className="text-xs text-muted-foreground">
                            {item.productVariant.name} - Qtd: {item.quantity}
                          </p>
                          <p className="text-xs font-medium">
                            {formatCentsToBRL(item.priceInCents * item.quantity)}
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
