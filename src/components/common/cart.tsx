"use client"

import { ShoppingBagIcon } from "lucide-react"
import Link from "next/link"
import { useState } from "react"

import { formatCentsToBRL } from "@/app/helpers/money"
import { Button } from "@/components/ui/button"
import { useCart } from "@/hooks/queries/use-cart"

import { ScrollArea } from "../ui/scroll-area"
import { Separator } from "../ui/separator"
import { Sheet, SheetClose, SheetContent, SheetHeader, SheetTitle, SheetTrigger } from "../ui/sheet"
import CartItem from "./cart-item"

const EmptyState = () => {
  return (
    <div className="flex flex-col items-center justify-center h-full gap-6 px-8 py-12">
      <div className="rounded-full bg-muted p-6">
        <ShoppingBagIcon className="w-12 h-12 text-muted-foreground" />
      </div>
      <div className="flex flex-col items-center gap-2 text-center">
        <h3 className="font-semibold text-lg">Seu carrinho está vazio</h3>
        <p className="text-sm text-muted-foreground text-balance">
          Adicione produtos ao carrinho para começar suas compras
        </p>
      </div>
      <SheetClose asChild>
        <Button asChild className="rounded-full mt-2">
          <Link href="/">
            Explorar produtos
          </Link>
        </Button>
      </SheetClose>
    </div>
  )
}

export const Cart = () => {
  const { data: cart } = useCart()
  const [isOpen, setIsOpen] = useState(false)

  return (
    <Sheet open={isOpen} onOpenChange={setIsOpen}>
      <SheetTrigger asChild>
        <Button variant="ghost" size="icon">
          <ShoppingBagIcon />
        </Button>
      </SheetTrigger>
      <SheetContent className="rounded-tl-3xl rounded-bl-3xl">
        <SheetHeader>
          <SheetTitle>Carrinho</SheetTitle>
        </SheetHeader>
        {cart?.items.length === 0 ? (
          <EmptyState />
        ) : (
          <div className="flex h-full flex-col px-5 pb-5">
            <div className="flex h-full max-h-full flex-col overflow-hidden">
              <ScrollArea className="h-full">
                <div className="flex h-full flex-col gap-8">
                  {cart?.items.map((item) => (
                    <CartItem
                      key={item.id}
                      id={item.id}
                      productName={item.productVariant.product.name}
                      productVariantId={item.productVariant.id}
                      productVariantName={item.productVariant.name}
                      productVariantImageUrl={item.productVariant.imageUrl}
                      productVariantPriceInCents={item.productVariant.priceInCents}
                      quantity={item.quantity}
                    />
                  ))}
                </div>
              </ScrollArea>
            </div>

            {cart?.items && cart?.items.length > 0 && (
              <div className="flex flex-col gap-4">
                <Separator />

                <div className="flex items-center justify-between text-xs font-medium">
                  <p>Subtotal</p>
                  <p>{formatCentsToBRL(cart?.totalPriceInCents ?? 0)}</p>
                </div>

                <Separator />

                <div className="flex items-center justify-between text-xs font-medium">
                  <p>Entrega</p>
                  <p>GRÁTIS</p>
                </div>

                <Separator />

                <div className="flex items-center justify-between text-xs font-medium">
                  <p>Total</p>
                  <p>{formatCentsToBRL(cart?.totalPriceInCents ?? 0)}</p>
                </div>

                <Button className="mt-5 rounded-full">
                  <Link href="/cart/identification">Finalizar compra</Link>
                </Button>
              </div>
            )}
          </div>
        )}
      </SheetContent>
    </Sheet>
  )
}

// SERVER ACTION
