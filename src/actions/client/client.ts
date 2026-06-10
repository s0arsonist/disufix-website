"use server";

import prisma from "@/lib/db";

// ------------------ CLIENT ------------------
export const createClient = async (
  nombre: string,
  apellido: string,
  email: string,
  telefono: string
) => {
  try {
    const clientExist = await prisma.client.findUnique({ where: { email } });
    if (!clientExist) {
      const client = await prisma.client.create({
        data: {
          nombre,
          apellido,
          email: email.toLowerCase(),
          telefono,
          createDate: new Date().toISOString(),
        },
      });
      return { ok: true, client, message: "Cliente creado" };
    }
    return { ok: false, client: clientExist, message: "Cliente ya existe" };
  } catch (error) {
    console.error(error);
    return { ok: false, message: "Error al crear cliente" };
  }
};

export const getTotalClientsCount = async () => {
  try {
    const totalClients = await prisma.client.count(); // Cuenta todos los registros de clientes
    return { ok: true, totalClients }; // Retorna el nÃºmero total de clientes
  } catch (error) {
    console.error("Error al obtener el nÃºmero de clientes:", error);
    return { ok: false, message: "Error al obtener el nÃºmero de clientes" }; // Maneja el error
  }
};
export const getClients = async () => prisma.client.findMany();
export const getClientById = async (id: string) =>
  prisma.client.findUnique({ where: { id } });
export const updateClient = async (id: string, data: any) =>
  prisma.client.update({ where: { id }, data });
export const deleteClient = async (id: string) =>
  prisma.client.delete({ where: { id } });

export const getNumberOfOrdersByClient = async (clientId: string) => {
  try {
    // Contar el nÃºmero de Ã³rdenes asociadas al cliente
    const orderCount = await prisma.order.count({
      where: {
        clientId: clientId, // Filtramos las Ã³rdenes por clientId
      },
    });

    return {
      ok: true,
      orderCount,
      message: `El cliente tiene ${orderCount} ordenes.`,
    };
  } catch (error) {
    console.error("Error al obtener las Ã³rdenes del cliente:", error);
    return {
      ok: false,
      message: `Error al obtener las Ã³rdenes del cliente: ${error}`,
    };
  }
};

// export const getOrdersByClient = async (clientId: string) => {
//   try {
//     // Obtener las Ã³rdenes del cliente
//     const orders = await prisma.order.findMany({
//       where: {
//         clientId: clientId, // Filtramos las Ã³rdenes por clientId
//       },
//       include: {
//         shippingAddress: true, // Incluir la informaciÃ³n de la direcciÃ³n de envÃ­o
//         paymentSummary: true, // Incluir la informaciÃ³n del resumen de pago
//         orderProducts: {
//           include: {
//             product: true, // Incluir los productos de cada orden
//           },
//         },
//       },
//     });

//     return {
//       ok: true,
//       orders,
//       message: `Se encontraron ${orders.length} ordenes para el cliente.`,
//     };
//   } catch (error) {
//     console.error("Error al obtener las Ã³rdenes del cliente:", error);
//     return {
//       ok: false,
//       message: `Error al obtener las Ã³rdenes del cliente: ${error}`,
//     };
//   }
// };

interface Order {
  id: string;
  state: "paid" | "pending" | "canceled";
  status: string;
  paymentSummary?: {
    total: number;
  };
}

export const getOrdersByClient = async (
  clientId: string
): Promise<{ ok: boolean; orders: Order[]; message: string }> => {
  try {
    // Obtener las Ã³rdenes del cliente
    const orders = await prisma.order.findMany({
      where: {
        clientId: clientId, // Filtramos las Ã³rdenes por clientId
      },
      include: {
        paymentSummary: true, // Incluir la informaciÃ³n del resumen de pago
      },
    });

    // Mapear los resultados para que coincidan con la interfaz Order
    const formattedOrders: Order[] = orders.map((order) => ({
      id: order.id,
      state: order.state, // El estado de la orden: paid, pending, canceled
      status: order.status,
      paymentSummary: order.paymentSummary
        ? { total: order.paymentSummary.total }
        : undefined, // Solo incluir el total si paymentSummary existe
    }));

    return {
      ok: true,
      orders: formattedOrders,
      message: `Se encontraron ${formattedOrders.length} ordenes para el cliente.`,
    };
  } catch (error) {
    console.error("Error al obtener las Ã³rdenes del cliente:", error);
    return {
      ok: false,
      message: `Error al obtener las Ã³rdenes del cliente: ${error}`,
      orders: [],
    };
  }
};
