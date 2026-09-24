import { Form, Head, Link } from '@inertiajs/react';
import { Eye, Headset, Pencil, Plus, Trash2 } from 'lucide-react';
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
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { useCan } from '@/hooks/use-can';
import { useTranslations } from '@/hooks/use-locale';
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
    const { t } = useTranslations();
    const [pbx, setPbx] = useState(filters.pbx);

    useEffect(() => {
        setPbx(filters.pbx);
    }, [filters.pbx]);

    return (
        <>
            <Head title={t('itSupport.title')} />

            <div className="flex h-full flex-1 flex-col gap-6 p-4 md:p-6">
                <PageHeader
                    title={t('itSupport.title')}
                    description={t('itSupport.description')}
                    icon={Headset}
                    action={
                        can('it_support.create') ? (
                            <Button asChild>
                                <Link href={create()}>
                                    <Plus />
                                    {t('itSupport.addContact')}
                                </Link>
                            </Button>
                        ) : undefined
                    }
                />

                <ResourceFilters
                    indexUrl={indexUrl}
                    filters={filters}
                    perPageOptions={perPageOptions}
                    searchPlaceholder={t('itSupport.searchPlaceholder')}
                    extraFields={
                        <div className="grid gap-2 xl:col-span-2">
                            <Label htmlFor="pbx">{t('common.pbx')}</Label>
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
                                placeholder={t('itSupport.filterByPbx')}
                            />
                        </div>
                    }
                />

                <ResultSummary
                    from={contacts.from}
                    to={contacts.to}
                    total={contacts.total}
                />

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
                            <DataTableHead>
                                <SortHeader
                                    label={t('common.lastName')}
                                    column="lastname"
                                    filters={filters}
                                    indexUrl={indexUrl}
                                />
                            </DataTableHead>
                            <DataTableHead>
                                <SortHeader
                                    label={t('common.pbx')}
                                    column="pbx"
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
                            <DataTableHead align="end">
                                {t('common.actions')}
                            </DataTableHead>
                        </DataTableHeaderRow>
                    </DataTableHeader>
                    <DataTableBody>
                        {contacts.data.length === 0 ? (
                            <DataTableEmpty colSpan={5}>
                                {t('itSupport.noResults')}
                            </DataTableEmpty>
                        ) : (
                            contacts.data.map((contact) => (
                                <DataTableRow key={contact.id}>
                                    <DataTableCell className="font-medium">
                                        {contact.name}
                                    </DataTableCell>
                                    <DataTableCell>
                                        {contact.lastname}
                                    </DataTableCell>
                                    <DataTableCell>
                                        {contact.pbx ?? '—'}
                                    </DataTableCell>
                                    <DataTableCell>
                                        {contact.created_at ?? '—'}
                                    </DataTableCell>
                                    <DataTableCell>
                                        <DataTableActions>
                                            {can('it_support.view') && (
                                                <Button
                                                    variant="ghost"
                                                    size="icon"
                                                    asChild
                                                >
                                                    <Link
                                                        href={show(contact.id)}
                                                    >
                                                        <Eye />
                                                        <span className="sr-only">
                                                            {t('common.view')}
                                                        </span>
                                                    </Link>
                                                </Button>
                                            )}
                                            {can('it_support.update') && (
                                                <Button
                                                    variant="ghost"
                                                    size="icon"
                                                    asChild
                                                >
                                                    <Link
                                                        href={edit(contact.id)}
                                                    >
                                                        <Pencil />
                                                        <span className="sr-only">
                                                            {t('common.edit')}
                                                        </span>
                                                    </Link>
                                                </Button>
                                            )}
                                            {can('it_support.delete') && (
                                                <Form
                                                    {...ItSupportController.destroy.form(
                                                        contact.id,
                                                    )}
                                                    options={{
                                                        preserveScroll: true,
                                                    }}
                                                    onSubmit={(event) => {
                                                        if (
                                                            !confirm(
                                                                t(
                                                                    'itSupport.deleteConfirm',
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

                <ResourcePagination links={contacts.links} />
            </div>
        </>
    );
}

ItSupportIndex.layout = {
    breadcrumbs: [
        {
            title: 'itSupport.title',
            href: index(),
        },
    ],
};
