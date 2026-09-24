import { Form, Head, Link } from '@inertiajs/react';
import { Eye, Pencil, Plus, Server, Trash2 } from 'lucide-react';
import ServerModelController from '@/actions/App/Http/Controllers/ServerModelController';
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
import { create, edit, index, show } from '@/routes/server-models';

type ServerModelRow = {
    id: number;
    name: string;
    created_at: string | null;
    updated_at: string | null;
};

export default function ServerModelsIndex({
    models,
    filters,
    perPageOptions,
}: {
    models: Paginated<ServerModelRow>;
    filters: ListFilters;
    perPageOptions: number[];
}) {
    const indexUrl = index.url();
    const { can } = useCan();
    const { t } = useTranslations();

    return (
        <>
            <Head title={t('serverModels.title')} />

            <div className="flex h-full flex-1 flex-col gap-6 p-4 md:p-6">
                <PageHeader
                    title={t('serverModels.title')}
                    description={t('serverModels.description')}
                    icon={Server}
                    action={
                        can('server_model.create') ? (
                            <Button asChild>
                                <Link href={create()}>
                                    <Plus />
                                    {t('serverModels.addModel')}
                                </Link>
                            </Button>
                        ) : undefined
                    }
                />

                <ResourceFilters
                    indexUrl={indexUrl}
                    filters={filters}
                    perPageOptions={perPageOptions}
                    searchPlaceholder={t('serverModels.searchPlaceholder')}
                />

                <div className="flex items-center justify-between">
                    <ResultSummary
                        from={models.from}
                        to={models.to}
                        total={models.total}
                    />
                </div>

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
                        {models.data.length === 0 ? (
                            <DataTableEmpty colSpan={4}>
                                {t('serverModels.noResults')}
                            </DataTableEmpty>
                        ) : (
                            models.data.map((model) => (
                                <DataTableRow key={model.id}>
                                    <DataTableCell className="font-medium">
                                        {model.name}
                                    </DataTableCell>
                                    <DataTableCell>
                                        {model.created_at ?? '—'}
                                    </DataTableCell>
                                    <DataTableCell>
                                        {model.updated_at ?? '—'}
                                    </DataTableCell>
                                    <DataTableCell>
                                        <DataTableActions>
                                            {can('server_model.view') && (
                                                <Button
                                                    variant="ghost"
                                                    size="icon"
                                                    asChild
                                                >
                                                    <Link
                                                        href={show(model.id)}
                                                    >
                                                        <Eye />
                                                        <span className="sr-only">
                                                            {t('common.view')}
                                                        </span>
                                                    </Link>
                                                </Button>
                                            )}
                                            {can('server_model.update') && (
                                                <Button
                                                    variant="ghost"
                                                    size="icon"
                                                    asChild
                                                >
                                                    <Link
                                                        href={edit(model.id)}
                                                    >
                                                        <Pencil />
                                                        <span className="sr-only">
                                                            {t('common.edit')}
                                                        </span>
                                                    </Link>
                                                </Button>
                                            )}
                                            {can('server_model.delete') && (
                                                <Form
                                                    {...ServerModelController.destroy.form(
                                                        model.id,
                                                    )}
                                                    options={{
                                                        preserveScroll: true,
                                                    }}
                                                    onSubmit={(event) => {
                                                        if (
                                                            !confirm(
                                                                t(
                                                                    'serverModels.deleteConfirm',
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

                <ResourcePagination links={models.links} />
            </div>
        </>
    );
}

ServerModelsIndex.layout = {
    breadcrumbs: [
        {
            title: 'serverModels.title',
            href: index(),
        },
    ],
};
