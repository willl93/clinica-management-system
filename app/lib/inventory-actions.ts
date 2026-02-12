"use server"

import { prisma } from "@/lib/prisma"
import { auth } from "@/auth"
import { revalidatePath } from "next/cache"
import { z } from "zod"

const ProductSchema = z.object({
    name: z.string().min(2),
    quantity: z.coerce.number().min(0),
    minStock: z.coerce.number().min(0),
    price: z.coerce.number().min(0).optional(),
})

export async function createProduct(prevState: any, formData: FormData) {
    const session = await auth()
    if (!session?.user || !(session.user as any).clinicId) return { error: "Unauthorized" }

    const clinicId = (session.user as any).clinicId

    const validated = ProductSchema.safeParse({
        name: formData.get("name"),
        quantity: formData.get("quantity"),
        minStock: formData.get("minStock"),
        price: formData.get("price"),
    })

    if (!validated.success) {
        return { error: "Invalid fields" }
    }

    try {
        await prisma.product.create({
            data: {
                ...validated.data,
                price: validated.data.price || 0,
                clinicId,
            }
        })
        revalidatePath("/dashboard/inventory")
        return { success: true }
    } catch (e) {
        console.error(e)
        return { error: "Failed to create product" }
    }
}

export async function updateStock(prevState: any, formData: FormData) {
    // Increment or decrement stock
    const productId = formData.get("productId") as string
    const adjustment = parseInt(formData.get("adjustment") as string)

    try {
        await prisma.product.update({
            where: { id: productId },
            data: {
                quantity: { increment: adjustment }
            }
        })
        revalidatePath("/dashboard/inventory")
        return { success: true }
    } catch (e) {
        return { error: "Failed to update stock" }
    }
}

export async function deleteProduct(productId: string) {
    try {
        await prisma.product.delete({ where: { id: productId } })
        revalidatePath("/dashboard/inventory")
        return { success: true }
    } catch (e) {
        return { error: "Failed" }
    }
}
