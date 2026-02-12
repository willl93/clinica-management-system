import Calendar from '@/app/ui/agenda/calendar'
import BookingWrapper from '@/app/ui/agenda/booking-wrapper'
import { getAppointments } from '@/app/lib/agenda-actions'
import { auth } from '@/auth'
import { prisma } from '@/lib/prisma'

export default async function AgendaPage() {
    const session = await auth()
    const rawAppointments = await getAppointments(new Date())
    const currentClinicId = (session?.user as any).clinicId || ""

    const appointments = rawAppointments.map((apt: any) => ({
        ...apt,
        date: apt.date.toISOString(),
        createdAt: apt.createdAt.toISOString(),
        updatedAt: apt.updatedAt.toISOString(),
    }))

    // Fetch patients for the booking form
    const patients = await prisma.user.findMany({
        where: { role: 'PATIENT' },
        select: { id: true, name: true }
    })

    // Fetch services
    const services = await (prisma as any).service.findMany({
        select: { id: true, name: true, price: true }
    })

    // Fetch clinics
    const clinics = await prisma.clinic.findMany({
        select: { id: true, name: true }
    })

    return (
        <div className="p-8">
            <BookingWrapper patients={patients} services={services} clinics={clinics}>
                <Calendar appointments={appointments} currentClinicId={currentClinicId} />
            </BookingWrapper>
        </div>
    )
}
