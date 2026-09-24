<?php

namespace App\Providers;

use App\Models\User;
use App\Support\AppPermissions;
use Carbon\CarbonImmutable;
use Illuminate\Cache\RateLimiting\Limit;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Date;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Gate;
use Illuminate\Support\Facades\RateLimiter;
use Illuminate\Support\ServiceProvider;
use Illuminate\Validation\Rules\Password;

class AppServiceProvider extends ServiceProvider
{
    /**
     * Register any application services.
     */
    public function register(): void
    {
        //
    }

    /**
     * Bootstrap any application services.
     */
    public function boot(): void
    {
        $this->configureDefaults();
        $this->configureRateLimiting();

        Gate::before(function ($user, string $ability): ?bool {
            if (! $user instanceof User) {
                return null;
            }

            return $user->hasRole(AppPermissions::ROLE_SUPER_ADMIN) ? true : null;
        });
    }

    /**
     * Configure default behaviors for production-ready applications.
     */
    private function configureDefaults(): void
    {
        Date::use(CarbonImmutable::class);

        DB::prohibitDestructiveCommands(
            app()->isProduction(),
        );

        Password::defaults(fn (): ?Password => app()->isProduction()
            ? Password::min(8)
                ->mixedCase()
                ->letters()
                ->numbers()
                ->symbols()
                ->uncompromised()
            : null,
        );
    }

    /**
     * Global HTTP rate limiters used by the web middleware stack.
     */
    private function configureRateLimiting(): void
    {
        RateLimiter::for('web', function (Request $request) {
            $limit = $request->user()
                ? (int) config('security.rate_limits.web_authenticated', 180)
                : (int) config('security.rate_limits.web', 90);

            return Limit::perMinute(max(1, $limit))->by($request->ip());
        });
    }
}
