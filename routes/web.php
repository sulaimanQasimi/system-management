<?php

use App\Http\Controllers\ActiveDirectoryUserController;
use App\Http\Controllers\ItSupportController;
use App\Http\Controllers\ServerModelController;
use App\Http\Controllers\ServerServiceController;
use Illuminate\Support\Facades\Route;

Route::inertia('/', 'welcome')->name('home');

Route::middleware(['auth', 'verified'])->group(function () {
    Route::inertia('dashboard', 'dashboard')->name('dashboard');

    Route::resource('ad-users', ActiveDirectoryUserController::class)
        ->except(['show'])
        ->parameters(['ad-users' => 'activeDirectoryUser']);

    Route::resource('server-models', ServerModelController::class)
        ->except(['show'])
        ->parameters(['server-models' => 'serverModel']);

    Route::resource('server-services', ServerServiceController::class)
        ->except(['show'])
        ->parameters(['server-services' => 'serverService']);

    Route::resource('it-support', ItSupportController::class)
        ->except(['show'])
        ->parameters(['it-support' => 'itSupport']);
});

require __DIR__.'/settings.php';
