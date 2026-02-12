import NextAuth from "next-auth"
import { authConfig } from "./auth.config"
import { PrismaAdapter } from "@auth/prisma-adapter"
import { prisma } from "@/lib/prisma"
import Credentials from "next-auth/providers/credentials"
import { z } from "zod"
import bcrypt from "bcryptjs"

async function getUser(username: string) {
    try {
        const user = await prisma.user.findUnique({
            where: { username },
            include: { clinic: true },
        })
        return user
    } catch (error) {
        console.error("Failed to fetch user:", error)
        throw new Error("Failed to fetch user.")
    }
}

export const { auth, signIn, signOut, handlers } = NextAuth({
    ...authConfig,
    adapter: PrismaAdapter(prisma),
    session: { strategy: "jwt" },
    providers: [
        Credentials({
            async authorize(credentials) {
                const parsedCredentials = z
                    .object({ username: z.string(), password: z.string().min(6) })
                    .safeParse(credentials)

                if (parsedCredentials.success) {
                    const { username, password } = parsedCredentials.data
                    const user = await getUser(username)
                    if (!user) return null

                    const passwordsMatch = await bcrypt.compare(password, user.password)
                    if (passwordsMatch) return user
                }

                return null
            },
        }),
    ],
    callbacks: {
        async session({ session, token }) {
            if (token.sub && session.user) {
                session.user.id = token.sub
                // @ts-ignore // Adding custom types to session
                session.user.role = token.role
                // @ts-ignore
                session.user.clinicId = token.clinicId
            }
            return session
        },
        async jwt({ token, user }) {
            if (user) {
                token.sub = user.id
                // @ts-ignore
                token.role = user.role
                // @ts-ignore
                token.clinicId = user.clinicId
            }
            return token
        }
    }
})
