import { Form, Head, Link } from '@inertiajs/react';
import { Eye, Pencil, Plus, Shield, Trash2, UserRound } from 'lucide-react';
import { useEffect, useState } from 'react';
import UserController from '@/actions/App/Http/Controllers/UserController';
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
import { Label } from '@/components/ui/label';
import { useCan } from '@/hooks/use-can';
import { create, edit, index, show } from '@/routes/users';

type UserRow = {
    id: number;
    name: string;
    email: string;
    email_verified_at: string | null;
    roles: string[];
    created_at: string | null;
};

type UserFilters = ListFilters & {
    role: string;
};

export default function UsersIndex({
    users,
    filters,
    perPageOptions,
    roles,
}: {
    users: Paginated<UserRow>;
    filters: UserFilters;
    perPageOptions: number[];
    roles: string[];
}) {
    const indexUrl = index.url();
    const { can } = useCan();
    const [role, setRole] = useState(filters.role);

    useEffect(() => {
        setRole(filters.role);
    }, [filters.role]);

    return (
        <>
            <Head title="Users" />

            <div className="flex h-full flex-1 flex-col gap-6 p-4 md:p-6">
                <PageHeader
                    title="User management"
                    description="Manage portal users, roles, and access."
                    icon={UserRound}
                    action={
                        can('user.create') ? (
                            <Button asChild>
                                <Link href={create()}>
                                    <Plus />
                                    Add user
                                </Link>
                            </Button>
                        ) : undefined
                    }
                />

                <ResourceFilters
                    indexUrl={indexUrl}
                    filters={filters}
                    perPageOptions={perPageOptions}
                    searchPlaceholder="Search name or email…"
                    extraFields={
                        <div className="grid gap-2">
                            <Label htmlFor="role">Role</Label>
                            <select
                                id="role"
                                value={role}
                                onChange={(event) => {
                                    const value = event.target.value;
                                    setRole(value);
                                    applyListFilters(
                                        indexUrl,
                                        { role: value },
                                        filters,
                                    );
                                }}
                                className="border-input bg-background h-9 rounded-md border px-2 text-sm shadow-xs"
                            >
                                <option value="">All roles</option>
                                {roles.map((item) => (
                                    <option key={item} value={item}>
                                        {item}
                                    </option>
                                ))}
                            </select>
                        </div>
                    }
                />

                <ResultSummary
                    from={users.from}
                    to={users.to}
                    total={users.total}
                />

                <DataTable minWidth={800}>
                    <DataTableHeader>
                        <DataTableHeaderRow>
                            <DataTableHead>
                                <SortHeader
                                    label="Name"
                                    column="name"
                                    filters={filters}
                                    indexUrl={indexUrl}
                                />
                            </DataTableHead>
                            <DataTableHead>
                                <SortHeader
                                    label="Email"
                                    column="email"
                                    filters={filters}
                                    indexUrl={indexUrl}
                                />
                            </DataTableHead>
                            <DataTableHead>
                                <span className="inline-flex items-center gap-1 font-medium">
                                    <Shield className="size-3.5" />
                                    Roles
                                </span>
                            </DataTableHead>
                            <DataTableHead>
                                <SortHeader
                                    label="Created"
                                    column="created_at"
                                    filters={filters}
                                    indexUrl={indexUrl}
                                />
                            </DataTableHead>
                            <DataTableHead align="end">Actions</DataTableHead>
                        </DataTableHeaderRow>
                    </DataTableHeader>
                    <DataTableBody>
                        {users.data.length === 0 ? (
                            <DataTableEmpty colSpan={5}>
                                No users found.
                            </DataTableEmpty>
                        ) : (
                            users.data.map((user) => (
                                <DataTableRow key={user.id}>
                                    <DataTableCell className="font-medium">
                                        {user.name}
                                    </DataTableCell>
                                    <DataTableCell>{user.email}</DataTableCell>
                                    <DataTableCell>
                                        <div className="flex flex-wrap gap-1">
                                            {user.roles.length === 0 ? (
                                                <span className="text-muted-foreground">
                                                    —
                                                </span>
                                            ) : (
                                                user.roles.map((item) => (
                                                    <Badge
                                                        key={item}
                                                        variant="secondary"
                                                    >
                                                        {item}
                                                    </Badge>
                                                ))
                                            )}
                                        </div>
                                    </DataTableCell>
                                    <DataTableCell>
                                        {user.created_at ?? '—'}
                                    </DataTableCell>
                                    <DataTableCell>
                                        <DataTableActions>
                                            {can('user.view') && (
                                                <Button
                                                    variant="ghost"
                                                    size="icon"
                                                    asChild
                                                >
                                                    <Link
                                                        href={show(user.id)}
                                                    >
                                                        <Eye />
                                                        <span className="sr-only">
                                                            View
                                                        </span>
                                                    </Link>
                                                </Button>
                                            )}
                                            {can('user.update') && (
                                                <Button
                                                    variant="ghost"
                                                    size="icon"
                                                    asChild
                                                >
                                                    <Link
                                                        href={edit(user.id)}
                                                    >
                                                        <Pencil />
                                                        <span className="sr-only">
                                                            Edit
                                                        </span>
                                                    </Link>
                                                </Button>
                                            )}
                                            {can('user.delete') && (
                                                <Form
                                                    {...UserController.destroy.form(
                                                        user.id,
                                                    )}
                                                    options={{
                                                        preserveScroll: true,
                                                    }}
                                                    onSubmit={(event) => {
                                                        if (
                                                            !confirm(
                                                                'Delete this user?',
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
                                                                Delete
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

                <ResourcePagination links={users.links} />
            </div>
        </>
    );
}

UsersIndex.layout = {
    breadcrumbs: [
        {
            title: 'Users',
            href: index(),
        },
    ],
};
