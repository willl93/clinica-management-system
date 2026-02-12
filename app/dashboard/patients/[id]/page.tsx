import { prisma } from "@/lib/prisma"
import { notFound } from "next/navigation"
import AnamnesisForm from "@/app/ui/patients/anamnesis-form"
import EvolutionTimeline from "@/app/ui/patients/evolution-timeline"
import { format } from "date-fns"

export default async function PatientDetailPage(props: { params: Promise<{ id: string }> }) {
    const params = await props.params
    const patient = await (prisma.user as any).findUnique({
        where: { id: params.id },
        include: {
            anamnesis: true,
            evolutions: {
                orderBy: { date: 'desc' },
                include: { user: { select: { name: true } } }
            },
            appointments: {
                orderBy: { date: 'desc' },
                include: { service: true },
                take: 5
            }
        }
    })

    if (!patient || patient.role !== 'PATIENT') {
        notFound()
    }

    return (
        <div className="p-8">
            <div className="mb-8">
                <h1 className="text-3xl font-bold text-gray-900">{patient.name}</h1>
                <p className="text-gray-500">Patient Profile & Records</p>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                {/* Left Column: Basic Info & Anamnesis */}
                <div className="lg:col-span-1 space-y-8">
                    <div className="bg-white p-6 rounded-lg shadow">
                        <h2 className="text-lg font-bold mb-4">Informação do Paciente</h2>
                        <div className="space-y-2 text-sm">
                            <p><span className="text-gray-500 font-medium">Nome:</span> {patient.name}</p>
                            <p><span className="text-gray-500 font-medium">Email:</span> {patient.username}</p>
                            <p><span className="text-gray-500 font-medium">CPF:</span> {(patient as any).cpf || '-'}</p>
                            <p><span className="text-gray-500 font-medium">Nascimento:</span> {(patient as any).birthDate ? format(new Date((patient as any).birthDate), 'dd/MM/yyyy') : '-'}</p>
                            <p><span className="text-gray-500 font-medium">Telefone:</span> {(patient as any).phone || '-'}</p>
                            <p className="pt-2 border-t mt-2"><span className="text-gray-400">Membro desde:</span> {format(new Date(patient.createdAt), 'PP')}</p>
                        </div>
                    </div>

                    <AnamnesisForm patientId={patient.id} initialContent={patient.anamnesis?.content} />

                    <div className="bg-white p-6 rounded-lg shadow">
                        <h2 className="text-lg font-bold mb-4">Recent Appointments</h2>
                        <div className="space-y-4">
                            {patient.appointments.map((apt: any) => (
                                <div key={apt.id} className="text-sm border-b pb-2">
                                    <p className="font-bold">{format(new Date(apt.date), 'PPp')}</p>
                                    <p className="text-gray-600">{apt.service?.name}</p>
                                    <p className={`text-xs font-semibold ${apt.status === 'COMPLETED' ? 'text-green-600' : 'text-blue-600'}`}>
                                        {apt.status}
                                    </p>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>

                {/* Right Column: Evolutions */}
                <div className="lg:col-span-2">
                    <EvolutionTimeline patientId={patient.id} evolutions={patient.evolutions} />
                </div>
            </div>
        </div>
    )
}
