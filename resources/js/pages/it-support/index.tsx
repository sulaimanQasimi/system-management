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
                                    <th className="px-4 py-3">
                                        <SortHeader
                                            label={t('common.lastName')}
                                            column="lastname"
                                            filters={filters}
                                            indexUrl={indexUrl}
                                        />
                                    </th>
                                    <th className="px-4 py-3">
                                        <SortHeader
                                            label={t('common.pbx')}
                                            column="pbx"
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
                                    <th className="px-4 py-3 text-end font-medium">
                                        {t('common.actions')}
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
                                            {t('itSupport.noResults')}
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
                                                                    {t(
                                                                        'common.view',
                                                                    )}
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
                                                                    {t(
                                                                        'common.edit',
                                                                    )}
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
                                                                        t(
                                                                            'itSupport.deleteConfirm',
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
