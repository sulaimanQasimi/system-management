import { Form, Head, Link } from '@inertiajs/react';
import { HardDrive } from 'lucide-react';
import ServerController from '@/actions/App/Http/Controllers/ServerController';
import ServerFormFields, {
    type ItSupportOption,
    type Option,
    type StatusOption,
} from '@/components/server-form-fields';
import { Button } from '@/components/ui/button';
import { Spinner } from '@/components/ui/spinner';
import { create, index } from '@/routes/servers';

export default function ServersCreate({
    departments,
    serverModels,
    services,
    itSupports,
    statusOptions,
}: {
    departments: Option[];
    serverModels: Option[];
    services: Option[];
    itSupports: ItSupportOption[];
    statusOptions: StatusOption[];
}) {
    return (
        <>
            <Head title="Add Server" />

            <div className="flex h-full flex-1 flex-col gap-6 p-4 md:p-6">
                <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
                    <div className="flex items-start gap-3">
                        <div className="bg-primary/10 text-primary flex size-11 items-center justify-center rounded-xl">
                            <HardDrive className="size-5" />
                        </div>
                        <div>
                            <h1 className="text-xl font-semibold tracking-tight">
                                Add server
                            </h1>
                            <p className="text-muted-foreground text-sm">
                                Full inventory record with network, services,
                                support, and iDRAC details.
                            </p>
                        </div>
                    </div>
                    <Button variant="outline" asChild>
                        <Link href={index()}>Back to servers</Link>
                    </Button>
                </div>

                <div className="border-border bg-card w-full rounded-xl border p-4 md:p-6">
                    <Form
                        {...ServerController.store.form()}
                        className="space-y-6"
                    >
                        {({ processing, errors }) => (
                            <>
                                <ServerFormFields
                                    errors={errors}
                                    departments={departments}
                                    serverModels={serverModels}
                                    services={services}
                                    itSupports={itSupports}
                                    statusOptions={statusOptions}
                                />

                                <div className="border-border sticky bottom-0 flex flex-wrap items-center gap-3 border-t bg-card/95 py-4 backdrop-blur">
                                    <Button disabled={processing}>
                                        {processing && <Spinner />}
                                        Create server
                                    </Button>
                                    <Button variant="outline" asChild>
                                        <Link href={index()}>Cancel</Link>
                                    </Button>
                                </div>
                            </>
                        )}
                    </Form>
                </div>
            </div>
        </>
    );
}

ServersCreate.layout = {
    breadcrumbs: [
        {
            title: 'Servers',
            href: index(),
        },
        {
            title: 'Add server',
            href: create(),
        },
    ],
};
