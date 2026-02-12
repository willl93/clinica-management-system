'use client'

import { useActionState } from 'react'
import { createAppointment } from '@/app/lib/agenda-actions'
import { useState } from 'react'

export default function BookingForm({
    patients,
    services,
    clinics,
    onClose
}: {
    patients: { id: string, name: string }[],
    services: { id: string, name: string, price: number }[],
    clinics: { id: string, name: string }[],
    onClose: () => void
}) {
    const [state, formAction] = useActionState(createAppointment, null)
    const [isNewPatient, setIsNewPatient] = useState(false)

    if ((state as any)?.success) {
        onClose()
    }

    return (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 overflow-y-auto p-4">
            <div className="bg-white p-6 rounded-lg shadow-lg w-full max-w-md my-8">
                <h2 className="text-xl font-bold mb-4">New Appointment</h2>

                <form action={formAction} className="space-y-4">
                    {/* Patient Section */}
                    <div className="border-b pb-4 mb-4">
                        <div className="flex items-center justify-between mb-2">
                            <label className="text-sm font-medium">Patient</label>
                            <button
                                type="button"
                                onClick={() => setIsNewPatient(!isNewPatient)}
                                className="text-xs text-blue-600 hover:underline"
                            >
                                {isNewPatient ? "Select Existing" : "+ New Patient"}
                            </button>
                        </div>

                        {!isNewPatient ? (
                            <select name="patientId" required={!isNewPatient} className="w-full border rounded p-2 text-sm">
                                <option value="">Select Existing Patient</option>
                                {patients.map(p => (
                                    <option key={p.id} value={p.id}>{p.name}</option>
                                ))}
                            </select>
                        ) : (
                            <div className="space-y-2">
                                <input type="hidden" name="isNewPatient" value="true" />
                                <input
                                    name="newPatientName"
                                    placeholder="Full Name"
                                    required={isNewPatient}
                                    className="w-full border rounded p-2 text-sm"
                                />
                                <input
                                    name="newPatientUsername"
                                    placeholder="Email"
                                    type="email"
                                    required={isNewPatient}
                                    className="w-full border rounded p-2 text-sm"
                                />
                                <div className="grid grid-cols-2 gap-2">
                                    <input
                                        name="newPatientCpf"
                                        placeholder="CPF"
                                        required={isNewPatient}
                                        className="w-full border rounded p-2 text-sm"
                                    />
                                    <input
                                        name="newPatientBirthDate"
                                        type="date"
                                        required={isNewPatient}
                                        className="w-full border rounded p-2 text-sm"
                                    />
                                </div>
                                <input
                                    name="newPatientPhone"
                                    placeholder="Phone/WhatsApp"
                                    required={isNewPatient}
                                    className="w-full border rounded p-2 text-sm"
                                />
                            </div>
                        )}
                    </div>

                    {/* Clinic Selection */}
                    <div>
                        <label className="block text-sm font-medium mb-1">Clinic</label>
                        <select name="clinicId" required className="w-full border rounded p-2 text-sm">
                            <option value="">Select Clinic</option>
                            {clinics.map(c => (
                                <option key={c.id} value={c.id}>{c.name}</option>
                            ))}
                        </select>
                    </div>

                    {/* Service Selection */}
                    <div>
                        <label className="block text-sm font-medium mb-1">Service</label>
                        <select name="serviceId" required className="w-full border rounded p-2 text-sm">
                            <option value="">Select Service</option>
                            {services.map(s => (
                                <option key={s.id} value={s.id}>{s.name} - ${s.price}</option>
                            ))}
                        </select>
                    </div>

                    {/* Date/Time Section */}
                    <div className="grid grid-cols-2 gap-4">
                        <div>
                            <label className="block text-sm font-medium mb-1">Date</label>
                            <input type="date" name="date" required className="w-full border rounded p-2 text-sm" />
                        </div>
                        <div>
                            <label className="block text-sm font-medium mb-1">Time</label>
                            <input type="time" name="time" required className="w-full border rounded p-2 text-sm" />
                        </div>
                    </div>

                    {/* Description */}
                    <div>
                        <label className="block text-sm font-medium mb-1">Attendance Description</label>
                        <textarea
                            name="notes"
                            placeholder="Reason for visit, symptoms, etc."
                            className="w-full border rounded p-2 text-sm min-h-[80px]"
                        ></textarea>
                    </div>

                    {state && (state as any).error && (
                        <p className="text-red-500 text-sm">{(state as any).error}</p>
                    )}

                    <div className="flex justify-end gap-2 mt-6">
                        <button type="button" onClick={onClose} className="px-4 py-2 text-gray-600 hover:bg-gray-100 rounded text-sm font-medium">
                            Cancel
                        </button>
                        <button type="submit" className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 text-sm font-medium shadow-sm transition-colors" >
                            Complete Booking
                        </button>
                    </div>
                </form>
            </div>
        </div>
    )
}
