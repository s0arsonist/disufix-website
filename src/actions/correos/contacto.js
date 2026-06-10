"use server";

import nodemailer from "nodemailer";

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

export const enviarCorreoContacto = async (
  nombre,
  email,
  telefono,
  mensaje,
  asunto = "Nuevo mensaje - Formulario de Contacto" // ParÃ¡metro asunto con valor predeterminado
) => {
  const correoHTML = `
    <!DOCTYPE html>
    <html lang="es">
    <head>
      <meta charset="UTF-8" />
      <meta name="viewport" content="width=device-width,initial-scale=1.0"/>
      <title>${asunto}</title>
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
                  <h1 style="color:#ffffff; margin:0; font-size:24px;">Nuevo Mensaje de Contacto</h1>
                </td>
              </tr>

              <!-- Contenido principal -->
              <tr>
                <td style="padding:30px 20px;">
                  <p style="margin-top:0; font-size:16px;">Has recibido un nuevo mensaje desde el formulario de contacto:</p>

                  <!-- Detalles del contacto -->
                  <table width="100%" style="margin:20px 0; background-color:#FFF8F0; border-radius:8px; padding:15px;">
                    <tr>
                      <td style="padding-bottom:10px;">
                        <p style="margin:0; font-weight:bold; color:#FF7A00;">InformaciÃ³n del Contacto:</p>
                      </td>
                    </tr>
                    <tr>
                      <td>
                        <p style="margin:10px 0; color:#4b5563;"><strong style="color:#FF7A00;">Nombre:</strong> ${nombre}</p>
                        <p style="margin:10px 0; color:#4b5563;"><strong style="color:#FF7A00;">Email:</strong> <a href="mailto:${email}" style="color:#FF7A00; text-decoration:none;">${email}</a></p>
                        <p style="margin:10px 0; color:#4b5563;"><strong style="color:#FF7A00;">TelÃ©fono:</strong> <a href="tel:${telefono}" style="color:#FF7A00; text-decoration:none;">${telefono}</a></p>
                      </td>
                    </tr>
                  </table>

                  <!-- Mensaje -->
                  <table width="100%" style="margin:20px 0; background-color:#FFF8F0; border-radius:8px; padding:15px;">
                    <tr>
                      <td style="padding-bottom:10px;">
                        <p style="margin:0; font-weight:bold; color:#FF7A00;">Mensaje:</p>
                      </td>
                    </tr>
                    <tr>
                      <td>
                        <p style="margin:10px 0; color:#4b5563; line-height:1.6;">${mensaje.replace(
                          /\n/g,
                          "<br>"
                        )}</p>
                      </td>
                    </tr>
                  </table>

                  <!-- Acciones rÃ¡pidas -->
                  <table width="100%" style="margin:30px 0 10px 0; text-align:center;">
                    <tr>
                      <td>
                        <a href="mailto:${email}" style="background-color:#FF7A00; color:white; padding:10px 20px; text-decoration:none; border-radius:4px; display:inline-block; margin:0 10px 10px 0;">
                          Responder por Email
                        </a>
                        <a href="tel:${telefono}" style="background-color:#FF7A00; color:white; padding:10px 20px; text-decoration:none; border-radius:4px; display:inline-block; margin:0 0 10px 0;">
                          Llamar
                        </a>
                      </td>
                    </tr>
                  </table>
                </td>
              </tr>

              <!-- Footer -->
              <tr>
                <td style="background-color:#FF7A00; color:#ffffff; padding:20px; text-align:center;">
                  <p style="margin:0 0 10px 0; font-size:14px;">Â© ${new Date().getFullYear()} Disufix. Todos los derechos reservados.</p>
                  <p style="margin:0; font-size:12px;">Este es un correo automÃ¡tico del sistema de contacto de Disufix.</p>
                </td>
              </tr>
            </table>
          </td>
        </tr>
      </table>
    </body>
    </html>
  `;

  const correoDisufix = {
    from: `"Formulario de Contacto - Disufix" <${process.env.EMAIL_USER}>`,
    to: process.env.ADMIN_EMAIL || "info@disufix.com", // Usar variable de entorno o direcciÃ³n predeterminada
    subject: asunto,
    html: correoHTML,
    replyTo: email, // Permite responder directamente al remitente
  };

  try {
    await transporter.sendMail(correoDisufix);

    // Enviar confirmaciÃ³n al cliente (opcional)
    const confirmacionCliente = {
      from: `"Disufix" <${process.env.EMAIL_USER}>`,
      to: email,
      subject: "Hemos recibido tu mensaje - Disufix",
      html: `
        <!DOCTYPE html>
        <html lang="es">
        <head>
          <meta charset="UTF-8" />
          <meta name="viewport" content="width=device-width,initial-scale=1.0"/>
          <title>Mensaje Recibido - Disufix</title>
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
                      <h1 style="color:#ffffff; margin:0; font-size:24px;">Â¡Hemos recibido tu mensaje!</h1>
                    </td>
                  </tr>

                  <!-- Contenido principal -->
                  <tr>
                    <td style="padding:30px 20px;">
                      <p style="margin-top:0; font-size:16px;">Hola <strong>${nombre}</strong>,</p>
                      <p style="font-size:16px;">Gracias por contactarnos. Hemos recibido tu mensaje y nos pondremos en contacto contigo lo antes posible.</p>

                      <!-- Resumen del mensaje -->
                      <table width="100%" style="margin:20px 0; background-color:#FFF8F0; border-radius:8px; padding:15px;">
                        <tr>
                          <td style="padding-bottom:10px;">
                            <p style="margin:0; font-weight:bold; color:#FF7A00;">Resumen de tu mensaje:</p>
                          </td>
                        </tr>
                        <tr>
                          <td>
                            <p style="margin:5px 0; color:#4b5563;"><strong>Asunto:</strong> ${asunto.replace(
                              "Nuevo mensaje - Formulario de Contacto",
                              "Consulta general"
                            )}</p>
                            <p style="margin:5px 0; color:#4b5563;"><strong>Fecha:</strong> ${new Date().toLocaleDateString(
                              "es-CO",
                              { year: "numeric", month: "long", day: "numeric" }
                            )}</p>
                          </td>
                        </tr>
                      </table>

                      <!-- Contacto con WhatsApp -->
                      <table width="100%" style="margin:30px 0 10px 0; background-color:#FFF8F0; border-radius:8px; padding:15px;">
                        <tr>
                          <td>
                            <p style="margin:0 0 10px 0; font-weight:bold; color:#FF7A00;">Â¿Necesitas ayuda inmediata?</p>
                            <p style="margin:0 0 10px 0; color:#4b5563;">Si tu consulta es urgente, puedes contactarnos directamente:</p>
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
                      <p style="margin:0; font-size:12px;">Este es un correo automÃ¡tico, por favor no respondas a este mensaje.</p>
                    </td>
                  </tr>
                </table>
              </td>
            </tr>
          </table>
        </body>
        </html>
      `,
    };

    await transporter.sendMail(confirmacionCliente);

    return {
      ok: true,
      message: "Mensaje enviado correctamente. Te responderemos pronto.",
    };
  } catch (error) {
    console.error("Error al enviar el correo:", error);
    return {
      ok: false,
      message: "Error al enviar el mensaje. Por favor intenta nuevamente.",
    };
  }
};
