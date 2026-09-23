<?php

namespace App\Http\Controllers;

use App\Enums\ServerStatus;
use App\Models\ActiveDirectoryUser;
use App\Models\ItSupport;
use App\Models\Server;
use App\Models\ServerService;
use App\Models\User;
use Inertia\Inertia;
use Inertia\Response;

class DashboardController extends Controller
{
    public function __invoke(): Response
    {
        $serversTotal = Server::query()->count();
        $serversActive = Server::query()
            ->where('status', ServerStatus::Active)
            ->count();
        $serversVm = Server::query()->where('is_vm', true)->count();
        $serversPhysical = Server::query()->where('is_vm', false)->count();
        $adUsersTotal = ActiveDirectoryUser::query()->count();
        $adUsersWithPhone = ActiveDirectoryUser::query()
            ->whereNotNull('phone')
            ->where('phone', '!=', '')
            ->count();
        $portalUsersTotal = User::query()->count();
        $portalUsersVerified = User::query()
            ->whereNotNull('email_verified_at')
            ->count();
        $itSupportTotal = ItSupport::query()->count();
        $itSupportWithPbx = ItSupport::query()
            ->whereNotNull('pbx')
            ->where('pbx', '!=', '')
            ->count();

        $serversByService = ServerService::query()
            ->withCount('servers')
            ->orderByDesc('servers_count')
            ->orderBy('name')
            ->get(['id', 'name'])
            ->map(fn (ServerService $service): array => [
                'id' => $service->id,
                'name' => $service->name,
                'servers_count' => $service->servers_count,
            ])
            ->values()
            ->all();

        return Inertia::render('dashboard', [
            'stats' => [
                [
                    'key' => 'servers',
                    'value' => $serversTotal,
                    'progress' => $this->percent($serversActive, $serversTotal),
                    'tone' => 'primary',
                    'hint_count' => $serversActive,
                ],
                [
                    'key' => 'virtual_machines',
                    'value' => $serversVm,
                    'progress' => $this->percent($serversVm, $serversTotal),
                    'tone' => 'info',
                    'hint_count' => $this->percent($serversVm, $serversTotal),
                ],
                [
                    'key' => 'physical_servers',
                    'value' => $serversPhysical,
                    'progress' => $this->percent($serversPhysical, $serversTotal),
                    'tone' => 'secondary',
                    'hint_count' => $this->percent($serversPhysical, $serversTotal),
                ],
                [
                    'key' => 'ad_users',
                    'value' => $adUsersTotal,
                    'progress' => $this->percent($adUsersWithPhone, $adUsersTotal),
                    'tone' => 'info',
                    'hint_count' => $adUsersWithPhone,
                ],
                [
                    'key' => 'portal_users',
                    'value' => $portalUsersTotal,
                    'progress' => $this->percent($portalUsersVerified, $portalUsersTotal),
                    'tone' => 'success',
                    'hint_count' => $portalUsersVerified,
                ],
                [
                    'key' => 'it_support',
                    'value' => $itSupportTotal,
                    'progress' => $this->percent($itSupportWithPbx, $itSupportTotal),
                    'tone' => 'warning',
                    'hint_count' => $itSupportWithPbx,
                ],
            ],
            'serversByService' => $serversByService,
        ]);
    }

    private function percent(int $part, int $total): int
    {
        if ($total <= 0) {
            return 0;
        }

        return (int) round(($part / $total) * 100);
    }
}
