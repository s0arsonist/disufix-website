'use server';

import prisma from '@/lib/db';
import bcryptjs from 'bcryptjs';

// ------------------ USER ------------------
export const registerUser = async (name: string, email: string, password: string) => {
    try {
        const userExist = await prisma.user.findUnique({ where: { email } });
        if (!userExist) {
            const user = await prisma.user.create({
                data: {
                    nombreCompleto: name,
                    email: email.toLowerCase(),
                    password: bcryptjs.hashSync(password),
                    active: true,
                    createDate: new Date().toISOString(),
                },
                select: { id: true, nombreCompleto: true, email: true }
            });
            return { ok: true, user, message: 'Usuario creado' };
        }
        return { ok: false, message: 'Usuario ya existe' };
    } catch (error) {
        console.error(error);
        return { ok: false, message: 'Error al crear usuario' };
    }
};

export const getUsers = async () => prisma.user.findMany();
export const getUserById = async (id: string) => prisma.user.findUnique({ where: { id } });
export const updateUser = async (id: string, data: any) => prisma.user.update({ where: { id }, data });
export const deleteUser = async (id: string) => prisma.user.delete({ where: { id } });