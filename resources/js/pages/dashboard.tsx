import { Head } from '@inertiajs/react';
import {
    Activity,
    Cable,
    HardDrive,
    Network,
    Server,
    ShieldCheck,
    Ticket,
    Users,
    Wifi,
} from 'lucide-react';
import {
    ActivityCard,
    ChartCard,
    ChartPlaceholder,
    DashboardCard,
    FocusTile,
    StatCard,
    type ActivityItem,
    type StatCardProps,
} from '@/components/dashboard';
import { PageHeader } from '@/components/layout/page-header';
import { Button } from '@/components/ui/button';
import { dashboard } from '@/routes';

/**
 * Dashboard metric definitions live here (not inside StatCard)
 * so the same card can be reused with different data sources later.
 */
const stats: StatCardProps[] = [
    {
        title: 'Active nodes',
        value: '128',
        icon: Network,
        trend: '+4.2%',
        trendType: 'positive',
        trendLabel: 'vs last month',
    },
    {
        title: 'Uptime',
        value: '99.97%',
        icon: Activity,
        trend: '0.0%',
        trendType: 'neutral',
        trendLabel: 'last 30 days',
    },
    {
        title: 'Open tickets',
        value: '6',
        icon: Ticket,
        trend: '-2',
        trendType: 'positive',
        trendLabel: '2 high priority',
    },
    {
        title: 'Directory users',
        value: '1,842',
        icon: Users,
        trend: '+18',
        trendType: 'positive',
        trendLabel: 'this quarter',
    },
];

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

const capacitySeries = [
    { label: 'Core uplink', value: '72%', percent: 72 },
    { label: 'Edge distribution', value: '54%', percent: 54 },
    { label: 'Wireless backhaul', value: '41%', percent: 41 },
    { label: 'Backup path', value: '18%', percent: 18 },
];

const recentActivity: ActivityItem[] = [
    {
        id: 1,
        title: 'Server health check completed',
        description: 'All monitored hosts responded within threshold.',
        timestamp: '12m ago',
        icon: HardDrive,
    },
    {
        id: 2,
        title: 'AD user provisioned',
        description: 'Account created for new department staff member.',
        timestamp: '1h ago',
        icon: Users,
    },
    {
        id: 3,
        title: 'Support ticket updated',
        description: 'Priority ticket #1042 moved to in progress.',
        timestamp: '3h ago',
        icon: ShieldCheck,
    },
];

export default function Dashboard() {
    return (
        <>
            <Head title="Dashboard" />
            <div className="flex h-full flex-1 flex-col gap-6 overflow-x-auto p-4 md:p-6">
                <PageHeader
                    title="Network operations"
                    description="Overview for the Network Section Department."
                    icon={Network}
                />

                {/* Responsive: 1 / 2 / 4 columns */}
                <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-4">
                    {stats.map((stat) => (
                        <StatCard key={stat.title} {...stat} />
                    ))}
                </div>

                <div className="grid grid-cols-1 gap-4 lg:grid-cols-5">
                    <ChartCard
                        className="lg:col-span-3"
                        title="Link utilization"
                        description="Approximate capacity across primary paths."
                        minHeight="14rem"
                    >
                        <div className="flex flex-col justify-center gap-5">
                            {capacitySeries.map((series) => (
                                <ChartPlaceholder
                                    key={series.label}
                                    {...series}
                                />
                            ))}
                        </div>
                    </ChartCard>

                    <ActivityCard
                        className="lg:col-span-2"
                        title="Recent activity"
                        description="Latest system events."
                        items={recentActivity}
                        action={
                            <Button variant="outline" size="sm" type="button">
                                View all
                            </Button>
                        }
                    />
                </div>

                <DashboardCard
                    title="Focus areas"
                    description="Day-to-day coverage for section teams."
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
