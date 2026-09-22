<?php

use App\Http\Controllers\ActiveDirectoryUserController;
use App\Http\Controllers\ItSupportController;
use App\Http\Controllers\QuickCreateController;
use App\Http\Controllers\ServerController;
use App\Http\Controllers\ServerModelController;
use App\Http\Controllers\ServerServiceController;
use App\Http\Controllers\UserController;
use Illuminate\Support\Facades\Route;

Route::inertia('/', 'welcome')->name('home');

Route::middleware(['auth', 'verified'])->group(function () {
    Route::inertia('dashboard', 'dashboard')->name('dashboard');

    Route::resource('users', UserController::class);

    Route::resource('ad-users', ActiveDirectoryUserController::class)
        ->parameters(['ad-users' => 'activeDirectoryUser']);

    Route::resource('servers', ServerController::class);

    Route::resource('server-models', ServerModelController::class)
        ->parameters(['server-models' => 'serverModel']);

    Route::resource('server-services', ServerServiceController::class)
        ->parameters(['server-services' => 'serverService']);

    Route::resource('it-support', ItSupportController::class)
        ->parameters(['it-support' => 'itSupport']);

    Route::prefix('quick-create')->name('quick-create.')->group(function () {
        Route::post('departments', [QuickCreateController::class, 'department'])
            ->name('departments');
        Route::post('server-models', [QuickCreateController::class, 'serverModel'])
            ->name('server-models');
        Route::post('server-services', [QuickCreateController::class, 'serverService'])
            ->name('server-services');
        Route::post('it-support', [QuickCreateController::class, 'itSupport'])
            ->name('it-support');
    });
});

require __DIR__.'/settings.php';
