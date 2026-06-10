import { Product } from "@/store/product";

export interface ShippingAddress {
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  address: string;
  city: string;
  state: string;
  notes: string;
}

export interface PaymentSummary {
  subtotal: number;
  shipping: number;
  total: number;
}

export interface OrderSummary {
  products: Product[];
  shippingAddress: ShippingAddress;
  paymenSummary: PaymentSummary;
}

export interface Order {
  id?: string;
  createdAt?: Date;
  products: Product[];
  shippingAddress: ShippingAddress;
  paymenSummary: PaymentSummary;
  state: StateOrder;
  paymentMethod: string;
}

export type StateOrder = ["paid", "pending", "canceled"];
