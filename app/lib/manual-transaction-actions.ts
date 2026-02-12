"use server"

import { prisma } from "@/lib/prisma"
import { auth } from "@/auth"
import { revalidatePath } from "next/cache"
import { z } from "zod"

const TransactionSchema = z.object({
    description: z.string().min(2),
    amount: z.coerce.number().min(0.01),
    type: z.enum(["INCOME", "EXPENSE"]),
    paymentMethod: z.string(),
    date: z.coerce.date(),
    status: z.enum(["PAID", "PENDING", "OVERDUE"]),
})

export async function createManualTransaction(prevState: any, formData: FormData) {
    const session = await auth()
    const clinicId = (session?.user as any).clinicId
    if (!session?.user || !clinicId) return { error: "Unauthorized" }

    const validated = TransactionSchema.safeParse({
        description: formData.get("description"),
        amount: formData.get("amount"),
        type: formData.get("type"),
        paymentMethod: formData.get("paymentMethod"),
        date: formData.get("date"),
        status: formData.get("status"),
    })

    if (!validated.success) {
        return { error: "Invalid fields" }
    }

    try {
        await prisma.transaction.create({
            data: {
                ...validated.data,
                clinicId,
            }
        })
        revalidatePath("/dashboard/financial")
        return { success: true }
    } catch (e) {
        console.error(e)
        return { error: "Failed to create transaction" }
    }
}
