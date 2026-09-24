<?php

use App\Models\User;

test('sqlmap user agent is blocked without creating a session', function () {
    $response = $this->withHeaders([
        'User-Agent' => 'sqlmap/1.10.9#pip (https://sqlmap.org)',
    ])->get('/');

    $response->assertForbidden();
});

test('suspicious sql probe in query string is blocked', function () {
    $response = $this->get('/login?id=1+union+select+null--');

    $response->assertForbidden();
});

test('normal browsers can reach the login page', function () {
    $response = $this->withHeaders([
        'User-Agent' => 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36',
    ])->get(route('login'));

    $response->assertOk();
});

test('health endpoint remains reachable', function () {
    $response = $this->withHeaders([
        'User-Agent' => 'sqlmap/1.10.9',
    ])->get('/up');

    $response->assertOk();
});

test('authenticated users are not blocked for normal browsing', function () {
    $user = User::factory()->create();

    $response = $this->actingAs($user)
        ->withHeaders([
            'User-Agent' => 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36',
        ])
        ->get(route('dashboard'));

    $response->assertOk();
});
