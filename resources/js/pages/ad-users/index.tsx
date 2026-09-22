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
import { create, edit, index, show } from '@/routes/ad-users';

type AdUserRow = {
    id: number;
    name: string;
    lastname: string;
    username: string;
    email: string;
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
}: {
    users: PaginatedUsers;
    filters: Filters;
    perPageOptions: number[];
}) {
    const { can } = useCan();
    const [search, setSearch] = useState(filters.search);
    const [job, setJob] = useState(filters.job);
    const [dateFrom, setDateFrom] = useState(filters.date_from);
    const [dateTo, setDateTo] = useState(filters.date_to);
    const searchTimeout = useRef<ReturnType<typeof setTimeout> | null>(null);

    useEffect(() => {
        setSearch(filters.search);
        setJob(filters.job);
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
            <Head title="Active Directory Users" />

            <div className="flex h-full flex-1 flex-col gap-6 p-4 md:p-6">
                <PageHeader
                    title="Active Directory Users"
                    description="Manage directory accounts for the Network Section."
                    icon={Users}
                    action={
                        can('ad_user.create') ? (
                            <Button asChild>
                                <Link href={create()}>
                                    <Plus />
                                    Add user
                                </Link>
                            </Button>
                        ) : undefined
                    }
                />

                <div className="border-border/80 bg-card rounded-lg border p-4 shadow-regal">
                    <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-5">
                        <div className="grid gap-2 xl:col-span-2">
                            <Label htmlFor="search">Search</Label>
                            <div className="relative">
                                <Search className="text-muted-foreground absolute top-1/2 left-3 size-4 -translate-y-1/2" />
                                <Input
                                    id="search"
                                    value={search}
                                    onChange={(event) =>
                                        onSearchChange(event.target.value)
                                    }
                                    placeholder="Name, username, email, phone…"
                                    className="pl-9"
                                />
                            </div>
                        </div>

                        <div className="grid gap-2">
                            <Label htmlFor="job">Job</Label>
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
                                placeholder="Filter by job"
                            />
                        </div>

                        <div className="grid gap-2">
                            <Label htmlFor="date_from">Date from</Label>
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
                            <Label htmlFor="date_to">Date to</Label>
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
                            Showing {users.from ?? 0}–{users.to ?? 0} of{' '}
                            {users.total}
                        </p>

                        <div className="flex flex-wrap items-center gap-3">
                            <div className="flex items-center gap-2">
                                <Label
                                    htmlFor="per_page"
                                    className="text-muted-foreground whitespace-nowrap"
                                >
                                    Per page
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
                                    Clear filters
                                </Button>
                            )}
                        </div>
                    </div>
                </div>

                <div className="border-border/80 bg-card overflow-hidden rounded-lg border shadow-regal">
                    <div className="overflow-x-auto">
                        <table className="w-full min-w-[1100px] text-left text-sm">
                            <thead className="bg-muted/50 border-b">
                                <tr className="text-muted-foreground">
                                    <th className="px-4 py-3">
                                        <SortButton
                                            label="Name"
                                            column="name"
                                            filters={filters}
                                        />
                                    </th>
                                    <th className="px-4 py-3">
                                        <SortButton
                                            label="Username"
                                            column="username"
                                            filters={filters}
                                        />
                                    </th>
                                    <th className="px-4 py-3">
                                        <SortButton
                                            label="Email"
                                            column="email"
                                            filters={filters}
                                        />
                                    </th>
                                    <th className="px-4 py-3">
                                        <SortButton
                                            label="Job"
                                            column="job"
                                            filters={filters}
                                        />
                                    </th>
                                    <th className="px-4 py-3">
                                        <SortButton
                                            label="PBX"
                                            column="pbx"
                                            filters={filters}
                                        />
                                    </th>
                                    <th className="px-4 py-3">
                                        <SortButton
                                            label="Phone"
                                            column="phone"
                                            filters={filters}
                                        />
                                    </th>
                                    <th className="px-4 py-3">
                                        <SortButton
                                            label="Date"
                                            column="date"
                                            filters={filters}
                                        />
                                    </th>
                                    <th className="px-4 py-3 font-medium">
                                        Created by
                                    </th>
                                    <th className="px-4 py-3 text-right font-medium">
                                        Actions
                                    </th>
                                </tr>
                            </thead>
                            <tbody>
                                {users.data.length === 0 ? (
                                    <tr>
                                        <td
                                            colSpan={9}
                                            className="text-muted-foreground px-4 py-10 text-center"
                                        >
                                            No Active Directory users found.
                                        </td>
                                    </tr>
                                ) : (
                                    users.data.map((user) => (
                                        <tr
                                            key={user.id}
                                            className="border-b last:border-0"
                                        >
                                            <td className="px-4 py-3 font-medium">
                                                {user.name} {user.lastname}
                                            </td>
                                            <td className="px-4 py-3">
                                                {user.username}
                                            </td>
                                            <td className="px-4 py-3">
                                                {user.email}
                                            </td>
                                            <td className="px-4 py-3">
                                                {user.job ?? '—'}
                                            </td>
                                            <td className="px-4 py-3">
                                                {user.pbx ?? '—'}
                                            </td>
                                            <td className="px-4 py-3">
                                                {user.phone ?? '—'}
                                            </td>
                                            <td className="px-4 py-3">
                                                {user.date ?? '—'}
                                            </td>
                                            <td className="px-4 py-3">
                                                {user.created_by ?? '—'}
                                            </td>
                                            <td className="px-4 py-3">
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
                                                                    View
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
                                                                    Edit
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
                                                                        'Delete this Active Directory user?',
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
                                                                        Delete
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
            title: 'Active Directory Users',
            href: index(),
        },
    ],
};
