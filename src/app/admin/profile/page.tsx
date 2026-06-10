"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { useSession } from "next-auth/react";
import LoadingSpinner from "@/components/admin/profile/loading-spinner";
import ProfileHeader from "@/components/admin/profile/profile-header";
import ProfileCard from "@/components/admin/profile/profile-card";
import PersonalInfoForm from "@/components/admin/profile/personal-info-form";
import PasswordChangeForm from "@/components/admin/profile/password-change-form";
// import SecurityOptions from "@/components/admin/profile/security-options";


export default function ProfilePage() {
  const { data: session, status } = useSession();
  const router = useRouter();

  // Redirigir si no hay sesiÃ³n
  useEffect(() => {
    if (status === "unauthenticated") {
      router.push("/login");
    }
  }, [status, router]);

  // Si estÃ¡ cargando la sesiÃ³n
  if (status === "loading") {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <LoadingSpinner />
      </div>
    );
  }

  return (
    <div className="container max-w-6xl mx-auto px-4 py-8">
      <ProfileHeader
        userName={session?.user?.nombreCompleto || "Usuario"}
        userEmail={session?.user?.email || ""}
      />

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-8">
        <ProfileCard
          title="InformaciÃ³n Personal"
          icon="user"
          description="Actualiza tus datos personales"
        >
          <PersonalInfoForm
            initialData={{
              nombreCompleto: session?.user?.nombreCompleto || "",
              email: session?.user?.email || "",
              role: session?.user?.role || "Usuario",
            }}
            userId={session?.user?.id || "123"}
          />
        </ProfileCard>

        <ProfileCard
          title="Cambiar ContraseÃ±a"
          icon="lock"
          description="Actualiza tu contraseÃ±a para mantener tu cuenta segura"
        >
          <PasswordChangeForm userId={session?.user?.id || "123"} />
        </ProfileCard>
      </div>

      {/* <div className="mt-6">
        <ProfileCard
          title="Opciones de Seguridad"
          icon="shield"
          description="Gestiona la seguridad de tu cuenta"
        >
          <SecurityOptions />
        </ProfileCard>
      </div> */}
    </div>
  );
}
