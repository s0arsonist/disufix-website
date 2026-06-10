'use server';

import prisma from '@/lib/db';
import bcryptjs from 'bcryptjs'

export const registerUser = async (name: string, email: string, password: string) => {
    try {
        const userExist = await prisma.user.findUnique({
            where: {
                email: email
            },
        })
        //si no existe creamos el usuario
        if (!userExist) {
            const user = await prisma.user.create({
                data: {
                    nombreCompleto: name,
                    email: email.toLowerCase(),
                    password: bcryptjs.hashSync(password),
                    active: true,
                    createDate: new Date().toLocaleString('en-US', {
                        year: 'numeric',
                        month: '2-digit',
                        day: '2-digit',
                        hour: '2-digit',
                        minute: '2-digit',
                        hour12: false,
                        timeZone: 'America/Bogota',
                    }).replace(',', '').replace('/', '-').replace('/', '-'),
                },
                select: {
                    id: true,
                    nombreCompleto: true,
                    email: true,
                }
            })
            return {
                ok: true,
                user: user,
                message: 'Usuario creado'
            }
        }
        return {
            ok: false,
            message: 'Usuario Ya existe'
        }
    } catch (error) {
        console.log(error);

        return {
            ok: false,
            message: 'No se pudo crear el usuario'
        }
    }
}