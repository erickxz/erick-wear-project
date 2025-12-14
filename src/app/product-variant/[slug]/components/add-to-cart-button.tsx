"use client";

// import { AddProductToCartSchema } from "@/actions/add-cart-product/schema";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { Check, Loader2, ShoppingBag } from "lucide-react";
import { useState } from "react";
import { toast } from "sonner";

import { addProductToCart } from "@/actions/add-cart-product";
import { Button } from "@/components/ui/button";

interface AddToCartButtonProps {
  productVariantId: string;
  quantity: number;
  onSuccess?: () => void;
}

const AddToCartButton = ({
  productVariantId,
  quantity,
  onSuccess,
}: AddToCartButtonProps) => {
  const queryClient = useQueryClient();
  const [showSuccess, setShowSuccess] = useState(false);

  const { mutate, isPending } = useMutation({
    mutationKey: ["addProductToCart", productVariantId, quantity],
    mutationFn: () =>
      addProductToCart({
        productVariantId,
        quantity,
      }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["cart"] });
      setShowSuccess(true);
      setTimeout(() => setShowSuccess(false), 2000);
      onSuccess?.();
    },
    onError: () => {
      toast.error("Erro ao adicionar produto ao carrinho");
    },
  });

  return (
    <Button
      variant="outline"
      className="rounded-full"
      size="lg"
      disabled={isPending || showSuccess}
      onClick={() => mutate()}
    >
      {isPending && <Loader2 className="animate-spin" />}
      {showSuccess && <Check className="animate-in zoom-in" />}
      {!isPending && !showSuccess && <ShoppingBag />}
      {showSuccess ? "Adicionado!" : "Adicionar ao carrinho"}
    </Button>
  );
};

export default AddToCartButton;
