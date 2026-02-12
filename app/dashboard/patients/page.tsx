import { prisma } from "@/lib/prisma"
import { auth } from "@/auth"
import Link from "next/link"

export default async function PatientsPage(props: { searchParams: Promise<{ query?: string }> }) {
    const searchParams = await props.searchParams
    const query = searchParams.query || ""
    const session = await auth()
    const clinicId = (session?.user as any).clinicId

    if (!clinicId) return <div>Access Denied</div>

    const patients = await prisma.user.findMany({
        where: {
            role: 'PATIENT',
            name: { contains: query }
        },
        select: {
            id: true,
            name: true,
            username: true,
            phone: true, // Add phone to selection
            createdAt: true,
            _count: {
                select: { appointments: true }
            }
        },
        orderBy: { name: 'asc' }
    })

    return (
        <div className="p-8">
            <div className="flex justify-between items-center mb-6">
                <h1 className="text-2xl font-bold">Patient Records</h1>

                <form className="relative w-64">
                    <input
                        name="query"
                        defaultValue={query}
                        placeholder="Search patients..."
                        className="w-full pl-10 pr-4 py-2 border rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                    <div className="absolute left-3 top-2.5">
                        <svg className="h-4 w-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                        </svg>
                    </div>
                </form>
            </div>

            <div className="bg-white shadow rounded-lg overflow-hidden">
                <table className="min-w-full divide-y divide-gray-200">
                    <thead className="bg-gray-50">
                        <tr>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Name</th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Email</th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Phone</th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Appointments</th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Joined</th>
                            <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase">Actions</th>
                        </tr>
                    </thead>
                    <tbody className="bg-white divide-y divide-gray-200">
                        {patients.map((patient: any) => (
                            <tr key={patient.id}>
                                <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">{patient.name}</td>
                                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{patient.username}</td>
                                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{patient.phone || '-'}</td>
                                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{patient._count.appointments}</td>
                                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{new Date(patient.createdAt).toLocaleDateString()}</td>
                                <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                                    <Link href={`/dashboard/patients/${patient.id}`} className="text-blue-600 hover:text-blue-900">
                                        View Records
                                    </Link>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </div>
    )
}
