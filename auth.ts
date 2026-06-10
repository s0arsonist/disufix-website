import NextAuth from "next-auth"
import authConfig from "./auth.config"
import { PrismaAdapter } from "@auth/prisma-adapter"
import prisma from "@/lib/db"

export const { handlers, auth, signIn, signOut } = NextAuth({
  adapter: PrismaAdapter(prisma),
  session: { strategy: "jwt" },
  ...authConfig,
  callbacks: {
    // AquÃ­ aÃ±adimos los datos del usuario al token JWT
    jwt({ token, user }: any) {
      if (user) { // User is available during sign-in
        token.id = user.id // Almacenar el ID del usuario
        token.nombreCompleto = user.nombreCompleto // Almacenar el nombre completo del usuario
        token.role = user.role // Almacenar el rol del usuario
      }
      return token
    },
    // AquÃ­ pasamos la informaciÃ³n del token a la sesiÃ³n
    session({ session, token }: any) {
      if (session.user) {
        session.user.id = token.id // Pasar el ID del usuario
        session.user.nombreCompleto = token.nombreCompleto // Pasar el nombre completo del usuario
        session.user.role = token.role // Pasar el rol del usuario
      }
      return session
    },
  },
})
