<?php

namespace App\Console\Commands;

use App\Models\User;
use Illuminate\Console\Command;
use Illuminate\Support\Facades\Hash;

class MakeUser extends Command
{
    /** @var string */
    protected $signature = 'make:user';

    /** @var string|null */
    protected $description = 'Maakt een gebruiker aan';

    /** @return void */
    public function __construct()
    {
        parent::__construct();
    }

    /** @return void */
    public function handle()
    {
        $name = $this->ask('Naam');
        $email = $this->ask('E-mailadres');
        $password = Hash::make($this->secret('Wachtwoord')); /** @phpstan-ignore-line */
        $this->info('Gebruiker maken...');
        User::create([
            'name' => $name,
            'email' => $email,
            'password' => $password,
        ]);
        $this->info('Gebruiker aangemaakt');
    }
}
