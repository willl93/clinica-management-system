'use server'

import { prisma } from "@/lib/prisma"
import { auth } from "@/auth"
import { revalidatePath } from "next/cache"
import { createTransaction } from "./financial-actions"

export async function completeAppointment(appointmentId: string, signature?: string) {
    const session = await auth()
    if (!session?.user) return { error: "Unauthorized" }

    // 1. Get Appointment details (service, price, commision)
    const appointment = await (prisma as any).appointment.findUnique({
        where: { id: appointmentId },
        include: { service: true }
    })

    if (!appointment) return { error: "Appointment not found" }
    if (appointment.status === "COMPLETED") return { error: "Already completed" }

    try {
        console.log(`Completing appointment ${appointmentId}...`)
        // 2. Update status
        await (prisma.appointment as any).update({
            where: { id: appointmentId },
            data: {
                status: "COMPLETED",
                signature
            }
        })
        console.log(`Appointment ${appointmentId} updated to COMPLETED.`)

        // 3. Create Transaction (Income)
        if (appointment.totalAmount > 0) {
            console.log(`Creating transaction for amount ${appointment.totalAmount}...`)
            await createTransaction({
                type: "INCOME",
                amount: appointment.totalAmount,
                description: `Appointment - ${appointment.service?.name || 'Service'}`,
                clinicId: appointment.clinicId,
                paymentMethod: "CASH",
                status: "PAID",
                appointmentId: appointment.id
            })
            console.log("Transaction created.")
        } else {
            console.log("No totalAmount set, skipping transaction.")
        }

        revalidatePath("/dashboard/agenda")
        revalidatePath("/dashboard/financial")
        return { success: true }
    } catch (e) {
        console.error("Error in completeAppointment:", e)
        return { error: "Failed to complete appointment" }
    }
}
