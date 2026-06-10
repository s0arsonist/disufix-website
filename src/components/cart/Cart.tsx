"use client";
import Image from "next/image";
import Link from "next/link";
import {
  Minus,
  Plus,
  Trash2,
  ArrowRight,
  ShoppingBag,
  ChevronLeft,
} from "lucide-react";

import { useAnimateOnScroll } from "@/hooks/use-animation";
import { useStore } from "@/store/cart";

export default function Cart() {
  const cart = useStore((state) => state.cart);
  //console.log("Cart Items:", cart);
  const getCartTotal = useStore((state) => state.getCartTotal);
  const updateQuantity = useStore((state) => state.updateQuantity);
  const removeFromCart = useStore((state) => state.removeFromCart);

  useAnimateOnScroll();

  // === LÃGICA DE DESCUENTO Y ENVÃO ===

  // 1. LÃ³gica de Descuento:
  // El 'subtotal' ya incluye los descuentos, porque 'item.product.price'
  // es el 'finalPrice' que calculamos en la pÃ¡gina de producto.
  const subtotal = getCartTotal();

  // 2. LÃ³gica de EnvÃ­o (Nueva):
  let shipping = 0; // Por defecto es 0
  if (subtotal > 0) {
    // Busca el *primer* producto en el carrito que tenga un costo de envÃ­o.
    const productWithShipping = cart.find(
      (item) =>
        typeof item.product.envioPrecio === "number" &&
        item.product.envioPrecio > 0
    );

    if (productWithShipping) {
      // Si se encuentra, ESE es el costo de envÃ­o.
      shipping = productWithShipping.product.envioPrecio as number;
    }
    // Si no se encuentra (todos son 0), 'shipping' se queda en 0.
  }

  const total = subtotal + shipping;
  // === FIN DE LA LÃGICA ===

  return (
    <div className="container-custom py-8 md:py-12">
      <div className="mb-8 animate-slide-down">
        <h1 className="text-3xl font-bold mb-2">
          Carrito de <span className="text-primary">Compras</span>
        </h1>
        <div className="w-20 h-1 bg-gradient-brand rounded-full"></div>
      </div>

      {cart.length === 0 ? (
        <div className="text-center py-16 animate-fade-in bg-white rounded-xl shadow-md">
          <div className="mb-6 flex justify-center">
            <div className="relative w-24 h-24 text-black/30">
              <ShoppingBag className="w-full h-full" />
            </div>
          </div>
          <h2 className="text-2xl font-bold mb-4">Tu carrito estÃ¡ vacÃ­o</h2>
          <p className="text-black/70 mb-8 max-w-md mx-auto">
            Parece que aÃºn no has agregado productos a tu carrito. Explora
            nuestro catÃ¡logo para encontrar lo que necesitas.
          </p>
          <Link
            href="/productos"
            className="btn bg-gradient-brand text-white px-6 py-3 rounded-full hover:shadow-lg transform hover:scale-105 transition-all flex items-center justify-center mx-auto w-fit"
          >
            Explorar Productos
            <ArrowRight className="ml-2 h-4 w-4" />
          </Link>
        </div>
      ) : (
        <div className="grid lg:grid-cols-3 gap-8">
          {/* Cart Items */}
          <div className="lg:col-span-2">
            <div className="bg-white rounded-xl shadow-md overflow-hidden animate-slide-up">
              <div className="hidden md:flex justify-between items-center p-4 bg-gray-50 border-b border-gray-200">
                <span className="font-medium">Producto</span>
                <div className="flex items-center gap-16">
                  <span className="font-medium">Cantidad</span>
                  <span className="font-medium">Precio</span>
                  <span className="w-8"></span> {/* Space for delete button */}
                </div>
              </div>

              {cart.map((item, index) => (
                <div
                  key={item.product.uniqueKey}
                  className="p-4 border-b border-gray-200 last:border-0 hover:bg-gray-50 transition-colors animate-slide-up"
                  style={{ animationDelay: `${index * 0.1}s` }}
                >
                  <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                    {/* Product */}
                    <div className="flex items-center gap-4">
                      <div className="relative w-20 h-20 rounded-md overflow-hidden flex-shrink-0">
                        <Image
                          src={item.product.image || "/placeholder.svg"}
                          alt={item.product.name}
                          fill
                          className="object-cover"
                          unoptimized={true}
                        />
                      </div>
                      <div>
                        <h3 className="font-medium">{item.product.name}</h3>
                        <p className="text-sm text-black/70">
                          CategorÃ­a: {item.product.category}
                        </p>
                        {item?.product?.size && (
                          <p className="text-sm text-black/70">
                            TamaÃ±o: {item.product.size}
                          </p>
                        )}
                        {item?.product?.color && (
                          <p className="text-sm text-black/70">
                            Color: {item.product.color}
                          </p>
                        )}
                        <p className="text-sm font-medium text-primary md:hidden">
                          ${item.product.price.toLocaleString()}
                        </p>
                      </div>
                    </div>

                    <div className="flex items-center justify-between sm:gap-8">
                      {/* Quantity */}
                      <div className="flex items-center border border-gray-300 rounded-full overflow-hidden">
                        <button
                          onClick={() => {
                            if (item.quantity > 1) {
                              updateQuantity(
                                item.product.uniqueKey,
                                item.quantity - 1
                              );
                            }
                          }}
                          className="px-2 py-1 text-black hover:text-primary transition-colors bg-gray-100 hover:bg-gray-200"
                        >
                          <Minus className="h-3 w-3" />
                        </button>
                        <span className="px-3 py-1 border-x border-gray-300 text-sm min-w-[30px] text-center">
                          {item.quantity}
                        </span>
                        <button
                          onClick={() =>
                            updateQuantity(
                              item.product.uniqueKey,
                              item.quantity + 1
                            )
                          }
                          className="px-2 py-1 text-black hover:text-primary transition-colors bg-gray-100 hover:bg-gray-200"
                        >
                          <Plus className="h-3 w-3" />
                        </button>
                      </div>

                      {/* Price */}
                      <div className="hidden md:block">
                        <span className="font-medium">
                          $
                          {(
                            item.product.price * item.quantity
                          ).toLocaleString()}
                        </span>
                      </div>

                      {/* Delete Button */}
                      <button
                        onClick={() => removeFromCart(item.product.uniqueKey)}
                        className="text-black hover:text-red-500 transition-colors"
                        aria-label="Eliminar producto"
                      >
                        <Trash2 className="h-5 w-5" />
                      </button>
                    </div>
                  </div>
                </div>
              ))}

              <div className="p-4 border-t border-gray-200 bg-gray-50">
                <Link
                  href="/productos"
                  className="flex items-center text-primary hover:underline"
                >
                  <ChevronLeft className="h-4 w-4 mr-1" />
                  Continuar Comprando
                </Link>
              </div>
            </div>
          </div>

          {/* Order Summary */}
          <div className="lg:col-span-1">
            <div className="bg-white rounded-xl shadow-md p-6 animate-slide-left sticky top-24">
              <h2 className="text-xl font-bold mb-6">Resumen de la Orden</h2>

              <div className="space-y-4 mb-6">
                <div className="flex justify-between">
                  <span className="text-black/70">Subtotal</span>
                  <span className="font-medium">
                    ${subtotal.toLocaleString()}
                  </span>
                </div>

                {/* === MOSTRAR ENVÃO ACTUALIZADO === */}
                <div className="flex justify-between">
                  <span className="text-black/70">EnvÃ­o</span>
                  <span className="font-medium">
                    {shipping > 0
                      ? `$${shipping.toLocaleString()}`
                      : "EnvÃ­o Gratis"}
                  </span>
                </div>

                <div className="border-t border-gray-200 pt-4 flex justify-between font-bold">
                  <span>Total</span>
                  <span className="text-primary">
                    ${total.toLocaleString()}
                  </span>
                </div>
              </div>

              <Link
                href="/checkout/direccion"
                className="btn bg-gradient-brand text-white w-full flex items-center justify-center rounded-full py-3 hover:shadow-lg transition-all"
              >
                Proceder al Pago
                <ArrowRight className="ml-2 h-4 w-4" />
              </Link>

              {/* Secure Payment */}
              <div className="mt-6 pt-6 border-t border-gray-100">
                <h3 className="font-medium mb-4 text-center">
                  MÃ©todos de Pago
                </h3>
                <div className="flex items-center justify-between">
                  <h1>
                    <span>Wompi</span>
                  </h1>
                  {/* <Image src="/payment-methods/visa.png" alt="Visa" width={40} height={25} />
                  <Image src="/payment-methods/mastercard.png" alt="Mastercard" width={40} height={25} />
                  <Image src="/payment-methods/amex.png" alt="American Express" width={40} height={25} /> */}
                  {/* <Image src="/payment-methods/pse.png" alt="PSE" width={40} height={25} /> */}
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
