<?php

namespace App\Http\Middleware;

use Closure;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\App;
use Illuminate\Support\Facades\View;
use Symfony\Component\HttpFoundation\Response;

class HandleLocale
{
    /**
     * Resolve locale from cookie, apply App locale, and share Blade attrs for SSR.
     *
     * @param  Closure(Request): (Response)  $next
     */
    public function handle(Request $request, Closure $next): Response
    {
        $locales = config('localization.locales', []);
        $cookieName = config('localization.cookie', 'locale');
        $fallback = config('localization.fallback', 'en');

        $locale = $request->cookie($cookieName, config('localization.default', $fallback));

        if (! is_string($locale) || ! array_key_exists($locale, $locales)) {
            $locale = $fallback;
        }

        App::setLocale($locale);

        $meta = $locales[$locale];

        View::share('locale', $locale);
        View::share('direction', $meta['dir'] ?? 'ltr');
        View::share('htmlLang', $meta['html_lang'] ?? $locale);

        return $next($request);
    }
}
