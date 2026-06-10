'use server'

import crypto from "crypto";

// Tipo para los datos de pago
interface PaymentData {
  amount: number; // Monto en centavos
  expirationTime?: string; // Fecha de expiraciÃ³n en formato ISO 8601
}

// FunciÃ³n para generar la referencia y firma de integridad
export async function generatePaymentData({ amount, expirationTime }: PaymentData) {
  // Definir el secreto de integridad
  const secret = process.env.WOMPI_SECRET_I; // Secreto para integridad
  console.log('secret',secret)

  // Generar una referencia Ãºnica de pago (puedes personalizar esta referencia)
  const reference = `ref-${Date.now()}`; // Genera una referencia numÃ©rica/alfanumÃ©rica Ãºnica

  // Crear la cadena concatenada para la firma de integridad
  let concatenatedString = `${reference}${amount*100}${"COP"}${secret}`;

  // Si se pasa expiration-time, lo agregamos a la cadena
  if (expirationTime) {
    concatenatedString += `${expirationTime}`;
  }

  // Generar el hash SHA256 usando crypto (en Node.js, backend)
  const hash = crypto
    .createHash("sha256")
    .update(concatenatedString)
    .digest("hex");

  return { reference, signature: hash };
}
