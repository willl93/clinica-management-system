'use client';

import { useActionState } from 'react';
import { authenticate } from '@/app/lib/actions';
import { useSearchParams } from 'next/navigation';

export default function AdminLoginForm() {
    const searchParams = useSearchParams();
    const callbackUrl = searchParams.get('callbackUrl') || '/admin';
    const [errorMessage, formAction, isPending] = useActionState(
        authenticate,
        undefined,
    );

    return (
        <form action={formAction} className="space-y-3">
            <div className="flex-1 rounded-lg bg-slate-900 px-6 pb-4 pt-8 shadow-md text-white">
                <h1 className="mb-3 text-2xl font-bold">
                    SaaS Management Portal
                </h1>
                <div className="w-full">
                    <div>
                        <label
                            className="mb-3 mt-5 block text-xs font-medium text-gray-300"
                            htmlFor="username"
                        >
                            Administrator Username
                        </label>
                        <div className="relative">
                            <input
                                className="peer block w-full rounded-md border border-slate-700 bg-slate-800 py-[9px] pl-10 text-sm outline-none placeholder:text-gray-500 focus:border-blue-500 text-white"
                                id="username"
                                type="text"
                                name="username"
                                placeholder="Enter admin username"
                                required
                            />
                        </div>
                    </div>
                    <div className="mt-4">
                        <label
                            className="mb-3 mt-5 block text-xs font-medium text-gray-300"
                            htmlFor="password"
                        >
                            Password
                        </label>
                        <div className="relative">
                            <input
                                className="peer block w-full rounded-md border border-slate-700 bg-slate-800 py-[9px] pl-10 text-sm outline-none placeholder:text-gray-500 focus:border-blue-500 text-white"
                                id="password"
                                type="password"
                                name="password"
                                placeholder="Enter password"
                                required
                                minLength={6}
                            />
                        </div>
                    </div>
                </div>
                <input type="hidden" name="redirectTo" value={callbackUrl} />
                <Button className="mt-4 w-full bg-blue-600 hover:bg-blue-500" aria-disabled={isPending}>
                    Access Management Console
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
            </div>
        </form>
    );
}

function Button({ className, ...rest }: React.ButtonHTMLAttributes<HTMLButtonElement>) {
    return (
        <button
            {...rest}
            className={`flex h-10 items-center justify-center rounded-lg px-4 text-sm font-medium text-white transition-colors focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-blue-500 aria-disabled:cursor-not-allowed aria-disabled:opacity-50 ${className}`}
        >
            Access Management Console
        </button>
    );
}
