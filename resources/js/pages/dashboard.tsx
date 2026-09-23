import { Head, Link } from '@inertiajs/react';
import {
    Box,
    HardDrive,
    Headset,
    Network,
    Server,
    Users,
    UserRound,
} from 'lucide-react';
import type { LucideIcon } from 'lucide-react';
import {
    ChartCard,
    ChartPlaceholder,
    StatCard,
    type StatTone,
} from '@/components/dashboard';
import { PageHeader } from '@/components/layout/page-header';
import { Button } from '@/components/ui/button';
import { useCan } from '@/hooks/use-can';
import { useLocale } from '@/hooks/use-locale';
import type { TranslationKey } from '@/locales';
import { dashboard } from '@/routes';
import { index as adUsers } from '@/routes/ad-users';
import { index as itSupport } from '@/routes/it-support';
import { index as servers } from '@/routes/servers';
import { index as serverServices } from '@/routes/server-services';
import { index as users } from '@/routes/users';

type DashboardStat = {
    key: string;
    value: number;
    progress: number;
    tone: StatTone;
    hint_count?: number;
};

type ServersByService = {
    id: number;
    name: string;
    servers_count: number;
};

const statIcons: Record<string, LucideIcon> = {
    servers: HardDrive,
    virtual_machines: Box,
    physical_servers: Server,
    ad_users: Users,
    portal_users: UserRound,
    it_support: Headset,
};

const statTitleKeys: Record<string, TranslationKey> = {
    servers: 'dashboard.statServers',
    virtual_machines: 'dashboard.statVirtualMachines',
    physical_servers: 'dashboard.statPhysicalServers',
    ad_users: 'dashboard.statAdUsers',
    portal_users: 'dashboard.statPortalUsers',
    it_support: 'dashboard.statItSupport',
};

const statLinks: Record<string, string> = {
    servers: servers.url(),
    virtual_machines: servers.url(),
    physical_servers: servers.url(),
    ad_users: adUsers.url(),
    portal_users: users.url(),
    it_support: itSupport.url(),
};

const statPermissions: Record<string, string> = {
    servers: 'server.view',
    virtual_machines: 'server.view',
    physical_servers: 'server.view',
    ad_users: 'ad_user.view',
    portal_users: 'user.view',
    it_support: 'it_support.view',
};

export default function Dashboard({
    stats,
    serversByService,
}: {
    stats: DashboardStat[];
    serversByService: ServersByService[];
}) {
    const { can } = useCan();
    const { t, locale } = useLocale();
    const maxServiceCount = Math.max(
        0,
        ...serversByService.map((service) => service.servers_count),
    );

    const formatCount = (value: number): string =>
        new Intl.NumberFormat(locale === 'fa' ? 'fa-AF' : 'en').format(value);

    const resolveHint = (stat: DashboardStat): string | undefined => {
        if (stat.hint_count === undefined) {
            return undefined;
        }

        const count = formatCount(stat.hint_count);

        switch (stat.key) {
            case 'servers':
                return t('dashboard.hintActive', { count });
            case 'virtual_machines':
            case 'physical_servers':
                return t('dashboard.hintPercentOfServers', {
                    percent: count,
                });
            case 'ad_users':
                return t('dashboard.hintWithPhone', { count });
            case 'portal_users':
                return t('dashboard.hintVerified', { count });
            case 'it_support':
                return t('dashboard.hintWithPbx', { count });
            default:
                return undefined;
        }
    };

    return (
        <>
            <Head title={t('dashboard.title')} />
            <div className="flex h-full flex-1 flex-col gap-6 overflow-x-auto p-4 md:p-6">
                <PageHeader
                    title={t('dashboard.networkOperations')}
                    description={t('dashboard.description')}
                    icon={Network}
                />

                <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-3">
                    {stats.map((stat) => {
                        const Icon = statIcons[stat.key];
                        const href = statLinks[stat.key];
                        const permission = statPermissions[stat.key];
                        const canView = !permission || can(permission);
                        const titleKey = statTitleKeys[stat.key];

                        return (
                            <StatCard
                                key={stat.key}
                                title={titleKey ? t(titleKey) : stat.key}
                                value={formatCount(stat.value)}
                                progress={stat.progress}
                                tone={stat.tone}
                                icon={Icon}
                                hint={resolveHint(stat)}
                                menuItems={
                                    canView && href
                                        ? [
                                              {
                                                  label: t('dashboard.viewAll'),
                                                  href,
                                              },
                                          ]
                                        : undefined
                                }
                            />
                        );
                    })}
                </div>

                <ChartCard
                    title={t('dashboard.serversByService')}
                    description={t('dashboard.serversByServiceDesc')}
                    isEmpty={serversByService.length === 0}
                    emptyMessage={t('dashboard.noServices')}
                    minHeight="12rem"
                    action={
                        can('server_service.view') ? (
                            <Button variant="outline" size="sm" asChild>
                                <Link href={serverServices()}>
                                    {t('dashboard.manageServices')}
                                </Link>
                            </Button>
                        ) : undefined
                    }
                >
                    <div className="space-y-4">
                        {serversByService.map((service) => {
                            const percent =
                                maxServiceCount > 0
                                    ? Math.round(
                                          (service.servers_count /
                                              maxServiceCount) *
                                              100,
                                      )
                                    : 0;

                            return (
                                <Link
                                    key={service.id}
                                    href={servers.url({
                                        query: {
                                            service_id: service.id,
                                        },
                                    })}
                                    className="hover:opacity-80 block transition-opacity"
                                >
                                    <ChartPlaceholder
                                        label={service.name}
                                        value={formatCount(
                                            service.servers_count,
                                        )}
                                        percent={percent}
                                    />
                                </Link>
                            );
                        })}
                    </div>
                </ChartCard>
            </div>
        </>
    );
}

Dashboard.layout = {
    breadcrumbs: [
        {
            title: 'nav.dashboard',
            href: dashboard(),
        },
    ],
};
