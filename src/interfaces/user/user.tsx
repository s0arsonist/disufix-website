import { Order } from "../checkout/checkout"

export interface User{
    id: string
    role: Role
    nombreCompleto: string
    email: string
    password:string
    createDate: string
    active: boolean
    order?:Order[]
}

export interface Client{
    id: string
    nombre: string
    apellido: string
    email: string
    telefono: string
    createDate: string
    order?:Order[]
}

export type Role = ['Admin','User']

