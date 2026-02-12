'use client'

import { useState, useActionState } from 'react'
import { updateAnamnesis } from '@/app/lib/patient-actions'

export default function AnamnesisForm({ patientId, initialContent }: { patientId: string, initialContent?: string }) {
    const [isEditing, setIsEditing] = useState(false)
    const [content, setContent] = useState(initialContent || '')

    async function handleSubmit(e: React.FormEvent) {
        e.preventDefault()
        const res = await updateAnamnesis(patientId, content)
        if (res.success) {
            setIsEditing(false)
        } else {
            alert(res.error)
        }
    }

    return (
        <div className="bg-white p-6 rounded-lg shadow h-fit">
            <div className="flex justify-between items-center mb-4">
                <h2 className="text-lg font-bold">Anamnesis (Medical History)</h2>
                {!isEditing && (
                    <button onClick={() => setIsEditing(true)} className="text-blue-600 hover:underline text-sm">
                        Edit
                    </button>
                )}
            </div>

            {isEditing ? (
                <form onSubmit={handleSubmit}>
                    <textarea
                        value={content}
                        onChange={(e) => setContent(e.target.value)}
                        className="w-full border rounded p-3 min-h-[300px] mb-4"
                        placeholder="Detail the patient's medical history, allergies, medications, etc..."
                    />
                    <div className="flex gap-2">
                        <button type="submit" className="bg-blue-600 text-white px-4 py-2 rounded">Save</button>
                        <button type="button" onClick={() => setIsEditing(false)} className="text-gray-500 px-4 py-2">Cancel</button>
                    </div>
                </form>
            ) : (
                <div className="prose max-w-none text-gray-700 whitespace-pre-wrap">
                    {content || <p className="text-gray-400 italic">No medical history recorded yet.</p>}
                </div>
            )}
        </div>
    )
}
