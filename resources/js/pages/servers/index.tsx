import { Form, Head, Link } from '@inertiajs/react';
import { Eye, HardDrive, Pencil, Plus, Trash2 } from 'lucide-react';
import { useEffect, useState } from 'react';
import ServerController from '@/actions/App/Http/Controllers/ServerController';
import {
    applyListFilters,
    ResourceFilters,
    ResourcePagination,
    ResultSummary,
    SortHeader,
    type ListFilters,
    type Paginated,
} from '@/components/resource-list';
import { PageHeader } from '@/components/layout/page-header';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { useCan } from '@/hooks/use-can';
import { useTranslations } from '@/hooks/use-locale';
import { statusLabel } from '@/lib/status-label';
import { create, edit, index, show } from '@/routes/servers';

type Option = { id: number; name: string };
type StatusOption = { value: string; label: string };

type ServerRow = {
    id: number;
    site_name: string;
    name: string;
    ip_address: string;
    status: string;
    status_label: string;
    is_vm: boolean;
    department: string | null;
    server_model: string | null;
    it_support: string | null;
    it_support_phone: string | null;
    services: string[];
    created_by: string | null;
    created_at: string | null;
};

type ServerFilters = ListFilters & {
    status: string;
    department_id: string;
    server_model_id: string;
    service_id: string;
    site_name: string;
};

function statusVariant(status: string) {
    switch (status) {
        case 'active':
            return 'success' as const;
        case 'maintenance':
            return 'warning' as const;
        case 'inactive':
            return 'outline' as const;
        case 'decommissioned':
            return 'destructive' as const;
        default:
            return 'outline' as const;
    }
}

