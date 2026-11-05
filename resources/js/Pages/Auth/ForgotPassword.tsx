import React from 'react';
import { useForm, Link, usePage } from '@inertiajs/react';
import GridShape from '../../components/common/GridShape';
import ThemeTogglerTwo from '../../components/common/ThemeTogglerTwo';

export default function ForgotPassword() {
    const { status } = usePage<{ status?: string | null }>().props;

    const { data, setData, post, processing, errors } = useForm({
        email: '',
    });

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        post(route('password.email'));
    };

    return (
        <div className="relative p-6 bg-white z-1 dark:bg-gray-900 sm:p-0">
            <div className="relative flex flex-col justify-center w-full h-screen lg:flex-row dark:bg-gray-900 sm:p-0">

                {/* Left Side: Form */}
                <div className="flex flex-col flex-1">
                    <div className="flex flex-col justify-center flex-1 w-full max-w-md mx-auto">
                        <div>
                            {/* Back to Login */}
                            <Link
                                href={route('login')}
                                className="inline-flex items-center gap-2 mb-6 text-sm text-gray-500 hover:text-brand-500 dark:text-gray-400 dark:hover:text-brand-400 transition-colors"
                            >
                                <svg
                                    xmlns="http://www.w3.org/2000/svg"
                                    className="w-4 h-4"
                                    fill="none"
                                    viewBox="0 0 24 24"
                                    stroke="currentColor"
                                    strokeWidth={2}
                                >
                                    <path strokeLinecap="round" strokeLinejoin="round" d="M15 19l-7-7 7-7" />
                                </svg>
                                Kembali ke Login
                            </Link>

                            <div className="mb-5 sm:mb-8">
                                <h1 className="mb-2 font-semibold text-gray-800 text-title-sm dark:text-white/90 sm:text-title-md">
                                    Lupa Password?
                                </h1>
                                {!status && (
                                    <p className="text-sm text-gray-500 dark:text-gray-400">
                                        Masukkan email Anda dan kami akan mengirimkan link untuk reset password.
                                    </p>
                                )}
                            </div>

                            {/* ── Success State ─────────────────────────────── */}
                            {status ? (
                                <div className="flex flex-col items-center text-center py-4">
                                    {/* Checkmark circle */}
                                    <div className="flex items-center justify-center w-16 h-16 mb-5 rounded-full bg-green-100 dark:bg-green-900/30">
                                        <svg
                                            xmlns="http://www.w3.org/2000/svg"
                                            className="w-8 h-8 text-green-600 dark:text-green-400"
                                            fill="none"
                                            viewBox="0 0 24 24"
                                            stroke="currentColor"
                                            strokeWidth={2}
                                        >
                                            <path strokeLinecap="round" strokeLinejoin="round" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                                        </svg>
                                    </div>

                                    <h2 className="mb-2 text-lg font-semibold text-gray-800 dark:text-white/90">
                                        Email Terkirim!
                                    </h2>
                                    <p className="mb-1 text-sm text-gray-500 dark:text-gray-400">
                                        {status}
                                    </p>
                                    <p className="mb-6 text-xs text-gray-400 dark:text-gray-500">
                                        Tidak menemukan email? Periksa folder <span className="font-medium">Spam</span> atau <span className="font-medium">Promosi</span>.
                                    </p>

                                    {/* Divider */}
                                    <div className="w-full border-t border-gray-200 dark:border-gray-700 mb-6" />

                                    <p className="text-sm text-gray-500 dark:text-gray-400 mb-3">
                                        Belum menerima email?
                                    </p>
                                    <Link
                                        href={route('password.request')}
                                        className="text-sm font-medium text-brand-500 hover:text-brand-600 dark:text-brand-400 transition-colors"
                                    >
                                        Kirim ulang link reset password
                                    </Link>
                                </div>
                            ) : (
                                /* ── Form ──────────────────────────────────── */
                                <form onSubmit={handleSubmit}>
                                    <div className="space-y-6">
                                        {/* Email Field */}
                                        <div>
                                            <label className="block mb-2 text-sm font-medium text-gray-700 dark:text-gray-400">
                                                Alamat Email <span className="text-red-500">*</span>
                                            </label>
                                            <input
                                                type="email"
                                                value={data.email}
                                                onChange={(e) => setData('email', e.target.value)}
                                                placeholder="info@gmail.com"
                                                required
                                                className="w-full h-11 px-4 py-2.5 text-sm text-gray-800 placeholder-gray-400 bg-transparent border border-gray-300 rounded-lg outline-none focus:border-brand-500 dark:border-gray-700 dark:text-white/90 dark:placeholder-gray-500 dark:focus:border-brand-500"
                                            />
                                            {errors.email && (
                                                <p className="mt-1.5 text-xs text-red-500">{errors.email}</p>
                                            )}
                                        </div>

                                        {/* Submit Button */}
                                        <div>
                                            <button
                                                type="submit"
                                                disabled={processing}
                                                className="flex items-center justify-center w-full h-11 px-4 py-2.5 text-sm font-medium text-white transition-colors bg-brand-500 rounded-lg hover:bg-brand-600 disabled:opacity-50"
                                            >
                                                {processing ? 'Mengirim...' : 'Kirim Link Reset Password'}
                                            </button>
                                        </div>
                                    </div>
                                </form>
                            )}
                        </div>
                    </div>
                </div>

                {/* Right Side: Split Screen Sidebar */}
                <div className="items-center hidden w-full h-full lg:w-1/2 bg-brand-950 dark:bg-white/5 lg:grid">
                    <div className="relative flex items-center justify-center z-1">
                        <GridShape />
                        <div className="flex flex-col items-center max-w-xs">
                            <Link href="/" className="block mb-4">
                                <img
                                    className="h-24 w-auto mx-auto"
                                    src="/images/logo/logo-mais-paiton.png"
                                    alt="Logo"
                                />
                            </Link>
                            <p className="text-center text-gray-400 dark:text-white/60">
                                Aplikasi Manajemen Surat Digital<br />
                                Pondok Pesantren Islamiyah Syafiiyah Paiton
                            </p>
                        </div>
                    </div>
                </div>

                {/* Theme Toggler */}
                <div className="fixed z-50 hidden bottom-6 right-6 sm:block">
                    <ThemeTogglerTwo />
                </div>
            </div>
        </div>
    );
}
