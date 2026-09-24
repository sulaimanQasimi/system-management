<?php

return [

    /*
    |--------------------------------------------------------------------------
    | Blocked User-Agent fragments
    |--------------------------------------------------------------------------
    |
    | Requests whose User-Agent contains any of these (case-insensitive)
    | substrings are rejected with 403 before a session is started.
    |
    */

    'blocked_user_agents' => [
        'sqlmap',
        'nikto',
        'nmap',
        'masscan',
        'zgrab',
        'dirbuster',
        'gobuster',
        'wpscan',
        'acunetix',
        'nessus',
        'openvas',
        'havij',
        'burpsuite',
        'sql-injector',
        'pangolin',
        'jsql',
    ],

    /*
    |--------------------------------------------------------------------------
    | Block empty User-Agent
    |--------------------------------------------------------------------------
    */

    'block_empty_user_agent' => env('SECURITY_BLOCK_EMPTY_UA', true),

    /*
    |--------------------------------------------------------------------------
    | Paths excluded from scanner / payload checks
    |--------------------------------------------------------------------------
    */

    'except' => [
        'up',
    ],

    /*
    |--------------------------------------------------------------------------
    | Suspicious query-string signatures (sqlmap-style probes)
    |--------------------------------------------------------------------------
    |
    | Only the URL query string is inspected (not POST bodies) to avoid
    | blocking legitimate form content.
    |
    */

    'blocked_payload_signatures' => [
        'sleep(',
        'benchmark(',
        'information_schema',
        'union select',
        'union all select',
        'or 1=1',
        'or \'1\'=\'1',
        'and 1=1',
        '\'--',
        '";--',
        'xp_cmdshell',
        'load_file(',
        'into outfile',
        'into dumpfile',
        'pg_sleep(',
        'waitfor delay',
        'extractvalue(',
        'updatexml(',
    ],

    /*
    |--------------------------------------------------------------------------
    | Rate limits (requests per minute, keyed by IP)
    |--------------------------------------------------------------------------
    */

    'rate_limits' => [
        'web' => (int) env('SECURITY_WEB_RATE_LIMIT', 90),
        'web_authenticated' => (int) env('SECURITY_WEB_AUTH_RATE_LIMIT', 180),
        'login' => (int) env('SECURITY_LOGIN_RATE_LIMIT', 5),
    ],

];
