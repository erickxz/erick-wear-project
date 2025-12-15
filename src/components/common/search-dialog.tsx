"use client";

import { useQuery } from "@tanstack/react-query";
import { Loader2, Search } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { useEffect, useState } from "react";

import { searchProducts } from "@/actions/search-products";
import { formatCentsToBRL } from "@/app/helpers/money";
// import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { ScrollArea } from "@/components/ui/scroll-area";

interface SearchDialogProps {
  isOpen: boolean;
  onOpenChange: (open: boolean) => void;
}

export const SearchDialog = ({ isOpen, onOpenChange }: SearchDialogProps) => {
  const [search, setSearch] = useState("");
  const [debouncedSearch, setDebouncedSearch] = useState("");

  // Debounce logic
  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedSearch(search);
    }, 500);

    return () => clearTimeout(timer);
  }, [search]);

  const { data: products, isLoading } = useQuery({
    queryKey: ["search-products", debouncedSearch],
    queryFn: () => searchProducts(debouncedSearch),
    enabled: debouncedSearch.length >= 2,
  });

  const handleClose = () => {
    onOpenChange(false);
    setSearch("");
  };

  return (
    <Dialog open={isOpen} onOpenChange={onOpenChange}>
      <DialogContent className="bg-background gap-0 overflow-hidden p-0 sm:max-w-[550px]">
        <DialogHeader className="border-b px-4 py-4">
          <DialogTitle className="sr-only">Buscar Produtos</DialogTitle>
          <div className="flex items-center gap-2">
            <Search className="text-muted-foreground h-5 w-5" />
            <Input
              placeholder="O que você procura?"
              className="placeholder:text-muted-foreground/50 h-auto border-none p-0 text-lg shadow-none focus-visible:ring-0"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              autoFocus
            />
          </div>
        </DialogHeader>

        <div className="p-0">
          {isLoading ? (
            <div className="flex items-center justify-center py-8">
              <Loader2 className="text-primary h-6 w-6 animate-spin" />
            </div>
          ) : products && products.length > 0 ? (
            <ScrollArea className="max-h-[400px]">
              <div className="p-2">
                <p className="text-muted-foreground px-3 py-2 text-xs font-medium">
                  Produtos encontrados
                </p>
                {products.map((product) => (
                  <Link
                    key={product.id}
                    href={`/product-variant/${product.variants[0]?.slug}`}
                    onClick={handleClose}
                    className="hover:bg-accent group flex items-center gap-4 rounded-lg p-3 transition-colors"
                  >
                    <div className="bg-secondary relative h-14 w-14 overflow-hidden rounded-md">
                      {product.variants[0]?.imageUrl ? (
                        <Image
                          src={product.variants[0].imageUrl}
                          alt={product.name}
                          fill
                          className="object-cover"
                        />
                      ) : (
                        <div className="bg-secondary text-muted-foreground flex h-full w-full items-center justify-center">
                          <Search className="h-6 w-6" />
                        </div>
                      )}
                    </div>
                    <div className="min-w-0 flex-1">
                      <h4 className="group-hover:text-primary line-clamp-1 font-medium transition-colors">
                        {product.name}
                      </h4>
                      <p className="text-muted-foreground line-clamp-2 text-sm">
                        {product.description}
                      </p>
                    </div>
                    <div className="text-right">
                      {product.variants[0] && (
                        <span className="text-sm font-semibold">
                          {formatCentsToBRL(product.variants[0].priceInCents)}
                        </span>
                      )}
                    </div>
                  </Link>
                ))}
              </div>
            </ScrollArea>
          ) : debouncedSearch.length >= 2 ? (
            <div className="text-muted-foreground py-12 text-center">
              <p>
                Nenhum produto encontrado para &quot;{debouncedSearch}&quot;
              </p>
            </div>
          ) : (
            <div className="text-muted-foreground py-12 text-center text-sm">
              Digite pelo menos 2 caracteres para buscar
            </div>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
};
