import { Form, Head, Link } from '@inertiajs/react';
import { Building2, Eye, Pencil, Plus, Trash2 } from 'lucide-react';
import DepartmentController from '@/actions/App/Http/Controllers/DepartmentController';
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
import { create, edit, index, show } from '@/routes/departments';

type DepartmentRow = {
    id: number;
    name: string;
    created_at: string | null;
    updated_at: string | null;
};

export default function DepartmentsIndex({
    departments,
    filters,
    perPageOptions,
}: {
    departments: Paginated<DepartmentRow>;
    filters: ListFilters;
    perPageOptions: number[];
}) {
    const indexUrl = index.url();
    const { can } = useCan();
    const { t } = useTranslations();

    return (
        <>
            <Head title={t('departments.title')} />

            <div className="flex h-full flex-1 flex-col gap-6 p-4 md:p-6">
                <PageHeader
                    title={t('departments.title')}
                    description={t('departments.description')}
                    icon={Building2}
                    action={
                        can('department.create') ? (
                            <Button asChild>
                                <Link href={create()}>
                                    <Plus />
                                    {t('departments.addDepartment')}
                                </Link>
                            </Button>
                        ) : undefined
                    }
                />

                <ResourceFilters
                    indexUrl={indexUrl}
                    filters={filters}
                    perPageOptions={perPageOptions}
                    searchPlaceholder={t('departments.searchPlaceholder')}
                />

                <div className="flex items-center justify-between">
                    <ResultSummary
                        from={departments.from}
                        to={departments.to}
                        total={departments.total}
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
                        {departments.data.length === 0 ? (
                            <DataTableEmpty colSpan={4}>
                                {t('departments.noResults')}
                            </DataTableEmpty>
                        ) : (
                            departments.data.map((department) => (
                                <DataTableRow key={department.id}>
                                    <DataTableCell className="font-medium">
                                        {department.name}
                                    </DataTableCell>
                                    <DataTableCell>
                                        {department.created_at ?? '—'}
                                    </DataTableCell>
                                    <DataTableCell>
                                        {department.updated_at ?? '—'}
                                    </DataTableCell>
                                    <DataTableCell>
                                        <DataTableActions>
                                            {can('department.view') && (
                                                <Button
                                                    variant="ghost"
                                                    size="icon"
                                                    asChild
                                                >
                                                    <Link
                                                        href={show(
                                                            department.id,
                                                        )}
                                                    >
                                                        <Eye />
                                                        <span className="sr-only">
                                                            {t('common.view')}
                                                        </span>
                                                    </Link>
                                                </Button>
                                            )}
                                            {can('department.update') && (
                                                <Button
                                                    variant="ghost"
                                                    size="icon"
                                                    asChild
                                                >
                                                    <Link
                                                        href={edit(
                                                            department.id,
                                                        )}
                                                    >
                                                        <Pencil />
                                                        <span className="sr-only">
                                                            {t('common.edit')}
                                                        </span>
                                                    </Link>
                                                </Button>
                                            )}
                                            {can('department.delete') && (
                                                <Form
                                                    {...DepartmentController.destroy.form(
                                                        department.id,
                                                    )}
                                                    options={{
                                                        preserveScroll: true,
                                                    }}
                                                    onSubmit={(event) => {
                                                        if (
                                                            !confirm(
                                                                t(
                                                                    'departments.deleteConfirm',
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

                <ResourcePagination links={departments.links} />
            </div>
        </>
    );
}

DepartmentsIndex.layout = {
    breadcrumbs: [
        {
            title: 'departments.title',
            href: index(),
        },
    ],
};
