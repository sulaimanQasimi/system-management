import { Form, Head, Link } from '@inertiajs/react';
import ServerModelController from '@/actions/App/Http/Controllers/ServerModelController';
import Heading from '@/components/heading';
import InputError from '@/components/input-error';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Spinner } from '@/components/ui/spinner';
import { create, index } from '@/routes/server-models';

export default function ServerModelsCreate() {
    return (
        <>
            <Head title="Add Server Model" />

            <div className="flex h-full flex-1 flex-col gap-6 p-4 md:p-6">
                <Heading
                    title="Add server model"
                    description="Register a new server model type."
                />

                <div className="border-border bg-card w-full rounded-xl border p-4 md:p-6">
                    <Form
                        {...ServerModelController.store.form()}
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
                                        placeholder="e.g. Dell PowerEdge R760"
                                        autoFocus
                                    />
                                    <InputError message={errors.name} />
                                </div>

                                <div className="flex items-center gap-3">
                                    <Button disabled={processing}>
                                        {processing && <Spinner />}
                                        Create model
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

ServerModelsCreate.layout = {
    breadcrumbs: [
        {
            title: 'Server Models',
            href: index(),
        },
        {
            title: 'Add model',
            href: create(),
        },
    ],
};
