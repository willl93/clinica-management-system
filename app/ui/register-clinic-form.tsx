'use client';

import { useActionState } from 'react';
import { registerClinic } from '@/app/lib/actions';

export default function RegisterClinicForm() {
    const [errorMessage, formAction, isPending] = useActionState(
        registerClinic,
        undefined,
    );

    return (
        <form action={formAction} className="space-y-3">
            <div className="flex-1 rounded-lg bg-gray-50 px-6 pb-4 pt-8 shadow-md">
                <h1 className="mb-3 text-2xl font-bold dark:text-gray-900">
                    Register Your Clinic
                </h1>
                <div className="w-full">
                    <div>
                        <label className="mb-3 mt-5 block text-xs font-medium text-gray-900" htmlFor="clinicName">
                            Clinic Name
                        </label>
                        <input
                            className="peer block w-full rounded-md border border-gray-200 py-[9px] px-3 text-sm outline-2 placeholder:text-gray-500"
                            id="clinicName"
                            type="text"
                            name="clinicName"
                            placeholder="Enter clinic name"
                            required
                        />
                    </div>
                    <div className="mt-4">
                        <label className="mb-3 mt-5 block text-xs font-medium text-gray-900" htmlFor="name">
                            Manager Name
                        </label>
                        <input
                            className="peer block w-full rounded-md border border-gray-200 py-[9px] px-3 text-sm outline-2 placeholder:text-gray-500"
                            id="name"
                            type="text"
                            name="name"
                            placeholder="Full name"
                            required
                        />
                    </div>
                    <div className="mt-4">
                        <label className="mb-3 mt-5 block text-xs font-medium text-gray-900" htmlFor="username">
                            Username
                        </label>
                        <input
                            className="peer block w-full rounded-md border border-gray-200 py-[9px] px-3 text-sm outline-2 placeholder:text-gray-500"
                            id="username"
                            type="text"
                            name="username"
                            placeholder="Choose a username"
                            required
                        />
                    </div>
                    <div className="mt-4">
                        <label className="mb-3 mt-5 block text-xs font-medium text-gray-900" htmlFor="password">
                            Password
                        </label>
                        <input
                            className="peer block w-full rounded-md border border-gray-200 py-[9px] px-3 text-sm outline-2 placeholder:text-gray-500"
                            id="password"
                            type="password"
                            name="password"
                            placeholder="Create password"
                            required
                            minLength={6}
                        />
                    </div>
                </div>

                <button
                    className="mt-6 w-full flex h-10 items-center justify-center rounded-lg bg-blue-600 px-4 text-sm font-medium text-white transition-colors hover:bg-blue-500 active:bg-blue-700 disabled:opacity-50"
                    disabled={isPending}
                >
                    Register Clinic
                </button>

                <div className="flex h-8 items-end space-x-1" aria-live="polite" aria-atomic="true">
                    {errorMessage && <p className="text-sm text-red-500">{errorMessage}</p>}
                </div>

                <div className="mt-4 text-center">
                    <a href="/login" className="text-sm text-blue-500 hover:underline">
                        Already have an account? Log in
                    </a>
                </div>
            </div>
        </form>
    );
}
