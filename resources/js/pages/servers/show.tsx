import { Head, Link } from '@inertiajs/react';
import {
    Activity,
    HardDrive,
    Headset,
    KeyRound,
    Network,
    Pencil,
    ServerCog,
} from 'lucide-react';
import { DetailField, DetailSection } from '@/components/detail-fields';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { useCan } from '@/hooks/use-can';
import { edit, index } from '@/routes/servers';

type ServerShow = {
    id: number;
    site_name: string;
    name: string;
    ip_address: string;
    subnet_mask: string | null;
    default_gateway: string | null;
    description: string | null;
    is_vm: boolean;
    status: string;
    status_label: string;
    department: string | null;
    server_model: string | null;
    it_support: string | null;
    it_support_phone: string | null;
    idrac_ip_address: string | null;
    idrac_subnet_mask: string | null;
    idrac_default_gateway: string | null;
    username: string | null;
    has_password: boolean;
    services: string[];
    created_by: string | null;
    created_at: string | null;
    updated_at: string | null;
};

function statusVariant(status: string) {
    switch (status) {
        case 'active':
            return 'default' as const;
        case 'maintenance':
            return 'secondary' as const;
        case 'inactive':
            return 'outline' as const;
        case 'decommissioned':
            return 'destructive' as const;
        default:
            return 'outline' as const;
    }
}

export default function ServersShow({ server }: { server: ServerShow }) {
    const { can } = useCan();

    return (
        <>
            <Head title={server.name} />

            <div className="flex h-full flex-1 flex-col gap-6 p-4 md:p-6">
                <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
                    <div className="flex items-start gap-3">
                        <div className="bg-primary/10 text-primary flex size-11 items-center justify-center rounded-xl">
                            <HardDrive className="size-5" />
                        </div>
                        <div>
                            <div className="flex flex-wrap items-center gap-2">
                                <h1 className="text-xl font-semibold tracking-tight">
                                    {server.name}
                                </h1>
                                <Badge variant={statusVariant(server.status)}>
                                    {server.status_label}
                                </Badge>
                                {server.is_vm && (
                                    <Badge variant="secondary">VM</Badge>
                                )}
                            </div>
                            <p className="text-muted-foreground text-sm">
                                {server.site_name} · {server.ip_address}
                            </p>
                        </div>
                    </div>
                    <div className="flex flex-wrap gap-2">
                        <Button variant="outline" asChild>
                            <Link href={index()}>Back to servers</Link>
                        </Button>
                        {can('server.update') && (
                            <Button asChild>
                                <Link href={edit(server.id)}>
                                    <Pencil />
                                    Edit
                                </Link>
                            </Button>
                        )}
                    </div>
                </div>

                <div className="space-y-6">
                    <DetailSection
                        title="Identity"
                        description="Site, department, model, and status."
                        icon={<HardDrive className="size-5" />}
                    >
                        <DetailField label="Site" value={server.site_name} />
                        <DetailField label="Server name" value={server.name} />
                        <DetailField
                            label="Status"
                            value={
                                <Badge variant={statusVariant(server.status)}>
                                    {server.status_label}
                                </Badge>
                            }
                        />
                        <DetailField
                            label="Type"
                            value={server.is_vm ? 'Virtual machine' : 'Physical'}
                        />
                        <DetailField
                            label="Department"
                            value={server.department}
                        />
                        <DetailField
                            label="Server model"
                            value={server.server_model}
                        />
                        <DetailField
                            label="Created by"
                            value={server.created_by}
                        />
                        <DetailField
                            label="Created at"
                            value={server.created_at}
                        />
                        <DetailField
                            label="Updated at"
                            value={server.updated_at}
                        />
                    </DetailSection>

                    <DetailSection
                        title="Network"
                        description="Primary network addressing."
                        icon={<Network className="size-5" />}
                    >
                        <DetailField
                            label="IP address"
                            value={
                                <span className="font-mono text-xs">
                                    {server.ip_address}
                                </span>
                            }
                        />
                        <DetailField
                            label="Subnet mask"
                            value={
                                server.subnet_mask ? (
                                    <span className="font-mono text-xs">
                                        {server.subnet_mask}
                                    </span>
                                ) : null
                            }
                        />
                        <DetailField
                            label="Default gateway"
                            value={
                                server.default_gateway ? (
                                    <span className="font-mono text-xs">
                                        {server.default_gateway}
                                    </span>
                                ) : null
                            }
                        />
                    </DetailSection>

                    <DetailSection
                        title="Running services"
                        description="Services hosted on this server."
                        icon={<ServerCog className="size-5" />}
                    >
                        <DetailField
                            label="Services"
                            className="md:col-span-2 xl:col-span-3"
                            value={
                                server.services.length > 0 ? (
                                    <div className="flex flex-wrap gap-1">
                                        {server.services.map((service) => (
                                            <Badge
                                                key={service}
                                                variant="secondary"
                                            >
                                                {service}
                                            </Badge>
                                        ))}
                                    </div>
                                ) : null
                            }
                        />
                    </DetailSection>

                    {!server.is_vm && (
                        <>
                            <DetailSection
                                title="IT Support"
                                description="Assigned support contact."
                                icon={<Headset className="size-5" />}
                            >
                                <DetailField
                                    label="Contact"
                                    value={server.it_support}
                                />
                                <DetailField
                                    label="Phone / PBX"
                                    value={server.it_support_phone}
                                />
                            </DetailSection>

                            <DetailSection
                                title="iDRAC / Out-of-band"
                                description="Management network and credentials."
                                icon={<KeyRound className="size-5" />}
                            >
                                <DetailField
                                    label="iDRAC IP"
                                    value={
                                        server.idrac_ip_address ? (
                                            <span className="font-mono text-xs">
                                                {server.idrac_ip_address}
                                            </span>
                                        ) : null
                                    }
                                />
                                <DetailField
                                    label="Subnet mask"
                                    value={
                                        server.idrac_subnet_mask ? (
                                            <span className="font-mono text-xs">
                                                {server.idrac_subnet_mask}
                                            </span>
                                        ) : null
                                    }
                                />
                                <DetailField
                                    label="Default gateway"
                                    value={
                                        server.idrac_default_gateway ? (
                                            <span className="font-mono text-xs">
                                                {server.idrac_default_gateway}
                                            </span>
                                        ) : null
                                    }
                                />
                                <DetailField
                                    label="Username"
                                    value={server.username}
                                />
                                <DetailField
                                    label="Password"
                                    value={
                                        server.has_password
                                            ? '••••••••'
                                            : null
                                    }
                                />
                            </DetailSection>
                        </>
                    )}

                    <DetailSection
                        title="Description"
                        description="Role, dependencies, and maintenance notes."
                        icon={<Activity className="size-5" />}
                    >
                        <DetailField
                            label="Notes"
                            className="md:col-span-2 xl:col-span-3"
                            value={
                                server.description ? (
                                    <p className="whitespace-pre-wrap font-normal">
                                        {server.description}
                                    </p>
                                ) : null
                            }
                        />
                    </DetailSection>
                </div>
            </div>
        </>
    );
}

ServersShow.layout = {
    breadcrumbs: [
        {
            title: 'Servers',
            href: index(),
        },
        {
            title: 'Details',
            href: '#',
        },
    ],
};
