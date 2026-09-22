import { Head, Link } from '@inertiajs/react';
import { Pencil, Server } from 'lucide-react';
import { DetailField, DetailSection } from '@/components/detail-fields';
import { Button } from '@/components/ui/button';
import { useCan } from '@/hooks/use-can';
import { edit, index } from '@/routes/server-models';

type ModelShow = {
    id: number;
    name: string;
    created_at: string | null;
    updated_at: string | null;
};

export default function ServerModelsShow({ model }: { model: ModelShow }) {
    const { can } = useCan();

    return (
        <>
            <Head title={model.name} />

            <div className="flex h-full flex-1 flex-col gap-6 p-4 md:p-6">
                <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
                    <div className="flex items-start gap-3">
                        <div className="bg-primary-light text-primary flex size-11 items-center justify-center rounded-lg">
                            <Server className="size-5" />
                        </div>
                        <div>
                            <h1 className="text-xl font-semibold tracking-tight">
                                {model.name}
                            </h1>
                            <p className="text-muted-foreground text-sm">
                                Server model
                            </p>
                        </div>
                    </div>
                    <div className="flex flex-wrap gap-2">
                        <Button variant="outline" asChild>
                            <Link href={index()}>Back to models</Link>
                        </Button>
                        {can('server_model.update') && (
                            <Button asChild>
                                <Link href={edit(model.id)}>
                                    <Pencil />
                                    Edit
                                </Link>
                            </Button>
                        )}
                    </div>
                </div>

                <DetailSection title="Model details">
                    <DetailField label="Name" value={model.name} />
                    <DetailField label="Created at" value={model.created_at} />
                    <DetailField label="Updated at" value={model.updated_at} />
                </DetailSection>
            </div>
        </>
    );
}

ServerModelsShow.layout = {
    breadcrumbs: [
        { title: 'Server Models', href: index() },
        { title: 'Details', href: '#' },
    ],
};
