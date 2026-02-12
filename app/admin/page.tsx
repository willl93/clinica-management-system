import { auth } from "@/auth"
import { getSaaSMetrics } from '@/app/lib/admin-actions'
import AdminChart from '@/app/ui/admin/admin-chart'
import Link from 'next/link'

export default async function AdminDashboard() {
    const session = await auth()
    const metrics = await getSaaSMetrics()

    if (metrics?.error) {
        return <div className="p-8 text-red-500">Error: {metrics.error}. Access Denied.</div>
    }

    return (
        <div className="p-8 bg-gray-50 min-h-screen">
            <h1 className="text-3xl font-bold mb-8 text-gray-800">SaaS Admin Dashboard</h1>

            {/* Greeting */}
            <div className="mb-8">
                <h2 className="text-xl text-gray-600">Bem-vindo, {session?.user?.name || 'Administrador'}</h2>
                <p className="text-sm text-gray-400">Visão geral do sistema SaaS</p>
            </div>

            {/* Top Cards */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
                <div className="bg-white p-6 rounded-xl shadow-sm border-l-4 border-blue-500">
                    <h3 className="text-gray-500 text-sm font-medium uppercase">Total de Clínicas</h3>
                    <p className="text-4xl font-bold text-gray-900 mt-2">{metrics.totalClinics}</p>
                </div>
                <div className="bg-white p-6 rounded-xl shadow-sm border-l-4 border-green-500">
                    <h3 className="text-gray-500 text-sm font-medium uppercase">Total de Pacientes (Global)</h3>
                    <p className="text-4xl font-bold text-gray-900 mt-2">{metrics.totalPatients}</p>
                </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                {/* Evolution Chart */}
                <div className="lg:col-span-2 bg-white p-6 rounded-xl shadow-sm">
                    <h2 className="text-xl font-bold mb-6 text-gray-800">Evolução de Pacientes (6 Meses)</h2>
                    <AdminChart data={metrics.chartData || []} />
                </div>

                {/* Clinics List */}
                <div className="col-span-1 bg-white p-6 rounded-xl shadow-sm">
                    <h2 className="text-xl font-bold mb-6 text-gray-800">Clínicas Ativas</h2>
                    <div className="overflow-y-auto max-h-[400px]">
                        <table className="w-full text-left">
                            <thead className="text-gray-500 text-sm border-b">
                                <tr>
                                    <th className="pb-3 font-medium">Nome</th>
                                    <th className="pb-3 font-medium text-right">Pacientes</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y">
                                {(metrics.clinics || []).map((clinic: any) => (
                                    <tr key={clinic.id} className="group hover:bg-gray-50">
                                        <td className="py-3">
                                            <div className="font-medium text-gray-900">{clinic.name}</div>
                                            <div className="text-xs text-gray-400">
                                                Desde {new Date(clinic.createdAt).toLocaleDateString()}
                                            </div>
                                        </td>
                                        <td className="py-3 text-right font-medium text-gray-700">
                                            {clinic.patientCount}
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                </div>
            </div>
        </div>
    )
}
