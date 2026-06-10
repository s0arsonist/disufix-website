"use client";

import { useEffect, useState } from "react";
import { useSearchParams } from "next/navigation";
import Link from "next/link";
import { CheckCircle, XCircle, AlertTriangle } from "lucide-react";
import type { ReactElement } from "react";

interface StatusDetails {
  title: string;
  description: string;
  icon: ReactElement;
  buttonText: string;
  buttonLink: string;
  isApproved: boolean;
}

export default function ConfirmationContent() {
  const searchParams = useSearchParams();
  const id = searchParams.get("id");

  const [state, setState] = useState({
    loading: true,
    error: false,
    paymentStatus: null as string | null,
  });

  useEffect(() => {
    if (!id) {
      setState((prev) => ({ ...prev, loading: false, error: true }));
      return;
    }

    const fetchPaymentStatus = async () => {
      try {
        const response = await fetch(
          `/api/payments/consultar_status?payment_link=${id}`,
          { method: "GET" }
        );

        if (!response.ok) {
          throw new Error("Error al consultar el estado del link de pago");
        }

        const payment = await response.json();
        setState((prev) => ({
          ...prev,
          loading: false,
          paymentStatus: payment.transaction.data.status,
        }));
      } catch (err) {
        console.error(err);
        setState((prev) => ({ ...prev, loading: false, error: true }));
      }
    };

    fetchPaymentStatus();
  }, [id]);

  const getStatusDetails = (): StatusDetails => {
    if (!state.paymentStatus) {
      return {
        title: "Estado desconocido",
        description: "No se encontrÃ³ informaciÃ³n del pago.",
        icon: <AlertTriangle size={64} className="text-yellow-400" />,
        buttonText: "Volver al inicio",
        buttonLink: "/",
        isApproved: false,
      };
    }

    const statusLower = state.paymentStatus.toLowerCase();

    if (statusLower === "approved" || statusLower === "aprobado") {
      return {
        title: "Â¡Pago aprobado!",
        description: "Gracias por tu pago. Nos comunicaremos contigo pronto.",
        icon: <CheckCircle size={64} className="text-green-500" />,
        buttonText: "Contactar por WhatsApp",
        buttonLink:
          "https://api.whatsapp.com/send/?phone=573156458075&text=Hola%2C+me+gustar%C3%ADa+obtener+m%C3%A1s+informaci%C3%B3n+sobre+sus+productos&type=phone_number&app_absent=0",
        isApproved: true,
      };
    }

    if (
      statusLower === "declined" ||
      statusLower === "rechazado" ||
      statusLower === "rejected"
    ) {
      return {
        title: "Pago rechazado",
        description:
          "Tu pago ha sido rechazado. Por favor, intenta con otro mÃ©todo de pago.",
        icon: <XCircle size={64} className="text-red-500" />,
        buttonText: "Intentar nuevamente",
        buttonLink: "/checkout",
        isApproved: false,
      };
    }

    return {
      title: `Estado: ${state.paymentStatus}`,
      description:
        "Tu pago estÃ¡ siendo procesado. Por favor, espera unos minutos.",
      icon: <AlertTriangle size={64} className="text-yellow-400" />,
      buttonText: "Actualizar estado",
      buttonLink: window.location.href,
      isApproved: false,
    };
  };

  const renderContent = () => {
    if (state.loading) {
      return (
        <div className="flex flex-col items-center justify-center">
          <div className="relative w-20 h-20">
            <div className="absolute inset-0 rounded-full border-4 border-t-4 border-t-[#EF7D30] border-r-[#FF9D50] border-b-[#FAEA2F] border-l-transparent animate-spin" />
            <div className="absolute inset-3 rounded-full border-4 border-t-4 border-t-[#FAEA2F] border-r-transparent border-b-[#EF7D30] border-l-[#FF9D50] animate-spin animation-delay-500" />
          </div>
          <p className="mt-6 text-lg font-medium text-gray-700 animate-pulse">
            Verificando pago...
          </p>
        </div>
      );
    }

    if (state.error) {
      return (
        <div className="w-full max-w-md">
          <div className="bg-white rounded-xl shadow-lg overflow-hidden">
            <div className="p-6 bg-gradient-to-r from-red-600 to-red-700 text-white flex flex-col items-center justify-center">
              <div className="h-24 w-24 flex items-center justify-center bg-white rounded-full p-2 mb-4">
                <AlertTriangle size={64} className="text-red-600" />
              </div>
              <h1 className="text-2xl font-bold mb-2">
                Error al consultar pago
              </h1>
            </div>
            <div className="p-6">
              <p className="text-gray-700 mb-6 text-center">
                No pudimos obtener la informaciÃ³n de tu pago. Por favor intenta
                nuevamente o contÃ¡ctanos para asistencia.
              </p>
              <div className="flex flex-col sm:flex-row justify-center gap-4">
                <Link
                  href="/"
                  className="px-6 py-3 rounded-full bg-[#EF7D30] hover:bg-[#D05E11] text-white font-medium transition-all duration-300 text-center"
                >
                  Ir al inicio
                </Link>
                <Link
                  href="https://wa.me/+123456789"
                  className="px-6 py-3 rounded-full bg-[#FAEA2F] hover:bg-[#D5C500] text-black font-medium transition-all duration-300 text-center"
                >
                  Contactar soporte
                </Link>
              </div>
            </div>
          </div>
        </div>
      );
    }

    const statusDetails = getStatusDetails();

    return (
      <div className="w-full max-w-md">
        <div className="bg-white rounded-xl shadow-lg overflow-hidden transform transition-all duration-300 hover:shadow-xl">
          <div
            className={`p-6 ${
              statusDetails.isApproved
                ? "bg-gradient-to-r from-[#EF7D30] to-[#FF9D50]"
                : "bg-gradient-to-r from-black to-[#333333]"
            } text-white flex flex-col items-center justify-center`}
          >
            <div className="h-24 w-24 flex items-center justify-center bg-white rounded-full p-2 mb-4">
              {statusDetails.icon}
            </div>
            <h1 className="text-2xl font-bold mb-2 text-center">
              {statusDetails.title}
            </h1>
          </div>

          <div className="p-6">
            <p className="text-gray-700 mb-6 text-center">
              {statusDetails.description}
            </p>

            <div className="flex justify-center">
              <Link
                href={statusDetails.buttonLink}
                className={`px-6 py-3 rounded-full font-medium transition-all duration-300 ${
                  statusDetails.isApproved
                    ? "bg-[#EF7D30] hover:bg-[#D05E11] text-white"
                    : "bg-[#FAEA2F] hover:bg-[#D5C500] text-black"
                }`}
              >
                {statusDetails.buttonText}
              </Link>
            </div>

            <div className="mt-6 text-center">
              <Link
                href="/"
                className="text-[#EF7D30] hover:text-[#D05E11] font-medium"
              >
                Volver al inicio
              </Link>
            </div>
          </div>
        </div>
      </div>
    );
  };

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
      {renderContent()}
    </div>
  );
}
