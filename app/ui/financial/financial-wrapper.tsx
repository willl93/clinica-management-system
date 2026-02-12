'use client'

import { useState } from 'react'
import NewTransactionModal from './new-transaction-modal'

export default function FinancialWrapper({ children }: { children: React.ReactNode }) {
    const [isModalOpen, setIsModalOpen] = useState(false)

    return (
        <div>
            {/* Header with buttons */}
            <div className="flex justify-between items-center mb-6">
                <h1 className="text-2xl font-bold">Financial Control</h1>
                <div className="space-x-4">
                    <a href="/dashboard/financial/services" className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700">
                        Manage Services
                    </a>
                    <button
                        onClick={() => setIsModalOpen(true)}
                        className="px-4 py-2 bg-green-600 text-white rounded hover:bg-green-700"
                    >
                        + New Transaction
                    </button>
                </div>
            </div>

            {children}

            {isModalOpen && (
                <NewTransactionModal onClose={() => setIsModalOpen(false)} />
            )}
        </div>
    )
}
