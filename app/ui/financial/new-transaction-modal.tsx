'use client'

import { useActionState, useState } from 'react'
import { createManualTransaction } from '@/app/lib/manual-transaction-actions'

export default function NewTransactionModal({ onClose }: { onClose: () => void }) {
    const [state, formAction] = useActionState(createManualTransaction, null)

    if ((state as any)?.success) {
        onClose()
    }

    return (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
            <div className="bg-white p-6 rounded-lg shadow-lg w-full max-w-md">
                <h2 className="text-xl font-bold mb-4">Add Transaction</h2>

                <form action={formAction} className="space-y-4">
                    <div>
                        <label className="block text-sm font-medium">Description</label>
                        <input name="description" required className="w-full border rounded p-2" placeholder="e.g. Rent, Electricity, Extra Sale" />
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                        <div>
                            <label className="block text-sm font-medium">Amount ($)</label>
                            <input name="amount" type="number" step="0.01" required className="w-full border rounded p-2" />
                        </div>
                        <div>
                            <label className="block text-sm font-medium">Type</label>
                            <select name="type" required className="w-full border rounded p-2">
                                <option value="EXPENSE">Expense</option>
                                <option value="INCOME">Extra Income</option>
                            </select>
                        </div>
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                        <div>
                            <label className="block text-sm font-medium">Payment Method</label>
                            <select name="paymentMethod" required className="w-full border rounded p-2">
                                <option value="CASH">Cash</option>
                                <option value="CREDIT_CARD">Credit Card</option>
                                <option value="DEBIT_CARD">Debit Card</option>
                                <option value="PIX">PIX / Transfer</option>
                            </select>
                        </div>
                        <div>
                            <label className="block text-sm font-medium">Status</label>
                            <select name="status" required className="w-full border rounded p-2">
                                <option value="PAID">Paid</option>
                                <option value="PENDING">Pending</option>
                            </select>
                        </div>
                    </div>

                    <div>
                        <label className="block text-sm font-medium">Date</label>
                        <input name="date" type="date" required defaultValue={new Date().toISOString().split('T')[0]} className="w-full border rounded p-2" />
                    </div>

                    {(state as any)?.error && <p className="text-red-500 text-sm mt-2">{(state as any).error}</p>}

                    <div className="flex justify-end gap-2 mt-6">
                        <button type="button" onClick={onClose} className="px-4 py-2 text-gray-600 hover:bg-gray-100 rounded">
                            Cancel
                        </button>
                        <button type="submit" className="px-4 py-2 bg-green-600 text-white rounded hover:bg-green-700">
                            Save Transaction
                        </button>
                    </div>
                </form>
            </div>
        </div>
    )
}
