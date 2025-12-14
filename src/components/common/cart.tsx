"use client";

import { ShoppingBagIcon } from "lucide-react";
import Link from "next/link";
import React, { useState } from "react";

import { formatCentsToBRL } from "@/app/helpers/money";
import { Button } from "@/components/ui/button";
import { useCart } from "@/hooks/queries/use-cart";
import { cn } from "@/lib/utils";

import { ScrollArea } from "../ui/scroll-area";
import { Separator } from "../ui/separator";
import {
  Sheet,
  SheetClose,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "../ui/sheet";
import CartItem from "./cart-item";

const EmptyState = () => {
  return (
    <div className="flex h-full flex-col items-center justify-center gap-6 px-8 py-12">
      <div className="bg-muted rounded-full p-6">
        <ShoppingBagIcon className="text-muted-foreground h-12 w-12" />
      </div>
      <div className="flex flex-col items-center gap-2 text-center">
        <h3 className="text-lg font-semibold">Seu carrinho está vazio</h3>
        <p className="text-muted-foreground text-sm text-balance">
          Adicione produtos ao carrinho para começar suas compras
        </p>
      </div>
      <SheetClose asChild>
        <Button asChild className="mt-2 rounded-full">
          <Link href="/">Explorar produtos</Link>
        </Button>
      </SheetClose>
    </div>
  );
};

export const Cart = () => {
  const { data: cart, isError } = useCart();
  const [isOpen, setIsOpen] = useState(false);
  const [isAnimating, setIsAnimating] = useState(false);

  // Show empty state if user is not logged in (error) or cart is empty
  const showEmptyState = isError || !cart || cart.items.length === 0;

  // Calculate total items in cart
  const totalItems =
    cart?.items.reduce((acc, item) => acc + item.quantity, 0) ?? 0;

  // Trigger animation only when items INCREASE (not just change)
  React.useEffect(() => {
    // Get previous count from sessionStorage
    const prevCount = parseInt(
      sessionStorage.getItem("cartTotalItems") || "0",
      10,
    );

    // Only animate if count increased
    if (totalItems > prevCount && totalItems > 0) {
      setIsAnimating(true);
      const timer = setTimeout(() => setIsAnimating(false), 600);
      return () => clearTimeout(timer);
    }

    // Always update sessionStorage with current count
    sessionStorage.setItem("cartTotalItems", totalItems.toString());
  }, [totalItems]);

  return (
    <Sheet open={isOpen} onOpenChange={setIsOpen}>
      <SheetTrigger asChild>
        <Button variant="ghost" size="icon" className="relative">
          <ShoppingBagIcon
            className={isAnimating ? "animate-cart-bounce" : ""}
          />
          {totalItems > 0 && (
            <span
              className={cn(
                "bg-primary text-primary-foreground absolute -top-1 -right-1 flex h-5 w-5 items-center justify-center rounded-full text-[10px] font-bold",
                isAnimating && "animate-scale-in",
              )}
            >
              {totalItems}
            </span>
          )}
        </Button>
      </SheetTrigger>
      <SheetContent className="w-[320px] rounded-tl-3xl rounded-bl-3xl">
        <SheetHeader className="text-lg">
          <SheetTitle>Carrinho</SheetTitle>
        </SheetHeader>
        {showEmptyState ? (
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
                      productVariantPriceInCents={
                        item.productVariant.priceInCents
                      }
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
  );
};

// SERVER ACTION
