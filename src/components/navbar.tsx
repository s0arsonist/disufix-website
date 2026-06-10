"use client"

import { useState, useEffect, useRef } from "react"
import Link from "next/link"
import Image from "next/image"
import { usePathname, useRouter } from "next/navigation"
import { ShoppingCart, Menu, X, ChevronRight, User, LogOut, Settings } from "lucide-react"
import { useSession } from "next-auth/react"
import { signOut } from "next-auth/react"
import { useStore } from "@/store/cart"


export default function Navbar() {
  const [isMenuOpen, setIsMenuOpen] = useState(false)
  const [scrolled, setScrolled] = useState(false)
  const [isUserMenuOpen, setIsUserMenuOpen] = useState(false)
  const [mounted, setMounted] = useState(false)

  // Usar useSession de NextAuth para obtener la sesiÃ³n
  const { data: session } = useSession()

  const pathname = usePathname()
  const cartItemsCount = useStore((state) => state.getCartItemsCount())
  const menuRef = useRef<HTMLDivElement>(null)
  const overlayRef = useRef<HTMLDivElement>(null)
  const userMenuRef = useRef<HTMLDivElement>(null)

  // Solucionar problemas de hidrataciÃ³n
  useEffect(() => {
    setMounted(true)
  }, [])

  const navLinks = [
    { name: "Inicio", href: "/" },
    { name: "Productos", href: "/productos" },
    { name: "Nosotros", href: "/nosotros" },
    { name: "Contacto", href: "/contacto" },
  ]

  const isActive = (path: string) => pathname === path

  // Obtener iniciales del nombre del usuario
  const getUserInitials = () => {
    if (!session?.user?.nombreCompleto) return ""

    const nameParts = session.user.nombreCompleto.split(" ")
    if (nameParts.length >= 2) {
      return `${nameParts[0][0]}${nameParts[1][0]}`.toUpperCase()
    }
    return nameParts[0][0].toUpperCase()
  }

  // Manejar cierre de sesiÃ³n
  const handleLogout = () => {
    signOut({ callbackUrl: "/" })
    setIsUserMenuOpen(false)
  }

  // Handle scroll effect
  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY > 20) {
        setScrolled(true)
      } else {
        setScrolled(false)
      }
    }

    window.addEventListener("scroll", handleScroll)
    return () => {
      window.removeEventListener("scroll", handleScroll)
    }
  }, [])

  // Close menus when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      // Cerrar menÃº mÃ³vil si se hace clic fuera
      if (isMenuOpen && menuRef.current && !menuRef.current.contains(event.target as Node)) {
        setIsMenuOpen(false)
      }

      // Cerrar menÃº de usuario si se hace clic fuera
      if (isUserMenuOpen && userMenuRef.current && !userMenuRef.current.contains(event.target as Node)) {
        setIsUserMenuOpen(false)
      }
    }

    document.addEventListener("mousedown", handleClickOutside)
    return () => {
      document.removeEventListener("mousedown", handleClickOutside)
    }
  }, [isMenuOpen, isUserMenuOpen])

  // Prevent body scroll when menu is open
  useEffect(() => {
    if (isMenuOpen) {
      document.body.style.overflow = "hidden"
    } else {
      document.body.style.overflow = ""
    }
    return () => {
      document.body.style.overflow = ""
    }
  }, [isMenuOpen])

  // Verificar si el usuario es administrador
  const isAdmin = session?.user?.role === "Admin"

  return (
    <>
      <header
        className={`sticky top-0 z-40 transition-all duration-300 ${
          scrolled ? "bg-white shadow-md py-2" : "bg-white/90 backdrop-blur-sm py-1"
        }`}
      >
        <div className="container-custom">
          <div className="flex items-center justify-between">
            {/* Logo */}
            <Link href="/" className="flex items-center animate-fade-in z-10">
              <div className="relative h-16 w-28">
                <Image src="/imgs/logo.png" alt="Disufix Logo" fill className="object-cover" priority />
              </div>
            </Link>

            {/* Navigation - Center Section */}
            <div className="flex-1 flex justify-center">
              <nav className="hidden md:flex items-center space-x-8">
                {navLinks.map((link, index) => (
                  <Link
                    key={link.name}
                    href={link.href}
                    className={`font-medium transition-colors animate-slide-down ${
                      isActive(link.href)
                        ? "text-primary relative after:content-[''] after:absolute after:bottom-[-5px] after:left-0 after:w-full after:h-[2px] after:bg-gradient-brand"
                        : "text-black hover:text-primary"
                    }`}
                    style={{ animationDelay: `${index * 0.1}s` }}
                  >
                    {link.name}
                  </Link>
                ))}
              </nav>
            </div>

            {/* Actions - Right Section */}
            <div className="w-[150px] flex items-center justify-end gap-4 z-10">
              {/* User Avatar or Login Icon */}
              {mounted && session ? (
                <div className="relative" ref={userMenuRef}>
                  <button
                    onClick={() => setIsUserMenuOpen(!isUserMenuOpen)}
                    className="w-9 h-9 rounded-full bg-gradient-brand flex items-center justify-center text-white font-medium text-sm hover:shadow-md transition-all"
                    aria-label="MenÃº de usuario"
                  >
                    {getUserInitials()}
                  </button>

                  {/* User Dropdown Menu */}
                  {isUserMenuOpen && (
                    <div className="absolute right-0 mt-2 w-48 bg-white rounded-md shadow-lg py-1 z-50 animate-fade-in">
                      {isAdmin && (
                        <Link
                          href="/admin/"
                          className="flex items-center px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 hover:text-primary"
                          onClick={() => setIsUserMenuOpen(false)}
                        >
                          <Settings className="h-4 w-4 mr-2" />
                          Panel de AdministraciÃ³n
                        </Link>
                      )}
                      <button
                        onClick={handleLogout}
                        className="flex items-center w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 hover:text-primary"
                      >
                        <LogOut className="h-4 w-4 mr-2" />
                        Cerrar SesiÃ³n
                      </button>
                    </div>
                  )}
                </div>
              ) : (
                <Link
                  href="/auth/login"
                  className="p-2 text-black hover:text-primary transition-colors animate-fade-in"
                  aria-label="Iniciar sesiÃ³n"
                >
                  <User className="h-6 w-6" />
                </Link>
              )}

              {/* Cart Icon */}
              <Link
                href="/carrito"
                className="relative p-2 text-black hover:text-primary transition-colors animate-fade-in"
                aria-label="Ver carrito"
              >
                <ShoppingCart className="h-6 w-6" />
                {mounted && cartItemsCount > 0 && (
                  <span className="absolute -top-1 -right-1 bg-primary text-white text-xs rounded-full h-5 w-5 flex items-center justify-center animate-scale-in">
                    {cartItemsCount}
                  </span>
                )}
              </Link>

              {/* Mobile Menu Button */}
              <button
                className="md:hidden p-2 text-black"
                onClick={() => setIsMenuOpen(!isMenuOpen)}
                aria-label="Toggle menu"
              >
                <Menu className="h-6 w-6" />
              </button>
            </div>
          </div>
        </div>
      </header>

      {/* Mobile Menu Overlay */}
      <div
        ref={overlayRef}
        className={`mobile-menu-overlay ${isMenuOpen ? "open" : ""}`}
        onClick={() => setIsMenuOpen(false)}
      ></div>

      {/* Mobile Menu */}
      <div ref={menuRef} className={`mobile-menu ${isMenuOpen ? "open" : ""}`}>
        <div className="flex flex-col h-full w-30">
          <div className="flex justify-between items-center p-6 border-b border-gray-100">
            <button
              onClick={() => setIsMenuOpen(false)}
              className="text-black hover:text-primary transition-colors"
              aria-label="Close menu"
            >
              <X className="h-6 w-6" />
            </button>
          </div>

          <nav className="flex-1 overflow-y-auto p-6">
            <ul className="space-y-6">
              {navLinks.map((link, index) => (
                <li key={link.name} className="border-b border-gray-100 pb-4">
                  <Link
                    href={link.href}
                    className={`flex justify-between items-center py-2 text-lg font-medium ${
                      isActive(link.href) ? "text-primary" : "text-black hover:text-primary"
                    }`}
                    onClick={() => setIsMenuOpen(false)}
                  >
                    {link.name}
                    <ChevronRight className={`h-5 w-5 ${isActive(link.href) ? "text-primary" : "text-gray-400"}`} />
                  </Link>
                </li>
              ))}

              {/* Admin Panel Link (solo para administradores) */}
              {mounted && isAdmin && (
                <li className="border-b border-gray-100 pb-4">
                  <Link
                    href="/admin/dashboard"
                    className="flex justify-between items-center py-2 text-lg font-medium text-black hover:text-primary"
                    onClick={() => setIsMenuOpen(false)}
                  >
                    Panel de AdministraciÃ³n
                    <ChevronRight className="h-5 w-5 text-gray-400" />
                  </Link>
                </li>
              )}
            </ul>
          </nav>

          <div className="p-6 border-t border-gray-100">
            <div className="flex flex-col gap-3">
              {mounted && session ? (
                <button
                  onClick={handleLogout}
                  className="flex items-center justify-center gap-2 w-full bg-white border border-primary text-primary py-3 rounded-full hover:bg-primary hover:text-white transition-colors"
                >
                  <LogOut className="h-5 w-5" />
                  <span>Cerrar SesiÃ³n</span>
                </button>
              ) : (
                <Link
                  href="/auth/login"
                  className="flex items-center justify-center gap-2 w-full bg-white border border-primary text-primary py-3 rounded-full hover:bg-primary hover:text-white transition-colors"
                  onClick={() => setIsMenuOpen(false)}
                >
                  <User className="h-5 w-5" />
                  <span>Iniciar SesiÃ³n</span>
                </Link>
              )}

              <Link
                href="/carrito"
                className="flex items-center justify-center gap-2 w-full bg-gradient-brand text-white py-3 rounded-full"
                onClick={() => setIsMenuOpen(false)}
              >
                <ShoppingCart className="h-5 w-5" />
                <span>Ver Carrito</span>
                {mounted && cartItemsCount > 0 && (
                  <span className="bg-white text-primary text-xs rounded-full h-5 w-5 flex items-center justify-center ml-1">
                    {cartItemsCount}
                  </span>
                )}
              </Link>
            </div>
          </div>
        </div>
      </div>
    </>
  )
}
