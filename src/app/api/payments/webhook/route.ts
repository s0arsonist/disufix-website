"use server";
// src/app/api/wompi-webhook/route.ts

import { NextRequest, NextResponse } from "next/server";
import { verifySignature } from "@/utils/wompi"; // Puedes crear una funciÃ³n para validar la firma
import axios from "axios";
import {
  getOrderById,
  getOrderWithShippingInfo,
  updateOrderStatus,
} from "@/actions/shipping/shipping";
import { createClient } from "@/actions/client/client";
import { enviarConfirmacionOrden } from "@/actions";

export async function POST(request: NextRequest) {
  try {
    // Lee el cuerpo de la solicitud
    const body = await request.json();
    console.log("Evento recibido:", body);

    // Validar la firma usando la funciÃ³n que has implementado (mÃ©todo para evitar ataques)
    const checksum = body.signature.checksum;
    const isValid = verifySignature(body, checksum);

    if (!isValid) {
      console.log("Firma no vÃ¡lida");
      return new NextResponse(JSON.stringify({ message: "Firma no vÃ¡lida" }), {
        status: 400,
      });
    }

    // Procesa el evento
    const { event, data } = body;
    if (event === "transaction.updated") {
      console.log("Evento de transacciÃ³n actualizado:", data);
      const transaction = data.transaction;

      // Maneja el evento (por ejemplo, actualiza el estado de la transacciÃ³n en tu base de datos)
      await handleTransactionUpdate(transaction);

      return NextResponse.json(
        { message: "Evento procesado correctamente" },
        { status: 200 }
      );
    }

    // Si el evento no es reconocido
    return new NextResponse(JSON.stringify({ message: "Evento desconocido" }), {
      status: 400,
    });
  } catch (error) {
    console.error("Error al procesar el evento:", error);
    return new NextResponse(JSON.stringify({ message: "Error interno" }), {
      status: 500,
    });
  }
}

// FunciÃ³n para manejar el evento de la transacciÃ³n
async function handleTransactionUpdate(transaction: any) {
  // AquÃ­ puedes realizar lo que necesites, como actualizar el estado de la transacciÃ³n
  if (transaction.status === "APPROVED") {
    //consultar orden por id
    const order = await getOrderWithShippingInfo(transaction.reference);
    console.log("Orden asociada:", order);

    //obtener los datos del cliente
    const dataClient = order.order?.shippingAddress;
    if (!dataClient)
      return new NextResponse(
        JSON.stringify({ message: "No se encontrÃ³ la orden" }),
        { status: 404 }
      );
    console.log("Datos del cliente:", dataClient);
    //crear el cliente en la base de datos
    const client = await createClient(
      dataClient?.firstName,
      dataClient?.lastName,
      dataClient?.email,
      dataClient?.phone
    );
    console.log("Cliente creado:", client.message);
    console.log("cliente:", client.client);

    //actualizar la orden con el cliente
    if (!client.client)
      return new NextResponse(
        JSON.stringify({ message: "No se encontrÃ³ el cliente" }),
        { status: 404 }
      );
    const updatedOrder = await updateOrderStatus(
      transaction.reference,
      "paid",
      transaction.payment_method.type,
      client.client.id
    );
    console.log("Orden actualizada:", updatedOrder.updatedOrder);
    console.log("TransacciÃ³n aprobada:", transaction.id);

    // Implementa esta funciÃ³n para obtener la orden por ID
    const correo = await enviarConfirmacionOrden(order.order?.id);
    console.log(correo);
  }
  console.log("Actualizando estado de la transacciÃ³n:", transaction.id);
  // Ejemplo de actualizaciÃ³n en base de datos, puedes adaptarlo segÃºn tu modelo
}
