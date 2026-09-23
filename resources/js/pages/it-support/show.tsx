import { Head, Link } from '@inertiajs/react';
import { Headset, Pencil } from 'lucide-react';
import { DetailField, DetailSection } from '@/components/detail-fields';
import { Button } from '@/components/ui/button';
import { useCan } from '@/hooks/use-can';
import { useTranslations } from '@/hooks/use-locale';
import { edit, index } from '@/routes/it-support';

type ContactShow = {
    id: number;
    name: string;
    lastname: string;
    pbx: string | null;
    created_at: string | null;
    updated_at: string | null;
};

export default function ItSupportShow({ contact }: { contact: ContactShow }) {
    const { can } = useCan();
    const { t } = useTranslations();

    return (
        <>
            <Head title={`${contact.name} ${contact.lastname}`} />

            <div className="flex h-full flex-1 flex-col gap-6 p-4 md:p-6">
                <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
                    <div className="flex items-start gap-3">
                        <div className="bg-primary-light text-primary flex size-11 items-center justify-center rounded-lg">
                            <Headset className="size-5" />
                        </div>
                        <div>
                            <h1 className="text-xl font-semibold tracking-tight">
                                {contact.name} {contact.lastname}
                            </h1>
                            <p className="text-muted-foreground text-sm">
                                {t('itSupport.contactSubtitle')}
                            </p>
                        </div>
                    </div>
                    <div className="flex flex-wrap gap-2">
                        <Button variant="outline" asChild>
                            <Link href={index()}>
                                {t('itSupport.backToItSupport')}
                            </Link>
                        </Button>
                        {can('it_support.update') && (
                            <Button asChild>
                                <Link href={edit(contact.id)}>
                                    <Pencil />
                                    {t('common.edit')}
                                </Link>
                            </Button>
                        )}
                    </div>
                </div>

                <DetailSection title={t('itSupport.contactDetails')}>
                    <DetailField label={t('common.name')} value={contact.name} />
                    <DetailField
                        label={t('common.lastName')}
                        value={contact.lastname}
                    />
                    <DetailField label={t('common.pbx')} value={contact.pbx} />
                    <DetailField
                        label={t('common.createdAt')}
                        value={contact.created_at}
                    />
                    <DetailField
                        label={t('common.updatedAt')}
                        value={contact.updated_at}
                    />
                </DetailSection>
            </div>
        </>
    );
}

ItSupportShow.layout = {
    breadcrumbs: [
        { title: 'itSupport.title', href: index() },
        { title: 'itSupport.breadcrumbDetails', href: '#' },
    ],
};
