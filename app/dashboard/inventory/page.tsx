import InventoryList from '@/app/ui/inventory/product-list'
import { prisma } from '@/lib/prisma'
import { auth } from '@/auth'

export default async function InventoryPage() {
    const session = await auth()
    const userRole = (session?.user as any).role
    const userClinicId = (session?.user as any).clinicId

    // "Central can see all" logic
    // Assuming if no clinicId or specific role, show all. 
    // For now, let's say if clinicId is missing, it's central. 
    // Or we will implement a 'isCentral' check.

    // Logic: 
    // If user has clinicId -> show only that clinic's products.
    // If user has NO clinicId (and is MANAGER/ADMIN) -> show ALL products. (Central View)

    const isCentral = !userClinicId

    const where = isCentral ? {} : { clinicId: userClinicId }

    const products = await prisma.product.findMany({
        where,
        include: {
            clinic: {
                select: { name: true }
            }
        },
        orderBy: {
            name: 'asc'
        }
    })

    return (
        <div className="p-8">
            <InventoryList products={products} isCentral={isCentral} />
        </div>
    )
}
