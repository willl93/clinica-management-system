'use client'

import { useState } from 'react'
import { format, startOfMonth, endOfMonth, eachDayOfInterval, isSameMonth, isSameDay, addMonths, subMonths } from 'date-fns'
import { cancelAppointment } from '@/app/lib/agenda-actions'
import { completeAppointment } from '@/app/lib/appointment-workflow'
import SignaturePad from './signature-pad'

type Appointment = {
    id: string
    date: string
    status: string
    patient: { name: string }
    clinic: { id: string, name: string }
}

export default function Calendar({ appointments, currentClinicId }: { appointments: Appointment[], currentClinicId: string }) {
    const [currentDate, setCurrentDate] = useState(new Date())
    const [selectedDate, setSelectedDate] = useState<Date | null>(new Date())
    const [completingAppointment, setCompletingAppointment] = useState<string | null>(null)

    const monthStart = startOfMonth(currentDate)
    const monthEnd = endOfMonth(currentDate)
    const daysInMonth = eachDayOfInterval({ start: monthStart, end: monthEnd })

    const nextMonth = () => setCurrentDate(addMonths(currentDate, 1))
    const prevMonth = () => setCurrentDate(subMonths(currentDate, 1))

    const handleCancel = async (id: string, clinicId: string) => {
        if (clinicId !== currentClinicId) {
            alert("You cannot cancel appointments from another clinic!")
            return
        }
        if (!confirm("Are you sure?")) return

        await cancelAppointment(id)
    }

    const selectedAppointments = appointments.filter(apt =>
        selectedDate && isSameDay(new Date(apt.date), selectedDate)
    )

    return (
        <div className="flex flex-col md:flex-row gap-6">
            {/* Calendar View */}
            <div className="bg-white p-6 rounded-lg shadow w-full md:w-2/3">
                <div className="flex justify-between items-center mb-4">
                    <button onClick={prevMonth} className="px-3 py-1 bg-gray-200 rounded">&lt;</button>
                    <h2 className="text-xl font-bold">{format(currentDate, 'MMMM yyyy')}</h2>
                    <button onClick={nextMonth} className="px-3 py-1 bg-gray-200 rounded">&gt;</button>
                </div>
                <div className="grid grid-cols-7 gap-1">
                    {['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].map(d => (
                        <div key={d} className="text-center font-bold text-gray-500 text-sm py-2">{d}</div>
                    ))}
                    {daysInMonth.map((day, idx) => {
                        // Simple offset logic could be added here for correct starting day
                        // For now just listing days
                        const dayAppointments = appointments.filter(apt => isSameDay(new Date(apt.date), day))
                        const hasOtherClinic = dayAppointments.some(apt => apt.clinic.id !== currentClinicId)
                        const hasMyClinic = dayAppointments.some(apt => apt.clinic.id === currentClinicId)

                        return (
                            <div
                                key={day.toString()}
                                onClick={() => setSelectedDate(day)}
                                className={`
                                    min-h-[80px] border rounded p-1 cursor-pointer transition-colors
                                    ${isSameDay(day, selectedDate || new Date(0)) ? 'border-blue-500 bg-blue-50' : 'border-gray-100 hover:bg-gray-50'}
                                `}
                            >
                                <div className="text-right text-sm text-gray-700">{format(day, 'd')}</div>
                                <div className="flex flex-col gap-1 mt-1">
                                    {hasMyClinic && <div className="h-2 w-2 rounded-full bg-blue-500 mx-auto" title="My Clinic"></div>}
                                    {hasOtherClinic && <div className="h-2 w-2 rounded-full bg-orange-400 mx-auto" title="Other Clinic"></div>}
                                </div>
                            </div>
                        )
                    })}
                </div>
            </div>

            {/* Daily Details View */}
            <div className="bg-white p-6 rounded-lg shadow w-full md:w-1/3">
                <h3 className="text-lg font-bold mb-4">
                    {selectedDate ? format(selectedDate, 'EEEE, MMM d') : 'Select a date'}
                </h3>

                <div className="space-y-4">
                    {selectedAppointments.length === 0 ? (
                        <p className="text-gray-500">No appointments for this day.</p>
                    ) : (
                        selectedAppointments.map(apt => (
                            <div key={apt.id} className={`p-3 rounded border-l-4 ${apt.clinic.id === currentClinicId ? 'border-blue-500 bg-blue-50' : 'border-orange-400 bg-orange-50'}`}>
                                <div className="flex justify-between items-start">
                                    <div>
                                        <p className="font-bold text-gray-900">{format(new Date(apt.date), 'HH:mm')}</p>
                                        <p className="text-sm">{apt.patient.name}</p>
                                        <p className="text-xs text-gray-500">{apt.clinic.name}</p>
                                        <p className="text-xs font-semibold mt-1">{apt.status}</p>
                                    </div>
                                    {apt.clinic.id === currentClinicId && apt.status !== 'CANCELLED' && (
                                        <div className="flex gap-2 mt-2">
                                            {apt.status === 'SCHEDULED' && (
                                                <button
                                                    onClick={() => setCompletingAppointment(apt.id)}
                                                    className="text-xs bg-green-600 text-white px-2 py-1 rounded hover:bg-green-700"
                                                >
                                                    Complete
                                                </button>
                                            )}
                                            <button
                                                onClick={() => handleCancel(apt.id, apt.clinic.id)}
                                                className="text-xs text-red-500 hover:text-red-700 underline"
                                            >
                                                Cancel
                                            </button>
                                        </div>
                                    )}
                                </div>
                            </div>
                        ))
                    )}
                </div>

                <div className="mt-8 pt-4 border-t">
                    <h4 className="font-bold mb-2">Legend</h4>
                    <div className="flex items-center gap-2 text-sm">
                        <div className="h-3 w-3 rounded-full bg-blue-500"></div>
                        <span>Your Clinic</span>
                    </div>
                    <div className="flex items-center gap-2 text-sm mt-1">
                        <div className="h-3 w-3 rounded-full bg-orange-400"></div>
                        <span>Other Clinics</span>
                    </div>
                </div>
            </div>
            {completingAppointment && (
                <SignaturePad
                    onCancel={() => setCompletingAppointment(null)}
                    onSave={async (signature) => {
                        const res = await completeAppointment(completingAppointment, signature)
                        if (res?.error) {
                            alert(res.error)
                        } else {
                            setCompletingAppointment(null)
                        }
                    }}
                />
            )}
        </div>
    )
}
