
import prisma from "@/lib/db"
import bcryptjs from "bcryptjs"
import type { NextAuthConfig } from "next-auth"
import Credentials from "next-auth/providers/credentials"

// Notice this is only an object, not a full Auth.js instance
export default {
  providers: [
    Credentials({
      // You can specify which fields should be submitted, by adding keys to the `credentials` object.
      // e.g. domain, username, password, 2FA token, etc.
      credentials: {
        email: {},
        password: {},
      },
      authorize: async (credentials: any) => {
        //verficamos si el usuario ees correcto
        const user = await prisma.user.findUnique({
          where: {
            email: credentials.email
          },
        })

        //si no esxiste mandomos el error
        if (!user) {
          throw new Error('User or Password incorrect')
        }

        //verificar la contraseÃ±a
        const invalidPass = bcryptjs.compareSync(credentials.password, user.password);
        if (!invalidPass) {
          throw new Error('User or Password incorrect')
        }

        return user;
      },
    }),
  ],
} satisfies NextAuthConfig