export default function ServersIndex({
    servers,
    filters,
    perPageOptions,
    statusOptions,
    departments,
    serverModels,
    services,
}: {
    servers: Paginated<ServerRow>;
    filters: ServerFilters;
    perPageOptions: number[];
    statusOptions: StatusOption[];
    departments: Option[];
    serverModels: Option[];
    services: Option[];
}) {
    const indexUrl = index.url();
    const { can } = useCan();
    const { t } = useTranslations();
    const [siteName, setSiteName] = useState(filters.site_name);
    const [status, setStatus] = useState(filters.status);
    const [departmentId, setDepartmentId] = useState(filters.department_id);
    const [serverModelId, setServerModelId] = useState(filters.server_model_id);
    const [serviceId, setServiceId] = useState(filters.service_id);

    useEffect(() => {
        setSiteName(filters.site_name);
        setStatus(filters.status);
        setDepartmentId(filters.department_id);
        setServerModelId(filters.server_model_id);
        setServiceId(filters.service_id);
    }, [filters]);

    return (
        <>
            <Head title={t('servers.title')} />

            <div className="flex h-full flex-1 flex-col gap-6 p-4 md:p-6">
                <PageHeader
                    title={t('servers.title')}
                    description={t('servers.description')}
                    icon={HardDrive}
                    action={
                        can('server.create') ? (
                            <Button asChild>
                                <Link href={create()}>
                                    <Plus />
                                    {t('servers.addServer')}
                                </Link>
                            </Button>
                        ) : undefined
                    }
                />

                <ResourceFilters
                    indexUrl={indexUrl}
                    filters={filters}
                    perPageOptions={perPageOptions}
                    searchPlaceholder={t('servers.searchPlaceholder')}
                    extraFields={
                        <>
                            <div className="grid gap-2">
                                <Label htmlFor="site_name">{t('common.site')}</Label>
                                <Input
                                    id="site_name"
                                    value={siteName}
                                    onChange={(event) =>
                                        setSiteName(event.target.value)
                                    }
                                    onBlur={() =>
                                        applyListFilters(
                                            indexUrl,
                                            { site_name: siteName },
                                            filters,
                                        )
                                    }
                                    onKeyDown={(event) => {
                                        if (event.key === 'Enter') {
                                            applyListFilters(
                                                indexUrl,
                                                { site_name: siteName },
                                                filters,
                                            );
                                        }
                                    }}
                                    placeholder={t('servers.filterBySite')}
                                />
                            </div>
                            <div className="grid gap-2">
                                <Label htmlFor="status">{t('common.status')}</Label>
                                <select
                                    id="status"
                                    value={status}
                                    onChange={(event) => {
                                        const value = event.target.value;
                                        setStatus(value);
                                        applyListFilters(
                                            indexUrl,
                                            { status: value },
                                            filters,
                                        );
                                    }}
                                    className="border-input bg-background h-9 rounded-md border px-2 text-sm shadow-xs"
                                >
                                    <option value="">
                                        {t('servers.allStatuses')}
                                    </option>
                                    {statusOptions.map((option) => (
                                        <option
                                            key={option.value}
                                            value={option.value}
                                        >
                                            {statusLabel(
                                                t,
                                                option.value,
                                                option.label,
                                            )}
                                        </option>
                                    ))}
                                </select>
                            </div>
                            <div className="grid gap-2">
                                <Label htmlFor="department_id">
                                    {t('common.department')}
                                </Label>
                                <select
                                    id="department_id"
                                    value={departmentId}
                                    onChange={(event) => {
                                        const value = event.target.value;
                                        setDepartmentId(value);
                                        applyListFilters(
                                            indexUrl,
                                            { department_id: value },
                                            filters,
                                        );
                                    }}
                                    className="border-input bg-background h-9 rounded-md border px-2 text-sm shadow-xs"
                                >
                                    <option value="">
                                        {t('servers.allDepartments')}
                                    </option>
                                    {departments.map((department) => (
                                        <option
                                            key={department.id}
                                            value={department.id}
                                        >
                                            {department.name}
                                        </option>
                                    ))}
                                </select>
                            </div>
                            <div className="grid gap-2">
                                <Label htmlFor="server_model_id">
                                    {t('servers.serverModel')}
                                </Label>
                                <select
                                    id="server_model_id"
                                    value={serverModelId}
                                    onChange={(event) => {
                                        const value = event.target.value;
                                        setServerModelId(value);
                                        applyListFilters(
                                            indexUrl,
                                            { server_model_id: value },
                                            filters,
                                        );
                                    }}
                                    className="border-input bg-background h-9 rounded-md border px-2 text-sm shadow-xs"
                                >
                                    <option value="">
                                        {t('servers.allModels')}
                                    </option>
                                    {serverModels.map((model) => (
                                        <option key={model.id} value={model.id}>
                                            {model.name}
                                        </option>
                                    ))}
                                </select>
                            </div>
                            <div className="grid gap-2">
                                <Label htmlFor="service_id">
                                    {t('common.services')}
                                </Label>
                                <select
                                    id="service_id"
                                    value={serviceId}
                                    onChange={(event) => {
                                        const value = event.target.value;
                                        setServiceId(value);
                                        applyListFilters(
                                            indexUrl,
                                            { service_id: value },
                                            filters,
                                        );
                                    }}
                                    className="border-input bg-background h-9 rounded-md border px-2 text-sm shadow-xs"
                                >
                                    <option value="">
                                        {t('servers.allServices')}
                                    </option>
                                    {services.map((service) => (
                                        <option
                                            key={service.id}
                                            value={service.id}
                                        >
                                            {service.name}
                                        </option>
                                    ))}
                                </select>
                            </div>
                        </>
                    }
                />

                <ResultSummary
                    from={servers.from}
                    to={servers.to}
                    total={servers.total}
                />

                <div className="border-border/80 bg-card overflow-hidden rounded-lg border shadow-regal">
                    <div className="overflow-x-auto">
                        <table className="w-full min-w-[1200px] text-start text-sm">
                            <thead className="bg-muted/50 border-b">
                                <tr className="text-muted-foreground">
                                    <th className="px-4 py-3">
                                        <SortHeader
                                            label={t('common.site')}
                                            column="site_name"
                                            filters={filters}
                                            indexUrl={indexUrl}
                                        />
                                    </th>
                                    <th className="px-4 py-3">
                                        <SortHeader
                                            label={t('common.server')}
                                            column="name"
                                            filters={filters}
                                            indexUrl={indexUrl}
                                        />
                                    </th>
                                    <th className="px-4 py-3">{t('common.model')}</th>
                                    <th className="px-4 py-3">
                                        <SortHeader
                                            label={t('common.ip')}
                                            column="ip_address"
                                            filters={filters}
                                            indexUrl={indexUrl}
                                        />
                                    </th>
                                    <th className="px-4 py-3">{t('common.services')}</th>
                                    <th className="px-4 py-3">{t('common.department')}</th>
                                    <th className="px-4 py-3">{t('servers.itSupport')}</th>
                                    <th className="px-4 py-3">
                                        <SortHeader
                                            label={t('common.status')}
                                            column="status"
                                            filters={filters}
                                            indexUrl={indexUrl}
                                        />
                                    </th>
                                    <th className="px-4 py-3">{t('common.createdBy')}</th>
                                    <th className="px-4 py-3 text-end font-medium">
                                        {t('common.actions')}
                                    </th>
                                </tr>
                            </thead>
                            <tbody>
                                {servers.data.length === 0 ? (
                                    <tr>
                                        <td
                                            colSpan={10}
                                            className="text-muted-foreground px-4 py-10 text-center"
                                        >
                                            {t('servers.noResults')}
                                        </td>
                                    </tr>
                                ) : (
                                    servers.data.map((server) => (
                                        <tr
                                            key={server.id}
                                            className="border-b last:border-0"
                                        >
                                            <td className="px-4 py-3">
                                                {server.site_name}
                                            </td>
                                            <td className="px-4 py-3 font-medium">
                                                <div className="flex flex-wrap items-center gap-2">
                                                    <Link
                                                        href={show(server.id)}
                                                        className="hover:text-primary hover:underline"
                                                    >
                                                        {server.name}
                                                    </Link>
                                                    {server.is_vm && (
                                                        <Badge variant="secondary">
                                                            {t('common.vm')}
                                                        </Badge>
                                                    )}
                                                </div>
                                            </td>
                                            <td className="px-4 py-3">
                                                {server.server_model ?? '—'}
                                            </td>
                                            <td className="px-4 py-3 font-mono text-xs">
                                                {server.ip_address}
                                            </td>
                                            <td className="px-4 py-3">
                                                <div className="flex max-w-[220px] flex-wrap gap-1">
                                                    {server.services.length ===
                                                    0 ? (
                                                        <span className="text-muted-foreground">
                                                            —
                                                        </span>
                                                    ) : (
                                                        server.services.map(
                                                            (service) => (
                                                                <Badge
                                                                    key={
                                                                        service
                                                                    }
                                                                    variant="secondary"
                                                                >
                                                                    {service}
                                                                </Badge>
                                                            ),
                                                        )
                                                    )}
                                                </div>
                                            </td>
                                            <td className="px-4 py-3">
                                                {server.department ?? '—'}
                                            </td>
                                            <td className="px-4 py-3">
                                                {server.is_vm ? (
                                                    <span className="text-muted-foreground">
                                                        —
                                                    </span>
                                                ) : (
                                                    <>
                                                        <div>
                                                            {server.it_support ??
                                                                '—'}
                                                        </div>
                                                        {server.it_support_phone && (
                                                            <div className="text-muted-foreground text-xs">
                                                                {
                                                                    server.it_support_phone
                                                                }
                                                            </div>
                                                        )}
                                                    </>
                                                )}
                                            </td>
                                            <td className="px-4 py-3">
                                                <Badge
                                                    variant={statusVariant(
                                                        server.status,
                                                    )}
                                                >
                                                    {statusLabel(
                                                        t,
                                                        server.status,
                                                        server.status_label,
                                                    )}
                                                </Badge>
                                            </td>
                                            <td className="px-4 py-3">
                                                {server.created_by ?? '—'}
                                            </td>
                                            <td className="px-4 py-3">
                                                <div className="flex items-center justify-end gap-1">
                                                    {can('server.view') && (
                                                        <Button
                                                            variant="ghost"
                                                            size="icon"
                                                            asChild
                                                        >
                                                            <Link
                                                                href={show(
                                                                    server.id,
                                                                )}
                                                            >
                                                                <Eye />
                                                                <span className="sr-only">
                                                                    {t('common.view')}
                                                                </span>
                                                            </Link>
                                                        </Button>
                                                    )}
                                                    {can('server.update') && (
                                                        <Button
                                                            variant="ghost"
                                                            size="icon"
                                                            asChild
                                                        >
                                                            <Link
                                                                href={edit(
                                                                    server.id,
                                                                )}
                                                            >
                                                                <Pencil />
                                                                <span className="sr-only">
                                                                    {t('common.edit')}
                                                                </span>
                                                            </Link>
                                                        </Button>
                                                    )}
                                                    {can('server.delete') && (
                                                        <Form
                                                            {...ServerController.destroy.form(
                                                                server.id,
                                                            )}
                                                            options={{
                                                                preserveScroll: true,
                                                            }}
                                                            onSubmit={(
                                                                event,
                                                            ) => {
                                                                if (
                                                                    !confirm(
                                                                        t(
                                                                            'servers.deleteConfirm',
                                                                        ),
                                                                    )
                                                                ) {
                                                                    event.preventDefault();
                                                                }
                                                            }}
                                                        >
                                                            {({
                                                                processing,
                                                            }) => (
                                                                <Button
                                                                    type="submit"
                                                                    variant="ghost"
                                                                    size="icon"
                                                                    disabled={
                                                                        processing
                                                                    }
                                                                    className="text-destructive hover:text-destructive"
                                                                >
                                                                    <Trash2 />
                                                                    <span className="sr-only">
                                                                    {t('common.delete')}
                                                                </span>
                                                                </Button>
                                                            )}
                                                        </Form>
                                                    )}
                                                </div>
                                            </td>
                                        </tr>
                                    ))
                                )}
                            </tbody>
                        </table>
                    </div>
                </div>

                <ResourcePagination links={servers.links} />
            </div>
        </>
    );
}

ServersIndex.layout = {
    breadcrumbs: [
        {
            title: 'servers.title',
            href: index(),
        },
    ],
};
