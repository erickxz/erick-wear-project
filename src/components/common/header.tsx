"use client";

import {
  ArrowRightIcon,
  HomeIcon,
  LogOutIcon,
  MenuIcon,
  PackageIcon,
  ShoppingBagIcon,
} from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { useState } from "react";

import { useCart } from "@/hooks/queries/use-cart";
import { authClient } from "@/lib/auth-client";

import { Avatar, AvatarFallback, AvatarImage } from "../ui/avatar";
import { Button } from "../ui/button";
import { Separator } from "../ui/separator";
import {
  Sheet,
  SheetContent,
  SheetFooter,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "../ui/sheet";
import { Cart } from "./cart";

interface HeaderProps {
  categories?: Array<{
    id: string;
    name: string;
    slug: string;
  }>;
}

const IconWrapper = ({ children }: { children: React.ReactNode }) => (
  <div className="relative flex h-5 w-5 shrink-0 items-center justify-center">
    {children}
  </div>
);

export const Header = ({ categories = [] }: HeaderProps) => {
  const { data: session } = authClient.useSession();
  const { data: cart } = useCart();

  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [isCartOpen, setIsCartOpen] = useState(false);

  const handleCartClick = () => {
    setIsSidebarOpen(false);
    setTimeout(() => setIsCartOpen(true), 300);
  };

  const hasPendingOrder = !!cart?.items?.length;

  return (
    <header className="flex items-center justify-between p-5">
      <Link href="/">
        <Image src="/Logo.png" alt="BEWEAR" width={100} height={26.14} />
      </Link>

      <div className="flex h-6 items-center gap-3">
        <div className="relative flex items-center">
          <Cart isOpen={isCartOpen} onOpenChange={setIsCartOpen} />
        </div>

        <Separator
          orientation="vertical"
          className="bg-border h-1 w-px shrink-0"
        />

        <Sheet open={isSidebarOpen} onOpenChange={setIsSidebarOpen}>
          <SheetTrigger asChild>
            <Button variant="ghost" size="icon">
              <MenuIcon />
            </Button>
          </SheetTrigger>

          <SheetContent className="rounded-tl-3xl rounded-bl-3xl p-3">
            <SheetHeader>
              <SheetTitle className="text-2xl font-bold">Menu</SheetTitle>
            </SheetHeader>

            <div className="flex h-full flex-col pt-6">
              {!session?.user && (
                <div className="mb-6 flex items-center justify-between">
                  <h2 className="font-semibold">Olá. Faça seu login!</h2>
                  <Button
                    asChild
                    className="rounded-full bg-purple-600 hover:bg-purple-700"
                  >
                    <Link
                      href="/authentication"
                      className="flex items-center gap-2"
                    >
                      Login
                      <ArrowRightIcon className="h-4 w-4" />
                    </Link>
                  </Button>
                </div>
              )}

              {/* LINKS PRINCIPAIS */}
              <div className="mb-6 flex flex-col gap-4">
                <Button
                  variant="ghost"
                  className="justify-start gap-3 font-normal"
                  asChild
                >
                  <Link href="/" className="flex items-center gap-3">
                    <IconWrapper>
                      <HomeIcon className="h-5 w-5" />
                    </IconWrapper>
                    Início
                  </Link>
                </Button>

                <Button
                  variant="ghost"
                  className="justify-start gap-3 font-normal"
                  asChild
                >
                  <Link href="/orders" className="flex items-center gap-3">
                    <IconWrapper>
                      <PackageIcon className="h-5 w-5" />
                      {hasPendingOrder && (
                        <span className="bg-primary ring-background absolute -top-0.5 -right-0.5 h-2 w-2 rounded-full ring-2" />
                      )}
                    </IconWrapper>
                    Meus Pedidos
                  </Link>
                </Button>

                <Button
                  variant="ghost"
                  className="justify-start gap-3 font-normal"
                  onClick={handleCartClick}
                >
                  <IconWrapper>
                    <ShoppingBagIcon className="h-5 w-5" />
                  </IconWrapper>
                  Carrinho
                </Button>
              </div>

              <Separator className="mb-6" />

              {/* CATEGORIAS */}
              <div className="flex flex-col gap-4">
                {categories.map((category) => (
                  <Button
                    key={category.id}
                    variant="ghost"
                    className="justify-start font-normal"
                    asChild
                  >
                    <Link href={`/category/${category.slug}`}>
                      {category.name}
                    </Link>
                  </Button>
                ))}
              </div>
            </div>

            {/* FOOTER */}
            <SheetFooter>
              {session?.user && (
                <div className="flex w-full items-center justify-between">
                  <div className="flex items-center gap-3">
                    <Avatar>
                      <AvatarImage
                        src={session.user.image as string | undefined}
                      />
                      <AvatarFallback>
                        {session.user.name?.split(" ")?.[0]?.[0]}
                        {session.user.name?.split(" ")?.[1]?.[0]}
                      </AvatarFallback>
                    </Avatar>

                    <div className="flex flex-col">
                      <p className="text-sm font-semibold">
                        {session.user.name}
                      </p>
                      <p className="text-muted-foreground text-xs">
                        {session.user.email}
                      </p>
                    </div>
                  </div>

                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={() => authClient.signOut()}
                  >
                    <LogOutIcon className="h-5 w-5" />
                  </Button>
                </div>
              )}
            </SheetFooter>
          </SheetContent>
        </Sheet>
      </div>
    </header>
  );
};
