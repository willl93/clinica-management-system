import { getFinancialSummary } from '@/app/lib/financial-actions'
import { auth } from '@/auth'
import { prisma } from '@/lib/prisma'
import Link from 'next/link'
import FinancialWrapper from '@/app/ui/financial/financial-wrapper'

export default async function FinancialPage() {
    const session = await auth()
    const clinicId = (session?.user as any).clinicId

    if (!clinicId) return <div>Access Denied</div>

    const summary = await getFinancialSummary(clinicId)

    const recentTransactions = await prisma.transaction.findMany({
        where: { clinicId },
        orderBy: { date: 'desc' },
        take: 5
    })

    return (
        <div className="p-8">
            <FinancialWrapper>
                {/* Summary Cards */}
                <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
                    <div className="bg-white p-6 rounded-lg shadow border-l-4 border-green-500">
                        <h3 className="text-gray-500 text-sm font-medium">Income (Month)</h3>
                        <p className="text-2xl font-bold text-gray-900">${summary.income.toFixed(2)}</p>
                    </div>
                    <div className="bg-white p-6 rounded-lg shadow border-l-4 border-red-500">
                        <h3 className="text-gray-500 text-sm font-medium">Expenses (Month)</h3>
                        <p className="text-2xl font-bold text-gray-900">${summary.expense.toFixed(2)}</p>
                    </div>
                    <div className="bg-white p-6 rounded-lg shadow border-l-4 border-blue-500">
                        <h3 className="text-gray-500 text-sm font-medium">Net Balance</h3>
                        <p className={`text-2xl font-bold ${summary.balance >= 0 ? 'text-green-600' : 'text-red-600'}`}>
                            ${summary.balance.toFixed(2)}
                        </p>
                    </div>
                    <div className="bg-white p-6 rounded-lg shadow border-l-4 border-yellow-500">
                        <h3 className="text-gray-500 text-sm font-medium">Receivable (Pending)</h3>
                        <p className="text-2xl font-bold text-gray-900">${summary.pendingReceivable.toFixed(2)}</p>
                    </div>
                </div>
            </FinancialWrapper>

            {/* Recent Transactions */}
            <div className="bg-white rounded-lg shadow overflow-hidden mt-8">
                <div className="px-6 py-4 border-b">
                    <h3 className="text-lg font-bold">Recent Transactions</h3>
                </div>
                <table className="min-w-full divide-y divide-gray-200">
                    <thead className="bg-gray-50">
                        <tr>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Date</th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Description</th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Type</th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Status</th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Amount</th>
                        </tr>
                    </thead>
                    <tbody className="bg-white divide-y divide-gray-200">
                        {recentTransactions.map((t: any) => (
                            <tr key={t.id}>
                                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                                    {t.date.toLocaleDateString()}
                                </td>
                                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{t.description}</td>
                                <td className="px-6 py-4 whitespace-nowrap text-sm">
                                    <span className={`px-2 py-1 rounded-full text-xs font-semibold ${t.type === 'INCOME' ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'}`}>
                                        {t.type}
                                    </span>
                                </td>
                                <td className="px-6 py-4 whitespace-nowrap text-sm">
                                    <span className={`px-2 py-1 rounded-full text-xs font-semibold 
                                        ${t.status === 'PAID' ? 'bg-green-100 text-green-800' :
                                            t.status === 'PENDING' ? 'bg-yellow-100 text-yellow-800' : 'bg-red-100 text-red-800'}`}>
                                        {t.status}
                                    </span>
                                </td>
                                <td className="px-6 py-4 whitespace-nowrap text-sm font-bold text-gray-900">
                                    ${t.amount.toFixed(2)}
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </div>
    )
}
