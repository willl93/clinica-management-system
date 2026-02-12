import RegisterClinicForm from '@/app/ui/register-clinic-form';

export default function RegisterClinicPage() {
    return (
        <main className="flex items-center justify-center md:h-screen bg-gray-100">
            <div className="relative mx-auto flex w-full max-w-[450px] flex-col space-y-2.5 p-4 md:-mt-32">
                <div className="flex h-20 w-full items-end rounded-lg bg-blue-600 p-3 md:h-36">
                    <div className="w-full text-white">
                        <span className="text-2xl font-bold">Aesthetic Clinic</span>
                        <p className="text-sm opacity-80">Platform Registration</p>
                    </div>
                </div>
                <RegisterClinicForm />
            </div>
        </main>
    );
}
