import { Head, Link } from '@inertiajs/react';
import { Pencil, ServerCog } from 'lucide-react';
import { DetailField, DetailSection } from '@/components/detail-fields';
import { Button } from '@/components/ui/button';
import { useCan } from '@/hooks/use-can';
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
                                Server service
                            </p>
                        </div>
                    </div>
                    <div className="flex flex-wrap gap-2">
                        <Button variant="outline" asChild>
                            <Link href={index()}>Back to services</Link>
                        </Button>
                        {can('server_service.update') && (
                            <Button asChild>
                                <Link href={edit(service.id)}>
                                    <Pencil />
                                    Edit
                                </Link>
                            </Button>
                        )}
                    </div>
                </div>

                <DetailSection title="Service details">
                    <DetailField label="Name" value={service.name} />
                    <DetailField label="Created at" value={service.created_at} />
                    <DetailField label="Updated at" value={service.updated_at} />
                </DetailSection>
            </div>
        </>
    );
}

ServerServicesShow.layout = {
    breadcrumbs: [
        { title: 'Server Services', href: index() },
        { title: 'Details', href: '#' },
    ],
};
