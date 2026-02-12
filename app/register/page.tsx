import RegisterForm from '@/app/ui/register-form';
import { prisma } from '@/lib/prisma';

export default async function RegisterPage() {
    // Fetch clinics to allow patient to choose (or we could pre-select if via special link)
    const clinics = await prisma.clinic.findMany({
        select: { id: true, name: true }
    });

    return (
        <main className="flex items-center justify-center md:h-screen">
            <div className="relative mx-auto flex w-full max-w-[400px] flex-col space-y-2.5 p-4 md:-mt-32">
                <div className="flex h-20 w-full items-end rounded-lg bg-blue-500 p-3 md:h-36">
                    <div className="w-32 text-white md:w-36">
                        <span className="text-xl font-bold">New Patient</span>
                    </div>
                </div>
                <RegisterForm clinics={clinics} />
            </div>
        </main>
    );
}
