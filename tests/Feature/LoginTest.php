<?php

namespace Tests\Feature;

use App\Models\User;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Tests\TestCase;

class LoginTest extends TestCase
{
    use RefreshDatabase;

    public function test_users_can_login_with_correct_credentials(): void
    {
        $user = User::factory()->create();

        $this->post('/login', [
            'email' => $user->email,
            'password' => 'password',
        ])->assertRedirect('/');

        $this->assertAuthenticatedAs($user);
    }

    public function test_users_cannot_login_with_incorrect_credentials(): void
    {
        $user = User::factory()->create();

        $this->from('/login')->post('/login', [
            'email' => $user->email,
            'password' => 'wrong-password',
        ])->assertRedirect('/login')->assertSessionHasErrors(['email', 'password']);

        $this->assertGuest();
    }

    public function test_login_page_provides_csrf_token(): void
    {
        $response = $this->get('/login');

        $response->assertOk();

        /** @var array{component: string, props: array{csrfToken?: string}} $page */
        $page = $response->viewData('page');
        $this->assertSame('auth/login', $page['component']);
        $this->assertNotEmpty($page['props']['csrfToken'] ?? null);
    }
}
