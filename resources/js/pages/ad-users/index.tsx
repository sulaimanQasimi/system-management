import { Form, Head, Link, router } from '@inertiajs/react';
import {
    ArrowDown,
    ArrowUp,
    ArrowUpDown,
    Plus,
    Eye,
    Pencil,
    Search,
    Trash2,
    Users,
    X,
} from 'lucide-react';
import { useEffect, useRef, useState } from 'react';
import ActiveDirectoryUserController from '@/actions/App/Http/Controllers/ActiveDirectoryUserController';
import { PageHeader } from '@/components/layout/page-header';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { useCan } from '@/hooks/use-can';
import { useTranslations } from '@/hooks/use-locale';
import { create, edit, index, show } from '@/routes/ad-users';

type AdUserRow = {
    id: number;
    name: string;
    lastname: string;
    username: string;
    email: string;
    department: string | null;
    job: string | null;
    pbx: string | null;
    phone: string | null;
    date: string | null;
    created_by: string | null;
    created_at: string | null;
};

type PaginatedUsers = {
    data: AdUserRow[];
    from: number | null;
    to: number | null;
    total: number;
    links: { url: string | null; label: string; active: boolean }[];
};

type Filters = {
    search: string;
    job: string;
    department_id: string;
    date_from: string;
    date_to: string;
    sort: string;
    direction: 'asc' | 'desc';
    per_page: number;
};

type SortKey =
    | 'name'
    | 'lastname'
    | 'username'
    | 'email'
    | 'job'
    | 'pbx'
    | 'phone'
    | 'date'
    | 'created_at';

function applyFilters(next: Partial<Filters>, current: Filters) {
    const params: Record<string, string | number> = {};
    const merged = { ...current, ...next };

    if (merged.search) {
        params.search = merged.search;
    }
    if (merged.job) {
        params.job = merged.job;
    }
    if (merged.department_id) {
        params.department_id = merged.department_id;
    }
    if (merged.date_from) {
        params.date_from = merged.date_from;
    }
    if (merged.date_to) {
        params.date_to = merged.date_to;
    }
    if (merged.sort && merged.sort !== 'created_at') {
        params.sort = merged.sort;
    }
    if (merged.direction && merged.direction !== 'desc') {
        params.direction = merged.direction;
    }
    if (merged.per_page && merged.per_page !== 15) {
        params.per_page = merged.per_page;
    }

    // Always send sort/direction together when sorting
    if (next.sort !== undefined || next.direction !== undefined) {
        params.sort = merged.sort;
        params.direction = merged.direction;
    }

    router.get(index.url(), params, {
        preserveState: true,
        preserveScroll: true,
        replace: true,
    });
}

function SortButton({
    label,
    column,
    filters,
}: {
    label: string;
    column: SortKey;
    filters: Filters;
}) {
    const active = filters.sort === column;
    const Icon = !active
        ? ArrowUpDown
        : filters.direction === 'asc'
          ? ArrowUp
          : ArrowDown;

    return (
        <button
            type="button"
            className="hover:text-foreground inline-flex items-center gap-1 font-medium"
            onClick={() =>
                applyFilters(
                    {
                        sort: column,
                        direction:
                            active && filters.direction === 'asc'
                                ? 'desc'
                                : 'asc',
                    },
                    filters,
                )
            }
        >
            {label}
            <Icon className="size-3.5 opacity-60" />
        </button>
    );
}

