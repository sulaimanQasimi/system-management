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
        ->has('stats', 6)
        ->where('stats.0.key', 'servers')
        ->where('stats.1.key', 'virtual_machines')
        ->where('stats.2.key', 'physical_servers')
        ->where('stats.3.key', 'ad_users')
        ->where('stats.4.key', 'portal_users')
        ->where('stats.5.key', 'it_support')
        ->has('serversByService')
    );
});
