import { Head } from '@inertiajs/react';
import {
    Activity,
    Cable,
    Network,
    Server,
    ShieldCheck,
    Wifi,
} from 'lucide-react';
import { dashboard } from '@/routes';

const stats = [
    {
        label: 'Active nodes',
        value: '128',
        hint: 'Across core & edge',
        icon: Network,
    },
    {
        label: 'Uptime',
        value: '99.97%',
        hint: 'Last 30 days',
        icon: Activity,
    },
    {
        label: 'Open tickets',
        value: '6',
        hint: '2 high priority',
        icon: ShieldCheck,
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

export default function Dashboard() {
    return (
        <>
            <Head title="Dashboard" />
            <div className="flex h-full flex-1 flex-col gap-6 overflow-x-auto p-4 md:p-6">
                <div>
                    <h1 className="text-2xl font-semibold tracking-tight">
                        Network operations
                    </h1>
                    <p className="text-muted-foreground mt-1 text-sm">
                        Overview for the Network Section Department.
                    </p>
                </div>

                <div className="grid gap-4 md:grid-cols-3">
                    {stats.map((stat) => (
                        <div
                            key={stat.label}
                            className="border-border/80 bg-card relative overflow-hidden rounded-xl border p-5"
                        >
                            <div className="flex items-start justify-between gap-3">
                                <div>
                                    <p className="text-muted-foreground text-sm">
                                        {stat.label}
                                    </p>
                                    <p className="mt-2 text-3xl font-semibold tracking-tight">
                                        {stat.value}
                                    </p>
                                    <p className="text-muted-foreground mt-1 text-xs">
                                        {stat.hint}
                                    </p>
                                </div>
                                <div className="bg-primary/10 text-primary flex size-10 items-center justify-center rounded-lg">
                                    <stat.icon className="size-5" />
                                </div>
                            </div>
                        </div>
                    ))}
                </div>

                <div className="border-border/80 bg-card rounded-xl border p-5 md:p-6">
                    <div className="mb-5 flex items-end justify-between gap-4">
                        <div>
                            <h2 className="text-lg font-semibold tracking-tight">
                                Focus areas
                            </h2>
                            <p className="text-muted-foreground mt-1 text-sm">
                                Day-to-day coverage for section teams.
                            </p>
                        </div>
                    </div>
                    <div className="grid gap-4 md:grid-cols-3">
                        {focusAreas.map((area) => (
                            <div
                                key={area.title}
                                className="bg-muted/40 rounded-lg p-4"
                            >
                                <div className="bg-primary/10 text-primary mb-3 flex size-9 items-center justify-center rounded-md">
                                    <area.icon className="size-4" />
                                </div>
                                <h3 className="font-medium">{area.title}</h3>
                                <p className="text-muted-foreground mt-1.5 text-sm leading-relaxed">
                                    {area.description}
                                </p>
                            </div>
                        ))}
                    </div>
                </div>
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
