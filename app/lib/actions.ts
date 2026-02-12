"use server"

import { signIn } from "@/auth"
import { AuthError } from "next-auth"
import { prisma } from "@/lib/prisma"
import bcrypt from "bcryptjs"
import { z } from "zod"

const RegisterSchema = z.object({
    name: z.string().min(2, { message: "Name must be at least 2 characters long." }),
    username: z.string().email({ message: "Please enter a valid email." }),
    password: z.string().min(6, { message: "Password must be at least 6 characters long." }),
    clinicId: z.string().uuid({ message: "Please select a valid clinic." }),
    cpf: z.string().optional(), // CPF is optional in schema but we should collect it
    birthDate: z.string().optional(),
    phone: z.string().optional(),
})

export async function authenticate(
    prevState: string | undefined,
    formData: FormData,
) {
    try {
        await signIn("credentials", formData)
    } catch (error) {
        if (error instanceof AuthError) {
            switch (error.type) {
                case "CredentialsSignin":
                    return "Invalid credentials."
                default:
                    return "Something went wrong."
            }
        }
        throw error
    }
}

export async function register(prevState: string | undefined, formData: FormData) {
    const validatedFields = RegisterSchema.safeParse({
        name: formData.get("name"),
        username: formData.get("username"),
        password: formData.get("password"),
        clinicId: formData.get("clinicId"),
        cpf: formData.get("cpf"),
        birthDate: formData.get("birthDate"),
        phone: formData.get("phone"),
    })

    if (!validatedFields.success) {
        return "Missing or Invalid Fields. Failed to Register."
    }

    const { name, username, password, clinicId, cpf, birthDate, phone } = validatedFields.data
    const hashedPassword = await bcrypt.hash(password, 10)

    try {
        await (prisma.user as any).create({
            data: {
                name,
                username,
                password: hashedPassword,
                role: "PATIENT",
                clinicId,
                cpf,
                birthDate: birthDate ? new Date(birthDate) : null,
                phone,
            },
        })
    } catch (error) {
        console.error(error)
        return "Database Error: Failed to Create User (Username or CPF might be taken)."
    }

    // Attempt to log in immediately
    try {
        await signIn("credentials", formData)
    } catch (error) {
        if (error instanceof AuthError) {
            switch (error.type) {
                case "CredentialsSignin":
                    return "Registration successful, but auto-login failed."
                default:
                    return "Something went wrong during login."
            }
        }
        throw error
    }
}

const ClinicRegisterSchema = z.object({
    clinicName: z.string().min(2, { message: "Clinic name must be at least 2 characters long." }),
    name: z.string().min(2, { message: "Manager name must be at least 2 characters long." }),
    username: z.string().min(4, { message: "Username must be at least 4 characters long." }),
    password: z.string().min(6, { message: "Password must be at least 6 characters long." }),
})

export async function registerClinic(prevState: string | undefined, formData: FormData) {
    const validatedFields = ClinicRegisterSchema.safeParse({
        clinicName: formData.get("clinicName"),
        name: formData.get("name"),
        username: formData.get("username"),
        password: formData.get("password"),
    })

    if (!validatedFields.success) {
        return "Missing Fields. Failed to Register Clinic."
    }

    const { clinicName, name, username, password } = validatedFields.data
    const hashedPassword = await bcrypt.hash(password, 10)

    try {
        const result = await prisma.$transaction(async (tx: any) => {
            const clinic = await tx.clinic.create({
                data: { name: clinicName }
            })

            await tx.user.create({
                data: {
                    name,
                    username,
                    password: hashedPassword,
                    role: "MANAGER",
                    clinicId: clinic.id
                }
            })
            return clinic
        })
    } catch (error) {
        console.error(error)
        return "Database Error: Failed to Create Clinic or Manager."
    }

    // Login as the new manager
    try {
        await signIn("credentials", formData)
    } catch (error) {
        if (error instanceof AuthError) {
            return "Clinic created, but auto-login failed."
        }
        throw error
    }
}
export async function handleSignOut() {
    const { signOut } = await import("@/auth")
    await signOut()
}
