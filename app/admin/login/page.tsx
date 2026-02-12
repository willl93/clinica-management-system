import AdminLoginForm from '@/app/ui/admin-login-form';
import { Suspense } from 'react';

export default function AdminLoginPage() {
    return (
        <main className="flex items-center justify-center md:h-screen bg-slate-100">
            <div className="relative mx-auto flex w-full max-w-[400px] flex-col space-y-2.5 p-4 md:-mt-32">
                <div className="flex h-20 w-full items-end rounded-lg bg-slate-900 p-3 md:h-36">
                    <div className="w-full text-white">
                        <span className="text-3xl font-bold">Admin Portal</span>
                    </div>
                </div>
                <Suspense>
                    <AdminLoginForm />
                </Suspense>
                <div className="text-center text-xs text-gray-400 mt-4">
                    <p>Restricted Access. Authorized Personnel Only.</p>
                </div>
            </div>
        </main>
    );
}
