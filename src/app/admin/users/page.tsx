"use client";

import { useState, useEffect } from "react";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import { User } from "@/components/admin/users/types";
// import { getUsers } from "@/components/admin/users/actions/user-actions";
import LoadingSpinner from "@/components/admin/profile/loading-spinner";
import UsersHeader from "@/components/admin/users/components/users-header";
import UsersTable from "@/components/admin/users/components/users-table";
import DeleteConfirmationModal from "@/components/admin/users/components/delete-confirmation-modal";
import UserFormModal from "@/components/admin/users/components/user-form-modal";
import { getUsers } from "@/actions/user/user";


export default function UsersPage() {
  const { data: session, status } = useSession();
  const router = useRouter();
  const [users, setUsers] = useState<User[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedRole, setSelectedRole] = useState<string | null>(null);

  const [isFormModalOpen, setIsFormModalOpen] = useState(false);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [selectedUser, setSelectedUser] = useState<User | null>(null);
  const [formMode, setFormMode] = useState<"create" | "edit">("create");

  // Verificar si el usuario tiene permisos de administrador


  // Cargar usuarios
  useEffect(() => {
    const loadUsers = async () => {
      try {
        setIsLoading(true);
        const result = await getUsers();
        console.log(result)
        if (result) {
          setUsers(result);
        }
      } catch (error) {
        console.error("Error al cargar usuarios:", error);
      } finally {
        setIsLoading(false);
      }
    };

    loadUsers()

  }, []);

  // Filtrar usuarios segÃºn bÃºsqueda y rol seleccionado
  const filteredUsers = users.filter((user) => {
    const matchesSearch =
      user.nombreCompleto.toLowerCase().includes(searchTerm.toLowerCase()) ||
      user.email.toLowerCase().includes(searchTerm.toLowerCase());

    const matchesRole = selectedRole ? user.role === selectedRole : true;

    return matchesSearch && matchesRole;
  });

  // Abrir modal para crear usuario
  const handleCreateUser = () => {
    setSelectedUser(null);
    setFormMode("create");
    setIsFormModalOpen(true);
  };

  // Abrir modal para editar usuario
  const handleEditUser = (user: User) => {
    setSelectedUser(user);
    setFormMode("edit");
    setIsFormModalOpen(true);
  };

  // Abrir modal para confirmar eliminaciÃ³n
  const handleDeleteClick = (user: User) => {
    setSelectedUser(user);
    setIsDeleteModalOpen(true);
  };

  // Actualizar lista de usuarios despuÃ©s de operaciones CRUD
  const refreshUsers = async () => {
    // try {
    //   setIsLoading(true);
    //   const result = await getUsers();
    //   if (result.users) {
    //     setUsers(result.users);
    //   }
    // } catch (error) {
    //   console.error("Error al actualizar lista de usuarios:", error);
    // } finally {
    //   setIsLoading(false);
    // }
  };

  // Si estÃ¡ cargando la sesiÃ³n
  if (status === "loading") {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <LoadingSpinner />
      </div>
    );
  }

  // Si no tiene permisos de administrador
 

  return (
    <div className="container mx-auto px-4 py-8">
      <UsersHeader
        onCreateUser={handleCreateUser}
        searchTerm={searchTerm}
        onSearchChange={setSearchTerm}
        selectedRole={selectedRole}
        onRoleChange={setSelectedRole}
        totalUsers={users.length}
        filteredUsers={filteredUsers.length}
      />

      {isLoading ? (
        <div className="flex justify-center py-12">
          <LoadingSpinner />
        </div>
      ) : (
        <UsersTable
          users={filteredUsers}
          onEdit={handleEditUser}
          onDelete={handleDeleteClick}
          currentUserId={session?.user?.id || ""}
        />
      )}

      {/* Modal para crear/editar usuario */}
      {isFormModalOpen && (
        <UserFormModal
          isOpen={isFormModalOpen}
          onClose={() => setIsFormModalOpen(false)}
          user={selectedUser}
          mode={formMode}
          onSuccess={() => {
            refreshUsers();
            setIsFormModalOpen(false);
          }}
        />
      )}

      {/* Modal para confirmar eliminaciÃ³n */}
      {isDeleteModalOpen && selectedUser && (
        <DeleteConfirmationModal
          isOpen={isDeleteModalOpen}
          onClose={() => setIsDeleteModalOpen(false)}
          user={selectedUser}
          onSuccess={() => {
            refreshUsers();
            setIsDeleteModalOpen(false);
          }}
          currentUserId={session?.user?.id || ""}
        />
      )}
    </div>
  );
}
