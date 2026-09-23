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
import { useTranslations } from '@/hooks/use-locale';
import { statusLabel } from '@/lib/status-label';
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
    const { t } = useTranslations();
    const translatedStatus = statusLabel(
        t,
        server.status,
        server.status_label,
    );

    return (
        <>
            <Head title={server.name} />

            <div className="flex h-full flex-1 flex-col gap-6 p-4 md:p-6">
                <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
                    <div className="flex items-start gap-3">
                        <div className="bg-primary-light text-primary flex size-11 items-center justify-center rounded-lg">
                            <HardDrive className="size-5" />
                        </div>
                        <div>
                            <div className="flex flex-wrap items-center gap-2">
                                <h1 className="text-xl font-semibold tracking-tight">
                                    {server.name}
                                </h1>
                                <Badge variant={statusVariant(server.status)}>
                                    {translatedStatus}
                                </Badge>
                                {server.is_vm && (
                                    <Badge variant="secondary">
                                        {t('common.vm')}
                                    </Badge>
                                )}
                            </div>
                            <p className="text-muted-foreground text-sm">
                                {server.site_name} · {server.ip_address}
                            </p>
                        </div>
                    </div>
                    <div className="flex flex-wrap gap-2">
                        <Button variant="outline" asChild>
                            <Link href={index()}>{t('servers.backToServers')}</Link>
                        </Button>
                        {can('server.update') && (
                            <Button asChild>
                                <Link href={edit(server.id)}>
                                    <Pencil />
                                    {t('common.edit')}
                                </Link>
                            </Button>
                        )}
                    </div>
                </div>

                <div className="space-y-6">
                    <DetailSection
                        title={t('servers.sectionIdentity')}
                        description={t('servers.sectionIdentityDesc')}
                        icon={<HardDrive className="size-5" />}
                    >
                        <DetailField label={t('common.site')} value={server.site_name} />
                        <DetailField
                            label={t('servers.serverName')}
                            value={server.name}
                        />
                        <DetailField
                            label={t('common.status')}
                            value={
                                <Badge variant={statusVariant(server.status)}>
                                    {translatedStatus}
                                </Badge>
                            }
                        />
                        <DetailField
                            label={t('common.type')}
                            value={
                                server.is_vm
                                    ? t('common.virtualMachine')
                                    : t('common.physical')
                            }
                        />
                        <DetailField
                            label={t('common.department')}
                            value={server.department}
                        />
                        <DetailField
                            label={t('servers.serverModel')}
                            value={server.server_model}
                        />
                        <DetailField
                            label={t('common.createdBy')}
                            value={server.created_by}
                        />
                        <DetailField
                            label={t('common.createdAt')}
                            value={server.created_at}
                        />
                        <DetailField
                            label={t('common.updatedAt')}
                            value={server.updated_at}
                        />
                    </DetailSection>

                    <DetailSection
                        title={t('servers.sectionNetwork')}
                        description={t('servers.sectionNetworkDesc')}
                        icon={<Network className="size-5" />}
                    >
                        <DetailField
                            label={t('servers.serverIpAddress')}
                            value={
                                <span className="font-mono text-xs">
                                    {server.ip_address}
                                </span>
                            }
                        />
                        <DetailField
                            label={t('servers.subnetMask')}
                            value={
                                server.subnet_mask ? (
                                    <span className="font-mono text-xs">
                                        {server.subnet_mask}
                                    </span>
                                ) : null
                            }
                        />
                        <DetailField
                            label={t('servers.defaultGateway')}
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
                        title={t('servers.sectionRunningServices')}
                        description={t('servers.sectionRunningServicesDesc')}
                        icon={<ServerCog className="size-5" />}
                    >
                        <DetailField
                            label={t('common.services')}
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
                                title={t('servers.sectionItSupport')}
                                description={t('servers.sectionItSupportDesc')}
                                icon={<Headset className="size-5" />}
                            >
                                <DetailField
                                    label={t('common.contact')}
                                    value={server.it_support}
                                />
                                <DetailField
                                    label={t('servers.phonePbx')}
                                    value={server.it_support_phone}
                                />
                            </DetailSection>

                            <DetailSection
                                title={t('servers.sectionIdrac')}
                                description={t('servers.sectionIdracDesc')}
                                icon={<KeyRound className="size-5" />}
                            >
                                <DetailField
                                    label={t('servers.idracIpAddress')}
                                    value={
                                        server.idrac_ip_address ? (
                                            <span className="font-mono text-xs">
                                                {server.idrac_ip_address}
                                            </span>
                                        ) : null
                                    }
                                />
                                <DetailField
                                    label={t('servers.subnetMask')}
                                    value={
                                        server.idrac_subnet_mask ? (
                                            <span className="font-mono text-xs">
                                                {server.idrac_subnet_mask}
                                            </span>
                                        ) : null
                                    }
                                />
                                <DetailField
                                    label={t('servers.defaultGateway')}
                                    value={
                                        server.idrac_default_gateway ? (
                                            <span className="font-mono text-xs">
                                                {server.idrac_default_gateway}
                                            </span>
                                        ) : null
                                    }
                                />
                                <DetailField
                                    label={t('common.username')}
                                    value={server.username}
                                />
                                <DetailField
                                    label={t('common.password')}
                                    value={
                                        server.has_password
                                            ? t('common.passwordMasked')
                                            : null
                                    }
                                />
                            </DetailSection>
                        </>
                    )}

                    <DetailSection
                        title={t('servers.sectionDescription')}
                        description={t('servers.sectionDescriptionDesc')}
                        icon={<Activity className="size-5" />}
                    >
                        <DetailField
                            label={t('common.notes')}
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
            title: 'servers.title',
            href: index(),
        },
        {
            title: 'servers.breadcrumbDetails',
            href: '#',
        },
    ],
};
