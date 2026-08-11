<?php

namespace Tests\Feature;

use App\Models\File;
use App\Models\User;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Tests\TestCase;

class FileSearchTest extends TestCase
{
    use RefreshDatabase;

    public function test_all_page_filters_by_name(): void
    {
        $user = User::factory()->create();
        File::factory()->for($user)->create(['name' => 'vakantiefoto.jpg']);
        File::factory()->for($user)->create(['name' => 'factuur.pdf']);

        $this->actingAs($user)
            ->get(route('all', ['search' => 'vakantie']))
            ->assertOk()
            ->assertSee('vakantiefoto.jpg')
            ->assertDontSee('factuur.pdf');
    }

    public function test_search_combines_with_media_scope(): void
    {
        $user = User::factory()->create();
        File::factory()->for($user)->create(['name' => 'vakantiefoto.jpg']);
        File::factory()->for($user)->text()->create(['name' => 'vakantieplan.txt']);

        $this->actingAs($user)
            ->get(route('media', ['search' => 'vakantie']))
            ->assertOk()
            ->assertSee('vakantiefoto.jpg')
            ->assertDontSee('vakantieplan.txt');
    }

    public function test_like_wildcards_match_literally(): void
    {
        $user = User::factory()->create();
        File::factory()->for($user)->create(['name' => 'korting 10%.jpg']);
        File::factory()->for($user)->create(['name' => 'korting 10 euro.jpg']);

        $this->actingAs($user)
            ->get(route('all', ['search' => '10%']))
            ->assertOk()
            ->assertSee('korting 10%.jpg')
            ->assertDontSee('korting 10 euro.jpg');
    }

    public function test_blank_search_returns_everything(): void
    {
        $user = User::factory()->create();
        File::factory()->for($user)->create(['name' => 'vakantiefoto.jpg']);

        $this->actingAs($user)
            ->get(route('all', ['search' => '  ']))
            ->assertOk()
            ->assertSee('vakantiefoto.jpg');
    }
}
