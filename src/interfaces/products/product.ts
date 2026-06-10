
export interface Product {
    id: string
    name: string
    price: number
    image: string
    color?: string
    size?: Size
    category: string
    featured: boolean
    description: string
    envioPrecio?: number
    descuento?: number
}
export interface ProductFeatured {
    id: string
    name: string
    price: number
    image: string
    color?: string
    size?: string
    category: string
    featured: boolean
    description: string
}

export interface ProductCart {
  id: string;
  uniqueKey: string;
  name: string;
  price: number;
  image: string;
  color?: string;
  size?: string;
  category: string;
  featured: boolean;
  description: string;
  envioPrecio?: number;
  descuento?: number;
}

export interface CartItem {
    product: ProductCart
    quantity: number
}

export interface ProductData {
  id: string;
  name: string;
  price: number;
  image: string;
  size: Size[];
  color: Color[];
  category: string;
  featured: boolean;
  description: string;
  features: Features[];
  specifications: Specifications[];
  images: Images[];
  envioPrecio?: number;
  descuento?: number;
}

export interface Images {
    id?: string
    src: string
}

export interface Color {
    id?: string
    name: string
    code: string
}

export interface Size {
    id?: string 
    name: string
    image: string
    price: number
}

export interface Category {
    id: string
    name: string
    img: string
}

export interface Specifications {
    id?: string,
    name: string,
    descripction: string
}

export interface Features {
    id?: string,
    name: string,
}


