<?php

use App\Http\Controllers\ActiveDirectoryUserController;
use Illuminate\Support\Facades\Route;

Route::inertia('/', 'welcome')->name('home');

Route::middleware(['auth', 'verified'])->group(function () {
    Route::inertia('dashboard', 'dashboard')->name('dashboard');

    Route::resource('ad-users', ActiveDirectoryUserController::class)
        ->except(['show'])
        ->parameters(['ad-users' => 'activeDirectoryUser']);
});

require __DIR__.'/settings.php';
