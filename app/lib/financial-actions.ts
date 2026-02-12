"use server"

import { prisma } from "@/lib/prisma"
import { auth } from "@/auth"
import { revalidatePath } from "next/cache"
import { z } from "zod"

const ServiceSchema = z.object({
    name: z.string().min(2),
    price: z.coerce.number().min(0),
    unit: z.string().min(1),
    productType: z.string().optional(),
})

export async function createService(prevState: any, formData: FormData) {
    const session = await auth()
    // @ts-ignore
    if (!session?.user || (session.user as any).role !== "MANAGER") return { error: "Unauthorized" }

    const validated = ServiceSchema.safeParse({
        name: formData.get("name"),
        price: formData.get("price"),
        unit: formData.get("unit"),
        productType: formData.get("productType"),
    })

    if (!validated.success) {
        return { error: "Invalid fields" }
    }

    try {
        await (prisma.service as any).create({
            data: validated.data
        })
        revalidatePath("/dashboard/financial/services")
        return { success: true }
    } catch (e) {
        return { error: "Failed to create service" }
    }
}

export async function deleteService(serviceId: string) {
    try {
        await (prisma.service as any).delete({ where: { id: serviceId } })
        revalidatePath("/dashboard/financial/services")
        return { success: true }
    } catch (e) {
        return { error: "Failed to delete" }
    }
}

// Transaction Helpers

export async function createTransaction(data: {
    type: "INCOME" | "EXPENSE",
    amount: number,
    description: string,
    clinicId: string,
    paymentMethod: string,
    installments?: number,
    status?: "PAID" | "PENDING" | "OVERDUE",
    dueDate?: Date
    appointmentId?: string
}) {
    await (prisma.transaction as any).create({
        data: {
            ...data,
            date: new Date(),
            dueDate: data.dueDate || new Date(),
        }
    })
}

export async function getFinancialSummary(clinicId: string) {
    // Current Month
    const start = new Date(); start.setDate(1); start.setHours(0, 0, 0, 0);
    const end = new Date(start); end.setMonth(end.getMonth() + 1);

    const transactions = await (prisma.transaction as any).findMany({
        where: {
            clinicId,
            date: { gte: start, lt: end },
            status: 'PAID'
        }
    })

    const income = transactions.filter((t: any) => t.type === 'INCOME').reduce((acc: number, t: any) => acc + t.amount, 0)
    const expense = transactions.filter((t: any) => t.type === 'EXPENSE').reduce((acc: number, t: any) => acc + t.amount, 0)

    const pending = await (prisma.transaction as any).aggregate({
        where: { clinicId, status: 'PENDING', type: 'INCOME' },
        _sum: { amount: true }
    })

    return {
        income,
        expense,
        balance: income - expense,
        pendingReceivable: pending._sum.amount || 0
    }
}
