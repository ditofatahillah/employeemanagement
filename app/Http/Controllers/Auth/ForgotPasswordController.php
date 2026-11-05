<?php

namespace App\Http\Controllers\Auth;

use App\Http\Controllers\Controller;
use App\Models\User;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Password;
use Inertia\Inertia;
use Inertia\Response;

class ForgotPasswordController extends Controller
{
    /**
     * Tampilkan halaman lupa password.
     */
    public function show(): Response
    {
        return Inertia::render('Auth/ForgotPassword');
    }

    /**
     * Kirim link reset password ke email pengguna.
     */
    public function sendResetLink(Request $request)
    {
        $request->validate([
            'email' => ['required', 'email'],
        ]);

        // Cek apakah email terdaftar di database
        if (!User::where('email', $request->email)->exists()) {
            return back()->withErrors([
                'email' => 'Email ini tidak terdaftar dalam sistem. Silakan hubungi administrator.',
            ]);
        }

        $status = Password::sendResetLink(
            $request->only('email')
        );

        if ($status === Password::RESET_LINK_SENT) {
            return back()->with('status', 'Link reset password telah dikirim ke email Anda. Silakan periksa inbox atau folder spam.');
        }

        return back()->withErrors(['email' => __($status)]);
    }
}
