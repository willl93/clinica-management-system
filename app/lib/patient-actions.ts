"use server"

import { prisma } from "@/lib/prisma"
import { auth } from "@/auth"
import { revalidatePath } from "next/cache"

export async function updateAnamnesis(patientId: string, content: string) {
    const session = await auth()
    if (!session?.user || (session.user as any).role !== "MANAGER") return { error: "Unauthorized" }

    try {
        await (prisma as any).anamnesis.upsert({
            where: { patientId },
            update: { content },
            create: { patientId, content }
        })
        revalidatePath(`/dashboard/patients/${patientId}`)
        return { success: true }
    } catch (e) {
        return { error: "Failed to update anamnesis" }
    }
}

export async function addEvolution(patientId: string, content: string) {
    const session = await auth()
    if (!session?.user || (session.user as any).role !== "MANAGER") return { error: "Unauthorized" }

    const userId = (session.user as any).id

    try {
        await (prisma as any).evolution.create({
            data: {
                patientId,
                content,
                userId
            }
        })
        revalidatePath(`/dashboard/patients/${patientId}`)
        return { success: true }
    } catch (e) {
        return { error: "Failed to add evolution" }
    }
}
