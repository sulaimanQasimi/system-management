import { Head, Link } from '@inertiajs/react';
import { HardDrive, Plus } from 'lucide-react';
import { useEffect, useState } from 'react';
import {
    applyListFilters,
    ResourceFilters,
    type ListFilters,
} from '@/components/resource-list';
import { PageHeader } from '@/components/layout/page-header';
import ServersDepartmentTree, {
    type DepartmentTreeNode,
} from '@/components/servers-department-tree';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { useCan } from '@/hooks/use-can';
import { useTranslations } from '@/hooks/use-locale';
import { statusLabel } from '@/lib/status-label';
import { create, index } from '@/routes/servers';

type Option = { id: number; name: string; label?: string };
type StatusOption = { value: string; label: string };

type ServerFilters = ListFilters & {
    status: string;
    department_id: string;
    server_model_id: string;
    service_id: string;
    site_name: string;
};

export default function ServersIndex({
    departmentTree = [],
    totalServers = 0,
    filters,
    perPageOptions,
    statusOptions,
    departments,
    serverModels,
    services,
}: {
    departmentTree?: DepartmentTreeNode[];
    totalServers?: number;
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
                                <Label htmlFor="site_name">
                                    {t('common.site')}
                                </Label>
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
                                <Label htmlFor="status">
                                    {t('common.status')}
                                </Label>
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
                                            {department.label ??
                                                department.name}
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

                <p className="text-muted-foreground text-sm">
                    {t('servers.treeSummary', { count: totalServers })}
                </p>

                <ServersDepartmentTree tree={departmentTree} />
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
