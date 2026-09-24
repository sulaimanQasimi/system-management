import { Form, Head, Link } from '@inertiajs/react';
import { Eye, Pencil, Plus, ServerCog, Trash2 } from 'lucide-react';
import ServerServiceController from '@/actions/App/Http/Controllers/ServerServiceController';
import {
    ResourceFilters,
    ResourcePagination,
    ResultSummary,
    SortHeader,
    type ListFilters,
    type Paginated,
} from '@/components/resource-list';
import { PageHeader } from '@/components/layout/page-header';
import { Button } from '@/components/ui/button';
import {
    DataTable,
    DataTableActions,
    DataTableBody,
    DataTableCell,
    DataTableEmpty,
    DataTableHead,
    DataTableHeader,
    DataTableHeaderRow,
    DataTableRow,
} from '@/components/ui/data-table';
import { useCan } from '@/hooks/use-can';
import { useTranslations } from '@/hooks/use-locale';
import { create, edit, index, show } from '@/routes/server-services';

type ServerServiceRow = {
    id: number;
    name: string;
    created_at: string | null;
    updated_at: string | null;
};

export default function ServerServicesIndex({
    services,
    filters,
    perPageOptions,
}: {
    services: Paginated<ServerServiceRow>;
    filters: ListFilters;
    perPageOptions: number[];
}) {
    const indexUrl = index.url();
    const { can } = useCan();
    const { t } = useTranslations();

    return (
        <>
            <Head title={t('serverServices.title')} />

            <div className="flex h-full flex-1 flex-col gap-6 p-4 md:p-6">
                <PageHeader
                    title={t('serverServices.title')}
                    description={t('serverServices.description')}
                    icon={ServerCog}
                    action={
                        can('server_service.create') ? (
                            <Button asChild>
                                <Link href={create()}>
                                    <Plus />
                                    {t('serverServices.addService')}
                                </Link>
                            </Button>
                        ) : undefined
                    }
                />

                <ResourceFilters
                    indexUrl={indexUrl}
                    filters={filters}
                    perPageOptions={perPageOptions}
                    searchPlaceholder={t('serverServices.searchPlaceholder')}
                />

                <ResultSummary
                    from={services.from}
                    to={services.to}
                    total={services.total}
                />

                <DataTable minWidth={640}>
                    <DataTableHeader>
                        <DataTableHeaderRow>
                            <DataTableHead>
                                <SortHeader
                                    label={t('common.name')}
                                    column="name"
                                    filters={filters}
                                    indexUrl={indexUrl}
                                />
                            </DataTableHead>
                            <DataTableHead>
                                <SortHeader
                                    label={t('common.created')}
                                    column="created_at"
                                    filters={filters}
                                    indexUrl={indexUrl}
                                />
                            </DataTableHead>
                            <DataTableHead>
                                <SortHeader
                                    label={t('common.updated')}
                                    column="updated_at"
                                    filters={filters}
                                    indexUrl={indexUrl}
                                />
                            </DataTableHead>
                            <DataTableHead align="end">
                                {t('common.actions')}
                            </DataTableHead>
                        </DataTableHeaderRow>
                    </DataTableHeader>
                    <DataTableBody>
                        {services.data.length === 0 ? (
                            <DataTableEmpty colSpan={4}>
                                {t('serverServices.noResults')}
                            </DataTableEmpty>
                        ) : (
                            services.data.map((service) => (
                                <DataTableRow key={service.id}>
                                    <DataTableCell className="font-medium">
                                        {service.name}
                                    </DataTableCell>
                                    <DataTableCell>
                                        {service.created_at ?? '—'}
                                    </DataTableCell>
                                    <DataTableCell>
                                        {service.updated_at ?? '—'}
                                    </DataTableCell>
                                    <DataTableCell>
                                        <DataTableActions>
                                            {can('server_service.view') && (
                                                <Button
                                                    variant="ghost"
                                                    size="icon"
                                                    asChild
                                                >
                                                    <Link
                                                        href={show(service.id)}
                                                    >
                                                        <Eye />
                                                        <span className="sr-only">
                                                            {t('common.view')}
                                                        </span>
                                                    </Link>
                                                </Button>
                                            )}
                                            {can('server_service.update') && (
                                                <Button
                                                    variant="ghost"
                                                    size="icon"
                                                    asChild
                                                >
                                                    <Link
                                                        href={edit(service.id)}
                                                    >
                                                        <Pencil />
                                                        <span className="sr-only">
                                                            {t('common.edit')}
                                                        </span>
                                                    </Link>
                                                </Button>
                                            )}
                                            {can('server_service.delete') && (
                                                <Form
                                                    {...ServerServiceController.destroy.form(
                                                        service.id,
                                                    )}
                                                    options={{
                                                        preserveScroll: true,
                                                    }}
                                                    onSubmit={(event) => {
                                                        if (
                                                            !confirm(
                                                                t(
                                                                    'serverServices.deleteConfirm',
                                                                ),
                                                            )
                                                        ) {
                                                            event.preventDefault();
                                                        }
                                                    }}
                                                >
                                                    {({ processing }) => (
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
                                                                {t(
                                                                    'common.delete',
                                                                )}
                                                            </span>
                                                        </Button>
                                                    )}
                                                </Form>
                                            )}
                                        </DataTableActions>
                                    </DataTableCell>
                                </DataTableRow>
                            ))
                        )}
                    </DataTableBody>
                </DataTable>

                <ResourcePagination links={services.links} />
            </div>
        </>
    );
}

ServerServicesIndex.layout = {
    breadcrumbs: [
        {
            title: 'serverServices.title',
            href: index(),
        },
    ],
};
