import ServicesList from '@/app/ui/financial/services-list'
import { prisma } from '@/lib/prisma'

export default async function ServicesPage() {
    const services = await prisma.service.findMany({
        orderBy: { name: 'asc' }
    })

    return <ServicesList services={services} />
}
