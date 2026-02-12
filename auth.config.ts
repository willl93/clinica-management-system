import type { NextAuthConfig } from "next-auth"
import Credentials from "next-auth/providers/credentials"
import { z } from "zod"
import { prisma } from "@/lib/prisma"
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

export const authConfig = {
    pages: {
        signIn: "/login",
    },
    callbacks: {
        authorized({ auth, request: { nextUrl } }) {
            const isLoggedIn = !!auth?.user
            const role = (auth?.user as any)?.role

            const isOnDashboard = nextUrl.pathname.startsWith("/dashboard")
            const isOnAdminLogin = nextUrl.pathname === "/admin/login"
            const isOnAdmin = nextUrl.pathname.startsWith("/admin") && !isOnAdminLogin

            if (isOnAdminLogin) {
                if (isLoggedIn) {
                    if (role === 'SUPER_ADMIN') return Response.redirect(new URL("/admin", nextUrl))
                    return Response.redirect(new URL("/dashboard", nextUrl))
                }
                return true
            }

            if (isOnDashboard) {
                if (isLoggedIn) return true
                return false // Redirect unauthenticated users to login page
            }

            if (isOnAdmin) {
                if (isLoggedIn && role === 'SUPER_ADMIN') return true
                if (isLoggedIn) return Response.redirect(new URL("/dashboard", nextUrl)) // Regular users go to dashboard
                return false
            }

            if (isLoggedIn) {
                if (role === 'SUPER_ADMIN') {
                    return Response.redirect(new URL("/admin", nextUrl))
                }
                return Response.redirect(new URL("/dashboard", nextUrl))
            }
            return true
        },
        async session({ session, token }) {
            if (token.sub && session.user) {
                session.user.id = token.sub
                // Add custom fields to session if needed (e.g., clinicId, role)
                // Note: You need to augment the Session type for TS support
            }
            return session
        },
        async jwt({ token, user }) {
            if (user) {
                token.sub = user.id
                // token.role = user.role
                // token.clinicId = user.clinicId
            }
            return token
        }
    },
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

                console.log("Invalid credentials")
                return null
            },
        }),
    ],
} satisfies NextAuthConfig
