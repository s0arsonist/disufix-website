'use server'

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

export const enviarCodigoRecuperacion = async (email, codigo) => {
  // Validar que el email y cÃ³digo existan
  if (!email || !codigo) {
    return {
      ok: false,
      message: "Email y cÃ³digo son requeridos",
    };
  }

  // Generar el HTML del correo
  const htmlCorreo = `
    <!DOCTYPE html>
    <html lang="es">
    <head>
      <meta charset="UTF-8" />
      <meta name="viewport" content="width=device-width,initial-scale=1.0"/>
      <title>RecuperaciÃ³n de ContraseÃ±a - Disufix</title>
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
                  <h1 style="color:#ffffff; margin:0; font-size:24px;">RecuperaciÃ³n de ContraseÃ±a</h1>
                </td>
              </tr>
              
              <!-- Contenido principal -->
              <tr>
                <td style="padding:30px 20px;">
                  <p style="margin-top:0; font-size:16px;">Hola,</p>
                  <p style="font-size:16px;">Hemos recibido una solicitud para restablecer la contraseÃ±a de tu cuenta. Utiliza el siguiente cÃ³digo para completar el proceso:</p>
                  
                  <!-- CÃ³digo de recuperaciÃ³n -->
                  <table width="100%" style="margin:30px 0; text-align:center;">
                    <tr>
                      <td>
                        <div style="background-color:#FFF8F0; border:2px dashed #FF7A00; padding:20px; border-radius:8px; display:inline-block; min-width:200px;">
                          <p style="margin:0; font-size:28px; font-weight:bold; letter-spacing:5px; color:#FF7A00;">${codigo}</p>
                        </div>
                      </td>
                    </tr>
                  </table>
                  
                  <!-- Instrucciones -->
                  <table width="100%" style="margin:20px 0; background-color:#FFF8F0; border-radius:8px; padding:15px;">
                    <tr>
                      <td style="padding-bottom:10px;">
                        <p style="margin:0; font-weight:bold; color:#FF7A00;">Instrucciones:</p>
                      </td>
                    </tr>
                    <tr>
                      <td>
                        <ol style="margin:10px 0; padding-left:20px; color:#4b5563;">
                          <li style="margin-bottom:8px;">Ingresa el cÃ³digo en la pÃ¡gina de recuperaciÃ³n de contraseÃ±a.</li>
                          <li style="margin-bottom:8px;">Crea una nueva contraseÃ±a segura.</li>
                          <li style="margin-bottom:8px;">Inicia sesiÃ³n con tu nueva contraseÃ±a.</li>
                        </ol>
                        <p style="margin:15px 0 5px 0; color:#4b5563;"><strong>Nota:</strong> Este cÃ³digo expirarÃ¡ en 30 minutos por razones de seguridad.</p>
                      </td>
                    </tr>
                  </table>
                  
                  <!-- Seguridad -->
                  <table width="100%" style="margin:30px 0 10px 0; background-color:#FFF8F0; border-radius:8px; padding:15px;">
                    <tr>
                      <td>
                        <p style="margin:0 0 10px 0; font-weight:bold; color:#FF7A00;">Â¿No solicitaste este cambio?</p>
                        <p style="margin:0 0 10px 0; color:#4b5563;">Si no solicitaste restablecer tu contraseÃ±a, te recomendamos:</p>
                        <ul style="margin:10px 0; padding-left:20px; color:#4b5563;">
                          <li style="margin-bottom:8px;">Ignorar este correo</li>
                          <li style="margin-bottom:8px;">Verificar la seguridad de tu cuenta</li>
                          <li style="margin-bottom:8px;">Contactarnos si crees que alguien estÃ¡ intentando acceder a tu cuenta</li>
                        </ul>
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
  `;

  // Configurar el correo
  const correoRecuperacion = {
    from: `"Disufix - Seguridad" <${process.env.EMAIL_USER}>`,
    to: email,
    subject: "CÃ³digo de recuperaciÃ³n de contraseÃ±a - Disufix",
    html: htmlCorreo,
  };

  try {
    // Enviar el correo
    await transporter.sendMail(correoRecuperacion);

    return {
      ok: true,
      message: "CÃ³digo de recuperaciÃ³n enviado correctamente",
    };
  } catch (error) {
    console.error("Error al enviar el cÃ³digo de recuperaciÃ³n:", error);
    return {
      ok: false,
      message: "Error al enviar el cÃ³digo de recuperaciÃ³n",
    };
  }
};
