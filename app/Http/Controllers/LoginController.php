<?php

namespace App\Http\Controllers;

use Illuminate\Http\RedirectResponse;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Request;
use Inertia\Inertia;
use Inertia\Response;

class LoginController extends Controller
{
    public function page(): RedirectResponse|Response
    {
        if (Auth::check()) {
            return redirect('/');
        }

        return Inertia::render('auth/login');
    }

    public function login(): RedirectResponse|Response
    {
        /** @var array<string, string> $credentials */
        $credentials = Request::validate([
            'email' => ['required', 'email'],
            'password' => ['required'],
        ]);

        if (Auth::attempt($credentials)) {
            Request::session()->regenerate();

            return redirect()->intended('/');
        }

        return back()->withErrors([
            'email' => 'Email of wachtwoord incorrect.',
            'password' => 'Email of wachtwoord incorrect.',
        ]);
    }

    public function logout(): RedirectResponse
    {
        Auth::logout();

        return redirect()
            ->route('login')
            ->with('success', 'Succesvol uitgelogd.');
    }
}
