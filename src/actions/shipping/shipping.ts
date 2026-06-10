"use server";

import { StateOrder } from "@/interfaces";
import prisma from "@/lib/db";
import { stat } from "fs";
// ------------------ SHIPPING ADDRESS ------------------
export const createShippingAddress = async (data: any) => {
  try {
    const shippingAddress = await prisma.shippingAddress.create({ data });
    return { ok: true, shippingAddress, message: "DirecciÃ³n creada" };
  } catch (error) {
    console.error(error);
    return { ok: false, message: "Error al crear direcciÃ³n" };
  }
};

export const getShippingAddresses = async () =>
  prisma.shippingAddress.findMany();
export const getShippingAddressById = async (id: string) =>
  prisma.shippingAddress.findUnique({ where: { id } });
export const updateShippingAddress = async (id: string, data: any) =>
  prisma.shippingAddress.update({ where: { id }, data });
export const deleteShippingAddress = async (id: string) =>
  prisma.shippingAddress.delete({ where: { id } });

// ------------------ PAYMENT SUMMARY ------------------
export const createPaymentSummary = async (
  subtotal: number,
  shipping: number,
  total: number
) => {
  try {
    const paymentSummary = await prisma.paymentSummary.create({
      data: { subtotal, shipping, total },
    });
    return { ok: true, paymentSummary, message: "Resumen de pago creado" };
  } catch (error) {
    console.error(error);
    return { ok: false, message: "Error al crear resumen de pago" };
  }
};

export const getPaymentSummaries = async () => prisma.paymentSummary.findMany();
export const getPaymentSummaryById = async (id: string) =>
  prisma.paymentSummary.findUnique({ where: { id } });
export const updatePaymentSummary = async (id: string, data: any) =>
  prisma.paymentSummary.update({ where: { id }, data });
export const deletePaymentSummary = async (id: string) =>
  prisma.paymentSummary.delete({ where: { id } });

// ------------------ ORDER ------------------
export const createOrder = async (data: any) => {
  try {
    const order = await prisma.order.create({ data });
    return { ok: true, order, message: "Orden creada" };
  } catch (error) {
    console.error(error);
    return { ok: false, message: "Error al crear orden" };
  }
};

export const getOrders = async () => prisma.order.findMany();
export const getOrderById = async (id: string) =>
  prisma.order.findUnique({ where: { id } });
// ------------------ GET ORDER WITH SHIPPING INFORMATION ------------------
export const getOrderWithShippingInfo = async (orderId: string) => {
  try {
    // Obtener la orden con la informaciÃ³n de envÃ­o
    const order = await prisma.order.findUnique({
      where: { id: orderId },
      include: {
        shippingAddress: true,
      },
    });

    if (!order) {
      return { ok: false, message: "Orden no encontrada" };
    }

    return {
      ok: true,
      order,
      message: "Orden y direcciÃ³n de envÃ­o recuperadas exitosamente",
    };
  } catch (error) {
    console.error(error);
    return {
      ok: false,
      message: "Error al obtener la orden con la informaciÃ³n de envÃ­o",
    };
  }
};

export const updateOrder = async (id: string, data: any) =>
  prisma.order.update({ where: { id }, data });
export const deleteOrder = async (id: string) =>
  prisma.order.delete({ where: { id } });

// ------------------ ORDER PRODUCT ------------------
export const createOrderProduct = async (
  orderId: string,
  productId: string,
  quantity: number
) => {
  try {
    const orderProduct = await prisma.orderProduct.create({
      data: { orderId, productId, quantity },
    });
    return { ok: true, orderProduct, message: "Producto en orden creado" };
  } catch (error) {
    console.error(error);
    return { ok: false, message: "Error al crear producto en orden" };
  }
};

export const getOrderProducts = async () => prisma.orderProduct.findMany();

export const createProductOrder = async (data: {
  name: string;
  price: number;
  image: string;
  size: string;
  color: string;
  description: string;
  featured: boolean;
  category: string;
}) => {
  try {
    // Crear el nuevo producto en la tabla ProductOrder
    const productOrder = await prisma.productOrder.create({
      data: {
        name: data.name,
        price: data.price,
        image: data.image,
        size: data.size,
        color: data.color,
        description: data.description,
        featured: data.featured,
        category: data.category,
      },
    });

    return { ok: true, productOrder, message: "Producto en orden creado" };
  } catch (error) {
    console.error("Error al crear el producto en orden:", error);
    return { ok: false, message: "Error al crear producto en orden" };
  }
};

