import { Form, Head, Link } from '@inertiajs/react';
import ServerServiceController from '@/actions/App/Http/Controllers/ServerServiceController';
import Heading from '@/components/heading';
import InputError from '@/components/input-error';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Spinner } from '@/components/ui/spinner';
import { create, index } from '@/routes/server-services';

export default function ServerServicesCreate() {
    return (
        <>
            <Head title="Add Server Service" />

            <div className="flex h-full flex-1 flex-col gap-6 p-4 md:p-6">
                <Heading
                    title="Add server service"
                    description="Register a new infrastructure service."
                />

                <div className="border-border bg-card max-w-xl rounded-xl border p-6">
                    <Form
                        {...ServerServiceController.store.form()}
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
                                        placeholder="e.g. DNS, DHCP, Active Directory"
                                        autoFocus
                                    />
                                    <InputError message={errors.name} />
                                </div>

                                <div className="flex items-center gap-3">
                                    <Button disabled={processing}>
                                        {processing && <Spinner />}
                                        Create service
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

ServerServicesCreate.layout = {
    breadcrumbs: [
        {
            title: 'Server Services',
            href: index(),
        },
        {
            title: 'Add service',
            href: create(),
        },
    ],
};
