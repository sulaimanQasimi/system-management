import { Form, Head, Link } from '@inertiajs/react';
import { Pencil, Plus, Shield, Trash2, UserRound } from 'lucide-react';
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
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { useCan } from '@/hooks/use-can';
import { create, edit, index } from '@/routes/users';

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
                <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
                    <div className="flex items-start gap-3">
                        <div className="bg-primary/10 text-primary flex size-11 items-center justify-center rounded-xl">
                            <UserRound className="size-5" />
                        </div>
                        <div>
                            <h1 className="text-xl font-semibold tracking-tight">
                                User management
                            </h1>
                            <p className="text-muted-foreground text-sm">
                                Manage portal users, roles, and access.
                            </p>
                        </div>
                    </div>
                    {can('user.create') && (
                        <Button asChild>
                            <Link href={create()}>
                                <Plus />
                                Add user
                            </Link>
                        </Button>
                    )}
                </div>

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

                <div className="border-border bg-card overflow-hidden rounded-xl border">
                    <div className="overflow-x-auto">
                        <table className="w-full min-w-[800px] text-left text-sm">
                            <thead className="bg-muted/50 border-b">
                                <tr className="text-muted-foreground">
                                    <th className="px-4 py-3">
                                        <SortHeader
                                            label="Name"
                                            column="name"
                                            filters={filters}
                                            indexUrl={indexUrl}
                                        />
                                    </th>
                                    <th className="px-4 py-3">
                                        <SortHeader
                                            label="Email"
                                            column="email"
                                            filters={filters}
                                            indexUrl={indexUrl}
                                        />
                                    </th>
                                    <th className="px-4 py-3">
                                        <span className="inline-flex items-center gap-1 font-medium">
                                            <Shield className="size-3.5" />
                                            Roles
                                        </span>
                                    </th>
                                    <th className="px-4 py-3">
                                        <SortHeader
                                            label="Created"
                                            column="created_at"
                                            filters={filters}
                                            indexUrl={indexUrl}
                                        />
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
                                            colSpan={5}
                                            className="text-muted-foreground px-4 py-10 text-center"
                                        >
                                            No users found.
                                        </td>
                                    </tr>
                                ) : (
                                    users.data.map((user) => (
                                        <tr
                                            key={user.id}
                                            className="border-b last:border-0"
                                        >
                                            <td className="px-4 py-3 font-medium">
                                                {user.name}
                                            </td>
                                            <td className="px-4 py-3">
                                                {user.email}
                                            </td>
                                            <td className="px-4 py-3">
                                                <div className="flex flex-wrap gap-1">
                                                    {user.roles.length === 0 ? (
                                                        <span className="text-muted-foreground">
                                                            —
                                                        </span>
                                                    ) : (
                                                        user.roles.map(
                                                            (item) => (
                                                                <Badge
                                                                    key={item}
                                                                    variant="secondary"
                                                                >
                                                                    {item}
                                                                </Badge>
                                                            ),
                                                        )
                                                    )}
                                                </div>
                                            </td>
                                            <td className="px-4 py-3">
                                                {user.created_at ?? '—'}
                                            </td>
                                            <td className="px-4 py-3">
                                                <div className="flex items-center justify-end gap-1">
                                                    {can('user.update') && (
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
                                                    {can('user.delete') && (
                                                        <Form
                                                            {...UserController.destroy.form(
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
                                                                        'Delete this user?',
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
