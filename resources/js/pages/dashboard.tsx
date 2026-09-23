import { Head, Link } from '@inertiajs/react';
import {
    Box,
    HardDrive,
    Headset,
    Network,
    Server,
    ServerCog,
    Users,
    UserRound,
} from 'lucide-react';
import type { LucideIcon } from 'lucide-react';
import { StatCard, type StatTone } from '@/components/dashboard';
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

const serviceTones: StatTone[] = [
    'primary',
    'info',
    'secondary',
    'success',
    'warning',
];

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
    const serversTotal =
        stats.find((stat) => stat.key === 'servers')?.value ?? 0;

    const formatCount = (value: number): string =>
        new Intl.NumberFormat(locale === 'fa' ? 'fa-AF' : 'en').format(value);

    const serviceProgress = (count: number): number => {
        if (serversTotal <= 0) {
            return 0;
        }

        return Math.min(100, Math.round((count / serversTotal) * 100));
    };

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

                <section className="space-y-4">
                    <div className="flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
                        <div>
                            <h2 className="text-base font-semibold tracking-tight">
                                {t('dashboard.serversByService')}
                            </h2>
                            <p className="text-muted-foreground text-sm">
                                {t('dashboard.serversByServiceDesc')}
                            </p>
                        </div>
                        {can('server_service.view') && (
                            <Button variant="outline" size="sm" asChild>
                                <Link href={serverServices()}>
                                    {t('dashboard.manageServices')}
                                </Link>
                            </Button>
                        )}
                    </div>

                    {serversByService.length === 0 ? (
                        <p className="text-muted-foreground border-border bg-card/40 rounded-2xl border px-5 py-10 text-center text-sm">
                            {t('dashboard.noServices')}
                        </p>
                    ) : (
                        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-3">
                            {serversByService.map((service, index) => (
                                <StatCard
                                    key={service.id}
                                    title={service.name}
                                    value={formatCount(service.servers_count)}
                                    progress={serviceProgress(
                                        service.servers_count,
                                    )}
                                    tone={
                                        serviceTones[
                                            index % serviceTones.length
                                        ]
                                    }
                                    icon={ServerCog}
                                    hint={t('dashboard.hintPercentOfServers', {
                                        percent: formatCount(
                                            serviceProgress(
                                                service.servers_count,
                                            ),
                                        ),
                                    })}
                                    menuItems={
                                        can('server.view')
                                            ? [
                                                  {
                                                      label: t(
                                                          'dashboard.viewAll',
                                                      ),
                                                      href: servers.url({
                                                          query: {
                                                              service_id:
                                                                  service.id,
                                                          },
                                                      }),
                                                  },
                                              ]
                                            : undefined
                                    }
                                />
                            ))}
                        </div>
                    )}
                </section>
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
