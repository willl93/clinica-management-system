'use client'

import dynamic from 'next/dynamic'

const AdminChart = dynamic(() => import('@/app/ui/admin/admin-chart'), { ssr: false })

export default function ChartWrapper({ data }: { data: any[] }) {
    return <AdminChart data={data} />
}
