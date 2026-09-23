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

                <div className="border-border/80 bg-card overflow-hidden rounded-lg border shadow-regal">
                    <div className="overflow-x-auto">
                        <table className="w-full min-w-[720px] text-start text-sm">
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
                                    <th className="px-4 py-3 font-medium">
                                        {t('roles.users')}
                                    </th>
                                    <th className="px-4 py-3 font-medium">
                                        {t('roles.permissions')}
                                    </th>
                                    <th className="px-4 py-3">
                                        <SortHeader
                                            label={t('common.created')}
                                            column="created_at"
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
                                {roles.data.length === 0 ? (
                                    <tr>
                                        <td
                                            colSpan={5}
                                            className="text-muted-foreground px-4 py-10 text-center"
                                        >
                                            {t('roles.noResults')}
                                        </td>
                                    </tr>
                                ) : (
                                    roles.data.map((role) => (
                                        <tr
                                            key={role.id}
                                            className="border-b last:border-0"
                                        >
                                            <td className="px-4 py-3 font-medium">
                                                <div className="flex flex-wrap items-center gap-2">
                                                    {role.name}
                                                    {role.is_protected && (
                                                        <Badge variant="secondary">
                                                            {t(
                                                                'roles.protected',
                                                            )}
                                                        </Badge>
                                                    )}
                                                </div>
                                            </td>
                                            <td className="px-4 py-3">
                                                {role.users_count}
                                            </td>
                                            <td className="px-4 py-3">
                                                {role.permissions_count}
                                            </td>
                                            <td className="px-4 py-3">
                                                {role.created_at ?? '—'}
                                            </td>
                                            <td className="px-4 py-3">
                                                <div className="flex items-center justify-end gap-1">
                                                    {can('role.view') && (
                                                        <Button
                                                            variant="ghost"
                                                            size="icon"
                                                            asChild
                                                        >
                                                            <Link
                                                                href={show(
                                                                    role.id,
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
                                                    {can('role.update') && (
                                                        <Button
                                                            variant="ghost"
                                                            size="icon"
                                                            asChild
                                                        >
                                                            <Link
                                                                href={edit(
                                                                    role.id,
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
                                                    {can('role.delete') &&
                                                        !role.is_protected && (
                                                            <Form
                                                                {...RoleController.destroy.form(
                                                                    role.id,
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
                                                                                'roles.deleteConfirm',
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
