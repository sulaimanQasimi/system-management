import { Head, Link } from '@inertiajs/react';
import { Pencil, ServerCog } from 'lucide-react';
import { DetailField, DetailSection } from '@/components/detail-fields';
import { Button } from '@/components/ui/button';
import { useCan } from '@/hooks/use-can';
import { useTranslations } from '@/hooks/use-locale';
import { edit, index } from '@/routes/server-services';

type ServiceShow = {
    id: number;
    name: string;
    created_at: string | null;
    updated_at: string | null;
};

export default function ServerServicesShow({
    service,
}: {
    service: ServiceShow;
}) {
    const { can } = useCan();
    const { t } = useTranslations();

    return (
        <>
            <Head title={service.name} />

            <div className="flex h-full flex-1 flex-col gap-6 p-4 md:p-6">
                <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
                    <div className="flex items-start gap-3">
                        <div className="bg-primary-light text-primary flex size-11 items-center justify-center rounded-lg">
                            <ServerCog className="size-5" />
                        </div>
                        <div>
                            <h1 className="text-xl font-semibold tracking-tight">
                                {service.name}
                            </h1>
                            <p className="text-muted-foreground text-sm">
                                {t('serverServices.serviceSubtitle')}
                            </p>
                        </div>
                    </div>
                    <div className="flex flex-wrap gap-2">
                        <Button variant="outline" asChild>
                            <Link href={index()}>
                                {t('serverServices.backToServices')}
                            </Link>
                        </Button>
                        {can('server_service.update') && (
                            <Button asChild>
                                <Link href={edit(service.id)}>
                                    <Pencil />
                                    {t('common.edit')}
                                </Link>
                            </Button>
                        )}
                    </div>
                </div>

                <DetailSection title={t('serverServices.serviceDetails')}>
                    <DetailField label={t('common.name')} value={service.name} />
                    <DetailField
                        label={t('common.createdAt')}
                        value={service.created_at}
                    />
                    <DetailField
                        label={t('common.updatedAt')}
                        value={service.updated_at}
                    />
                </DetailSection>
            </div>
        </>
    );
}

ServerServicesShow.layout = {
    breadcrumbs: [
        { title: 'serverServices.title', href: index() },
        { title: 'serverServices.breadcrumbDetails', href: '#' },
    ],
};
