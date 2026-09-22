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
                    'title' => 'Servers',
                    'value' => $serversTotal,
                    'progress' => $this->percent($serversActive, $serversTotal),
                    'tone' => 'primary',
                    'hint' => $serversActive.' active',
                ],
                [
                    'key' => 'virtual_machines',
                    'title' => 'Virtual machines',
                    'value' => $serversVm,
                    'progress' => $this->percent($serversVm, $serversTotal),
                    'tone' => 'info',
                    'hint' => $this->percent($serversVm, $serversTotal).'% of servers',
                ],
                [
                    'key' => 'physical_servers',
                    'title' => 'Physical servers',
                    'value' => $serversPhysical,
                    'progress' => $this->percent($serversPhysical, $serversTotal),
                    'tone' => 'secondary',
                    'hint' => $this->percent($serversPhysical, $serversTotal).'% of servers',
                ],
                [
                    'key' => 'ad_users',
                    'title' => 'AD Users',
                    'value' => $adUsersTotal,
                    'progress' => $this->percent($adUsersWithPhone, $adUsersTotal),
                    'tone' => 'info',
                    'hint' => $adUsersWithPhone.' with phone',
                ],
                [
                    'key' => 'portal_users',
                    'title' => 'Portal Users',
                    'value' => $portalUsersTotal,
                    'progress' => $this->percent($portalUsersVerified, $portalUsersTotal),
                    'tone' => 'success',
                    'hint' => $portalUsersVerified.' verified',
                ],
                [
                    'key' => 'it_support',
                    'title' => 'IT Support',
                    'value' => $itSupportTotal,
                    'progress' => $this->percent($itSupportWithPbx, $itSupportTotal),
                    'tone' => 'warning',
                    'hint' => $itSupportWithPbx.' with PBX',
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
