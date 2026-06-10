"use server";

import { Role } from "@/generated/prisma";
import prisma from "@/lib/db";
import { hash, compare } from "bcryptjs"; // Usamos bcryptjs para comparar y cifrar contraseÃ±as

type UpdatePasswordData = {
  userId: string; // ID del usuario
  currentPassword: string; // ContraseÃ±a actual proporcionada por el usuario
  newPassword: string; // Nueva contraseÃ±a
};

export async function updatePassword({
  userId,
  currentPassword,
  newPassword,
}: UpdatePasswordData) {
  try {
    // Buscar al usuario en la base de datos por su ID
    const user = await prisma.user.findUnique({
      where: { id: userId },
    });

    // Verificar si el usuario existe
    if (!user) {
      return { success: false, message: "Usuario no encontrado" };
    }

    // Comparar la contraseÃ±a actual con la almacenada en la base de datos
    const isCurrentPasswordValid = await compare(
      currentPassword,
      user.password
    );

    // Si la contraseÃ±a actual no es vÃ¡lida, retornamos un error
    if (!isCurrentPasswordValid) {
      return { success: false, message: "La contraseÃ±a actual no es correcta" };
    }

    // Si la contraseÃ±a actual es vÃ¡lida, proceder a cifrar la nueva contraseÃ±a
    const hashedNewPassword = await hash(newPassword, 10); // Usamos bcryptjs para cifrar la nueva contraseÃ±a

    // Actualizamos la contraseÃ±a del usuario en la base de datos
    await prisma.user.update({
      where: { id: userId },
      data: {
        password: hashedNewPassword, // Actualizamos la contraseÃ±a con la nueva, cifrada
      },
    });

    return { success: true, message: "ContraseÃ±a actualizada correctamente" };
  } catch (error) {
    console.error("Error al actualizar la contraseÃ±a:", error);
    return { success: false, message: "Error al actualizar la contraseÃ±a" };
  }
}

type CreateUserData = {
  nombreCompleto: string;
  email: string;
  rol: Role; // Asumiendo roles simples, puedes expandirlos si es necesario
  password: string;
};

export const createUser = async ({
  nombreCompleto,
  email,
  rol,
  password,
}: CreateUserData) => {
  try {
    // Verificar si el usuario ya existe
    const userExists = await prisma.user.findUnique({
      where: { email },
    });

    if (userExists) {
      return { success: false, message: "El usuario con ese email ya existe" };
    }

    // Cifrar la contraseÃ±a
    const hashedPassword = await hash(password, 10);

    // Crear el usuario en la base de datos
    const user = await prisma.user.create({
      data: {
        nombreCompleto,
        email: email.toLowerCase(),
        password: hashedPassword,
        role: rol,
        createDate: new Date().toISOString(),
        active: true, // Asumimos que el usuario estÃ¡ activo por defecto
      },
    });

    return { success: true, user, message: "Usuario creado exitosamente" };
  } catch (error) {
    console.error(error);
    return { success: false, message: "Error al crear el usuario" };
  }
};

type UpdateUserData = {
  userId: string;
  nombreCompleto: string;
  email: string;
  rol: Role;
  password?: string; // La contraseÃ±a es opcional en caso de que el usuario no la quiera cambiar
  currentPassword?: string; // Para validar la contraseÃ±a actual
};

export const updateUserr = async ({
  userId,
  nombreCompleto,
  email,
  rol,
  password,
}: UpdateUserData) => {
  try {
    // Verificar si el usuario existe
    const user = await prisma.user.findUnique({
      where: { id: userId },
    });

    if (!user) {
      return { success: false, message: "Usuario no encontrado" };
    }

    // Si se proporciona la contraseÃ±a actual, validamos que coincida

    // Si se proporciona una nueva contraseÃ±a, la ciframos
    let updatedPassword = user.password;
    if (password) {
      updatedPassword = await hash(password, 10);
    }

    // Actualizar el usuario
    const updatedUser = await prisma.user.update({
      where: { id: userId },
      data: {
        nombreCompleto,
        email: email.toLowerCase(),
        role: rol || "User",
        password: updatedPassword, // Actualizamos la contraseÃ±a si se proporcionÃ³ una nueva
      },
    });

    return {
      success: true,
      user: updatedUser,
      message: "Usuario actualizado exitosamente",
    };
  } catch (error) {
    console.error(error);
    return { success: false, message: "Error al actualizar el usuario" };
  }
};

export const deleteUser = async (userId: string) => {
  try {
    // Verificar si el usuario existe
    const user = await prisma.user.findUnique({
      where: { id: userId },
    });

    if (!user) {
      return { success: false, message: "Usuario no encontrado" };
    }

    // Eliminar el usuario de la base de datos
    await prisma.user.delete({
      where: { id: userId },
    });

    return { success: true, message: "Usuario eliminado exitosamente" };
  } catch (error) {
    console.error(error);
    return { success: false, message: "Error al eliminar el usuario" };
  }
};

export async function verificarUsuario(email: string) {
  const user = await prisma.user.findUnique({
    where: { email: email },
  });

  // Verificar si el usuario existe
  if (!user) {
    return { success: false, message: "Usuario no encontrado" };
  }

  return { success: true, user };
}

export async function updatePasswordRecover(
  userId: string,
  newPassword: string
) {
  try {
    // Si la contraseÃ±a actual es vÃ¡lida, proceder a cifrar la nueva contraseÃ±a
    const hashedNewPassword = await hash(newPassword, 10); // Usamos bcryptjs para cifrar la nueva contraseÃ±a

    // Actualizamos la contraseÃ±a del usuario en la base de datos
    await prisma.user.update({
      where: { id: userId },
      data: {
        password: hashedNewPassword, // Actualizamos la contraseÃ±a con la nueva, cifrada
      },
    });

    return { success: true, message: "ContraseÃ±a actualizada correctamente" };
  } catch (error) {
    console.error("Error al actualizar la contraseÃ±a:", error);
    return { success: false, message: "Error al actualizar la contraseÃ±a" };
  }
}
