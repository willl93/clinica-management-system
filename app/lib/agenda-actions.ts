"use server"

import { prisma } from "@/lib/prisma"
import { auth } from "@/auth"
import { revalidatePath } from "next/cache"
import { startOfMonth, endOfMonth, startOfDay, endOfDay } from "date-fns"

export async function getAppointments(date: Date) {
    const session = await auth()
    if (!session?.user) return []

    // Fetch appointments for the whole month of the given date
    // For now, let's just fetch everything around that date to be safe, or filter strictly.
    // "Shared agenda" - fetch ALL appointments?
    // "uma clinica nao podera cancela p horario da outra" implies read access might be global.

    // Let's fetch all appointments for the current month.
    const start = startOfMonth(date)
    const end = endOfMonth(date)

    const appointments = await prisma.appointment.findMany({
        where: {
            date: {
                gte: start,
                lte: end,
            },
        },
        include: {
            patient: {
                select: { name: true }
            },
            clinic: {
                select: { name: true, id: true }
            }
        },
        orderBy: {
            date: 'asc'
        }
    })

    return appointments
}

export async function createAppointment(prevState: any, formData: FormData) {
    const session = await auth()
    if (!session?.user) return { error: "Unauthorized" }

    const isNewPatient = formData.get("isNewPatient") === "true"
    const clinicId = formData.get("clinicId") as string
    const serviceId = formData.get("serviceId") as string
    const datePart = formData.get("date") as string // YYYY-MM-DD
    const timePart = formData.get("time") as string // HH:mm
    const notes = formData.get("notes") as string

    if (!clinicId || !serviceId || !datePart || !timePart) {
        return { error: "Required fields are missing." }
    }

    const date = new Date(`${datePart}T${timePart}`)

    try {
        console.log(`Creating appointment for clinic ${clinicId}, service ${serviceId} on ${date}...`)
        let patientId = formData.get("patientId") as string

        // Handle on-the-fly patient creation
        if (isNewPatient) {
            console.log("Creating new patient...")
            const name = formData.get("newPatientName") as string
            const username = formData.get("newPatientUsername") as string
            const cpf = formData.get("newPatientCpf") as string
            const birthDate = formData.get("newPatientBirthDate") as string
            const phone = formData.get("newPatientPhone") as string

            if (!name || !username) {
                console.warn("New patient details missing.")
                return { error: "Nome e Email são obrigatórios para novo paciente." }
            }

            // Check if user exists
            let user = await prisma.user.findUnique({ where: { username } })
            if (!user) {
                console.log(`User ${username} not found, creating...`)
                user = await (prisma.user as any).create({
                    data: {
                        name,
                        username,
                        password: "changeme", // Default password
                        role: "PATIENT",
                        clinicId: clinicId,
                        cpf,
                        birthDate: birthDate ? new Date(birthDate) : null,
                        phone,
                    }
                })
                console.log(`New patient created with ID ${user?.id}`)
            } else {
                console.log(`Existing user found with ID ${user.id}`)
            }
            if (!user) return { error: "Falha ao criar ou encontrar paciente." }
            patientId = user.id
        }

        if (!patientId) {
            console.warn("No patientId provided.")
            return { error: "Selecione um paciente ou preencha os dados do novo paciente." }
        }

        // Fetch service price for totalAmount
        const service = await (prisma.service as any).findUnique({
            where: { id: serviceId }
        })

        const totalAmount = service ? service.price : 0

        console.log(`Inserting appointment record for patient ${patientId} with amount ${totalAmount}...`)
        await (prisma.appointment as any).create({
            data: {
                date,
                patientId,
                clinicId,
                serviceId,
                status: "SCHEDULED",
                notes,
                totalAmount, // Critical for financial transaction generation
            }
        })
        console.log("Appointment created successfully.")

        revalidatePath("/dashboard/agenda")
        return { success: true }
    } catch (error: any) {
        console.error("Error in createAppointment:", error)
        if (error.code === 'P2002') {
            return { error: `Já existe um usuário com este ${error.meta?.target || 'dado'} (Email ou CPF já cadastrados).` }
        }
        return { error: "Erro ao criar agendamento. Verifique se o email ou CPF já estão em uso." }
    }
}

export async function cancelAppointment(appointmentId: string) {
    const session = await auth()
    if (!session?.user) return { error: "Unauthorized" }

    const userClinicId = (session.user as any).clinicId

    const appointment = await prisma.appointment.findUnique({
        where: { id: appointmentId }
    })

    if (!appointment) return { error: "Appointment not found" }

    // "uma clinica nao podera cancela p horario da outra"
    if (appointment.clinicId !== userClinicId) {
        return { error: "You can only cancel appointments for your own clinic." }
    }

    await prisma.appointment.update({
        where: { id: appointmentId },
        data: { status: "CANCELLED" }
    })

    revalidatePath("/dashboard/agenda")
    return { success: true }
}
