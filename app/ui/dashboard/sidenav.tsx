'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { handleSignOut } from '@/app/lib/actions'
import {
    CalendarIcon,
    HomeIcon,
    ClipboardDocumentListIcon,
    CurrencyDollarIcon,
    CircleStackIcon,
    PowerIcon,
    ChartBarIcon
} from '@heroicons/react/24/outline'

const links = [
    { name: 'Home', href: '/dashboard', icon: HomeIcon },
    { name: 'Agenda', href: '/dashboard/agenda', icon: CalendarIcon },
    { name: 'Inventory', href: '/dashboard/inventory', icon: CircleStackIcon },
    { name: 'Financial', href: '/dashboard/financial', icon: CurrencyDollarIcon },
    { name: 'Patients', href: '/dashboard/patients', icon: ClipboardDocumentListIcon },
    // Admin link will be added dynamically
]

export default function SideNav({ role }: { role?: string }) {
    const pathname = usePathname()

    const allLinks = role === 'SUPER_ADMIN'
        ? [...links, { name: 'Admin Dashboard', href: '/admin', icon: ChartBarIcon }]
        : links

    return (
        <div className="flex h-full flex-col px-3 py-4 md:px-2 bg-gray-900 text-white w-64">
            <Link className="mb-2 flex h-20 items-end justify-start rounded-md bg-blue-600 p-4 md:h-40" href="/">
                <div className="w-32 text-white md:w-40 font-bold text-2xl">
                    Clinica Estetica
                </div>
            </Link>
            <div className="flex grow flex-row justify-between space-x-2 md:flex-col md:space-x-0 md:space-y-2">
                {allLinks.map((link) => {
                    const LinkIcon = link.icon
                    const isActive = pathname === link.href
                    return (
                        <Link
                            key={link.name}
                            href={link.href}
                            className={`flex h-[48px] grow items-center justify-center gap-2 rounded-md p-3 text-sm font-medium hover:bg-blue-600 hover:text-white md:flex-none md:justify-start md:p-2 md:px-3
                                ${isActive ? 'bg-blue-600 text-white' : 'text-gray-400'}
                            `}
                        >
                            <LinkIcon className="w-6" />
                            <p className="hidden md:block">{link.name}</p>
                        </Link>
                    )
                })}
                <div className="hidden h-auto w-full grow rounded-md bg-gray-900 md:block"></div>
                <form action={handleSignOut}>
                    <button className="flex h-[48px] w-full grow items-center justify-center gap-2 rounded-md p-3 text-sm font-medium text-gray-400 hover:bg-red-600 hover:text-white md:flex-none md:justify-start md:p-2 md:px-3">
                        <PowerIcon className="w-6" />
                        <div className="hidden md:block">Sign Out</div>
                    </button>
                </form>
            </div>
        </div>
    )
}
