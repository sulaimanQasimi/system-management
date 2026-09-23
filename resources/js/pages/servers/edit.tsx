import { Form, Head, Link } from '@inertiajs/react';
import { HardDrive } from 'lucide-react';
import ServerController from '@/actions/App/Http/Controllers/ServerController';
import { PageHeader } from '@/components/layout/page-header';
import ServerFormFields, {
    type ItSupportOption,
    type Option,
    type ServerFormValues,
    type StatusOption,
} from '@/components/server-form-fields';
import { Button } from '@/components/ui/button';
import { Spinner } from '@/components/ui/spinner';
import { useTranslations } from '@/hooks/use-locale';
import { index } from '@/routes/servers';

export default function ServersEdit({
    server,
    departments,
    serverModels,
    services,
    itSupports,
    statusOptions,
}: {
    server: ServerFormValues & { id: number };
    departments: Option[];
    serverModels: Option[];
    services: Option[];
    itSupports: ItSupportOption[];
    statusOptions: StatusOption[];
}) {
    const { t } = useTranslations();

    return (
        <>
            <Head title={t('servers.headEdit', { name: server.name ?? '' })} />

            <div className="flex h-full flex-1 flex-col gap-6 p-4 md:p-6">
                <PageHeader
                    title={t('servers.editTitle')}
                    description={t('servers.editDescription', {
                        name: server.name ?? '',
                    })}
                    icon={HardDrive}
                    action={
                        <Button variant="outline" asChild>
                            <Link href={index()}>{t('servers.backToServers')}</Link>
                        </Button>
                    }
                />

                <Form
                    {...ServerController.update.form(server.id)}
                    className="space-y-6"
                >
                    {({ processing, errors }) => (
                        <>
                            <ServerFormFields
                                values={server}
                                errors={errors}
                                departments={departments}
                                serverModels={serverModels}
                                services={services}
                                itSupports={itSupports}
                                statusOptions={statusOptions}
                                isEdit
                            />

                            <div className="border-border/60 bg-background/95 sticky bottom-0 z-[1] -mx-4 flex flex-wrap items-center gap-3 border-t px-4 py-4 backdrop-blur md:-mx-6 md:px-6">
                                <Button disabled={processing}>
                                    {processing && <Spinner />}
                                    {t('common.saveChanges')}
                                </Button>
                                <Button variant="outline" asChild>
                                    <Link href={index()}>{t('common.cancel')}</Link>
                                </Button>
                            </div>
                        </>
                    )}
                </Form>
            </div>
        </>
    );
}

ServersEdit.layout = {
    breadcrumbs: [
        {
            title: 'servers.title',
            href: index(),
        },
        {
            title: 'servers.breadcrumbEdit',
            href: '#',
        },
    ],
};
