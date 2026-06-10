"use client";

import { useEffect, useState } from "react";
import { Sparkles, BarChart3, Package, Users, Clock } from "lucide-react";
import Image from "next/image";
import { getTotalProductsCount } from "@/actions";
import { getTotalClientsCount } from "@/actions/client/client";
import {
  getPendingOrdersCount,
  getProductsSold,
} from "@/actions/shipping/shipping";

export function WelcomePanel() {
  const [currentTime, setCurrentTime] = useState(new Date());
  const [greeting, setGreeting] = useState("");
  const [totalProducts, setTotalProducts] = useState(0);
  const [clients, setClients] = useState(0);
  const [productsVen, setProductsVen] = useState(0);
  const [ordersPending, setOrdersPending] = useState(0);

  useEffect(() => {
    const getData = async () => {
      const totalProducts = await getTotalProductsCount();
      if (totalProducts.totalProducts) {
        setTotalProducts(totalProducts.totalProducts);
      }
      const clients = await getTotalClientsCount();
      if (clients.totalClients) {
        setClients(clients.totalClients);
      }

      const productosVendidos = await getProductsSold();
      if (productosVendidos) {
        setProductsVen(productosVendidos);
      }

      const ordenesPendientes = await getPendingOrdersCount();
      if (ordenesPendientes.count) {
        setOrdersPending(ordenesPendientes.count);
      }
    };
    try {
      getData();
    } catch (error) {
      console.log(error);
    }
  }, []);

  useEffect(() => {
    // Update greeting based on time of day
    const updateGreeting = () => {
      const hour = new Date().getHours();
      if (hour < 12) {
        setGreeting("Buenos dÃ­as");
      } else if (hour < 18) {
        setGreeting("Buenas tardes");
      } else {
        setGreeting("Buenas noches");
      }
    };

    // Update time every minute
    const interval = setInterval(() => {
      setCurrentTime(new Date());
      updateGreeting();
    }, 60000);

    // Initial greeting
    updateGreeting();

    return () => clearInterval(interval);
  }, []);

  // Format date as "Lunes, 6 de Mayo de 2024"
  const formattedDate = new Intl.DateTimeFormat("es-ES", {
    weekday: "long",
    day: "numeric",
    month: "long",
    year: "numeric",
  }).format(currentTime);

  // Capitalize first letter of the day
  const capitalizedDate =
    formattedDate.charAt(0).toUpperCase() + formattedDate.slice(1);

  return (
    <div className="w-full p-6 md:p-8 bg-gradient-to-br from-white to-gray-50 rounded-2xl shadow-lg border border-gray-100">
      <div className="flex flex-col md:flex-row items-center justify-between gap-6">
        {/* Left side - Welcome text */}
        <div className="space-y-4 text-center md:text-left">
          <div className="inline-flex items-center gap-2 px-4 py-2 bg-primary/10 text-primary rounded-full text-sm font-medium">
            <Sparkles className="h-4 w-4" />
            <span>Panel de AdministraciÃ³n</span>
          </div>

          <h1 className="text-3xl md:text-4xl font-bold text-gray-900">
            {greeting}, <span className="text-primary">Administrador</span>
          </h1>

          <p className="text-gray-600">
            Bienvenido al panel de control de Disufix. AquÃ­ podrÃ¡s gestionar
            todos los aspectos de tu negocio.
          </p>

          <p className="text-sm text-gray-500">
            {capitalizedDate} â¢{" "}
            {currentTime.toLocaleTimeString("es-ES", {
              hour: "2-digit",
              minute: "2-digit",
            })}
          </p>
        </div>

        {/* Right side - Logo and decoration */}
        <div className="relative flex-shrink-0">
          <div className="w-40 h-40 md:w-48 md:h-48 relative">
            <div
              className="absolute inset-0 bg-gradient-to-br from-primary/20 to-primary/5 rounded-full animate-pulse"
              style={{ animationDuration: "3s" }}
            ></div>
            <div className="absolute inset-4 bg-white rounded-full flex items-center justify-center shadow-inner">
              <Image
                src="/imgs/logo.png"
                alt="Disufix Logo"
                width={120}
                height={120}
                className="object-contain p-4"
              />
            </div>
          </div>
        </div>
      </div>

      {/* Quick stats */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mt-8">
        <QuickStat
          icon={<Package className="h-5 w-5 text-emerald-600" />}
          title="Productos"
          value={totalProducts.toString()}
          bgColor="bg-emerald-50"
          textColor="text-emerald-600"
        />
        <QuickStat
          icon={<Users className="h-5 w-5 text-blue-600" />}
          title="Clientes"
          value={clients.toString()}
          bgColor="bg-blue-50"
          textColor="text-blue-600"
        />
        <QuickStat
          icon={<BarChart3 className="h-5 w-5 text-purple-600" />}
          title="Productos Vendidos"
          value={productsVen.toString()}
          bgColor="bg-purple-50"
          textColor="text-purple-600"
        />
        <QuickStat
          icon={<Clock className="h-5 w-5 text-amber-600" />}
          title="Pedidos Pendientes"
          value={ordersPending.toString()}
          bgColor="bg-amber-50"
          textColor="text-amber-600"
        />
      </div>
    </div>
  );
}

interface QuickStatProps {
  icon: React.ReactNode;
  title: string;
  value: string;
  bgColor: string;
  textColor: string;
}

function QuickStat({ icon, title, value, bgColor, textColor }: QuickStatProps) {
  return (
    <div className="flex items-center p-4 bg-white rounded-xl shadow-sm border border-gray-100 hover:shadow-md transition-shadow">
      <div className={`p-3 rounded-lg mr-4 ${bgColor}`}>{icon}</div>
      <div>
        <p className="text-sm text-gray-500">{title}</p>
        <p className={`text-xl font-bold ${textColor}`}>{value}</p>
      </div>
    </div>
  );
}
