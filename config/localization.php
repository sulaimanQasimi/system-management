<?php

return [

    /*
    |--------------------------------------------------------------------------
    | Default & fallback locale
    |--------------------------------------------------------------------------
    */

    'default' => env('APP_LOCALE', 'en'),

    'fallback' => env('APP_FALLBACK_LOCALE', 'en'),

    /*
    |--------------------------------------------------------------------------
    | Supported locales
    |--------------------------------------------------------------------------
    |
    | html_lang uses BCP 47 (fa-AF = Dari in Afghanistan).
    | dir drives document direction for RTL/LTR layout.
    |
    */

    'locales' => [
        'en' => [
            'code' => 'en',
            'name' => 'English',
            'native' => 'English',
            'dir' => 'ltr',
            'html_lang' => 'en',
        ],
        'fa' => [
            'code' => 'fa',
            'name' => 'Dari',
            'native' => 'دری',
            'dir' => 'rtl',
            'html_lang' => 'fa-AF',
        ],
    ],

    /*
    |--------------------------------------------------------------------------
    | Cookie
    |--------------------------------------------------------------------------
    */

    'cookie' => 'locale',

];
