'use client'

import { useState } from 'react'
import { addEvolution } from '@/app/lib/patient-actions'
import { format } from 'date-fns'

export default function EvolutionTimeline({ patientId, evolutions }: { patientId: string, evolutions: any[] }) {
    const [newNote, setNewNote] = useState('')
    const [isAdding, setIsAdding] = useState(false)

    async function handleSubmit(e: React.FormEvent) {
        e.preventDefault()
        if (!newNote.trim()) return

        const res = await addEvolution(patientId, newNote)
        if (res.success) {
            setNewNote('')
            setIsAdding(false)
        } else {
            alert(res.error)
        }
    }

    return (
        <div className="bg-white p-6 rounded-lg shadow">
            <div className="flex justify-between items-center mb-6">
                <h2 className="text-lg font-bold">Evolution Timeline</h2>
                <button
                    onClick={() => setIsAdding(!isAdding)}
                    className="bg-green-600 text-white px-3 py-1 rounded text-sm hover:bg-green-700"
                >
                    {isAdding ? 'Cancel' : '+ Add Note'}
                </button>
            </div>

            {isAdding && (
                <form onSubmit={handleSubmit} className="mb-8 border-b pb-6">
                    <textarea
                        value={newNote}
                        onChange={(e) => setNewNote(e.target.value)}
                        className="w-full border rounded p-3 min-h-[100px] mb-3"
                        placeholder="Write dynamic evolution details, treatment markers, or observations..."
                        required
                    />
                    <button type="submit" className="bg-blue-600 text-white px-4 py-2 rounded">Save Note</button>
                </form>
            )}

            <div className="space-y-6">
                {evolutions.length === 0 ? (
                    <p className="text-gray-500 italic text-center py-4">No evolution records found.</p>
                ) : (
                    evolutions.map((evo) => (
                        <div key={evo.id} className="relative pl-6 border-l-2 border-gray-100">
                            <div className="absolute -left-1.5 top-1.5 h-3 w-3 rounded-full bg-blue-500"></div>
                            <div className="mb-1">
                                <span className="text-sm font-bold text-gray-900">{format(new Date(evo.date), 'MMMM d, yyyy HH:mm')}</span>
                                {evo.user && <span className="text-xs text-gray-500 ml-2">by {evo.user.name}</span>}
                            </div>
                            <div className="text-gray-700 whitespace-pre-wrap bg-gray-50 p-3 rounded mt-2 border">
                                {evo.content}
                            </div>
                        </div>
                    ))
                )}
            </div>
        </div>
    )
}
