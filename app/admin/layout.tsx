import Link from 'next/link'
import { PowerIcon, ChartBarIcon, BuildingOfficeIcon } from '@heroicons/react/24/outline'
import { handleSignOut } from '@/app/lib/actions'
import { auth } from '@/auth'

export default async function AdminLayout({ children }: { children: React.ReactNode }) {
    const session = await auth()

    return (
        <div className="flex h-screen flex-col md:flex-row md:overflow-hidden bg-slate-50">
            <div className="w-full flex-none md:w-64 bg-slate-900 text-white">
                <div className="flex h-full flex-col px-3 py-4 md:px-2">
                    <div className="mb-2 flex h-20 items-end justify-start rounded-md bg-blue-700 p-4 md:h-40">
                        <div className="w-32 text-white md:w-40 font-bold text-xl">
                            SaaS Manager
                        </div>
                    </div>

                    <div className="flex grow flex-row justify-between space-x-2 md:flex-col md:space-x-0 md:space-y-2">
                        <Link
                            href="/admin"
                            className="flex h-[48px] grow items-center justify-center gap-2 rounded-md bg-blue-600/20 p-3 text-sm font-medium text-blue-100 hover:bg-blue-600 hover:text-white md:flex-none md:justify-start md:p-2 md:px-3"
                        >
                            <ChartBarIcon className="w-6" />
                            <p className="hidden md:block">Visão Geral</p>
                        </Link>

                        {/* Placeholder for future detailed clinic list page if needed */}
                        {/* <Link
                            href="/admin/clinics"
                            className="flex h-[48px] grow items-center justify-center gap-2 rounded-md p-3 text-sm font-medium text-gray-400 hover:bg-blue-600 hover:text-white md:flex-none md:justify-start md:p-2 md:px-3"
                        >
                            <BuildingOfficeIcon className="w-6" />
                            <p className="hidden md:block">Clínicas</p>
                        </Link> */}

                        <div className="hidden h-auto w-full grow rounded-md md:block"></div>

                        <div className="px-3 py-2 text-xs text-gray-500 text-center md:text-left">
                            {session?.user?.name || 'Administrador'}
                        </div>

                        <form action={handleSignOut}>
                            <button className="flex h-[48px] w-full grow items-center justify-center gap-2 rounded-md p-3 text-sm font-medium text-gray-400 hover:bg-red-600 hover:text-white md:flex-none md:justify-start md:p-2 md:px-3">
                                <PowerIcon className="w-6" />
                                <div className="hidden md:block">Sair</div>
                            </button>
                        </form>
                    </div>
                </div>
            </div>
            <div className="flex-grow p-6 md:overflow-y-auto md:p-12">{children}</div>
        </div>
    )
}
