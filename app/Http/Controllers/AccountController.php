<?php

namespace App\Http\Controllers;

use Illuminate\Auth\AuthenticationException;
use Illuminate\Http\RedirectResponse;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Facades\Request;
use Inertia\Inertia;
use Inertia\Response;

class AccountController extends Controller
{
    /**
     * @throws AuthenticationException
     */
    public function edit(): Response
    {
        $user = Auth::user();
        if (is_null($user)) {
            throw new AuthenticationException;
        }

        return Inertia::render('account/edit', [
            'name' => $user->name,
            'email' => $user->email,
        ]);
    }

    public function update(): RedirectResponse
    {
        /** @var array{name:string,email:string,password?:string} $settings */
        $settings = Request::validate([
            'name' => ['required', 'string'],
            'email' => ['required', 'email'],
            'password' => ['nullable', 'string', 'min:8'],
        ]);

        $user = Auth::user();
        if (is_null($user)) {
            throw new AuthenticationException;
        }

        $user->update([
            'name' => $settings['name'],
            'email' => $settings['email'],
        ]);

        if (isset($settings['password'])) {
            $user->update([
                'password' => Hash::make($settings['password']),
            ]);
        }

        return redirect(route('account.update'))->with(
            'success',
            'Instellingen succesvol opgeslagen . '
        );
    }
}
