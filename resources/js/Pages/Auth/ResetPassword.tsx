import React, { useState } from 'react';
import { useForm, Link } from '@inertiajs/react';
import GridShape from '../../components/common/GridShape';
import ThemeTogglerTwo from '../../components/common/ThemeTogglerTwo';
import { EyeCloseIcon, EyeIcon } from '../../icons';

interface Props {
    token: string;
    email: string;
}

export default function ResetPassword({ token, email }: Props) {
    const [showPassword, setShowPassword] = useState(false);
    const [showPasswordConfirmation, setShowPasswordConfirmation] = useState(false);

    const { data, setData, post, processing, errors } = useForm({
        token: token,
        email: email,
        password: '',
        password_confirmation: '',
    });

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        post(route('password.update'));
    };

    return (
        <div className="relative p-6 bg-white z-1 dark:bg-gray-900 sm:p-0">
            <div className="relative flex flex-col justify-center w-full h-screen lg:flex-row dark:bg-gray-900 sm:p-0">

                {/* Left Side: Form */}
                <div className="flex flex-col flex-1">
                    <div className="flex flex-col justify-center flex-1 w-full max-w-md mx-auto">
                        <div>
                            <div className="mb-5 sm:mb-8">
                                <h1 className="mb-2 font-semibold text-gray-800 text-title-sm dark:text-white/90 sm:text-title-md">
                                    Reset Password
                                </h1>
                                <p className="text-sm text-gray-500 dark:text-gray-400">
                                    Buat password baru untuk akun Anda.
                                </p>
                            </div>

                            <form onSubmit={handleSubmit}>
                                <div className="space-y-6">
                                    {/* Email Field (readonly) */}
                                    <div>
                                        <label className="block mb-2 text-sm font-medium text-gray-700 dark:text-gray-400">
                                            Email
                                        </label>
                                        <input
                                            type="email"
                                            value={data.email}
                                            onChange={(e) => setData('email', e.target.value)}
                                            className="w-full h-11 px-4 py-2.5 text-sm text-gray-500 placeholder-gray-400 bg-gray-50 border border-gray-300 rounded-lg outline-none cursor-not-allowed dark:border-gray-700 dark:text-gray-400 dark:bg-gray-800/50"
                                            readOnly
                                        />
                                        {errors.email && (
                                            <p className="mt-1.5 text-xs text-red-500">{errors.email}</p>
                                        )}
                                    </div>

                                    {/* Password Field */}
                                    <div>
                                        <label className="block mb-2 text-sm font-medium text-gray-700 dark:text-gray-400">
                                            Password Baru <span className="text-red-500">*</span>
                                        </label>
                                        <div className="relative">
                                            <input
                                                type={showPassword ? 'text' : 'password'}
                                                value={data.password}
                                                onChange={(e) => setData('password', e.target.value)}
                                                placeholder="Minimal 8 karakter"
                                                required
                                                className="w-full h-11 px-4 py-2.5 text-sm text-gray-800 placeholder-gray-400 bg-transparent border border-gray-300 rounded-lg outline-none focus:border-brand-500 dark:border-gray-700 dark:text-white/90 dark:placeholder-gray-500 dark:focus:border-brand-500"
                                            />
                                            <span
                                                onClick={() => setShowPassword(!showPassword)}
                                                className="absolute z-30 -translate-y-1/2 cursor-pointer right-4 top-1/2"
                                            >
                                                {showPassword ? (
                                                    <EyeIcon className="fill-gray-500 dark:fill-gray-400 size-5" />
                                                ) : (
                                                    <EyeCloseIcon className="fill-gray-500 dark:fill-gray-400 size-5" />
                                                )}
                                            </span>
                                        </div>
                                        {errors.password && (
                                            <p className="mt-1.5 text-xs text-red-500">{errors.password}</p>
                                        )}
                                    </div>

                                    {/* Confirm Password Field */}
                                    <div>
                                        <label className="block mb-2 text-sm font-medium text-gray-700 dark:text-gray-400">
                                            Konfirmasi Password Baru <span className="text-red-500">*</span>
                                        </label>
                                        <div className="relative">
                                            <input
                                                type={showPasswordConfirmation ? 'text' : 'password'}
                                                value={data.password_confirmation}
                                                onChange={(e) => setData('password_confirmation', e.target.value)}
                                                placeholder="Ulangi password baru"
                                                required
                                                className="w-full h-11 px-4 py-2.5 text-sm text-gray-800 placeholder-gray-400 bg-transparent border border-gray-300 rounded-lg outline-none focus:border-brand-500 dark:border-gray-700 dark:text-white/90 dark:placeholder-gray-500 dark:focus:border-brand-500"
                                            />
                                            <span
                                                onClick={() => setShowPasswordConfirmation(!showPasswordConfirmation)}
                                                className="absolute z-30 -translate-y-1/2 cursor-pointer right-4 top-1/2"
                                            >
                                                {showPasswordConfirmation ? (
                                                    <EyeIcon className="fill-gray-500 dark:fill-gray-400 size-5" />
                                                ) : (
                                                    <EyeCloseIcon className="fill-gray-500 dark:fill-gray-400 size-5" />
                                                )}
                                            </span>
                                        </div>
                                    </div>

                                    {/* Submit Button */}
                                    <div>
                                        <button
                                            type="submit"
                                            disabled={processing}
                                            className="flex items-center justify-center w-full h-11 px-4 py-2.5 text-sm font-medium text-white transition-colors bg-brand-500 rounded-lg hover:bg-brand-600 disabled:opacity-50"
                                        >
                                            {processing ? 'Menyimpan...' : 'Reset Password'}
                                        </button>
                                    </div>
                                </div>
                            </form>

                            <div className="mt-5 text-center sm:text-start">
                                <p className="text-sm font-normal text-gray-700 dark:text-gray-400">
                                    Ingat password Anda?{' '}
                                    <Link
                                        href={route('login')}
                                        className="text-brand-500 hover:text-brand-600 dark:text-brand-400 font-medium transition-colors"
                                    >
                                        Kembali ke Login
                                    </Link>
                                </p>
                            </div>
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
