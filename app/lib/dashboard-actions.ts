"use server"

import { prisma } from "@/lib/prisma"
import { auth } from "@/auth"
import { startOfMonth, endOfMonth } from "date-fns"

export async function getDashboardStats() {
    const session = await auth()
    const clinicId = (session?.user as any).clinicId

    if (!clinicId) return null

    const now = new Date()
    const monthStart = startOfMonth(now)
    const monthEnd = endOfMonth(now)

    try {
        // 1. Total Sales (Monthly)
        const salesData = await (prisma.transaction as any).aggregate({
            where: {
                clinicId,
                type: 'INCOME',
                status: 'PAID',
                date: {
                    gte: monthStart,
                    lte: monthEnd
                }
            },
            _sum: {
                amount: true
            }
        })

        // 2. Total Patients
        const patientCount = await prisma.user.count({
            where: {
                clinicId,
                role: 'PATIENT'
            }
        })

        // 3. Upcoming Appointments
        const appointments = await (prisma.appointment as any).findMany({
            where: {
                clinicId,
                status: 'SCHEDULED',
                date: {
                    gte: now
                }
            },
            include: {
                patient: {
                    select: { name: true }
                },
                service: {
                    select: { name: true }
                }
            },
            orderBy: {
                date: 'asc'
            },
            take: 5
        })

        return {
            totalSales: salesData._sum.amount || 0,
            totalPatients: patientCount,
            upcomingAppointments: appointments
        }
    } catch (e) {
        console.error(e)
        return null
    }
}
