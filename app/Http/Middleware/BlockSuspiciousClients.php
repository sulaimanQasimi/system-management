<?php

namespace App\Http\Middleware;

use Closure;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Log;
use Symfony\Component\HttpFoundation\Response;

class BlockSuspiciousClients
{
    /**
     * Reject known scanners and obvious SQLi probe payloads before a session starts.
     *
     * @param  Closure(Request): Response  $next
     */
    public function handle(Request $request, Closure $next): Response
    {
        if ($this->shouldSkip($request)) {
            return $next($request);
        }

        $userAgent = (string) $request->userAgent();

        if ($this->hasBlockedUserAgent($userAgent)) {
            return $this->deny($request, 'blocked_user_agent', $userAgent);
        }

        if ($this->hasSuspiciousPayload($request)) {
            return $this->deny($request, 'suspicious_payload', $userAgent);
        }

        return $next($request);
    }

    private function shouldSkip(Request $request): bool
    {
        foreach (config('security.except', []) as $path) {
            if ($request->is($path)) {
                return true;
            }
        }

        return false;
    }

    private function hasBlockedUserAgent(string $userAgent): bool
    {
        if (
            $userAgent === ''
            && config('security.block_empty_user_agent', true)
            && ! app()->runningUnitTests()
        ) {
            return true;
        }

        $needle = strtolower($userAgent);

        foreach (config('security.blocked_user_agents', []) as $fragment) {
            if ($fragment !== '' && str_contains($needle, strtolower((string) $fragment))) {
                return true;
            }
        }

        return false;
    }

    private function hasSuspiciousPayload(Request $request): bool
    {
        $haystack = strtolower(urldecode((string) $request->getQueryString()));

        if ($haystack === '') {
            return false;
        }

        foreach (config('security.blocked_payload_signatures', []) as $signature) {
            if ($signature !== '' && str_contains($haystack, strtolower((string) $signature))) {
                return true;
            }
        }

        return false;
    }

    private function deny(Request $request, string $reason, string $userAgent): Response
    {
        Log::warning('Blocked suspicious client', [
            'reason' => $reason,
            'ip' => $request->ip(),
            'method' => $request->method(),
            'path' => $request->path(),
            'user_agent' => mb_substr($userAgent, 0, 255),
        ]);

        return response('Forbidden', Response::HTTP_FORBIDDEN);
    }
}
