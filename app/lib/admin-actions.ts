'use server'

import { prisma } from "@/lib/prisma"
import { auth } from "@/auth"
import { startOfMonth, subMonths, format } from "date-fns"

export async function getSaaSMetrics() {
    const session = await auth()

    // Authorization check
    if ((session?.user as any).role !== 'SUPER_ADMIN') {
        return { error: "Unauthorized" }
    }

    try {
        // 1. Total Clinics
        const totalClinics = await prisma.clinic.count()

        // 2. Total Patients (Global)
        const totalPatients = await prisma.user.count({
            where: { role: 'PATIENT' }
        })

        // 3. Growth Chart Data (Last 6 months)
        const chartData = []
        for (let i = 5; i >= 0; i--) {
            const date = subMonths(new Date(), i)
            const startDate = startOfMonth(date)
            // This is a cumulative count up to end of that month, or new users in that month?
            // "grafico de pacientes cadastrados nas clinicas" -> Usually implies total growth or monthly acquisition.
            // Let's do "New Patients" per month for now as it's a common metric.
            // Actually, "Total Patients" over time is often requested for SaaS.
            // Let's do Monthly Active (New) Patients for the chart bars.

            const nextMonth = subMonths(new Date(), i - 1)
            const startNext = startOfMonth(nextMonth)

            const count = await prisma.user.count({
                where: {
                    role: 'PATIENT',
                    createdAt: {
                        gte: startDate,
                        lt: startNext
                    }
                }
            })

            chartData.push({
                name: format(date, 'MMM/yy'),
                patients: count
            })
        }

        // 4. Clinics List with Patient Counts
        const clinics = await prisma.clinic.findMany({
            include: {
                _count: {
                    select: { users: { where: { role: 'PATIENT' } } }
                }
            },
            orderBy: { createdAt: 'desc' }
        })

        const formattedClinics = clinics.map(c => ({
            id: c.id,
            name: c.name,
            createdAt: c.createdAt,
            patientCount: c._count.users
        }))

        return {
            totalClinics,
            totalPatients,
            chartData,
            clinics: formattedClinics
        }

    } catch (error) {
        console.error("Error fetching SaaS metrics:", error)
        return { error: "Failed to fetch metrics" }
    }
}
