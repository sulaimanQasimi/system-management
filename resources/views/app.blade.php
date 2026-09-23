<!DOCTYPE html>
<html
    lang="{{ $htmlLang ?? str_replace('_', '-', app()->getLocale()) }}"
    dir="{{ $direction ?? 'ltr' }}"
    data-locale="{{ $locale ?? app()->getLocale() }}"
    @class(['dark' => ($appearance ?? 'system') == 'dark'])
>
    <head>
        <meta charset="utf-8">
        <meta name="viewport" content="width=device-width, initial-scale=1">

        {{-- Apply appearance + locale before paint to avoid LTR/RTL flash --}}
        <script>
            (function() {
                const appearance = '{{ $appearance ?? "system" }}';
                const root = document.documentElement;

                if (appearance === 'system') {
                    const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;

                    if (prefersDark) {
                        root.classList.add('dark');
                    }
                }

                try {
                    var stored = localStorage.getItem('locale');
                    if (stored === 'en' || stored === 'fa') {
                        var map = {
                            en: { lang: 'en', dir: 'ltr' },
                            fa: { lang: 'fa-AF', dir: 'rtl' }
                        };
                        root.lang = map[stored].lang;
                        root.dir = map[stored].dir;
                        root.dataset.locale = stored;
                    }
                } catch (e) {}
            })();
        </script>

        {{-- Inline style to set the HTML background color based on our theme in app.css --}}
        <style>
            html {
                background-color: oklch(0.975 0.008 90);
            }

            html.dark {
                background-color: oklch(0.17 0.03 265);
            }
        </style>

        <link rel="icon" href="/favicon.ico" sizes="any">
        <link rel="icon" href="/favicon.svg" type="image/svg+xml">
        <link rel="apple-touch-icon" href="/apple-touch-icon.png">

        @fonts

        @viteReactRefresh
        @vite(['resources/css/app.css', 'resources/js/app.tsx', "resources/js/pages/{$page['component']}.tsx"])
        <x-inertia::head>
            <title>{{ config('app.name', 'Laravel') }}</title>
        </x-inertia::head>
    </head>
    <body class="font-sans antialiased">
        <x-inertia::app />
    </body>
</html>