//actuallizar una orden.
// ------------------ UPDATE ORDER ------------------
export const updateOrderStatus = async (
  orderId: string,
  state: StateOrder | any,
  paymentMethod: string,
  clientId: string
) => {
  try {
    if (state === undefined) {
      return { ok: false, message: "Faltan datos para actualizar la orden" };
    }

    // Actualizamos la orden con el nuevo estado, mÃ©todo de pago y cliente
    const updatedOrder = await prisma.order.update({
      where: { id: orderId },
      data: {
        state, // Actualiza el estado de la orden
        paymentMethod, // Actualiza el mÃ©todo de pago
        clientId, // Asigna el cliente a la orden
      },
    });

    return {
      ok: true,
      updatedOrder,
      message: "Orden actualizada exitosamente",
    };
  } catch (error) {
    console.error(error);
    return { ok: false, message: "Error al actualizar la orden" };
  }
};

// FunciÃ³n para obtener el nÃºmero de Ã³rdenes con estado "paid"
export const getTotalPaidOrdersCount = async () => {
  try {
    // Contar las Ã³rdenes cuyo estado es "paid"
    const totalPaidOrders = await prisma.order.count({
      where: {
        state: "paid", // Filtramos las Ã³rdenes con estado "paid"
      },
    });
    return { ok: true, totalPaidOrders }; // Retorna el nÃºmero total de Ã³rdenes "paid"
  } catch (error) {
    console.error(
      "Error al obtener el nÃºmero de Ã³rdenes con estado 'paid':",
      error
    );
    return {
      ok: false,
      message: "Error al obtener el nÃºmero de Ã³rdenes con estado 'paid'",
    }; // Manejo de errores
  }
};

export const getProductsSold = async () => {
  try {
    // Obtener la cantidad de productos vendidos en todas las Ã³rdenes con estado "paid"
    const totalSold = await prisma.orderProduct.aggregate({
      where: {
        order: {
          state: "paid", // Solo contar productos de Ã³rdenes pagadas
        },
      },
      _sum: {
        quantity: true, // Sumar la cantidad de productos vendidos
      },
    });

    return totalSold._sum.quantity || 0; // Devuelve el total de productos vendidos
  } catch (error) {
    console.error("Error al obtener los productos vendidos:", error);
    return 0;
  }
};

// FunciÃ³n para obtener el nÃºmero de Ã³rdenes pendientes
export const getPendingOrdersCount = async () => {
  try {
    // Obtener las Ã³rdenes cuyo estado sea "pendiente"
    const pendingOrders = await prisma.order.count({
      where: {
        status: "pendiente", // Filtrar por Ã³rdenes pendientes
      },
    });

    return { ok: true, count: pendingOrders }; // Devolver el nÃºmero de Ã³rdenes pendientes
  } catch (error) {
    console.error("Error al obtener el nÃºmero de Ã³rdenes pendientes:", error);
    return {
      ok: false,
      message: "Error al obtener el nÃºmero de Ã³rdenes pendientes",
    };
  }
};

export const getOrderDetails = async () => {
  try {
    // Obtener los detalles de la orden usando prisma con la opciÃ³n `include`
    const order = await prisma.order.findMany({
      include: {
        orderProducts: {
          include: {
            product: true, // Incluir los productos asociados con esta orden
          },
        },
        shippingAddress: true, // Incluir la direcciÃ³n de envÃ­o
        paymentSummary: true, // Incluir el resumen de pago
        client: true, // Incluir los detalles del cliente
        user: true, // Incluir los detalles del usuario
      },
    });

    // Si no se encuentra la orden
    if (!order) {
      return { ok: false, message: "Orden no encontrada" };
    }

    // Devolver los datos de la orden
    return { ok: true, order };
  } catch (error) {
    console.error("Error al obtener los detalles de la orden:", error);
    return { ok: false, message: "Error al obtener los detalles de la orden" };
  }
};

// FunciÃ³n para obtener todas las Ã³rdenes con sus relaciones
// FunciÃ³n para obtener todas las Ã³rdenes con sus relaciones
export const getAllOrders = async () => {
  try {
    // Obtener todas las Ã³rdenes con sus relaciones
    const orders = await prisma.order.findMany({
      include: {
        orderProducts: {
          include: {
            product: true, // Incluir los productos asociados con esta orden
          },
        },
        shippingAddress: true, // Incluir la direcciÃ³n de envÃ­o
        paymentSummary: true, // Incluir el resumen de pago
        client: true, // Incluir los detalles del cliente
        user: true, // Incluir los detalles del usuario
      },
    });

    // AsegÃºrate de que no haya Ã³rdenes con `null` en las relaciones
    const safeOrders = orders.map((order) => ({
      ...order,
      shippingAddress: order.shippingAddress
        ? {
            ...order.shippingAddress, // Desestructuramos el objeto original
            firstName: order.shippingAddress.firstName ?? "",
            lastName: order.shippingAddress.lastName ?? "",
            city: order.shippingAddress.city ?? "",
            state: order.shippingAddress.state ?? "",
            notes: order.shippingAddress.notes ?? "",
            phone: order.shippingAddress.phone ?? "",
            email: order.shippingAddress.email ?? "",
          }
        : {
            // Si shippingAddress es nulo, proporcionar valores predeterminados
            id: "",
            address: "",
            firstName: "",
            lastName: "",
            city: "",
            state: "",
            notes: "",
            phone: "",
            email: "",
          },
      paymentSummary: order.paymentSummary ?? { id: "", subtotal: 0, total: 0 },
      client: order.client ?? { id: "", nombre: "" },
      user: order.user ?? { id: "", nombreCompleto: "" },
    }));

    return { ok: true, orders: safeOrders };
  } catch (error) {
    console.error("Error al obtener las Ã³rdenes:", error);
    return { ok: false, message: "Error al obtener las Ã³rdenes" };
  }
};

