import SideNav from '@/app/ui/dashboard/sidenav'
import { auth } from '@/auth'

export default async function Layout({ children }: { children: React.ReactNode }) {
    const session = await auth()
    const role = (session?.user as any)?.role

    return (
        <div className="flex h-screen flex-col md:flex-row md:overflow-hidden bg-gray-50">
            <div className="w-full flex-none md:w-64">
                <SideNav role={role} />
            </div>
            <div className="flex-grow p-4 md:overflow-y-auto">{children}</div>
        </div>
    )
}
