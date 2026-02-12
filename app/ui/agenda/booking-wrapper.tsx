'use client'

import { useState } from 'react'
import BookingForm from './booking-form'

export default function BookingWrapper({
    children,
    patients,
    services,
    clinics
}: {
    children: React.ReactNode,
    patients: { id: string, name: string }[],
    services: { id: string, name: string, price: number }[],
    clinics: { id: string, name: string }[]
}) {
    const [isBookingOpen, setIsBookingOpen] = useState(false)

    return (
        <div>
            <div className="flex justify-between items-center mb-6">
                <h1 className="text-2xl font-bold">Shared Agenda</h1>
                <button
                    onClick={() => setIsBookingOpen(true)}
                    className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
                >
                    + New Appointment
                </button>
            </div>

            {children}

            {isBookingOpen && (
                <BookingForm
                    patients={patients}
                    services={services}
                    clinics={clinics}
                    onClose={() => setIsBookingOpen(false)}
                />
            )}
        </div>
    )
}
