

export async function checkoutWompi(monto,reference,hash) {
  // Verifica si el script de Wompi ya estÃ¡ cargado
  if (!window.WidgetCheckout) {
    // Crear el script para cargar el widget de Wompi
    console.log("Cargando el script de Wompi...");
    const script = document.createElement("script");
    script.src = "https://checkout.wompi.co/widget.js";
    script.async = true;
    document.body.appendChild(script);

    // ConfiguraciÃ³n del checkout de Wompi cuando el script se carga
    script.onload = () => {
      const checkout = new window.WidgetCheckout({
        currency: "COP",
        amountInCents: monto * 100, // Monto en centavos
        reference: reference, // Referencia Ãºnica
        publicKey: process.env.NEXT_PUBLIC_WOMPI_API_KEY, // Llave pÃºblica de Wompi
        signature: { integrity: hash }, // Firma de integridad
        redirectUrl: "https://www.disufix.com/checkout/confirmacion", // URL de redirecciÃ³n (opcional)
        taxInCents: {
          // Opcional
          vat: 0,
          consumption: 0,
        },
        // customerData: {
        //   // Opcional
        //   email: "lola@gmail.com",
        //   fullName: "Lola Flores",
        //   phoneNumber: "3040777777",
        //   phoneNumberPrefix: "+57",
        //   legalId: "123456789",
        //   legalIdType: "CC",
        // },
      });

      checkout.open(function (result) {
        const transaction = result.transaction;
        console.log("Transaction ID: ", transaction.id);
        console.log("Transaction object: ", transaction);
      });
    };
  } else {
    // Si el script ya estÃ¡ cargado, abrir el checkout directamente
    console.log("El script de Wompi ya estÃ¡ cargado.",monto);
    const checkout = new window.WidgetCheckout({
      currency: "COP",
      amountInCents: monto * 100, // Monto en centavos
      reference: reference, // Referencia Ãºnica
      publicKey: process.env.NEXT_PUBLIC_WOMPI_API_KEY, // Llave pÃºblica de Wompi
      signature: { integrity: hash }, // Firma de integridad
      redirectUrl: "https://www.disufix.com/checkout/confirmacion", // URL de redirecciÃ³n (opcional)
      taxInCents: {
        // Opcional
        vat: 0,
        consumption: 0,
      },
      // customerData: {
      //   // Opcional
      //   email: "lola@gmail.com",
      //   fullName: "Lola Flores",
      //   phoneNumber: "3040777777",
      //   phoneNumberPrefix: "+57",
      //   legalId: "123456789",
      //   legalIdType: "CC",
      // },
    });

    checkout.open(function (result) {
      const transaction = result.transaction;
      console.log("Transaction ID: ", transaction.id);
      console.log("Transaction object: ", transaction);

      // Puedes redirigir o realizar acciones con el resultado de la transacciÃ³n
      if (transaction.status === "APPROVED") {
        alert("Pago exitoso en breve nos comunicamos contigo!");
      } else {
        alert("Pago fallido, por favor intÃ©ntalo nuevamente.");
      }
    });

  }
}
