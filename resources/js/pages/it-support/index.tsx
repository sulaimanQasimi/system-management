import { Form, Head, Link } from '@inertiajs/react';
import { Pencil, Plus, Trash2, Eye } from 'lucide-react';
import { useEffect, useState } from 'react';
import ItSupportController from '@/actions/App/Http/Controllers/ItSupportController';
import {
    applyListFilters,
    ResourceFilters,
    ResourcePagination,
    ResultSummary,
    SortHeader,
    type ListFilters,
    type Paginated,
} from '@/components/resource-list';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { useCan } from '@/hooks/use-can';
import { create, edit, index, show } from '@/routes/it-support';

type ItSupportRow = {
    id: number;
    name: string;
    lastname: string;
    pbx: string | null;
    created_at: string | null;
    updated_at: string | null;
};

type ItSupportFilters = ListFilters & {
    pbx: string;
};

export default function ItSupportIndex({
    contacts,
    filters,
    perPageOptions,
}: {
    contacts: Paginated<ItSupportRow>;
    filters: ItSupportFilters;
    perPageOptions: number[];
}) {
    const indexUrl = index.url();
    const { can } = useCan();
    const [pbx, setPbx] = useState(filters.pbx);

    useEffect(() => {
        setPbx(filters.pbx);
    }, [filters.pbx]);

    return (
        <>
            <Head title="IT Support" />

            <div className="flex h-full flex-1 flex-col gap-6 p-4 md:p-6">
                <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
                    <div>
                        <h1 className="text-xl font-semibold tracking-tight">
                            IT Support
                        </h1>
                        <p className="text-muted-foreground text-sm">
                            Support contacts and PBX extensions for the
                            department.
                        </p>
                    </div>
                    {can('it_support.create') && (
                        <Button asChild>
                            <Link href={create()}>
                                <Plus />
                                Add contact
                            </Link>
                        </Button>
                    )}
                </div>

                <ResourceFilters
                    indexUrl={indexUrl}
                    filters={filters}
                    perPageOptions={perPageOptions}
                    searchPlaceholder="Search name, last name, or PBX…"
                    extraFields={
                        <div className="grid gap-2 xl:col-span-2">
                            <Label htmlFor="pbx">PBX</Label>
                            <Input
                                id="pbx"
                                value={pbx}
                                onChange={(event) => setPbx(event.target.value)}
                                onBlur={() =>
                                    applyListFilters(
                                        indexUrl,
                                        { pbx },
                                        filters,
                                    )
                                }
                                onKeyDown={(event) => {
                                    if (event.key === 'Enter') {
                                        applyListFilters(
                                            indexUrl,
                                            { pbx },
                                            filters,
                                        );
                                    }
                                }}
                                placeholder="Filter by PBX extension"
                            />
                        </div>
                    }
                />

                <ResultSummary
                    from={contacts.from}
                    to={contacts.to}
                    total={contacts.total}
                />

                <div className="border-border bg-card overflow-hidden rounded-xl border">
                    <div className="overflow-x-auto">
                        <table className="w-full min-w-[720px] text-left text-sm">
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
                                            label="Last name"
                                            column="lastname"
                                            filters={filters}
                                            indexUrl={indexUrl}
                                        />
                                    </th>
                                    <th className="px-4 py-3">
                                        <SortHeader
                                            label="PBX"
                                            column="pbx"
                                            filters={filters}
                                            indexUrl={indexUrl}
                                        />
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
                                {contacts.data.length === 0 ? (
                                    <tr>
                                        <td
                                            colSpan={5}
                                            className="text-muted-foreground px-4 py-10 text-center"
                                        >
                                            No IT Support contacts found.
                                        </td>
                                    </tr>
                                ) : (
                                    contacts.data.map((contact) => (
                                        <tr
                                            key={contact.id}
                                            className="border-b last:border-0"
                                        >
                                            <td className="px-4 py-3 font-medium">
                                                {contact.name}
                                            </td>
                                            <td className="px-4 py-3">
                                                {contact.lastname}
                                            </td>
                                            <td className="px-4 py-3">
                                                {contact.pbx ?? '—'}
                                            </td>
                                            <td className="px-4 py-3">
                                                {contact.created_at ?? '—'}
                                            </td>
                                            <td className="px-4 py-3">
                                                <div className="flex items-center justify-end gap-1">
                                                    {can('it_support.view') && (
                                                        <Button
                                                            variant="ghost"
                                                            size="icon"
                                                            asChild
                                                        >
                                                            <Link
                                                                href={show(
                                                                    contact.id,
                                                                )}
                                                            >
                                                                <Eye />
                                                                <span className="sr-only">
                                                                    View
                                                                </span>
                                                            </Link>
                                                        </Button>
                                                    )}
                                                    {can(
                                                        'it_support.update',
                                                    ) && (
                                                        <Button
                                                            variant="ghost"
                                                            size="icon"
                                                            asChild
                                                        >
                                                            <Link
                                                                href={edit(
                                                                    contact.id,
                                                                )}
                                                            >
                                                                <Pencil />
                                                                <span className="sr-only">
                                                                    Edit
                                                                </span>
                                                            </Link>
                                                        </Button>
                                                    )}
                                                    {can(
                                                        'it_support.delete',
                                                    ) && (
                                                        <Form
                                                            {...ItSupportController.destroy.form(
                                                                contact.id,
                                                            )}
                                                            options={{
                                                                preserveScroll: true,
                                                            }}
                                                            onSubmit={(
                                                                event,
                                                            ) => {
                                                                if (
                                                                    !confirm(
                                                                        'Delete this IT Support contact?',
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

                <ResourcePagination links={contacts.links} />
            </div>
        </>
    );
}

ItSupportIndex.layout = {
    breadcrumbs: [
        {
            title: 'IT Support',
            href: index(),
        },
    ],
};
