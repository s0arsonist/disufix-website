import { create } from "zustand"
import { persist } from "zustand/middleware"

export interface Product {
  id: string
  name: string
  price: number
  image: string
  category: string
  featured: boolean
  description: string
  envioPrecio: number
}

type ProductStore = {
  products: Product[]
  addProduct: (product: Product) => void
  removeProduct: (id: string) => void
  updateProduct: (id: string, updatedProduct: Partial<Product>) => void
  getProductById: (id: string) => Product | undefined
}

export const useProductStore = create<ProductStore>()(
  persist(
    (set, get) => ({
      products: [],

      addProduct: (product) => {
        set((state) => ({ products: [...state.products, product] }))
      },

      removeProduct: (id) => {
        set((state) => ({ products: state.products.filter((product) => product.id !== id) }))
      },

      updateProduct: (id, updatedProduct) => {
        set((state) => ({
          products: state.products.map((product) =>
            product.id === id ? { ...product, ...updatedProduct } : product
          ),
        }))
      },

      getProductById: (id) => {
        return get().products.find((product) => product.id === id)
      },
    }),
    {
      name: "products-store",
    }
  )
)
