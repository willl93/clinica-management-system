'use client'

import { useActionState } from 'react'
import { createProduct, updateStock, deleteProduct } from '@/app/lib/inventory-actions'
import { useState } from 'react'

type Product = {
    id: string
    name: string
    quantity: number
    minStock: number
    price: number | null
    clinic?: { name: string }
}

export default function InventoryList({ products, isCentral }: { products: Product[], isCentral: boolean }) {
    const [isAdding, setIsAdding] = useState(false)
    const [state, formAction] = useActionState(createProduct, null)

    return (
        <div>
            <div className="flex justify-between items-center mb-6">
                <h1 className="text-2xl font-bold">Inventory Management</h1>
                {!isCentral && (
                    <button
                        onClick={() => setIsAdding(!isAdding)}
                        className="bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700"
                    >
                        {isAdding ? 'Cancel' : '+ Add Product'}
                    </button>
                )}
            </div>

            {isAdding && !isCentral && (
                <div className="bg-gray-50 p-4 rounded mb-6 border">
                    <form action={formAction} className="flex gap-4 items-end flex-wrap">
                        <div>
                            <label className="block text-sm">Product Name</label>
                            <input name="name" required className="border p-2 rounded" />
                        </div>
                        <div>
                            <label className="block text-sm">Quantity</label>
                            <input name="quantity" type="number" required className="border p-2 rounded w-24" />
                        </div>
                        <div>
                            <label className="block text-sm">Min Stock</label>
                            <input name="minStock" type="number" required defaultValue={5} className="border p-2 rounded w-24" />
                        </div>
                        <div>
                            <label className="block text-sm">Price</label>
                            <input name="price" type="number" step="0.01" className="border p-2 rounded w-24" />
                        </div>
                        <button type="submit" className="bg-blue-600 text-white px-4 py-2 rounded mb-0.5">Save</button>
                    </form>
                    {(state as any)?.error && <p className="text-red-500 mt-2">{(state as any).error}</p>}
                </div>
            )}

            <div className="bg-white shadow rounded-lg overflow-hidden">
                <table className="min-w-full divide-y divide-gray-200">
                    <thead className="bg-gray-50">
                        <tr>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Product</th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Stock</th>
                            {isCentral && <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Clinic</th>}
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
                        </tr>
                    </thead>
                    <tbody className="bg-white divide-y divide-gray-200">
                        {products.map(product => {
                            const isLowStock = product.quantity <= product.minStock
                            return (
                                <tr key={product.id}>
                                    <td className="px-6 py-4 whitespace-nowrap">{product.name}</td>
                                    <td className="px-6 py-4 whitespace-nowrap font-bold">{product.quantity}</td>
                                    {isCentral && <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{product.clinic?.name}</td>}
                                    <td className="px-6 py-4 whitespace-nowrap">
                                        {isLowStock ? (
                                            <span className="px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-red-100 text-red-800">
                                                Low Stock
                                            </span>
                                        ) : (
                                            <span className="px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-green-100 text-green-800">
                                                OK
                                            </span>
                                        )}
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                                        {!isCentral && (
                                            <div className="flex gap-2">
                                                <form action={async (formData) => { await updateStock(null, formData) }}>
                                                    <input type="hidden" name="productId" value={product.id} />
                                                    <input type="hidden" name="adjustment" value="1" />
                                                    <button className="text-green-600 hover:text-green-900 font-bold">+</button>
                                                </form>
                                                <form action={async (formData) => { await updateStock(null, formData) }}>
                                                    <input type="hidden" name="productId" value={product.id} />
                                                    <input type="hidden" name="adjustment" value="-1" />
                                                    <button className="text-red-600 hover:text-red-900 font-bold">-</button>
                                                </form>
                                                <button
                                                    onClick={() => { if (confirm('Delete?')) deleteProduct(product.id) }}
                                                    className="text-gray-400 hover:text-red-600 ml-4"
                                                >
                                                    Bin
                                                </button>
                                            </div>
                                        )}
                                        {isCentral && isLowStock && (
                                            <button className="text-blue-600 hover:text-blue-900">Request Restock</button>
                                        )}
                                    </td>
                                </tr>
                            )
                        })}
                    </tbody>
                </table>
            </div>
        </div>
    )
}
