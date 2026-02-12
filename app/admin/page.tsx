'use client'

import { useEffect, useState } from 'react'
import { getSaaSMetrics } from '@/app/lib/admin-actions'
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts'
import Link from 'next/link'

export default function AdminDashboard() {
    const [metrics, setMetrics] = useState<any>(null)
    const [loading, setLoading] = useState(true)

    useEffect(() => {
        getSaaSMetrics().then(data => {
            setMetrics(data)
            setLoading(false)
        })
    }, [])

    if (loading) return <div className="p-8">Loading SaaS Metrics...</div>
    if (metrics?.error) return <div className="p-8 text-red-500">Error: {metrics.error}. Access Denied.</div>

    return (
        <div className="p-8 bg-gray-50 min-h-screen">
            <h1 className="text-3xl font-bold mb-8 text-gray-800">SaaS Admin Dashboard</h1>

            {/* Top Cards */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
                <div className="bg-white p-6 rounded-xl shadow-sm border-l-4 border-blue-500">
                    <h3 className="text-gray-500 text-sm font-medium uppercase">Total Clinics</h3>
                    <p className="text-4xl font-bold text-gray-900 mt-2">{metrics.totalClinics}</p>
                </div>
                <div className="bg-white p-6 rounded-xl shadow-sm border-l-4 border-green-500">
                    <h3 className="text-gray-500 text-sm font-medium uppercase">Total Patients (Global)</h3>
                    <p className="text-4xl font-bold text-gray-900 mt-2">{metrics.totalPatients}</p>
                </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                {/* Growth Chart */}
                <div className="lg:col-span-2 bg-white p-6 rounded-xl shadow-sm">
                    <h2 className="text-xl font-bold mb-6 text-gray-800">Growth (Last 6 Months)</h2>
                    <div className="h-80 w-full">
                        <ResponsiveContainer width="100%" height="100%">
                            <BarChart data={metrics.chartData}>
                                <CartesianGrid strokeDasharray="3 3" vertical={false} />
                                <XAxis dataKey="name" />
                                <YAxis />
                                <Tooltip
                                    contentStyle={{ borderRadius: '8px', border: 'none', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)' }}
                                />
                                <Bar dataKey="patients" fill="#3B82F6" radius={[4, 4, 0, 0]} />
                            </BarChart>
                        </ResponsiveContainer>
                    </div>
                </div>

                {/* Clinics List */}
                <div className="bg-white p-6 rounded-xl shadow-sm">
                    <h2 className="text-xl font-bold mb-6 text-gray-800">Active Clinics</h2>
                    <div className="overflow-y-auto max-h-[400px]">
                        <table className="w-full text-left">
                            <thead className="text-gray-500 text-sm border-b">
                                <tr>
                                    <th className="pb-3 font-medium">Name</th>
                                    <th className="pb-3 font-medium text-right">Patients</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y">
                                {metrics.clinics.map((clinic: any) => (
                                    <tr key={clinic.id} className="group hover:bg-gray-50">
                                        <td className="py-3">
                                            <div className="font-medium text-gray-900">{clinic.name}</div>
                                            <div className="text-xs text-gray-400">
                                                Since {new Date(clinic.createdAt).toLocaleDateString()}
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
                    <div className="mt-4 pt-4 border-t text-center">
                        <button className="text-sm text-blue-600 hover:underline">View All Clinics</button>
                    </div>
                </div>
            </div>
        </div>
    )
}
