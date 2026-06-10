"use client";

import Image from "next/image";
import Link from "next/link";
import {
  ArrowRight,
  ChevronRight,
  ShieldCheck,
  Truck,
  Zap,
} from "lucide-react";
import { useAnimateOnScroll } from "@/hooks/use-animation";

import { useEffect, useState } from "react";
import type { Category, Product } from "@/interfaces";
import { getCategories, getFeaturedProducts } from "@/actions";
import Loader from "@/components/ui/loader";
import WhatsappContact from "@/components/ui/contact";
import SocialFeedSimple from "@/components/ui/social-feed-simple";

export function Home() {
  useAnimateOnScroll();
  const [categories, setCategories] = useState<Category[]>([]);
  const [featuredProducts, setFeaturedProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(false);

useEffect(() => {
  const getProductb = async () => {
    setLoading(true);
    try {
      // Hacemos ambas peticiones en paralelo para mÃ¡s eficiencia
      const [productsb, categoriesb] = await Promise.all([
        getFeaturedProducts(),
        getCategories(),
      ]);

      

      //console.log("Featured Products:", productsb);
      setFeaturedProducts(productsb);
      setCategories(categoriesb);
    } catch (error) {
      console.log(error);
    } finally {
      // 'setLoading(false)' debe ir aquÃ­, dentro del 'finally'
      // para que se ejecute despuÃ©s de que 'await' termine.
      setLoading(false);
    }
  };

  getProductb();
}, []);

  return (
    <>
      {/* Hero Section */}
      <section className="relative min-h-[90vh] flex items-center overflow-hidden">
        <div className="absolute inset-0 z-0">
          <Image
            src="/imgs/home.png"
            alt="Disufix productos"
            fill
            className="object-cover"
            priority
            quality={90}
          />
          <div className="absolute inset-0 bg-gradient-to-r from-black/90 to-black/60"></div>
        </div>

        <div className="container-custom relative z-10 py-20">
          <div className="grid md:grid-cols-2 gap-8 items-center">
            <div className="animate-slide-right">
              <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold mb-4 text-white">
                Tu hogar,
                <span className="text-primary"> tus reglas</span> y nosotros
              </h1>
              <p className="text-lg md:text-xl mb-8 text-gray-200">
                Productos innovadores para que mantengas tu construcciÃ³n como un
                experto.
                <br />
                <br />
                <span>#Halzoportimismo</span>
              </p>

              <div className="flex flex-wrap gap-4">
                <Link
                  href="/productos"
                  className="btn bg-gradient-brand text-white px-6 py-3 rounded-full hover:shadow-lg transform hover:scale-105 transition-all flex items-center"
                >
                  Ver Productos
                  <ChevronRight className="ml-1 h-5 w-5" />
                </Link>
                <Link
                  href="/nosotros"
                  className="btn btn-outline border-white text-white hover:bg-white hover:text-black"
                >
                  Conocer MÃ¡s
                </Link>
              </div>

              {/* Features */}
              <div className="grid grid-cols-3 gap-4 mt-12">
                <div
                  className="flex flex-col items-center text-center text-white animate-slide-up"
                  style={{ animationDelay: "0.2s" }}
                >
                  <div className="bg-primary/20 p-3 rounded-full mb-3">
                    <ShieldCheck className="h-6 w-6 text-primary" />
                  </div>
                  <span className="text-sm font-medium">
                    Calidad Garantizada
                  </span>
                </div>
                <div
                  className="flex flex-col items-center text-center text-white animate-slide-up"
                  style={{ animationDelay: "0.3s" }}
                >
                  <div className="bg-primary/20 p-3 rounded-full mb-3">
                    <Truck className="h-6 w-6 text-primary" />
                  </div>
                  <span className="text-sm font-medium">EnvÃ­o Nacional</span>
                </div>
                <div
                  className="flex flex-col items-center text-center text-white animate-slide-up"
                  style={{ animationDelay: "0.4s" }}
                >
                  <div className="bg-primary/20 p-3 rounded-full mb-3">
                    <Zap className="h-6 w-6 text-primary" />
                  </div>
                  <span className="text-sm font-medium">Alta TecnologÃ­a</span>
                </div>
              </div>
            </div>
            <div className="hidden md:block animate-slide-left">
              <div className="relative">
                <div className="absolute -top-10 -left-10 w-40 h-40 bg-gradient-brand rounded-full opacity-30 animate-bounce-slow"></div>
                <div
                  className="absolute -bottom-10 -right-10 w-32 h-32 bg-secondary rounded-full opacity-30 animate-bounce-slow"
                  style={{ animationDelay: "1s" }}
                ></div>
                <div className="p-6 rounded-2xl">
                  {!featuredProducts[featuredProducts.length - 1]?.image ? (
                    <Loader showText={false} />
                  ) : (
                    <div className="relative h-[400px] w-full rounded-xl overflow-hidden">
                      <Image
                        src={`${
                          featuredProducts[featuredProducts.length - 1]?.image
                        }`}
                        alt="Producto destacado"
                        fill
                        className="object-contain"
                        priority
                        unoptimized={true}
                      />
                    </div>
                  )}

                  <div className="mt-4 p-4 bg-white/10 backdrop-blur-sm rounded-xl">
                    <h3 className="text-xl font-bold text-white">
                      {featuredProducts[featuredProducts.length - 1]?.name}
                    </h3>
                    <p className="text-gray-200 mb-3">
                      {
                        featuredProducts[featuredProducts.length - 1]
                          ?.description
                      }
                    </p>
                    <Link
                      href={`/productos/${
                        featuredProducts[featuredProducts.length - 1]?.id
                      }`}
                      className="inline-block bg-white text-primary px-4 py-2 rounded-full text-sm font-medium hover:bg-primary hover:text-white transition-colors"
                    >
                      Ver Detalles
                    </Link>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Sello en Hero */}
        <div className="absolute top-4 right-4 md:top-8 md:right-8 z-20">
          <div className="relative h-16 w-16 md:h-28 md:w-28 lg:h-32 lg:w-32 group animate-bounce-slow">
            <Image
              src="/imgs/sello.png"
              alt="Sello Disufix"
              fill
              className="object-cover rounded-full shadow-lg group-hover:scale-110 transition-transform duration-300"
            />
          </div>
        </div>

        {/* Wave Divider */}
        <div className="absolute bottom-0 left-0 w-full overflow-hidden">
          <svg
            className="relative block w-full h-[50px] md:h-[100px]"
            viewBox="0 0 1200 120"
            preserveAspectRatio="none"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              d="M321.39,56.44c58-10.79,114.16-30.13,172-41.86,82.39-16.72,168.19-17.73,250.45-.39C823.78,31,906.67,72,985.66,92.83c70.05,18.48,146.53,26.09,214.34,3V120H0V95.8C59.71,118.11,130.83,141.14,214.86,141.14c67.64,0,133.76-18.59,190.91-51.39A438.59,438.59,0,0,0,321.39,56.44Z"
              fill="#ffffff"
            ></path>
          </svg>
        </div>
      </section>
      {/* Categories Section */}
      <section className="section bg-gray-50">
        <div className="container-custom">
          <div className="text-center mb-12 animate-on-scroll">
            <h2 className="text-3xl font-bold mb-4">
              Nuestras <span className="text-primary">CategorÃ­as</span>
            </h2>
            <div className="w-20 h-1 bg-gradient-brand mx-auto rounded-full mb-4"></div>
            <p className="text-black/70 max-w-2xl mx-auto">
              Descubre nuestra amplia gama de productos especializados para cada
              necesidad
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {categories.map((category, index) => (
              <Link
                key={category.id}
                href={`/productos?categoria=${category.name}`}
                className="card group card-hover"
                style={{ transitionDelay: `${index * 0.1}s` }}
              >
                <div className="relative h-48 w-full">
                  <Image
                    src={category.img || "/placeholder.svg"}
                    alt={category.name}
                    fill
                    className="object-cover group-hover:scale-105 transition-transform duration-300"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-neutral/90 to-transparent"></div>
                  <div className="absolute bottom-0 left-0 p-4 text-white">
                    <h3 className="text-xl font-bold mb-1">{category.name}</h3>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </section>
      <WhatsappContact />

      {/* Featured Products */}
      <section className="section">
        <div className="container-custom">
          <div className="flex justify-between items-center mb-12">
            <div className="animate-on-scroll">
              <h2 className="text-3xl font-bold mb-2">
                Productos <span className="text-primary">Destacados</span>
              </h2>
              <div className="w-20 h-1 bg-gradient-brand rounded-full mb-2"></div>
              <p className="text-black/70">Nuestros productos mÃ¡s populares</p>
            </div>
            <Link
              href="/productos"
              className="flex items-center text-primary font-medium hover:underline animate-on-scroll"
            >
              Ver todos <ArrowRight className="ml-2 h-4 w-4" />
            </Link>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {featuredProducts.map((product, index) => {
              // 1. Definimos las variables (como antes)
              const originalPrice = product.size?.price || product.price;
              const discount = product?.descuento;
              const shippingCost = product?.envioPrecio;

              // 2. Calculamos si existe un descuento vÃ¡lido
              const hasDiscount = typeof discount === "number" && discount > 0;

              // 3. Calculamos el precio final
              const finalPrice =
                hasDiscount && typeof originalPrice === "number"
                  ? originalPrice * (1 - discount / 100)
                  : originalPrice;

              // 4. Verificamos si el envÃ­o es gratis
              const isFreeShipping = shippingCost === 0;

              return (
                <div
                  key={product.id}
                  className="card group card-hover "
                  style={{ transitionDelay: `${index * 0.1}s` }}
                >
                  <div className="relative h-64 w-full overflow-hidden">
                    <Image
                      src={
                        product.size?.image ||
                        product.image ||
                        "/placeholder.svg"
                      }
                      alt={product.name}
                      fill
                      className="object-contain group-hover:scale-105 transition-transform duration-300"
                      unoptimized={true}
                    />

                    {/* === INICIO: NUEVO BADGE DE OFERTA === */}
                    {hasDiscount && (
                      <div className="absolute top-3 left-3 bg-red-600 text-white text-xs font-bold uppercase px-2 py-1 rounded-md z-10">
                        Oferta -{discount}%
                      </div>
                    )}
                    {/* === FIN: NUEVO BADGE DE OFERTA === */}

                    <div className="absolute top-3 right-3 bg-primary text-white text-xs font-bold uppercase px-2 py-1 rounded-full">
                      {product.category}
                    </div>
                  </div>

                  <div className="p-5">
                    <h3 className="font-bold text-lg mt-1 mb-2 min-h-[56px]">
                      {product.name}
                    </h3>

                    <div className="flex justify-between items-end mt-2">
                      {/* --- Bloque de Precio y EnvÃ­o --- */}
                      <div>
                        {/* LÃ³gica de descuento */}
                        {hasDiscount ? (
                          <>
                            <span className="text-gray-500 line-through text-md mr-2">
                              ${originalPrice?.toLocaleString()}
                            </span>
                            <span className="font-bold text-lg text-primary">
                              ${finalPrice?.toLocaleString()}
                            </span>
                          </>
                        ) : (
                          <span className="font-bold text-lg text-primary">
                            ${originalPrice?.toLocaleString()}
                          </span>
                        )}

                        {/* LÃ³gica de envÃ­o */}
                        {isFreeShipping && (
                          <div className="text-green-600 font-semibold text-sm mt-1">
                            EnvÃ­o Gratis
                          </div>
                        )}
                      </div>

                      {/* --- BotÃ³n --- */}
                      <Link
                        href={`/productos/${product.id}`}
                        className="btn bg-gradient-brand py-2 px-4 text-sm text-white rounded-full flex-shrink-0"
                      >
                        Ver Detalles
                      </Link>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </section>
      {/* <SocialNetworks/> */}
      <SocialFeedSimple />

      {/* About Section */}
      <section className="section relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-r from-primary to-primary-dark opacity-95 z-0"></div>
        <div className="absolute -top-20 -right-20 w-64 h-64 bg-white/10 rounded-full"></div>
        <div className="absolute -bottom-20 -left-20 w-64 h-64 bg-white/10 rounded-full"></div>

        <div className="container-custom relative z-10">
          <div className="grid md:grid-cols-2 gap-12 items-center">
            <div className="animate-on-scroll">
              <h2 className="text-3xl font-bold mb-6 text-white">
                Â¿QuiÃ©n es <span className="text-secondary">Disufix</span>?
              </h2>
              <div className="w-20 h-1 bg-secondary rounded-full mb-6"></div>
              <p className="text-lg mb-6 text-white/90">
                Disufix es una empresa que crea y ofrece productos quÃ­micos de
                alta tecnologÃ­a e innovaciÃ³n para cualquier tipo de usuario,
                desde uso domÃ©stico hasta uso industrial, para el mantenimiento
                y prevenciÃ³n en construcciones.
              </p>
              <p className="text-lg mb-8 text-white/90">
                Contamos con presencia en mÃ¡s de 30 ciudades de Colombia,
                brindando soluciones efectivas y de calidad.
              </p>
              <Link
                href="/nosotros"
                className="btn bg-white text-primary hover:bg-secondary hover:text-black transition-colors px-6 py-3 rounded-full inline-flex items-center"
              >
                Conocer MÃ¡s
                <ChevronRight className="ml-1 h-5 w-5" />
              </Link>
            </div>
            <div className="relative animate-on-scroll">
              <div className="bg-white/10 backdrop-blur-sm p-4 rounded-2xl rotate-3 transform hover:rotate-0 transition-transform duration-300">
                <div className="relative h-80 md:h-[400px] rounded-xl overflow-hidden">
                  <Image
                    src="/imgs/cambiodisufix.jpg"
                    alt="Acerca de Disufix"
                    fill
                    className="object-contain"
                  />
                </div>
              </div>
              <div className="absolute -bottom-5 -left-5 w-32 h-32 bg-secondary/30 rounded-full animate-bounce-slow"></div>
            </div>
          </div>
        </div>

        {/* Sello en About */}
        <div className="absolute bottom-4 left-4 md:bottom-8 md:left-8 z-20">
          <div className="relative h-14 w-14 md:h-24 md:w-24 lg:h-28 lg:w-28 group">
            <Image
              src="/imgs/sello.png"
              alt="Sello Disufix"
              fill
              className="object-cover rounded-full shadow-lg group-hover:scale-110 transition-transform duration-300 opacity-80"
            />
          </div>
        </div>
      </section>

      {/* Testimonials */}
      <section className="section bg-gray-50">
        <div className="container-custom">
          <div className="text-center mb-12 animate-on-scroll">
            <h2 className="text-3xl font-bold mb-4">
              Lo que dicen nuestros{" "}
              <span className="text-primary">clientes</span>
            </h2>
            <div className="w-20 h-1 bg-gradient-brand mx-auto rounded-full mb-4"></div>
            <p className="text-black/70 max-w-2xl mx-auto">
              Experiencias reales de quienes han confiado en nuestros productos
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            {[1, 2, 3].map((i) => (
              <div
                key={i}
                className="bg-white p-6 rounded-xl shadow-md hover:shadow-lg transition-all animate-on-scroll"
                style={{ transitionDelay: `${(i - 1) * 0.1}s` }}
              >
                <div className="flex items-center text-yellow-400 mb-4">
                  {[...Array(5)].map((_, j) => (
                    <svg
                      key={j}
                      className="w-5 h-5 fill-current"
                      viewBox="0 0 24 24"
                    >
                      <path d="M12 17.27L18.18 21l-1.64-7.03L22 9.24l-7.19-.61L12 2 9.19 8.63 2 9.24l5.46 4.73L5.82 21z" />
                    </svg>
                  ))}
                </div>
                <p className="text-black mb-4">
                  "Los productos de Disufix han superado mis expectativas. La
                  calidad es excepcional y los resultados son duraderos.
                  Definitivamente los recomiendo."
                </p>
                <div className="flex items-center">
                  <div className="w-10 h-10 bg-gradient-brand rounded-full mr-3 flex items-center justify-center text-white font-bold">
                    {String.fromCharCode(64 + i)}
                  </div>
                  <div>
                    <h4 className="font-bold">Cliente Satisfecho</h4>
                    <p className="text-sm text-black/70">BogotÃ¡, Colombia</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="section relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-brand opacity-90"></div>
        <div className="absolute -top-20 -right-20 w-64 h-64 bg-white/10 rounded-full"></div>
        <div className="absolute -bottom-20 -left-20 w-64 h-64 bg-white/10 rounded-full"></div>

        <div className="container-custom text-center relative z-10">
          <div className="max-w-2xl mx-auto animate-on-scroll">
            <h2 className="text-3xl font-bold mb-6 text-white">
              Â¿Listo para transformar tus proyectos?
            </h2>
            <p className="text-lg mb-8 text-white/90">
              Descubre la diferencia con nuestros productos de alta tecnologÃ­a e
              innovaciÃ³n
            </p>
            <Link
              href="/productos"
              className="btn bg-white text-primary hover:bg-neutral hover:text-white transition-colors px-8 py-3 rounded-full inline-flex items-center"
            >
              Explorar Productos
              <ChevronRight className="ml-1 h-5 w-5" />
            </Link>
          </div>
        </div>
      </section>
    </>
  );
}
