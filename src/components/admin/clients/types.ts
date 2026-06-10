export interface Client {
  id: string;
  nombre: string;
  apellido: string;
  email: string;
  telefono: string;
  createDate: string;
}

export interface Order {
  id: string
  state: "paid" | "pending" | "canceled"
  status: string
  paymentSummary?: {
    total: number
  }
}
