import { Form, Head, Link } from '@inertiajs/react';
import ServerServiceController from '@/actions/App/Http/Controllers/ServerServiceController';
import Heading from '@/components/heading';
import InputError from '@/components/input-error';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Spinner } from '@/components/ui/spinner';
import { index } from '@/routes/server-services';

export default function ServerServicesEdit({
    service,
}: {
    service: { id: number; name: string };
}) {
    return (
        <>
            <Head title={`Edit ${service.name}`} />

            <div className="flex h-full flex-1 flex-col gap-6 p-4 md:p-6">
                <Heading
                    title="Edit server service"
                    description={`Update details for ${service.name}.`}
                />

                <div className="border-border bg-card max-w-xl rounded-xl border p-6">
                    <Form
                        {...ServerServiceController.update.form(service.id)}
                        className="space-y-6"
                    >
                        {({ processing, errors }) => (
                            <>
                                <div className="grid gap-2">
                                    <Label htmlFor="name">Name</Label>
                                    <Input
                                        id="name"
                                        name="name"
                                        required
                                        defaultValue={service.name}
                                        autoFocus
                                    />
                                    <InputError message={errors.name} />
                                </div>

                                <div className="flex items-center gap-3">
                                    <Button disabled={processing}>
                                        {processing && <Spinner />}
                                        Save changes
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

ServerServicesEdit.layout = {
    breadcrumbs: [
        {
            title: 'Server Services',
            href: index(),
        },
        {
            title: 'Edit service',
            href: '#',
        },
    ],
};
