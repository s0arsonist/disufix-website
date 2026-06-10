'use server'

import {  signIn } from "../../../auth";
import { AuthError } from "next-auth";

type dataform = {
    email: string,
    password: string
}

export async function authenticate(data:dataform) {
    try {
        await signIn('credentials', {
            ...data,
            redirect: false,
        })

        return { success: true , message:'Bienvenido a Disufix'}; //retornamos success true 

    } catch (error) {
        console.log(error);
        //caturamos el error que viene de auth
        if (error instanceof AuthError) {
            return { error: error.cause?.err?.message };
        }
        return { error: 'error 500' };
    }
}

