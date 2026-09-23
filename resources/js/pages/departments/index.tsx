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

                <div className="border-border/80 bg-card overflow-hidden rounded-lg border shadow-regal">
                    <div className="overflow-x-auto">
                        <table className="w-full min-w-[640px] text-start text-sm">
                            <thead className="bg-muted/50 border-b">
                                <tr className="text-muted-foreground">
                                    <th className="px-4 py-3">
                                        <SortHeader
                                            label={t('common.name')}
                                            column="name"
                                            filters={filters}
                                            indexUrl={indexUrl}
                                        />
                                    </th>
                                    <th className="px-4 py-3">
                                        <SortHeader
                                            label={t('common.created')}
                                            column="created_at"
                                            filters={filters}
                                            indexUrl={indexUrl}
                                        />
                                    </th>
                                    <th className="px-4 py-3">
                                        <SortHeader
                                            label={t('common.updated')}
                                            column="updated_at"
                                            filters={filters}
                                            indexUrl={indexUrl}
                                        />
                                    </th>
                                    <th className="px-4 py-3 text-end font-medium">
                                        {t('common.actions')}
                                    </th>
                                </tr>
                            </thead>
                            <tbody>
                                {departments.data.length === 0 ? (
                                    <tr>
                                        <td
                                            colSpan={4}
                                            className="text-muted-foreground px-4 py-10 text-center"
                                        >
                                            {t('departments.noResults')}
                                        </td>
                                    </tr>
                                ) : (
                                    departments.data.map((department) => (
                                        <tr
                                            key={department.id}
                                            className="border-b last:border-0"
                                        >
                                            <td className="px-4 py-3 font-medium">
                                                {department.name}
                                            </td>
                                            <td className="px-4 py-3">
                                                {department.created_at ?? '—'}
                                            </td>
                                            <td className="px-4 py-3">
                                                {department.updated_at ?? '—'}
                                            </td>
                                            <td className="px-4 py-3">
                                                <div className="flex items-center justify-end gap-1">
                                                    {can(
                                                        'department.view',
                                                    ) && (
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
                                                                    {t(
                                                                        'common.view',
                                                                    )}
                                                                </span>
                                                            </Link>
                                                        </Button>
                                                    )}
                                                    {can(
                                                        'department.update',
                                                    ) && (
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
                                                                    {t(
                                                                        'common.edit',
                                                                    )}
                                                                </span>
                                                            </Link>
                                                        </Button>
                                                    )}
                                                    {can(
                                                        'department.delete',
                                                    ) && (
                                                        <Form
                                                            {...DepartmentController.destroy.form(
                                                                department.id,
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
                                                                            'departments.deleteConfirm',
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
                                                                        {t(
                                                                            'common.delete',
                                                                        )}
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
