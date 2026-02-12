'use client'

import { useActionState } from 'react'
import { createService, deleteService } from '@/app/lib/financial-actions'

export default function ServicesList({ services }: { services: any[] }) {
    const [state, formAction] = useActionState(createService, null)

    return (
        <div className="p-8">
            <div className="flex justify-between items-center mb-6">
                <h1 className="text-2xl font-bold">Manage Services</h1>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                {/* Add Service Form */}
                <div className="bg-white p-6 rounded-lg shadow h-fit">
                    <h2 className="text-lg font-bold mb-4">Add New Service</h2>
                    <form action={formAction} className="space-y-4">
                        <div>
                            <label className="block text-sm font-medium">Service Name</label>
                            <input name="name" required className="w-full border rounded p-2" placeholder="e.g. Botox Facial" />
                        </div>
                        <div className="grid grid-cols-2 gap-4">
                            <div>
                                <label className="block text-sm font-medium">Price ($)</label>
                                <input name="price" type="number" step="0.01" required className="w-full border rounded p-2" placeholder="0.00" />
                            </div>
                            <div>
                                <label className="block text-sm font-medium">Unidade Métrica</label>
                                <select name="unit" required className="w-full border rounded p-2 text-sm">
                                    <option value="UI">UI (Botox)</option>
                                    <option value="1ml">1ml (Preenchimento)</option>
                                    <option value="Unidade">Unidade (Fios)</option>
                                    <option value="Sessão">Sessão (Bio-estimuladores)</option>
                                    <option value="Outro">Outro</option>
                                </select>
                            </div>
                        </div>
                        <div>
                            <label className="block text-sm font-medium">Tipo de Produto</label>
                            <input name="productType" className="w-full border rounded p-2" placeholder="e.g. Toxina Botulínica" />
                        </div>
                        <button type="submit" className="w-full bg-blue-600 text-white py-2 rounded hover:bg-blue-700">
                            Save Service
                        </button>
                        {(state as any)?.error && <p className="text-red-500 text-sm">{(state as any).error}</p>}
                    </form>
                </div>

                {/* Services List */}
                <div className="col-span-2 bg-white rounded-lg shadow overflow-hidden">
                    <table className="min-w-full divide-y divide-gray-200">
                        <thead className="bg-gray-50">
                            <tr>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Service</th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Unidade</th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Tipo</th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Price</th>
                                <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase">Actions</th>
                            </tr>
                        </thead>
                        <tbody className="bg-white divide-y divide-gray-200">
                            {services.length === 0 ? (
                                <tr><td colSpan={5} className="p-6 text-center text-gray-500">No services found.</td></tr>
                            ) : services.map(service => (
                                <tr key={service.id}>
                                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">{service.name}</td>
                                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{service.unit || '-'}</td>
                                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{service.productType || '-'}</td>
                                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">${service.price.toFixed(2)}</td>
                                    <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                                        <button
                                            onClick={async () => {
                                                if (confirm('Delete?')) {
                                                    const res = await deleteService(service.id)
                                                    if (res?.error) alert(res.error)
                                                }
                                            }}
                                            className="text-red-600 hover:text-red-900"
                                        >
                                            Delete
                                        </button>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    )
}
