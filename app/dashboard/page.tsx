import { auth } from "@/auth"
import { redirect } from "next/navigation"
import { getDashboardStats } from "@/app/lib/dashboard-actions"
import { format } from "date-fns"
import { handleSignOut } from "@/app/lib/actions"

export default async function Page() {
    const session = await auth()

    if (!session) {
        redirect("/login")
    }

    const stats = await getDashboardStats()

    return (
        <div className="p-8">
            <h1 className="text-2xl font-bold mb-6">Dashboard Summary</h1>

            {/* Metric Cards */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
                <div className="bg-white p-6 rounded-lg shadow border-l-4 border-green-500">
                    <h3 className="text-gray-500 text-sm font-medium">Vendas do Mês</h3>
                    <p className="text-3xl font-bold text-gray-900">
                        ${stats?.totalSales.toFixed(2) || '0.00'}
                    </p>
                </div>
                <div className="bg-white p-6 rounded-lg shadow border-l-4 border-blue-500">
                    <h3 className="text-gray-500 text-sm font-medium">Pacientes Cadastrados</h3>
                    <p className="text-3xl font-bold text-gray-900">
                        {stats?.totalPatients || 0}
                    </p>
                </div>
                <div className="bg-white p-6 rounded-lg shadow border-l-4 border-yellow-500">
                    <h3 className="text-gray-500 text-sm font-medium">Agendamentos Futuros</h3>
                    <p className="text-3xl font-bold text-gray-900">
                        {stats?.upcomingAppointments.length || 0}
                    </p>
                </div>
            </div>

            <div className="grid grid-cols-1 xl:grid-cols-2 gap-8">
                {/* Upcoming Appointments */}
                <div className="bg-white shadow rounded-lg overflow-hidden">
                    <div className="px-6 py-4 border-b bg-gray-50">
                        <h3 className="font-bold text-gray-900">Próximos Pacientes</h3>
                    </div>
                    <div className="divide-y divide-gray-100">
                        {!stats?.upcomingAppointments?.length && (
                            <p className="p-6 text-gray-500 text-center">Nenhum agendamento futuro.</p>
                        )}
                        {stats?.upcomingAppointments?.map((apt: any) => (
                            <div key={apt.id} className="p-4 flex justify-between items-center hover:bg-gray-50 transition-colors">
                                <div>
                                    <p className="font-bold text-gray-900">{apt.patient.name}</p>
                                    <p className="text-sm text-gray-500">{apt.service?.name || 'Consulta Geral'}</p>
                                </div>
                                <div className="text-right text-sm">
                                    <p className="font-medium text-blue-600">{format(new Date(apt.date), 'dd/MM HH:mm')}</p>
                                    <p className="text-xs text-gray-400">Scheduled</p>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>

                {/* Account Summary */}
                <div className="bg-white shadow rounded-lg p-6">
                    <h3 className="font-bold text-gray-900 mb-4">Bem-vindo(a), {session.user?.name}</h3>
                    <div className="space-y-4 text-sm">
                        <div className="flex justify-between border-b pb-2">
                            <span className="text-gray-500">Perfil:</span>
                            <span className="font-mono bg-blue-50 px-2 py-0.5 rounded text-blue-700">{(session.user as any).role}</span>
                        </div>
                        <div className="flex justify-between border-b pb-2">
                            <span className="text-gray-500">Email:</span>
                            <span>{session.user?.email || (session.user as any).username}</span>
                        </div>
                        <div className="flex justify-between border-b pb-2">
                            <span className="text-gray-500">ID Clínica:</span>
                            <span className="font-mono text-gray-400">{(session.user as any).clinicId}</span>
                        </div>
                    </div>

                    <form
                        action={handleSignOut}
                        className="mt-8"
                    >
                        <button
                            className="w-full bg-red-50 text-red-600 border border-red-200 px-4 py-2 rounded hover:bg-red-600 hover:text-white transition-colors text-sm font-medium"
                            type="submit"
                        >
                            Sign Out
                        </button>
                    </form>
                </div>
            </div>
        </div>
    )
}
