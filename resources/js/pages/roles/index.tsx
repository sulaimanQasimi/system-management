import { Form, Head, Link } from '@inertiajs/react';
import { Eye, Pencil, Plus, Shield, Trash2 } from 'lucide-react';
import RoleController from '@/actions/App/Http/Controllers/RoleController';
import {
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
import { create, edit, index, show } from '@/routes/roles';

type RoleRow = {
    id: number;
    name: string;
    users_count: number;
    permissions_count: number;
    is_protected: boolean;
    created_at: string | null;
    updated_at: string | null;
};

export default function RolesIndex({
    roles,
    filters,
    perPageOptions,
}: {
    roles: Paginated<RoleRow>;
    filters: ListFilters;
    perPageOptions: number[];
}) {
    const indexUrl = index.url();
    const { can } = useCan();
    const { t } = useTranslations();

    return (
        <>
            <Head title={t('roles.title')} />

            <div className="flex h-full flex-1 flex-col gap-6 p-4 md:p-6">
                <PageHeader
                    title={t('roles.title')}
                    description={t('roles.description')}
                    icon={Shield}
                    action={
                        can('role.create') ? (
                            <Button asChild>
                                <Link href={create()}>
                                    <Plus />
                                    {t('roles.addRole')}
                                </Link>
                            </Button>
                        ) : undefined
                    }
                />

                <ResourceFilters
                    indexUrl={indexUrl}
                    filters={filters}
                    perPageOptions={perPageOptions}
                    searchPlaceholder={t('roles.searchPlaceholder')}
                />

                <div className="flex items-center justify-between">
                    <ResultSummary
                        from={roles.from}
                        to={roles.to}
                        total={roles.total}
                    />
                </div>

                <DataTable minWidth={720}>
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
                            <DataTableHead>{t('roles.users')}</DataTableHead>
                            <DataTableHead>
                                {t('roles.permissions')}
                            </DataTableHead>
                            <DataTableHead>
                                <SortHeader
                                    label={t('common.created')}
                                    column="created_at"
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
                        {roles.data.length === 0 ? (
                            <DataTableEmpty colSpan={5}>
                                {t('roles.noResults')}
                            </DataTableEmpty>
                        ) : (
                            roles.data.map((role) => (
                                <DataTableRow key={role.id}>
                                    <DataTableCell className="font-medium">
                                        <div className="flex flex-wrap items-center gap-2">
                                            {role.name}
                                            {role.is_protected && (
                                                <Badge variant="secondary">
                                                    {t('roles.protected')}
                                                </Badge>
                                            )}
                                        </div>
                                    </DataTableCell>
                                    <DataTableCell>
                                        {role.users_count}
                                    </DataTableCell>
                                    <DataTableCell>
                                        {role.permissions_count}
                                    </DataTableCell>
                                    <DataTableCell>
                                        {role.created_at ?? '—'}
                                    </DataTableCell>
                                    <DataTableCell>
                                        <DataTableActions>
                                            {can('role.view') && (
                                                <Button
                                                    variant="ghost"
                                                    size="icon"
                                                    asChild
                                                >
                                                    <Link
                                                        href={show(role.id)}
                                                    >
                                                        <Eye />
                                                        <span className="sr-only">
                                                            {t('common.view')}
                                                        </span>
                                                    </Link>
                                                </Button>
                                            )}
                                            {can('role.update') && (
                                                <Button
                                                    variant="ghost"
                                                    size="icon"
                                                    asChild
                                                >
                                                    <Link
                                                        href={edit(role.id)}
                                                    >
                                                        <Pencil />
                                                        <span className="sr-only">
                                                            {t('common.edit')}
                                                        </span>
                                                    </Link>
                                                </Button>
                                            )}
                                            {can('role.delete') &&
                                                !role.is_protected && (
                                                    <Form
                                                        {...RoleController.destroy.form(
                                                            role.id,
                                                        )}
                                                        options={{
                                                            preserveScroll: true,
                                                        }}
                                                        onSubmit={(event) => {
                                                            if (
                                                                !confirm(
                                                                    t(
                                                                        'roles.deleteConfirm',
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

                <ResourcePagination links={roles.links} />
            </div>
        </>
    );
}

RolesIndex.layout = {
    breadcrumbs: [
        {
            title: 'roles.title',
            href: index(),
        },
    ],
};
