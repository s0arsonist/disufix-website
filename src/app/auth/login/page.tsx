"use client"

import type React from "react"

import { useState } from "react"
import Link from "next/link"
import Image from "next/image"
import { Eye, EyeOff, Mail, Lock } from "lucide-react"
import { useAnimateOnScroll } from "@/hooks/use-animation"
import { toast } from "sonner"
import { authenticate } from "@/actions"
import { useRouter } from "next/navigation"

export default function LoginPage() {
  useAnimateOnScroll()
  const router = useRouter();
  const [showPassword, setShowPassword] = useState(false)
  const [formData, setFormData] = useState({
    email: "",
    password: "",
  })

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target
    setFormData({
      ...formData,
      [name]: value,
    })
  }

  const handleSubmit = async(e: React.FormEvent) => {
    e.preventDefault()
    const res = await authenticate(formData);
    if(res.success){
      toast.success(res.message);
      window.location.replace("/");
    }else{
      toast.error(res.error);
    }
  }

  return (
    <div className="container-custom py-12 md:py-20">
      <div className="max-w-md mx-auto bg-white rounded-xl shadow-md overflow-hidden animate-slide-up">
        <div className="h-2 bg-gradient-brand"></div>
        <div className="p-8">
          <div className="flex justify-center mb-6">
          <div className="relative h-14 w-24">
              <Image src="/imgs/logo.png" alt="Disufix" fill className="object-cover" />
            </div>
          </div>

          <h1 className="text-2xl font-bold mb-6 text-center">
            Iniciar <span className="text-primary">SesiÃ³n</span>
          </h1>

          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="space-y-2">
              <label htmlFor="email" className="block text-sm font-medium">
                Correo ElectrÃ³nico
              </label>
              <div className="relative">
                <input
                  id="email"
                  name="email"
                  type="email"
                  required
                  value={formData.email}
                  onChange={handleChange}
                  className="w-full px-4 py-3 pl-10 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
                  placeholder="correo@ejemplo.com"
                />
                <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
              </div>
            </div>

            <div className="space-y-2">
              <div className="flex justify-between items-center">
                <label htmlFor="password" className="block text-sm font-medium">
                  ContraseÃ±a
                </label>
                <Link href="/auth/forgot-password" className="text-sm text-primary hover:underline">
                  Â¿Olvidaste tu contraseÃ±a?
                </Link>
              </div>
              <div className="relative">
                <input
                  id="password"
                  name="password"
                  type={showPassword ? "text" : "password"}
                  required
                  value={formData.password}
                  onChange={handleChange}
                  className="w-full px-4 py-3 pl-10 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
                  placeholder="â¢â¢â¢â¢â¢â¢â¢â¢"
                />
                <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-500 hover:text-primary"
                >
                  {showPassword ? <EyeOff className="h-5 w-5" /> : <Eye className="h-5 w-5" />}
                </button>
              </div>
            </div>

            <button
              type="submit"
              className="w-full bg-gradient-brand text-white py-3 rounded-lg hover:shadow-lg transition-all font-medium"
            >
              Iniciar SesiÃ³n
            </button>
          </form>

          <div className="mt-8 text-center">
            <p className="text-sm text-gray-600">
              Â¿No tienes una cuenta?{" "}
              <Link href="/auth/register" className="text-primary font-medium hover:underline">
                RegÃ­strate aquÃ­
              </Link>
            </p>
          </div>
        </div>
      </div>
    </div>
  )
}
