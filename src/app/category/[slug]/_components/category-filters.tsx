"use client";

import { Filter, Search } from "lucide-react";
import { useRouter, useSearchParams } from "next/navigation";
import { useEffect, useState } from "react";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Sheet,
  SheetContent,
  SheetFooter,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import { Slider } from "@/components/ui/slider";

export const CategoryFilters = () => {
  const router = useRouter();
  const searchParams = useSearchParams();

  const initialMin = Number(searchParams.get("minPrice")) || 0;
  const initialMax = Number(searchParams.get("maxPrice")) || 1000;
  const initialSearch = searchParams.get("q") || "";

  const [search, setSearch] = useState(initialSearch);
  const [priceRange, setPriceRange] = useState([initialMin, initialMax]);
  const [isOpen, setIsOpen] = useState(false);

  // Debounce Search
  useEffect(() => {
    const timer = setTimeout(() => {
      const params = new URLSearchParams(searchParams.toString());
      if (search) params.set("q", search);
      else params.delete("q");
      router.push(`?${params.toString()}`, { scroll: false });
    }, 500);
    return () => clearTimeout(timer);
  }, [search, router, searchParams]);

  const applyFilters = () => {
    const params = new URLSearchParams(searchParams.toString());

    if (priceRange[0] > 0) params.set("minPrice", priceRange[0].toString());
    else params.delete("minPrice");

    if (priceRange[1] < 1000) params.set("maxPrice", priceRange[1].toString());
    else params.delete("maxPrice");

    router.push(`?${params.toString()}`, { scroll: false });
    setIsOpen(false);
  };

  const clearFilters = () => {
    setPriceRange([0, 1000]);
    const params = new URLSearchParams(searchParams.toString());
    params.delete("minPrice");
    params.delete("maxPrice");
    router.push(`?${params.toString()}`, { scroll: false });
    setIsOpen(false);
  };

  const activeFiltersCount =
    (priceRange[0] > 0 ? 1 : 0) + (priceRange[1] < 1000 ? 1 : 0);

  return (
    <div className="flex items-center gap-4">
      <div className="relative flex-1">
        <Search className="text-muted-foreground absolute top-2.5 left-2.5 h-4 w-4" />
        <Input
          placeholder="Buscar produtos..."
          className="bg-background pl-9"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />
      </div>

      <Sheet open={isOpen} onOpenChange={setIsOpen}>
        <SheetTrigger asChild>
          <Button variant="outline" className="relative gap-2">
            <Filter className="h-4 w-4" />
            Filtros
            {activeFiltersCount > 0 && (
              <Badge
                variant="secondary"
                className="ml-1 flex h-5 w-5 items-center justify-center rounded-full p-0 text-[10px]"
              >
                {activeFiltersCount}
              </Badge>
            )}
          </Button>
        </SheetTrigger>
        <SheetContent className="w-[300px] p-4 sm:w-[400px]">
          <SheetHeader>
            <SheetTitle className="text-lg font-semibold">Filtros</SheetTitle>
          </SheetHeader>

          <div className="space-y-8 py-6">
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <Label className="text-base">Faixa de Preço</Label>
                <span className="text-muted-foreground text-sm">
                  R$ {priceRange[0]} - R$ {priceRange[1]}
                </span>
              </div>

              <Slider
                defaultValue={[0, 1000]}
                max={1000}
                step={10}
                value={priceRange}
                onValueChange={setPriceRange}
                className="py-4"
              />

              <div className="flex items-center gap-4">
                <div className="space-y-1">
                  <Label className="text-xs">Mínimo</Label>
                  <Input
                    type="number"
                    value={priceRange[0]}
                    onChange={(e) =>
                      setPriceRange([Number(e.target.value), priceRange[1]])
                    }
                    className="h-8"
                  />
                </div>
                <div className="space-y-1">
                  <Label className="text-xs">Máximo</Label>
                  <Input
                    type="number"
                    value={priceRange[1]}
                    onChange={(e) =>
                      setPriceRange([priceRange[0], Number(e.target.value)])
                    }
                    className="h-8"
                  />
                </div>
              </div>
            </div>
          </div>

          <SheetFooter className="flex-col gap-2 sm:flex-col">
            <Button onClick={applyFilters} className="w-full">
              Aplicar Filtros
            </Button>
            <Button variant="outline" onClick={clearFilters} className="w-full">
              Limpar Filtros
            </Button>
          </SheetFooter>
        </SheetContent>
      </Sheet>
    </div>
  );
};