export default function AdUsersIndex({
    users,
    filters,
    perPageOptions,
    departments,
}: {
    users: PaginatedUsers;
    filters: Filters;
    perPageOptions: number[];
    departments: { id: number; name: string }[];
}) {
    const { can } = useCan();
    const { t } = useTranslations();
    const [search, setSearch] = useState(filters.search);
    const [job, setJob] = useState(filters.job);
    const [departmentId, setDepartmentId] = useState(filters.department_id);
    const [dateFrom, setDateFrom] = useState(filters.date_from);
    const [dateTo, setDateTo] = useState(filters.date_to);
    const searchTimeout = useRef<ReturnType<typeof setTimeout> | null>(null);

    useEffect(() => {
        setSearch(filters.search);
        setJob(filters.job);
        setDepartmentId(filters.department_id);
        setDateFrom(filters.date_from);
        setDateTo(filters.date_to);
    }, [filters]);

    useEffect(() => {
        return () => {
            if (searchTimeout.current) {
                clearTimeout(searchTimeout.current);
            }
        };
    }, []);

    const hasActiveFilters = Boolean(
        filters.search ||
            filters.job ||
            filters.department_id ||
            filters.date_from ||
            filters.date_to ||
            filters.sort !== 'created_at' ||
            filters.direction !== 'desc' ||
            filters.per_page !== 15,
    );

    const onSearchChange = (value: string) => {
        setSearch(value);
        if (searchTimeout.current) {
            clearTimeout(searchTimeout.current);
        }
        searchTimeout.current = setTimeout(() => {
            applyFilters({ search: value }, filters);
        }, 350);
    };

    return (
        <>
            <Head title={t('adUsers.title')} />

            <div className="flex h-full flex-1 flex-col gap-6 p-4 md:p-6">
                <PageHeader
                    title={t('adUsers.title')}
                    description={t('adUsers.description')}
                    icon={Users}
                    action={
                        can('ad_user.create') ? (
                            <Button asChild>
                                <Link href={create()}>
                                    <Plus />
                                    {t('adUsers.addUser')}
                                </Link>
                            </Button>
                        ) : undefined
                    }
                />

                <div className="border-border/80 bg-card rounded-lg border p-4 shadow-regal">
                    <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-6">
                        <div className="grid gap-2 xl:col-span-2">
                            <Label htmlFor="search">{t('common.search')}</Label>
                            <div className="relative">
                                <Search className="text-muted-foreground absolute top-1/2 start-3 size-4 -translate-y-1/2" />
                                <Input
                                    id="search"
                                    value={search}
                                    onChange={(event) =>
                                        onSearchChange(event.target.value)
                                    }
                                    placeholder={t('adUsers.searchPlaceholder')}
                                    className="ps-9"
                                />
                            </div>
                        </div>

                        <div className="grid gap-2">
                            <Label htmlFor="department_id">
                                {t('common.department')}
                            </Label>
                            <select
                                id="department_id"
                                className="border-input bg-background h-9 w-full rounded-md border px-3 text-sm shadow-xs"
                                value={departmentId}
                                onChange={(event) => {
                                    const value = event.target.value;
                                    setDepartmentId(value);
                                    applyFilters(
                                        { department_id: value },
                                        filters,
                                    );
                                }}
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
                            <Label htmlFor="job">{t('common.job')}</Label>
                            <Input
                                id="job"
                                value={job}
                                onChange={(event) => setJob(event.target.value)}
                                onBlur={() =>
                                    applyFilters({ job }, filters)
                                }
                                onKeyDown={(event) => {
                                    if (event.key === 'Enter') {
                                        applyFilters({ job }, filters);
                                    }
                                }}
                                placeholder={t('adUsers.filterByJob')}
                            />
                        </div>

                        <div className="grid gap-2">
                            <Label htmlFor="date_from">{t('common.dateFrom')}</Label>
                            <Input
                                id="date_from"
                                type="date"
                                value={dateFrom}
                                onChange={(event) => {
                                    const value = event.target.value;
                                    setDateFrom(value);
                                    applyFilters(
                                        { date_from: value },
                                        filters,
                                    );
                                }}
                            />
                        </div>

                        <div className="grid gap-2">
                            <Label htmlFor="date_to">{t('common.dateTo')}</Label>
                            <Input
                                id="date_to"
                                type="date"
                                value={dateTo}
                                onChange={(event) => {
                                    const value = event.target.value;
                                    setDateTo(value);
                                    applyFilters({ date_to: value }, filters);
                                }}
                            />
                        </div>
                    </div>

                    <div className="mt-4 flex flex-wrap items-center justify-between gap-3">
                        <p className="text-muted-foreground text-sm">
                            {t('common.showingRange', {
                                from: users.from ?? 0,
                                to: users.to ?? 0,
                                total: users.total,
                            })}
                        </p>

                        <div className="flex flex-wrap items-center gap-3">
                            <div className="flex items-center gap-2">
                                <Label
                                    htmlFor="per_page"
                                    className="text-muted-foreground whitespace-nowrap"
                                >
                                    {t('common.perPage')}
                                </Label>
                                <select
                                    id="per_page"
                                    className="border-input bg-background h-9 rounded-md border px-2 text-sm shadow-xs"
                                    value={filters.per_page}
                                    onChange={(event) =>
                                        applyFilters(
                                            {
                                                per_page: Number(
                                                    event.target.value,
                                                ),
                                            },
                                            filters,
                                        )
                                    }
                                >
                                    {perPageOptions.map((option) => (
                                        <option key={option} value={option}>
                                            {option}
                                        </option>
                                    ))}
                                </select>
                            </div>

                            {hasActiveFilters && (
                                <Button
                                    type="button"
                                    variant="outline"
                                    size="sm"
                                    onClick={() =>
                                        router.get(
                                            index.url(),
                                            {},
                                            {
                                                preserveState: true,
                                                preserveScroll: true,
                                                replace: true,
                                            },
                                        )
                                    }
                                >
                                    <X />
                                    {t('common.clearFilters')}
                                </Button>
                            )}
                        </div>
                    </div>
                </div>

                <div className="border-border/80 bg-card overflow-hidden rounded-lg border shadow-regal">
                    <div className="overflow-x-auto">
                        <table className="w-max min-w-full border-collapse text-start text-sm">
                            <thead className="bg-muted/50 border-b">
                                <tr className="text-muted-foreground">
                                    <th className="px-3 py-2.5 whitespace-nowrap">
                                        <SortButton
                                            label={t('common.name')}
                                            column="name"
                                            filters={filters}
                                        />
                                    </th>
                                    <th className="px-3 py-2.5 whitespace-nowrap">
                                        <SortButton
                                            label={t('common.lastName')}
                                            column="lastname"
                                            filters={filters}
                                        />
                                    </th>
                                    <th className="px-3 py-2.5 whitespace-nowrap">
                                        <SortButton
                                            label={t('common.username')}
                                            column="username"
                                            filters={filters}
                                        />
                                    </th>
                                    <th className="px-3 py-2.5 whitespace-nowrap">
                                        <SortButton
                                            label={t('common.email')}
                                            column="email"
                                            filters={filters}
                                        />
                                    </th>
                                    <th className="w-full px-3 py-2.5 font-medium whitespace-nowrap">
                                        {t('common.department')}
                                    </th>
                                    <th className="px-3 py-2.5 whitespace-nowrap">
                                        <SortButton
                                            label={t('common.job')}
                                            column="job"
                                            filters={filters}
                                        />
                                    </th>
                                    <th className="px-3 py-2.5 whitespace-nowrap">
                                        <SortButton
                                            label={t('common.pbx')}
                                            column="pbx"
                                            filters={filters}
                                        />
                                    </th>
                                    <th className="px-3 py-2.5 whitespace-nowrap">
                                        <SortButton
                                            label={t('common.phone')}
                                            column="phone"
                                            filters={filters}
                                        />
                                    </th>
                                    <th className="px-3 py-2.5 whitespace-nowrap">
                                        <SortButton
                                            label={t('common.date')}
                                            column="date"
                                            filters={filters}
                                        />
                                    </th>
                                    <th className="px-3 py-2.5 font-medium whitespace-nowrap">
                                        {t('common.createdBy')}
                                    </th>
                                    <th className="w-0 px-3 py-2.5 text-end font-medium whitespace-nowrap">
                                        {t('common.actions')}
                                    </th>
                                </tr>
                            </thead>
                            <tbody>
                                {users.data.length === 0 ? (
                                    <tr>
                                        <td
                                            colSpan={11}
                                            className="text-muted-foreground px-3 py-8 text-center"
                                        >
                                            {t('adUsers.noResults')}
                                        </td>
                                    </tr>
                                ) : (
                                    users.data.map((user) => (
                                        <tr
                                            key={user.id}
                                            className="border-b last:border-0"
                                        >
                                            <td className="px-3 py-2.5 font-medium whitespace-nowrap">
                                                {user.name}
                                            </td>
                                            <td className="px-3 py-2.5 whitespace-nowrap">
                                                {user.lastname}
                                            </td>
                                            <td className="px-3 py-2.5 whitespace-nowrap">
                                                {user.username}
                                            </td>
                                            <td className="max-w-[12rem] truncate px-3 py-2.5">
                                                {user.email}
                                            </td>
                                            <td className="w-full px-3 py-2.5 whitespace-nowrap">
                                                {user.department ?? '—'}
                                            </td>
                                            <td className="px-3 py-2.5 whitespace-nowrap">
                                                {user.job ?? '—'}
                                            </td>
                                            <td className="px-3 py-2.5 whitespace-nowrap">
                                                {user.pbx ?? '—'}
                                            </td>
                                            <td className="px-3 py-2.5 whitespace-nowrap">
                                                {user.phone ?? '—'}
                                            </td>
                                            <td className="px-3 py-2.5 whitespace-nowrap">
                                                {user.date ?? '—'}
                                            </td>
                                            <td className="px-3 py-2.5 whitespace-nowrap">
                                                {user.created_by ?? '—'}
                                            </td>
                                            <td className="w-0 px-3 py-2.5">
                                                <div className="flex items-center justify-end gap-1">
                                                    {can('ad_user.view') && (
                                                        <Button
                                                            variant="ghost"
                                                            size="icon"
                                                            asChild
                                                        >
                                                            <Link
                                                                href={show(
                                                                    user.id,
                                                                )}
                                                            >
                                                                <Eye />
                                                                <span className="sr-only">
                                                                    {t('common.view')}
                                                                </span>
                                                            </Link>
                                                        </Button>
                                                    )}
                                                    {can('ad_user.update') && (
                                                        <Button
                                                            variant="ghost"
                                                            size="icon"
                                                            asChild
                                                        >
                                                            <Link
                                                                href={edit(
                                                                    user.id,
                                                                )}
                                                            >
                                                                <Pencil />
                                                                <span className="sr-only">
                                                                    {t('common.edit')}
                                                                </span>
                                                            </Link>
                                                        </Button>
                                                    )}
                                                    {can('ad_user.delete') && (
                                                        <Form
                                                            {...ActiveDirectoryUserController.destroy.form(
                                                                user.id,
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
                                                                            'adUsers.deleteConfirm',
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

                {users.links.length > 3 && (
                    <div className="flex flex-wrap gap-2">
                        {users.links.map((link, i) =>
                            link.url ? (
                                <Button
                                    key={i}
                                    variant={
                                        link.active ? 'default' : 'outline'
                                    }
                                    size="sm"
                                    asChild
                                >
                                    <Link
                                        href={link.url}
                                        preserveState
                                        preserveScroll
                                        dangerouslySetInnerHTML={{
                                            __html: link.label,
                                        }}
                                    />
                                </Button>
                            ) : (
                                <Button
                                    key={i}
                                    variant="outline"
                                    size="sm"
                                    disabled
                                    dangerouslySetInnerHTML={{
                                        __html: link.label,
                                    }}
                                />
                            ),
                        )}
                    </div>
                )}
            </div>
        </>
    );
}

AdUsersIndex.layout = {
    breadcrumbs: [
        {
            title: 'adUsers.title',
            href: index(),
        },
    ],
};
