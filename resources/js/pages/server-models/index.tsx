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
import { useCan } from '@/hooks/use-can';
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

    return (
        <>
            <Head title="Server Models" />

            <div className="flex h-full flex-1 flex-col gap-6 p-4 md:p-6">
                <PageHeader
                    title="Server Models"
                    description="Catalog of server model types used by the Network Section."
                    icon={Server}
                    action={
                        can('server_model.create') ? (
                            <Button asChild>
                                <Link href={create()}>
                                    <Plus />
                                    Add model
                                </Link>
                            </Button>
                        ) : undefined
                    }
                />

                <ResourceFilters
                    indexUrl={indexUrl}
                    filters={filters}
                    perPageOptions={perPageOptions}
                    searchPlaceholder="Search by model name…"
                />

                <div className="flex items-center justify-between">
                    <ResultSummary
                        from={models.from}
                        to={models.to}
                        total={models.total}
                    />
                </div>

                <div className="border-border/80 bg-card overflow-hidden rounded-lg border shadow-regal">
                    <div className="overflow-x-auto">
                        <table className="w-full min-w-[640px] text-left text-sm">
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
                                            label="Created"
                                            column="created_at"
                                            filters={filters}
                                            indexUrl={indexUrl}
                                        />
                                    </th>
                                    <th className="px-4 py-3">
                                        <SortHeader
                                            label="Updated"
                                            column="updated_at"
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
                                {models.data.length === 0 ? (
                                    <tr>
                                        <td
                                            colSpan={4}
                                            className="text-muted-foreground px-4 py-10 text-center"
                                        >
                                            No server models found.
                                        </td>
                                    </tr>
                                ) : (
                                    models.data.map((model) => (
                                        <tr
                                            key={model.id}
                                            className="border-b last:border-0"
                                        >
                                            <td className="px-4 py-3 font-medium">
                                                {model.name}
                                            </td>
                                            <td className="px-4 py-3">
                                                {model.created_at ?? '—'}
                                            </td>
                                            <td className="px-4 py-3">
                                                {model.updated_at ?? '—'}
                                            </td>
                                            <td className="px-4 py-3">
                                                <div className="flex items-center justify-end gap-1">
                                                    {can(
                                                        'server_model.view',
                                                    ) && (
                                                        <Button
                                                            variant="ghost"
                                                            size="icon"
                                                            asChild
                                                        >
                                                            <Link
                                                                href={show(
                                                                    model.id,
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
                                                        'server_model.update',
                                                    ) && (
                                                        <Button
                                                            variant="ghost"
                                                            size="icon"
                                                            asChild
                                                        >
                                                            <Link
                                                                href={edit(
                                                                    model.id,
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
                                                        'server_model.delete',
                                                    ) && (
                                                        <Form
                                                            {...ServerModelController.destroy.form(
                                                                model.id,
                                                            )}
                                                            options={{
                                                                preserveScroll: true,
                                                            }}
                                                            onSubmit={(
                                                                event,
                                                            ) => {
                                                                if (
                                                                    !confirm(
                                                                        'Delete this server model?',
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

                <ResourcePagination links={models.links} />
            </div>
        </>
    );
}

ServerModelsIndex.layout = {
    breadcrumbs: [
        {
            title: 'Server Models',
            href: index(),
        },
    ],
};
