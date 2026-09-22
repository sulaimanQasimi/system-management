import { Head, Link } from '@inertiajs/react';
import {
    Cable,
    HardDrive,
    Headset,
    Network,
    Server,
    Users,
    UserRound,
    Wifi,
} from 'lucide-react';
import type { LucideIcon } from 'lucide-react';
import {
    DashboardCard,
    FocusTile,
    StatCard,
    type StatTone,
} from '@/components/dashboard';
import { PageHeader } from '@/components/layout/page-header';
import { Button } from '@/components/ui/button';
import { useCan } from '@/hooks/use-can';
import { dashboard } from '@/routes';
import { index as adUsers } from '@/routes/ad-users';
import { index as itSupport } from '@/routes/it-support';
import { index as servers } from '@/routes/servers';
import { index as users } from '@/routes/users';

type DashboardStat = {
    key: string;
    title: string;
    value: number;
    progress: number;
    tone: StatTone;
    hint?: string;
};

const focusAreas = [
    {
        title: 'Core infrastructure',
        description:
            'Switch fabric, routers, and backbone health for campus segments.',
        icon: Server,
    },
    {
        title: 'Access layer',
        description:
            'Wired and wireless endpoints, VLAN assignments, and port status.',
        icon: Wifi,
    },
    {
        title: 'Link capacity',
        description:
            'Uplink utilization, failover paths, and circuit monitoring.',
        icon: Cable,
    },
];

const statIcons: Record<string, LucideIcon> = {
    servers: HardDrive,
    ad_users: Users,
    portal_users: UserRound,
    it_support: Headset,
};

const statLinks: Record<string, string> = {
    servers: servers.url(),
    ad_users: adUsers.url(),
    portal_users: users.url(),
    it_support: itSupport.url(),
};

const statPermissions: Record<string, string> = {
    servers: 'server.view',
    ad_users: 'ad_user.view',
    portal_users: 'user.view',
    it_support: 'it_support.view',
};

function formatCount(value: number): string {
    return new Intl.NumberFormat().format(value);
}

export default function Dashboard({ stats }: { stats: DashboardStat[] }) {
    const { can } = useCan();

    return (
        <>
            <Head title="Dashboard" />
            <div className="flex h-full flex-1 flex-col gap-6 overflow-x-auto p-4 md:p-6">
                <PageHeader
                    title="Network operations"
                    description="Overview for the Network Section Department."
                    icon={Network}
                />

                <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-4">
                    {stats.map((stat) => {
                        const Icon = statIcons[stat.key];
                        const href = statLinks[stat.key];
                        const permission = statPermissions[stat.key];
                        const canView = !permission || can(permission);

                        return (
                            <StatCard
                                key={stat.key}
                                title={stat.title}
                                value={formatCount(stat.value)}
                                progress={stat.progress}
                                tone={stat.tone}
                                icon={Icon}
                                hint={stat.hint}
                                menuItems={
                                    canView && href
                                        ? [
                                              {
                                                  label: 'View all',
                                                  href,
                                              },
                                          ]
                                        : undefined
                                }
                            />
                        );
                    })}
                </div>

                <DashboardCard
                    title="Focus areas"
                    description="Day-to-day coverage for section teams."
                    action={
                        can('server.view') ? (
                            <Button variant="outline" size="sm" asChild>
                                <Link href={servers()}>View servers</Link>
                            </Button>
                        ) : undefined
                    }
                >
                    <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
                        {focusAreas.map((area) => (
                            <FocusTile key={area.title} {...area} />
                        ))}
                    </div>
                </DashboardCard>
            </div>
        </>
    );
}

Dashboard.layout = {
    breadcrumbs: [
        {
            title: 'Dashboard',
            href: dashboard(),
        },
    ],
};
