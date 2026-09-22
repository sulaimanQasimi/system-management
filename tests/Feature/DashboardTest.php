<?php

use App\Models\User;

test('guests are redirected to the login page', function () {
    $response = $this->get(route('dashboard'));
    $response->assertRedirect(route('login'));
});

test('authenticated users can visit the dashboard', function () {
    $user = User::factory()->create();
    $this->actingAs($user);

    $response = $this->get(route('dashboard'));
    $response->assertOk();
    $response->assertInertia(fn ($page) => $page
        ->component('dashboard')
        ->has('stats', 4)
        ->where('stats.0.key', 'servers')
        ->where('stats.1.key', 'ad_users')
        ->where('stats.2.key', 'portal_users')
        ->where('stats.3.key', 'it_support')
    );
});
