import { createHash } from "crypto"; // Importamos la funciÃ³n createHash

export async function verifySignature(eventData: any, signature: string) {
  const secret = process.env.WOMPI_SECRET_E; // La llave secreta de Wompi para eventos

  if (!secret) {
    throw new Error(
      "La llave secreta de Wompi no estÃ¡ definida en las variables de entorno."
    );
  }

  // Paso 1: Concatenar los valores del evento segÃºn las propiedades indicadas
  let concatenatedString = "";

  // Iterar sobre las propiedades en "properties"
  for (let prop of eventData.signature.properties) {
    const value = prop
      .split(".")
      .reduce((o: Record<string, any>, i: string) => {
        return o[i];
      }, eventData.data);

    concatenatedString += value;
  }

  console.log("Cadena concatenada despuÃ©s del paso 1:", concatenatedString);

  // Paso 2: Concatenar el timestamp
  concatenatedString += eventData.timestamp;
  console.log("Cadena concatenada despuÃ©s del paso 2:", concatenatedString);

  // Paso 3: Concatenar el secreto
  concatenatedString += secret;
  console.log("Cadena concatenada despuÃ©s del paso 3:", concatenatedString);

  // Paso 4: Usar SHA256 para generar el checksum
  const calculatedChecksum = createHash("sha256") // Usamos createHash directamente
    .update(concatenatedString)
    .digest("hex");

  console.log("Checksum calculado:", calculatedChecksum);

  // Paso 5: Comparar el checksum calculado con el proporcionado en el evento
  return calculatedChecksum === signature;
}
