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

// FunciÃ³n para enviar el correo de confirmaciÃ³n
export const enviarConfirmacionOrden = async (orderId) => {
  try {
    // ObtÃ©n la orden desde la base de datos
    const order = await getOrderDetailsId(orderId);
    console.log("orden", order);

    // Genera el HTML para los productos
    const productRows = order.orderProducts
      .map(
        (item) => ` 
        <tr>
          <td style="padding:12px; border-bottom:1px solid #e5e7eb;">
            <div style="display:flex; align-items:center;">
              <img src="${item.product.image}" alt="${
          item.product.name
        }" style="width:50px; height:50px; object-fit:cover; border-radius:4px; margin-right:10px;">
              <div>
                <p style="margin:0; font-weight:bold;">${item.product.name}</p>
                <p style="margin:0; color:#6b7280; font-size:12px;">Talla: ${
                  item.product.size
                } | Color: ${item.product.color}</p>
              </div>
            </div>
          </td>
          <td style="padding:12px; border-bottom:1px solid #e5e7eb; text-align:center;">${
            item.quantity
          }</td>
          <td style="padding:12px; border-bottom:1px solid #e5e7eb; text-align:right;">${formatCurrency(
            item.product.price
          )}</td>
          <td style="padding:12px; border-bottom:1px solid #e5e7eb; text-align:right; font-weight:bold;">${formatCurrency(
            item.product.price * item.quantity
          )}</td>
        </tr>`
      )
      .join("");

    // Calcular el subtotal
    const subtotal = order.orderProducts.reduce(
      (total, item) => total + item.product.price * item.quantity,
      0
    );

    // HTML para el cliente (incluye WhatsApp)
    const htmlCliente = `
      <!DOCTYPE html>
      <html lang="es">
      <head>
        <meta charset="UTF-8" />
        <meta name="viewport" content="width=device-width,initial-scale=1.0"/>
        <title>ConfirmaciÃ³n de Pedido - Disufix</title>
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
                    <h1 style="color:#ffffff; margin:0; font-size:24px;">Â¡Gracias por tu compra!</h1>
                  </td>
                </tr>
                
                <!-- Contenido principal -->
                <tr>
                  <td style="padding:30px 20px;">
                    <p style="margin-top:0; font-size:16px;">Hola <strong>${
                      order.client.nombre
                    } ${order.client.apellido || ""}</strong>,</p>
                    <p style="font-size:16px;">Hemos recibido tu pedido correctamente. A continuaciÃ³n encontrarÃ¡s los detalles de tu compra:</p>
                    
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
                          <p style="margin:5px 0; color:#4b5563;"><strong>Fecha:</strong> ${new Date().toLocaleDateString(
                            "es-CO",
                            { year: "numeric", month: "long", day: "numeric" }
                          )}</p>
                          <p style="margin:5px 0; color:#4b5563;"><strong>MÃ©todo de Pago:</strong> ${
                            order.paymentMethod
                          }</p>
                        </td>
                      </tr>
                    </table>
                    
                    <!-- DirecciÃ³n de envÃ­o -->
                    <table width="100%" style="margin:20px 0; background-color:#FFF8F0; border-radius:8px; padding:15px;">
                      <tr>
                        <td style="padding-bottom:10px;">
                          <p style="margin:0; font-weight:bold; color:#FF7A00;">DirecciÃ³n de EnvÃ­o:</p>
                        </td>
                      </tr>
                      <tr>
                        <td>
                          <p style="margin:5px 0; color:#4b5563;">${
                            order.shippingAddress.address
                          }</p>
                          <p style="margin:5px 0; color:#4b5563;">${
                            order.shippingAddress.city
                          }, ${order.shippingAddress.state || ""}</p>
                          <p style="margin:5px 0; color:#4b5563;">Nota: ${
                            order.shippingAddress.notes
                          }</p>
                        </td>
                      </tr>
                    </table>
                    
                    <!-- Productos -->
                    <p style="font-weight:bold; font-size:18px; margin:30px 0 10px 0; color:#FF7A00;">Productos:</p>
                    <table width="100%" style="border-collapse:collapse;">
                      <thead>
                        <tr style="background-color:#FFF8F0;">
                          <th style="padding:12px; text-align:left; border-bottom:2px solid #FFE0C2;">Producto</th>
                          <th style="padding:12px; text-align:center; border-bottom:2px solid #FFE0C2;">Cantidad</th>
                          <th style="padding:12px; text-align:right; border-bottom:2px solid #FFE0C2;">Precio</th>
                          <th style="padding:12px; text-align:right; border-bottom:2px solid #FFE0C2;">Subtotal</th>
                        </tr>
                      </thead>
                      <tbody>
                        ${productRows}
                      </tbody>
                    </table>
                    
                    <!-- Resumen de pago -->
                    <table width="100%" style="margin:30px 0; border-collapse:collapse;">
                      <tr>
                        <td width="60%"></td>
                        <td width="40%">
                          <table width="100%" style="border-collapse:collapse;">
                            <tr>
                              <td style="padding:8px 0; color:#6b7280;">Subtotal:</td>
                              <td style="padding:8px 0; text-align:right; color:#6b7280;">${formatCurrency(
                                subtotal
                              )}</td>
                            </tr>
                            <tr>
                              <td style="padding:8px 0; color:#6b7280;">EnvÃ­o:</td>
                              <td style="padding:8px 0; text-align:right; color:#6b7280;">${formatCurrency(
                                order.paymentSummary.shipping || 0
                              )}</td>
                            </tr>
                            <tr>
                              <td style="padding:12px 0; font-weight:bold; font-size:18px; border-top:2px solid #FFE0C2;">Total:</td>
                              <td style="padding:12px 0; text-align:right; font-weight:bold; font-size:18px; color:#FF7A00; border-top:2px solid #FFE0C2;">${formatCurrency(
                                subtotal + (order.paymentSummary.shipping || 0)
                              )}</td>
                            </tr>
                          </table>
                        </td>
                      </tr>
                    </table>
                    
                    <!-- InformaciÃ³n de seguimiento -->
                    <p style="margin:30px 0 10px 0; font-size:16px;">Te enviaremos una notificaciÃ³n cuando tu pedido sea enviado con la informaciÃ³n de seguimiento correspondiente.</p>
                    
                    <!-- Contacto con WhatsApp (solo para cliente) -->
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

    // HTML para el administrador (sin WhatsApp)
    const htmlAdmin = `
      <!DOCTYPE html>
      <html lang="es">
      <head>
        <meta charset="UTF-8" />
        <meta name="viewport" content="width=device-width,initial-scale=1.0"/>
        <title>Nuevo Pedido - Disufix</title>
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
                    <h1 style="color:#ffffff; margin:0; font-size:24px;">Â¡Nuevo Pedido Recibido!</h1>
                  </td>
                </tr>
                
                <!-- Contenido principal -->
                <tr>
                  <td style="padding:30px 20px;">
                    <p style="margin-top:0; font-size:16px;">Se ha recibido un nuevo pedido con los siguientes detalles:</p>
                    
                    <!-- InformaciÃ³n del cliente -->
                    <table width="100%" style="margin:20px 0; background-color:#FFF8F0; border-radius:8px; padding:15px;">
                      <tr>
                        <td style="padding-bottom:10px;">
                          <p style="margin:0; font-weight:bold; color:#FF7A00;">InformaciÃ³n del Cliente:</p>
                        </td>
                      </tr>
                      <tr>
                        <td>
                          <p style="margin:5px 0; color:#4b5563;"><strong>Nombre:</strong> ${
                            order.client.nombre
                          } ${order.client.apellido || ""}</p>
                          <p style="margin:5px 0; color:#4b5563;"><strong>Email:</strong> ${
                            order.shippingAddress.email
                          }</p>
                          <p style="margin:5px 0; color:#4b5563;"><strong>TelÃ©fono:</strong> ${
                            order.client.telefono || "No especificado"
                          }</p>
                        </td>
                      </tr>
                    </table>
                    
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
                          <p style="margin:5px 0; color:#4b5563;"><strong>Fecha:</strong> ${new Date().toLocaleDateString(
                            "es-CO",
                            { year: "numeric", month: "long", day: "numeric" }
                          )}</p>
                          <p style="margin:5px 0; color:#4b5563;"><strong>MÃ©todo de Pago:</strong> ${
                            order.paymentMethod
                          }</p>
                        </td>
                      </tr>
                    </table>
                    
                    <!-- DirecciÃ³n de envÃ­o -->
                    <table width="100%" style="margin:20px 0; background-color:#FFF8F0; border-radius:8px; padding:15px;">
                      <tr>
                        <td style="padding-bottom:10px;">
                          <p style="margin:0; font-weight:bold; color:#FF7A00;">DirecciÃ³n de EnvÃ­o:</p>
                        </td>
                      </tr>
                      <tr>
                        <td>
                          <p style="margin:5px 0; color:#4b5563;">${
                            order.shippingAddress.address
                          }</p>
                          <p style="margin:5px 0; color:#4b5563;">${
                            order.shippingAddress.city
                          }, ${order.shippingAddress.state || ""}</p>
                           <p style="margin:5px 0; color:#4b5563;">Nota: ${
                             order.shippingAddress.notes
                           }</p>
                        </td>
                      </tr>
                    </table>
                    
                    <!-- Productos -->
                    <p style="font-weight:bold; font-size:18px; margin:30px 0 10px 0; color:#FF7A00;">Productos:</p>
                    <table width="100%" style="border-collapse:collapse;">
                      <thead>
                        <tr style="background-color:#FFF8F0;">
                          <th style="padding:12px; text-align:left; border-bottom:2px solid #FFE0C2;">Producto</th>
                          <th style="padding:12px; text-align:center; border-bottom:2px solid #FFE0C2;">Cantidad</th>
                          <th style="padding:12px; text-align:right; border-bottom:2px solid #FFE0C2;">Precio</th>
                          <th style="padding:12px; text-align:right; border-bottom:2px solid #FFE0C2;">Subtotal</th>
                        </tr>
                      </thead>
                      <tbody>
                        ${productRows}
                      </tbody>
                    </table>
                    
                    <!-- Resumen de pago -->
                    <table width="100%" style="margin:30px 0; border-collapse:collapse;">
                      <tr>
                        <td width="60%"></td>
                        <td width="40%">
                          <table width="100%" style="border-collapse:collapse;">
                            <tr>
                              <td style="padding:8px 0; color:#6b7280;">Subtotal:</td>
                              <td style="padding:8px 0; text-align:right; color:#6b7280;">${formatCurrency(
                                subtotal
                              )}</td>
                            </tr>
                            <tr>
                              <td style="padding:8px 0; color:#6b7280;">EnvÃ­o:</td>
                              <td style="padding:8px 0; text-align:right; color:#6b7280;">${formatCurrency(
                                order.paymentSummary.shipping || 0
                              )}</td>
                            </tr>
                            <tr>
                              <td style="padding:12px 0; font-weight:bold; font-size:18px; border-top:2px solid #FFE0C2;">Total:</td>
                              <td style="padding:12px 0; text-align:right; font-weight:bold; font-size:18px; color:#FF7A00; border-top:2px solid #FFE0C2;">${formatCurrency(
                                subtotal + (order.paymentSummary.shipping || 0)
                              )}</td>
                            </tr>
                          </table>
                        </td>
                      </tr>
                    </table>
                  </td>
                </tr>
                
                <!-- Footer -->
                <tr>
                  <td style="background-color:#FF7A00; color:#ffffff; padding:20px; text-align:center;">
                    <p style="margin:0 0 10px 0; font-size:14px;">Â© ${new Date().getFullYear()} Disufix. Todos los derechos reservados.</p>
                    <p style="margin:0; font-size:12px;">Este es un correo automÃ¡tico del sistema de pedidos de Disufix.</p>
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
      to: order.shippingAddress.email, // Enviar al cliente
      subject: `ConfirmaciÃ³n de tu pedido #${order.id} - Disufix`,
      html: htmlCliente,
    };

    await transporter.sendMail(correoCliente);

    // Enviar el correo a la administraciÃ³n
    const correoAdmin = {
      from: `"Disufix" <${process.env.EMAIL_USER}>`,
      to: process.env.ADMIN_EMAIL, // Admin
      subject: `Nuevo pedido #${order.id} - Disufix`,
      html: htmlAdmin, // Usando la plantilla especÃ­fica para admin
    };

    await transporter.sendMail(correoAdmin);

    return {
      ok: true,
      message:
        "Correo de confirmaciÃ³n enviado correctamente a cliente y administraciÃ³n.",
    };
  } catch (error) {
    console.error("Error al enviar el correo:", error);
    return { ok: false, message: "Error al enviar el correo." };
  }
};
