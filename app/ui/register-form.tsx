'use client';

import { useActionState } from 'react';
import { register } from '@/app/lib/actions';

export default function RegisterForm({ clinics }: { clinics: { id: string, name: string }[] }) {
    const [errorMessage, formAction, isPending] = useActionState(
        register,
        undefined,
    );

    return (
        <form action={formAction} className="space-y-3">
            <div className="flex-1 rounded-lg bg-gray-50 px-6 pb-4 pt-8 shadow-md">
                <h1 className="mb-3 text-2xl font-bold dark:text-gray-900">
                    Create Patient Account
                </h1>
                <div className="w-full">
                    <div>
                        <label
                            className="mb-3 mt-5 block text-xs font-medium text-gray-900"
                            htmlFor="name"
                        >
                            Full Name
                        </label>
                        <div className="relative">
                            <input
                                className="peer block w-full rounded-md border border-gray-200 py-[9px] px-3 text-sm outline-2 placeholder:text-gray-500"
                                id="name"
                                type="text"
                                name="name"
                                placeholder="Enter your full name"
                                required
                            />
                        </div>
                    </div>
                    <div>
                        <label
                            className="mb-3 mt-5 block text-xs font-medium text-gray-900"
                            htmlFor="phone"
                        >
                            Phone / WhatsApp
                        </label>
                        <div className="relative">
                            <input
                                className="peer block w-full rounded-md border border-gray-200 py-[9px] px-3 text-sm outline-2 placeholder:text-gray-500"
                                id="phone"
                                type="text"
                                name="phone"
                                placeholder="(00) 00000-0000"
                                required
                            />
                        </div>
                    </div>
                    <div className="mt-4">
                        <label
                            className="mb-3 mt-5 block text-xs font-medium text-gray-900"
                            htmlFor="username"
                        >
                            Email
                        </label>
                        <div className="relative">
                            <input
                                className="peer block w-full rounded-md border border-gray-200 py-[9px] pl-10 text-sm outline-2 placeholder:text-gray-500"
                                id="username"
                                type="email"
                                name="username"
                                placeholder="Enter your email"
                                required
                            />
                        </div>
                    </div>
                    <div className="mt-4 grid grid-cols-1 gap-4 sm:grid-cols-2">
                        <div>
                            <label
                                className="mb-3 mt-5 block text-xs font-medium text-gray-900"
                                htmlFor="cpf"
                            >
                                CPF
                            </label>
                            <input
                                className="peer block w-full rounded-md border border-gray-200 py-[9px] px-3 text-sm outline-2 placeholder:text-gray-500"
                                id="cpf"
                                type="text"
                                name="cpf"
                                placeholder="000.000.000-00"
                                required
                            />
                        </div>
                        <div>
                            <label
                                className="mb-3 mt-5 block text-xs font-medium text-gray-900"
                                htmlFor="birthDate"
                            >
                                Data de Nascimento
                            </label>
                            <input
                                className="peer block w-full rounded-md border border-gray-200 py-[9px] px-3 text-sm outline-2 placeholder:text-gray-500"
                                id="birthDate"
                                type="date"
                                name="birthDate"
                                required
                            />
                        </div>
                    </div>
                    <div className="mt-4">
                        <label
                            className="mb-3 mt-5 block text-xs font-medium text-gray-900"
                            htmlFor="clinic"
                        >
                            Select Your Clinic
                        </label>
                        <div className="relative">
                            <select
                                id="clinicId"
                                name="clinicId"
                                className="peer block w-full rounded-md border border-gray-200 py-[9px] pl-10 text-sm outline-2 placeholder:text-gray-500"
                                defaultValue=""
                                required
                            >
                                <option value="" disabled>Select a clinic</option>
                                {clinics.map((clinic) => (
                                    <option key={clinic.id} value={clinic.id}>
                                        {clinic.name}
                                    </option>
                                ))}
                            </select>
                        </div>
                    </div>
                    <div className="mt-4">
                        <label
                            className="mb-3 mt-5 block text-xs font-medium text-gray-900"
                            htmlFor="password"
                        >
                            Password
                        </label>
                        <div className="relative">
                            <input
                                className="peer block w-full rounded-md border border-gray-200 py-[9px] pl-10 text-sm outline-2 placeholder:text-gray-500"
                                id="password"
                                type="password"
                                name="password"
                                placeholder="Create password"
                                required
                                minLength={6}
                            />
                        </div>
                    </div>
                </div>
                <Button className="mt-4 w-full" aria-disabled={isPending}>
                    Sign Up
                </Button>
                <div
                    className="flex h-8 items-end space-x-1"
                    aria-live="polite"
                    aria-atomic="true"
                >
                    {errorMessage && (
                        <>
                            <p className="text-sm text-red-500">{errorMessage}</p>
                        </>
                    )}
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

function Button({ className, ...rest }: React.ButtonHTMLAttributes<HTMLButtonElement>) {
    return (
        <button
            {...rest}
            className={`flex h-10 items-center justify-center rounded-lg bg-green-500 px-4 text-sm font-medium text-white transition-colors hover:bg-green-400 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-green-500 active:bg-green-600 aria-disabled:cursor-not-allowed aria-disabled:opacity-50 ${className}`}
        >
            Register
        </button>
    );
}