export const updateOrderStatuss = async (
  orderId: string,
  newStatus: string
) => {
  try {
    // Verificar si la orden existe
    const existingOrder = await prisma.order.findUnique({
      where: { id: orderId },
    });

    if (!existingOrder) {
      throw new Error("Orden no encontrada");
    }

    // Actualizar el estado de la orden
    const updatedOrder = await prisma.order.update({
      where: { id: orderId },
      data: {
        status: newStatus, // Cambiar el estado de la orden
      },
    });

    return {
      ok: true,
      message: "Estado de la orden actualizado con Ã©xito",
      updatedOrder,
    };
  } catch (error) {
    console.error("Error al actualizar el estado de la orden:", error);
    return {
      ok: false,
      message: `Error al actualizar el estado de la orden: ${error}`,
    };
  }
};

export const deleteOrderfull = async (orderId: string) => {
  try {
    // Verificar si la orden existe
    const existingOrder = await prisma.order.findUnique({
      where: { id: orderId },
      include: {
        orderProducts: true, // Incluir los productos asociados con la orden
        shippingAddress: true, // Incluir la direcciÃ³n de envÃ­o asociada
        paymentSummary: true, // Incluir el resumen de pago asociado
      },
    });

    if (!existingOrder) {
      throw new Error("Orden no encontrada");
    }

    // Eliminar los productos relacionados con la orden
    await prisma.orderProduct.deleteMany({
      where: { orderId: orderId },
    });

    // Eliminar la direcciÃ³n de envÃ­o si existe
    if (existingOrder.shippingAddress) {
      await prisma.shippingAddress.delete({
        where: { id: existingOrder.shippingAddress.id },
      });
    }

    // Eliminar el resumen de pago si existe
    if (existingOrder.paymentSummary) {
      await prisma.paymentSummary.delete({
        where: { id: existingOrder.paymentSummary.id },
      });
    }

    // Finalmente, eliminar la orden
    await prisma.order.delete({
      where: { id: orderId },
    });

    return {
      ok: true,
      message: "Orden eliminada con Ã©xito",
    };
  } catch (error) {
    console.error("Error al eliminar la orden:", error);
    return {
      ok: false,
      message: `Error al eliminar la orden: ${error}`,
    };
  }
};

export const getOrderProductss = async (orderId: string) => {
  try {
    // Realizamos la consulta a la base de datos para obtener los productos de la orden
    const orderWithProducts = await prisma.order.findUnique({
      where: { id: orderId },
      include: {
        orderProducts: {
          include: {
            product: true, // AsegÃºrate de incluir los detalles del producto
          },
        },
      },
    });

    if (!orderWithProducts) {
      throw new Error("Orden no encontrada");
    }

    // Obtener la lista de productos
    const products = orderWithProducts.orderProducts.map((orderProduct) => ({
      productId: orderProduct.product.id,
      name: orderProduct.product.name,
      price: orderProduct.product.price,
      quantity: orderProduct.quantity,
      image: orderProduct.product.image,
    }));

    return products; // Devolver la lista de productos
  } catch (error) {
    console.error("Error al obtener los productos de la orden:", error);
    throw new Error("No se pudieron obtener los productos de la orden");
  }
};

export const getOrderDetailsId = async (orderId: string) => {
  try {
    // Obtener la orden junto con sus productos, direcciÃ³n de envÃ­o y resumen de pago
    const order = await prisma.order.findUnique({
      where: { id: orderId },
      include: {
        orderProducts: {
          include: {
            product: true, // Incluye la informaciÃ³n del producto
          },
        },
        shippingAddress: true,
        paymentSummary: true,
        client: true,
      },
    });

    if (!order) {
      throw new Error("Orden no encontrada");
    }

    return order; // Devuelve la orden completa con los detalles
  } catch (error) {
    console.error("Error al obtener los detalles de la orden:", error);
    throw new Error("No se pudo obtener los detalles de la orden");
  }
};
