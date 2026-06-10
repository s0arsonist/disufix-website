"use client";

import type React from "react";
import { useState, useEffect } from "react";
import Link from "next/link";
import {
  Home,
  ShoppingBag,
  Tag,
  ClipboardList,
  ChevronRight,
  X,
  Users,
  User2,
} from "lucide-react";
import { usePathname } from "next/navigation";
import { useSession } from "next-auth/react";
import { getPendingOrdersCount } from "@/actions/shipping/shipping";
import { Badge } from "@/components/ui/badge";
import UserProfileLink from "./profile/user-profile-link";

interface NavItem {
  name: string;
  path: string;
  icon: React.ReactNode;
  badge?: number | null;
}

interface NavGroup {
  title: string;
  items: NavItem[];
}

interface SidebarProps {
  isOpen?: boolean;
  onClose?: () => void;
}

const Sidebar: React.FC<SidebarProps> = ({
  isOpen = true,
  onClose = () => {},
}) => {
  const [mounted, setMounted] = useState(false);
  const [ordersPending, setOrdersPending] = useState(0);
  const { data: session } = useSession();
  const pathname = usePathname(); // Para obtener la ruta activa

  // FunciÃ³n para obtener las Ã³rdenes pendientes
  useEffect(() => {
    const getOrdersPending = async () => {
      try {
        const pendingOrdersData = await getPendingOrdersCount();
        if (pendingOrdersData && pendingOrdersData.count) {
          setOrdersPending(pendingOrdersData.count);
        }
      } catch (error) {
        console.log("Error al obtener Ã³rdenes pendientes:", error);
      }
    };

    getOrdersPending();
    setMounted(true); // Evitar los problemas de hidrataciÃ³n
  }, []);

  // Reemplazar la definiciÃ³n de navGroups para usar el tipo correcto
  const navGroups: NavGroup[] = [
    {
      title: "Principal",
      items: [
        {
          name: "Dashboard",
          path: "/admin",
          icon: <Home size={20} />,
        },
      ],
    },
    {
      title: "CatÃ¡logo",
      items: [
        {
          name: "Products",
          path: "/admin/products",
          icon: <ShoppingBag size={20} />,
        },
        {
          name: "Categories",
          path: "/admin/categories",
          icon: <Tag size={20} />,
        },
      ],
    },
    {
      title: "Ventas",
      items: [
        {
          name: "Orders",
          path: "/admin/orders",
          icon: <ClipboardList size={20} />,
          badge: ordersPending > 0 ? ordersPending : null,
        },
      ],
    },
    {
      title: "Usuarios",
      items: [
        {
          name: "Users",
          path: "/admin/users",
          icon: <Users size={20} />,
        },
        {
          name: "Clients",
          path: "/admin/clients",
          icon: <User2 size={20} />,
        },
      ],
    },
  ];

  const isActive = (path: string) => pathname === path; // Verificar si la ruta actual coincide con el link

  return (
    <>
      {/* Mobile Overlay */}
      {isOpen && (
        <div
          className="md:hidden fixed inset-0 bg-black/50 z-30"
          onClick={onClose}
        />
      )}

      {/* Sidebar */}
      <aside
        className={`fixed md:sticky top-0 left-0 h-screen z-40 
        transition-transform duration-300 ease-in-out w-64
        ${isOpen ? "translate-x-0" : "-translate-x-full md:translate-x-0"} 
        bg-white/90 backdrop-blur-sm text-black flex flex-col`}
      >
        {/* Sidebar Header */}
        <div className="h-16 flex items-center justify-between px-4 border-b border-indigo-600/30">
          <UserProfileLink />
          <button
            onClick={onClose}
            className="md:hidden p-1 rounded-full hover:bg-white/10 transition-colors text-primary"
            aria-label="Close sidebar"
          >
            <X size={20} />
          </button>
        </div>

        {/* Navigation */}
        <nav className="flex-1 overflow-y-auto py-4 px-0">
          {" "}
          {/* CambiÃ© px-8 a px-0 */}
          {navGroups.map((group, index) => (
            <div key={group.title} className="mb-4">
              {index > 0 && (
                <div className="h-px bg-indigo-600/20 my-4 mx-3"></div>
              )}
              <h2 className="text-xs font-semibold text-gray-500 uppercase tracking-wider px-3 mb-2">
                {group.title}
              </h2>
              <ul className="space-y-1">
                {group.items.map((item) => (
                  <li key={item.name}>
                    <Link href={item.path}>
                      <button
                        onClick={() => {
                          if (window.innerWidth < 768) {
                            onClose();
                          }
                        }}
                        className={`group flex items-center w-full px-5 py-2 rounded-xl transition-all duration-200
                ${
                  isActive(item.path)
                    ? "bg-gradient-brand text-white"
                    : "text-black hover:bg-white/10 hover:text-primary"
                }`}
                      >
                        {/* Icono y nombre mÃ¡s agrupados */}
                        <span>{item.icon}</span>
                        <span className="px-1">{item.name}</span>

                        {/* Badge para Ã³rdenes pendientes */}
                        {item.badge && (
                          <Badge
                            className={`ml-2 ${
                              isActive(item.path)
                                ? "bg-white text-primary"
                                : "bg-primary text-white"
                            }`}
                          >
                            {item.badge}
                          </Badge>
                        )}

                        <ChevronRight className="ml-2 h-4 w-4 opacity-0 group-hover:opacity-100" />
                      </button>
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </nav>

        {/* Sidebar Footer */}
        <div className="mt-auto p-4 border-t border-indigo-600/30">
          <Link
            href="/"
            className="flex items-center w-full px-3 py-2 text-black rounded-lg hover:bg-white/10 hover:text-primary"
          >
            <ShoppingBag className="mr-2 h-5 w-5" />
            <span>Tienda</span>
          </Link>
        </div>
      </aside>
    </>
  );
};

export default Sidebar;
