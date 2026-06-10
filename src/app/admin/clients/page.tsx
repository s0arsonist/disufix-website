"use client";

import { useState, useEffect } from "react";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import { Client } from "@/components/admin/clients/types";
import LoadingSpinner from "@/components/admin/profile/loading-spinner";
import ClientsHeader from "@/components/admin/clients/components/clients-header";
import ClientsGrid from "@/components/admin/clients/components/clients-grid";
import ClientDetailModal from "@/components/admin/clients/components/client-detail-modal";
import { getClients } from "@/actions/client/client";


export default function ClientsPage() {
  const { data: session, status } = useSession();
  const router = useRouter();
  const [clients, setClients] = useState<Client[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");

  const [selectedClient, setSelectedClient] = useState<Client | null>(null);
  const [isDetailModalOpen, setIsDetailModalOpen] = useState(false);

  // Cargar clientes
  useEffect(() => {
    const loadClients = async () => {
      try {
        setIsLoading(true);
        const result = await getClients();
        if (result) {
          setClients(result);
        }
      } catch (error) {
        console.error("Error al cargar clientes:", error);
      } finally {
        setIsLoading(false);
      }
    };


      loadClients();
  }, [status]);

  // Filtrar clientes segÃºn bÃºsqueda
  const filteredClients = clients.filter((client) => {
    const fullName = `${client.nombre} ${client.apellido}`.toLowerCase();
    return (
      fullName.includes(searchTerm.toLowerCase()) ||
      client.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
      client.telefono.includes(searchTerm)
    );
  });

  // Ver detalles de un cliente
  const handleViewClient = (client: Client) => {
    setSelectedClient(client);
    setIsDetailModalOpen(true);
  };

  // Si estÃ¡ cargando la sesiÃ³n
  if (status === "loading") {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <LoadingSpinner />
      </div>
    );
  }

  // Si no estÃ¡ autenticado
  if (status === "unauthenticated") {
    router.push("/login");
    return null;
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <ClientsHeader
        searchTerm={searchTerm}
        onSearchChange={setSearchTerm}
        totalClients={clients.length}
        filteredClients={filteredClients.length}
      />

      {isLoading ? (
        <div className="flex justify-center py-12">
          <LoadingSpinner />
        </div>
      ) : (
        <ClientsGrid
          clients={filteredClients}
          onViewClient={handleViewClient}
        />
      )}

      {/* Modal de detalles del cliente */}
      {isDetailModalOpen && selectedClient && (
        <ClientDetailModal
          isOpen={isDetailModalOpen}
          onClose={() => setIsDetailModalOpen(false)}
          client={selectedClient}
        />
      )}
    </div>
  );
}
