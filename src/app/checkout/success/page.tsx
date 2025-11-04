"use client";

import Image from "next/image";
import { redirect } from "next/navigation";

import { Header } from "@/components/common/header";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogTitle,
} from "@/components/ui/dialog";

const CheckoutSuccessPage = () => {
  return (
    <>
    <Header />
        <Dialog open={true} onOpenChange={(open) => {
            if (!open) {
                redirect("/");
            }
        }}>
        <DialogContent className="text-center">
            <Image src="/illustration (1).svg" alt="Success" width={250} height={250} className="mx-auto" />
            <DialogTitle className="text-center text-2xl font-bold mt-4">Pedido Efetuado!</DialogTitle>
            <DialogDescription className="font-medium text-center text-sm text-gray-500">Seu pedido foi efetuado com sucesso. Você pode acompanhar o status na seção de “Meus Pedidos”.</DialogDescription>
            <Button className="w-full md:w-auto rounded-full mt-2" size="lg" onClick={() => {
                redirect("/orders");
            }}>
                Ver meus pedidos
            </Button>
            <Button className="w-full md:w-auto rounded-full" variant="outline" size="lg" onClick={() => {
                redirect("/");
            }}> 
                Voltar para a loja
            </Button>
        </DialogContent>
    </Dialog>
</>
  )
}

export default CheckoutSuccessPage;