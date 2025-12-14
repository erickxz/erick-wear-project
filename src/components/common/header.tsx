"use client";

import { ArrowRightIcon, HomeIcon, LogOutIcon, MenuIcon, PackageIcon, ShoppingBagIcon } from "lucide-react";
import Image from "next/image";
import Link from "next/link";

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

export const Header = ({ categories = [] }: HeaderProps) => {
  const { data: session } = authClient.useSession();

  return (
    <header className="flex items-center justify-between p-5">
      <Link href="/">
        <Image src="/Logo.png" alt="BEWEAR" width={100} height={26.14} />
      </Link>

      <div className="flex items-center gap-3 h-6">
        <div className="relative flex items-center">
          <Cart />
        </div>

        <Separator
          orientation="vertical"
          className="h-1 w-px shrink-0 bg-border"
        />

        <Sheet>
          <SheetTrigger asChild>
            <Button variant="ghost" size="icon">
              <MenuIcon />
            </Button>
          </SheetTrigger>
          <SheetContent className="rounded-tl-3xl rounded-bl-3xl p-3">
            <SheetHeader>
              <SheetTitle className="text-2xl font-bold">Menu</SheetTitle>
            </SheetHeader>
            
            <div className="flex flex-col h-full pt-6">
              {!session?.user ? (
                <div className="flex items-center justify-between mb-6">
                  <h2 className="font-semibold">Olá. Faça seu login!</h2>
                  <Button asChild className="bg-purple-600 hover:bg-purple-700 rounded-full">
                    <Link href="/authentication" className="flex items-center gap-2">
                      Login
                      <ArrowRightIcon className="h-4 w-4" />
                    </Link>
                  </Button>
                </div>
              ) : null}

              <div className="flex flex-col gap-4 mb-6">
                <Button variant="ghost" className="justify-start font-normal" asChild>
                  <Link href="/" className="flex items-center gap-3">
                    <HomeIcon className="h-5 w-5" />
                    Início
                  </Link>
                </Button>
                
                <Button variant="ghost" className="justify-start font-normal" asChild>
                  <Link href="/orders" className="flex items-center gap-3">
                    <PackageIcon className="h-5 w-5" />
                    Meus Pedidos
                  </Link>
                </Button>
                
                <Button variant="ghost" className="justify-start font-normal" asChild>
                  <Link href="/cart/identification" className="flex items-center gap-3">
                    <ShoppingBagIcon className="h-5 w-5" />
                    Sacola
                  </Link>
                </Button>
              </div>

              <Separator className="mb-6" />

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
        
            <SheetFooter>
              {session?.user ? (
                <div className="flex items-center justify-between w-full">
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
                      <p className="text-sm font-semibold">{session.user.name}</p>
                      <p className="text-xs text-muted-foreground">
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
              ) : null}
            </SheetFooter>
          </SheetContent>
        </Sheet>
      </div>
    </header>
  );
};
