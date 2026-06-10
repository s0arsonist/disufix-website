'use server'

import nodemailer from "nodemailer";
import { getOrderDetailsId } from "../shipping/shipping";

// Configura el transporte SMTP
const transporter = nodemailer.createTransport({
  host: "smtp.hostinger.com",
  port: 465,
  secure: true,
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS,
  },
});

// FunciÃ³n para formatear moneda
function formatCurrency(amount) {
  return new Intl.NumberFormat("es-CO", {
    style: "currency",
    currency: "COP",
    minimumFractionDigits: 0,
  }).format(amount);
}

// FunciÃ³n para enviar correo de actualizaciÃ³n de estado
export const enviarActualizacionEstado = async (orderId, status) => {
  try {
    // ObtÃ©n la orden desde la base de datos
    const order = await getOrderDetailsId(orderId);

    if (!order) {
      return { ok: false, message: "Orden no encontrada" };
    }

    // Definir configuraciones segÃºn el estado
    const statusConfig = {
      procesando: {
        titulo: "Tu pedido estÃ¡ siendo procesado",
        mensaje: "Estamos preparando tu pedido para enviarlo pronto.",
        color: "#FF7A00",
        icono: "ð",
        asunto: "Tu pedido estÃ¡ siendo procesado - Disufix",
      },
      enviado: {
        titulo: "Â¡Tu pedido ha sido enviado!",
        mensaje: "Tu pedido estÃ¡ en camino. Pronto llegarÃ¡ a tu direcciÃ³n.",
        color: "#FF7A00",
        icono: "ð",
        asunto: "Tu pedido ha sido enviado - Disufix",
      },
      entregado: {
        titulo: "Â¡Tu pedido ha sido entregado!",
        mensaje:
          "Tu pedido ha sido entregado con Ã©xito. Â¡Esperamos que disfrutes tus productos!",
        color: "#FF7A00",
        icono: "â",
        asunto: "Tu pedido ha sido entregado - Disufix",
      },
      cancelado: {
        titulo: "Tu pedido ha sido cancelado",
        mensaje:
          "Lamentamos informarte que tu pedido ha sido cancelado. Si tienes alguna pregunta, no dudes en contactarnos.",
        color: "#FF7A00",
        icono: "â",
        asunto: "Tu pedido ha sido cancelado - Disufix",
      },
      reembolsado: {
        titulo: "Reembolso procesado",
        mensaje:
          "Hemos procesado el reembolso de tu pedido. El dinero deberÃ­a reflejarse en tu cuenta en los prÃ³ximos dÃ­as.",
        color: "#FF7A00",
        icono: "ð°",
        asunto: "Reembolso procesado - Disufix",
      },
    };

    // Si el estado no existe en la configuraciÃ³n, usar un valor predeterminado
    const config = statusConfig[status] || {
      titulo: `ActualizaciÃ³n de tu pedido: ${status}`,
      mensaje: "Hay una actualizaciÃ³n en el estado de tu pedido.",
      color: "#FF7A00",
      icono: "ð¦",
      asunto: `ActualizaciÃ³n de tu pedido - Disufix`,
    };

    // Generar informaciÃ³n de seguimiento si estÃ¡ disponible
    let seguimientoHTML = "";
    if (status === "enviado" && order.trackingNumber) {
      seguimientoHTML = `
        <table width="100%" style="margin:20px 0; background-color:#FFF8F0; border-radius:8px; padding:15px;">
          <tr>
            <td style="padding-bottom:10px;">
              <p style="margin:0; font-weight:bold; color:#FF7A00;">InformaciÃ³n de Seguimiento:</p>
            </td>
          </tr>
          <tr>
            <td>
              <p style="margin:5px 0; color:#4b5563;"><strong>NÃºmero de Seguimiento:</strong> ${
                order.trackingNumber
              }</p>
              ${
                order.courierName
                  ? `<p style="margin:5px 0; color:#4b5563;"><strong>Empresa de EnvÃ­o:</strong> ${order.courierName}</p>`
                  : ""
              }
              ${
                order.trackingUrl
                  ? `<p style="margin:10px 0;"><a href="${order.trackingUrl}" style="background-color:#FF7A00; color:white; padding:10px 15px; text-decoration:none; border-radius:4px; display:inline-block;">Seguir mi pedido</a></p>`
                  : ""
              }
            </td>
          </tr>
        </table>
      `;
    }

    // Generar resumen de productos
    const productList = order.orderProducts
      .map(
        (item) => `
        <tr>
          <td style="padding:12px; border-bottom:1px solid #e5e7eb;">
            <div style="display:flex; align-items:center;">
              <img src="${item.product.image}" alt="${item.product.name}" style="width:40px; height:40px; object-fit:cover; border-radius:4px; margin-right:10px;">
              <div>
                <p style="margin:0; font-weight:bold;">${item.product.name}</p>
                <p style="margin:0; color:#6b7280; font-size:12px;">Cantidad: ${item.quantity}</p>
              </div>
            </div>
          </td>
        </tr>
      `
      )
      .join("");

    // Generar HTML del correo
    const htmlCliente = `
      <!DOCTYPE html>
      <html lang="es">
      <head>
        <meta charset="UTF-8" />
        <meta name="viewport" content="width=device-width,initial-scale=1.0"/>
        <title>${config.asunto}</title>
      </head>
      <body style="margin:0; padding:0; font-family: Arial, sans-serif; background-color:#f5f5f5; color:#333;">
        <table width="100%" style="background-color:#f5f5f5; padding:20px 0;">
          <tr>
            <td align="center">
              <table width="600" style="background-color:#ffffff; border-radius:8px; overflow:hidden; box-shadow: 0 4px 6px rgba(0,0,0,0.1);">
                <!-- Header con logo -->
                <tr>
                  <td style="background: linear-gradient(to right, #FF7A00, #FF9A40); padding:30px 20px; text-align:center;">
                    <img src="https://disufix.com/imgs/logo.png" alt="Disufix Logo" style="max-height:60px; margin-bottom:10px;">
                    <h1 style="color:#ffffff; margin:0; font-size:24px;">${
                      config.icono
                    } ${config.titulo}</h1>
                  </td>
                </tr>
                
                <!-- Contenido principal -->
                <tr>
                  <td style="padding:30px 20px;">
                    <p style="margin-top:0; font-size:16px;">Hola <strong>${
                      order.client.nombre
                    } ${order.client.apellido || ""}</strong>,</p>
                    <p style="font-size:16px;">${config.mensaje}</p>
                    
                    <!-- Detalles del pedido -->
                    <table width="100%" style="margin:20px 0; background-color:#FFF8F0; border-radius:8px; padding:15px;">
                      <tr>
                        <td style="padding-bottom:10px;">
                          <p style="margin:0; font-weight:bold; color:#FF7A00;">Detalles del Pedido:</p>
                        </td>
                      </tr>
                      <tr>
                        <td>
                          <p style="margin:5px 0; color:#4b5563;"><strong>NÃºmero de Pedido:</strong> #${
                            order.id
                          }</p>
                          <p style="margin:5px 0; color:#4b5563;"><strong>Fecha:</strong> ${new Date(
                            order.createdAt
                          ).toLocaleDateString("es-CO", {
                            year: "numeric",
                            month: "long",
                            day: "numeric",
                          })}</p>
                          <p style="margin:5px 0; color:#4b5563;"><strong>Estado actual:</strong> <span style="color:${
                            config.color
                          }; font-weight:bold;">${
      status.charAt(0).toUpperCase() + status.slice(1)
    }</span></p>
                        </td>
                      </tr>
                    </table>
                    
                    ${seguimientoHTML}
                    
                    <!-- Resumen de productos -->
                    <p style="font-weight:bold; font-size:18px; margin:30px 0 10px 0; color:#FF7A00;">Resumen de tu pedido:</p>
                    <table width="100%" style="border-collapse:collapse; background-color:#FFF8F0; border-radius:8px; overflow:hidden;">
                      <tbody>
                        ${productList}
                      </tbody>
                    </table>
                    
                    ${
                      status === "entregado"
                        ? `
                    <!-- SecciÃ³n de valoraciÃ³n (solo para pedidos entregados) -->
                    <table width="100%" style="margin:30px 0 10px 0; background-color:#FFF8F0; border-radius:8px; padding:15px;">
                      <tr>
                        <td style="text-align:center;">
                          <p style="margin:0 0 10px 0; font-weight:bold; color:#FF7A00; font-size:18px;">Â¿QuÃ© te parecieron tus productos?</p>
                          <p style="margin:0 0 15px 0; color:#4b5563;">Tu opiniÃ³n es muy importante para nosotros. Â¡Nos encantarÃ­a saber quÃ© piensas!</p>
                          <a href="https://disufix.com/valorar-pedido/${order.id}" style="background-color:#FF7A00; color:white; padding:10px 20px; text-decoration:none; border-radius:4px; display:inline-block; font-weight:bold;">Valorar mi compra</a>
                        </td>
                      </tr>
                    </table>
                    `
                        : ""
                    }
                    
                    <!-- Contacto con WhatsApp -->
                    <table width="100%" style="margin:30px 0 10px 0; background-color:#FFF8F0; border-radius:8px; padding:15px;">
                      <tr>
                        <td>
                          <p style="margin:0 0 10px 0; font-weight:bold; color:#FF7A00;">Â¿Tienes alguna pregunta?</p>
                          <p style="margin:0 0 10px 0; color:#4b5563;">Si tienes alguna duda sobre tu pedido, no dudes en contactarnos:</p>
                          <p style="margin:0; color:#4b5563;">
                            <a href="https://wa.me/573156458075" style="color:#FF7A00; text-decoration:none; font-weight:bold;">
                              WhatsApp: +57 315 645 8075
                            </a>
                          </p>
                        </td>
                      </tr>
                    </table>
                  </td>
                </tr>
                
                <!-- Footer -->
                <tr>
                  <td style="background-color:#FF7A00; color:#ffffff; padding:20px; text-align:center;">
                    <p style="margin:0 0 10px 0; font-size:14px;">Â© ${new Date().getFullYear()} Disufix. Todos los derechos reservados.</p>
                    <p style="margin:0; font-size:12px;">Este correo fue enviado a ${
                      order.shippingAddress.email
                    } porque realizaste una compra en nuestra tienda.</p>
                  </td>
                </tr>
              </table>
            </td>
          </tr>
        </table>
      </body>
      </html>
    `;

    // Enviar el correo al cliente
    const correoCliente = {
      from: `"Disufix" <${process.env.EMAIL_USER}>`,
      to: order.shippingAddress.email,
      subject: config.asunto,
      html: htmlCliente,
    };

    await transporter.sendMail(correoCliente);

    return {
      ok: true,
      message: `Correo de actualizaciÃ³n de estado "${status}" enviado correctamente al cliente.`,
    };
  } catch (error) {
    console.error("Error al enviar el correo de actualizaciÃ³n:", error);
    return {
      ok: false,
      message: "Error al enviar el correo de actualizaciÃ³n.",
    };
  }
};
