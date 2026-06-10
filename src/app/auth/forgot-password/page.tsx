"use client";

import type React from "react";

import { useState } from "react";
import Link from "next/link";
import Image from "next/image";
import {
  Mail,
  ArrowLeft,
  Eye,
  EyeOff,
  Lock,
  Check,
  Loader2,
} from "lucide-react";
import { useAnimateOnScroll } from "@/hooks/use-animation";
import { enviarCodigoRecuperacion } from "@/actions";
import toast from "react-hot-toast";
import { updatePasswordRecover, verificarUsuario } from "@/actions/auth/user";

// Estados posibles del flujo de recuperaciÃ³n
type RecoveryState = "email" | "verification" | "reset" | "success";

export default function RecoverPasswordPage() {
  useAnimateOnScroll();

  // Estados para los inputs
  const [email, setEmail] = useState("");
  const [codeInput, setCodeInput] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

  // Estados para controlar el flujo
  const [recoveryState, setRecoveryState] = useState<RecoveryState>("email");
  const [code, setCode] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [userId, setUserId] = useState("");

  // FunciÃ³n para generar cÃ³digo de 6 dÃ­gitos
  function generarCodigo() {
    return Math.floor(100000 + Math.random() * 900000);
  }

  // Enviar cÃ³digo al email
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      const usuario = await verificarUsuario(email);

      if (usuario.success && usuario.user) {
        setUserId(usuario.user?.id);
        const codigoGenerado = generarCodigo();
        setCode(codigoGenerado.toString());
        const correo = await enviarCodigoRecuperacion(email, codigoGenerado);
        if (correo.ok) {
          toast.success("CÃ³digo enviado correctamente");
          setRecoveryState("verification");
        } else {
          toast.error("No se pudo enviar el correo");
        }
      } else {
        toast.error("Usuario no existe");
      }
    } catch (error) {
      toast.error("Error inesperado: " + error);
    } finally {
      setIsLoading(false);
    }
  };

  // Verificar cÃ³digo ingresado
  const handleVerifyCode = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      // Simulamos un pequeÃ±o retraso para mostrar el loader
      await new Promise((resolve) => setTimeout(resolve, 800));

      if (code === codeInput) {
        toast.success("CÃ³digo verificado correctamente");
        setRecoveryState("reset");
      } else {
        toast.error("CÃ³digo invÃ¡lido, intenta nuevamente");
      }
    } catch (error) {
      toast.error("Error al verificar el cÃ³digo");
    } finally {
      setIsLoading(false);
    }
  };

  // Cambiar contraseÃ±a
  const handleResetPassword = async (e: React.FormEvent) => {
    e.preventDefault();

    if (password !== confirmPassword) {
      toast.error("Las contraseÃ±as no coinciden");
      return;
    }

    if (password.length < 6) {
      toast.error("La contraseÃ±a debe tener al menos 6 caracteres");
      return;
    }

    setIsLoading(true);

    try {
      await new Promise((resolve) => setTimeout(resolve, 1000));
      const newPassword = await updatePasswordRecover(userId, password);
      if (newPassword.success) {
        toast.success("ContraseÃ±a actualizada correctamente");
        setRecoveryState("success");
      } else {
        toast.error("no se pudo cambiar la contra mi rey");
      }
    } catch (error) {
      toast.error("Error al actualizar la contraseÃ±a");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="container-custom py-12 md:py-20">
      <div className="max-w-md mx-auto bg-white rounded-xl shadow-md overflow-hidden animate-slide-up">
        <div className="h-2 bg-gradient-brand"></div>
        <div className="p-8">
          <div className="flex justify-center mb-6">
            <div className="relative h-14 w-24">
              <Image
                src="/imgs/logo.png"
                alt="Disufix"
                fill
                className="object-cover"
              />
            </div>
          </div>

          <h1 className="text-2xl font-bold mb-2 text-center">
            Recuperar <span className="text-primary">ContraseÃ±a</span>
          </h1>

          {/* Estado: Ingreso de email */}
          {recoveryState === "email" && (
            <>
              <p className="text-center text-gray-600 mb-6">
                Ingresa tu correo electrÃ³nico y te enviaremos un cÃ³digo para
                restablecer tu contraseÃ±a.
              </p>

              <form onSubmit={handleSubmit} className="space-y-6">
                <div className="space-y-2">
                  <label htmlFor="email" className="block text-sm font-medium">
                    Correo ElectrÃ³nico
                  </label>
                  <div className="relative">
                    <input
                      id="email"
                      type="email"
                      required
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      className="w-full px-4 py-3 pl-10 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
                      placeholder="correo@ejemplo.com"
                      disabled={isLoading}
                    />
                    <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
                  </div>
                </div>

                <button
                  type="submit"
                  className="w-full bg-gradient-brand text-white py-3 rounded-lg hover:shadow-lg transition-all font-medium flex items-center justify-center"
                  disabled={isLoading}
                >
                  {isLoading ? (
                    <>
                      <Loader2 className="animate-spin mr-2 h-5 w-5" />
                      Enviando...
                    </>
                  ) : (
                    "Enviar CÃ³digo de RecuperaciÃ³n"
                  )}
                </button>
              </form>
            </>
          )}

          {/* Estado: VerificaciÃ³n de cÃ³digo */}
          {recoveryState === "verification" && (
            <div className="animate-fade-in">
              <div className="bg-green-50 text-green-800 p-4 rounded-lg mb-6">
                <p>
                  Hemos enviado un cÃ³digo de recuperaciÃ³n a{" "}
                  <strong>{email}</strong>. Por favor revisa tu bandeja de
                  entrada.
                </p>
              </div>

              <form onSubmit={handleVerifyCode} className="space-y-6">
                <div className="space-y-2">
                  <label htmlFor="code" className="block text-sm font-medium">
                    CÃ³digo de VerificaciÃ³n
                  </label>
                  <input
                    id="code"
                    type="text"
                    placeholder="CÃ³digo de 6 dÃ­gitos"
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary text-center text-lg tracking-widest"
                    required
                    maxLength={6}
                    value={codeInput}
                    onChange={(e) =>
                      setCodeInput(e.target.value.replace(/[^0-9]/g, ""))
                    }
                    disabled={isLoading}
                  />
                </div>

                <button
                  type="submit"
                  className="w-full bg-gradient-brand text-white py-3 rounded-lg hover:shadow-lg transition-all font-medium flex items-center justify-center"
                  disabled={isLoading || codeInput.length !== 6}
                >
                  {isLoading ? (
                    <>
                      <Loader2 className="animate-spin mr-2 h-5 w-5" />
                      Verificando...
                    </>
                  ) : (
                    "Verificar CÃ³digo"
                  )}
                </button>
              </form>

              <div className="mt-6 space-y-4">
                <p className="text-sm text-gray-600">
                  Si no recibes el correo en unos minutos, revisa tu carpeta de
                  spam o intenta nuevamente.
                </p>
                <div className="flex justify-between">
                  <button
                    onClick={() => setRecoveryState("email")}
                    className="text-primary hover:underline font-medium text-sm"
                    disabled={isLoading}
                  >
                    Usar otro correo
                  </button>
                  <button
                    onClick={handleSubmit}
                    className="text-primary hover:underline font-medium text-sm"
                    disabled={isLoading}
                  >
                    Reenviar cÃ³digo
                  </button>
                </div>
              </div>
            </div>
          )}

          {/* Estado: Cambio de contraseÃ±a */}
          {recoveryState === "reset" && (
            <div className="animate-fade-in">
              <p className="text-center text-gray-600 mb-6">
                Crea una nueva contraseÃ±a segura para tu cuenta.
              </p>

              <form onSubmit={handleResetPassword} className="space-y-6">
                <div className="space-y-2">
                  <label
                    htmlFor="password"
                    className="block text-sm font-medium"
                  >
                    Nueva ContraseÃ±a
                  </label>
                  <div className="relative">
                    <input
                      id="password"
                      type={showPassword ? "text" : "password"}
                      required
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      className="w-full px-4 py-3 pl-10 pr-10 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
                      placeholder="MÃ­nimo 8 caracteres"
                      minLength={8}
                      disabled={isLoading}
                    />
                    <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
                    <button
                      type="button"
                      className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400"
                      onClick={() => setShowPassword(!showPassword)}
                    >
                      {showPassword ? (
                        <EyeOff className="h-5 w-5" />
                      ) : (
                        <Eye className="h-5 w-5" />
                      )}
                    </button>
                  </div>
                </div>

                <div className="space-y-2">
                  <label
                    htmlFor="confirmPassword"
                    className="block text-sm font-medium"
                  >
                    Confirmar ContraseÃ±a
                  </label>
                  <div className="relative">
                    <input
                      id="confirmPassword"
                      type={showConfirmPassword ? "text" : "password"}
                      required
                      value={confirmPassword}
                      onChange={(e) => setConfirmPassword(e.target.value)}
                      className={`w-full px-4 py-3 pl-10 pr-10 border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary ${
                        confirmPassword && password !== confirmPassword
                          ? "border-red-500"
                          : "border-gray-300"
                      }`}
                      placeholder="Repite tu contraseÃ±a"
                      disabled={isLoading}
                    />
                    <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
                    <button
                      type="button"
                      className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400"
                      onClick={() =>
                        setShowConfirmPassword(!showConfirmPassword)
                      }
                    >
                      {showConfirmPassword ? (
                        <EyeOff className="h-5 w-5" />
                      ) : (
                        <Eye className="h-5 w-5" />
                      )}
                    </button>
                  </div>
                  {confirmPassword && password !== confirmPassword && (
                    <p className="text-red-500 text-sm">
                      Las contraseÃ±as no coinciden
                    </p>
                  )}
                </div>

                <div className="space-y-2">
                  <p className="text-sm text-gray-600">Tu contraseÃ±a debe:</p>
                  <ul className="text-sm space-y-1">
                    <li
                      className={`flex items-center ${
                        password.length >= 8
                          ? "text-green-600"
                          : "text-gray-500"
                      }`}
                    >
                      {password.length >= 8 ? (
                        <Check className="h-4 w-4 mr-2" />
                      ) : (
                        <span className="h-4 w-4 mr-2 inline-block" />
                      )}
                      Tener al menos 8 caracteres
                    </li>
                    <li
                      className={`flex items-center ${
                        /[A-Z]/.test(password)
                          ? "text-green-600"
                          : "text-gray-500"
                      }`}
                    >
                      {/[A-Z]/.test(password) ? (
                        <Check className="h-4 w-4 mr-2" />
                      ) : (
                        <span className="h-4 w-4 mr-2 inline-block" />
                      )}
                      Incluir al menos una mayÃºscula
                    </li>
                    <li
                      className={`flex items-center ${
                        /[0-9]/.test(password)
                          ? "text-green-600"
                          : "text-gray-500"
                      }`}
                    >
                      {/[0-9]/.test(password) ? (
                        <Check className="h-4 w-4 mr-2" />
                      ) : (
                        <span className="h-4 w-4 mr-2 inline-block" />
                      )}
                      Incluir al menos un nÃºmero
                    </li>
                  </ul>
                </div>

                <button
                  type="submit"
                  className="w-full bg-gradient-brand text-white py-3 rounded-lg hover:shadow-lg transition-all font-medium flex items-center justify-center"
                  disabled={
                    isLoading ||
                    password.length < 8 ||
                    password !== confirmPassword
                  }
                >
                  {isLoading ? (
                    <>
                      <Loader2 className="animate-spin mr-2 h-5 w-5" />
                      Actualizando...
                    </>
                  ) : (
                    "Cambiar ContraseÃ±a"
                  )}
                </button>
              </form>
            </div>
          )}

          {/* Estado: Ãxito */}
          {recoveryState === "success" && (
            <div className="text-center py-4 animate-fade-in">
              <div className="bg-green-50 p-6 rounded-lg mb-6 flex flex-col items-center">
                <div className="rounded-full bg-green-100 p-3 mb-4">
                  <Check className="h-8 w-8 text-green-600" />
                </div>
                <h3 className="text-xl font-bold text-green-800 mb-2">
                  Â¡ContraseÃ±a actualizada!
                </h3>
                <p className="text-green-700">
                  Tu contraseÃ±a ha sido cambiada exitosamente. Ya puedes iniciar
                  sesiÃ³n con tu nueva contraseÃ±a.
                </p>
              </div>

              <Link
                href="/auth/login"
                className="w-full bg-gradient-brand text-white py-3 rounded-lg hover:shadow-lg transition-all font-medium inline-block"
              >
                Ir a Iniciar SesiÃ³n
              </Link>
            </div>
          )}

          {/* Enlace para volver a iniciar sesiÃ³n (visible en todos los estados excepto Ã©xito) */}
          {recoveryState !== "success" && (
            <div className="mt-8 text-center">
              <Link
                href="/auth/login"
                className="text-primary font-medium hover:underline flex items-center justify-center"
              >
                <ArrowLeft className="h-4 w-4 mr-1" />
                Volver a Iniciar SesiÃ³n
              </Link>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
