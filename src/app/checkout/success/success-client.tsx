"use client";

import Image from "next/image";
import { redirect, useSearchParams } from "next/navigation";
import { useEffect } from "react";

import { verifyOrderPayment } from "@/actions/verify-order-payment";
import { Header } from "@/components/common/header";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogTitle,
} from "@/components/ui/dialog";

export default function CheckoutSuccessClient() {
  const searchParams = useSearchParams();
  const sessionId = searchParams.get("session_id");

  useEffect(() => {
    if (sessionId) {
      verifyOrderPayment(sessionId);
    }
  }, [sessionId]);

  return (
    <>
      <Header />
      <Dialog
        open
        onOpenChange={(open) => {
          if (!open) redirect("/");
        }}
      >
        <DialogContent className="text-center">
          <Image
            src="/illustration (1).svg"
            alt="Success"
            width={250}
            height={250}
            className="mx-auto"
          />

          <DialogTitle className="mt-4 text-2xl font-bold">
            Pedido Efetuado!
          </DialogTitle>

          <DialogDescription className="text-sm font-medium text-gray-500">
            Seu pedido foi efetuado com sucesso. Você pode acompanhar o status
            na seção de “Meus Pedidos”.
          </DialogDescription>

          <Button
            className="mt-2 w-full rounded-full md:w-auto"
            size="lg"
            onClick={() => redirect("/orders")}
          >
            Ver meus pedidos
          </Button>

          <Button
            className="w-full rounded-full md:w-auto"
            variant="outline"
            size="lg"
            onClick={() => redirect("/")}
          >
            Voltar para a loja
          </Button>
        </DialogContent>
      </Dialog>
    </>
  );
}
