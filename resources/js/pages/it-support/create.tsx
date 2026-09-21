import { Form, Head, Link } from '@inertiajs/react';
import ItSupportController from '@/actions/App/Http/Controllers/ItSupportController';
import Heading from '@/components/heading';
import InputError from '@/components/input-error';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Spinner } from '@/components/ui/spinner';
import { create, index } from '@/routes/it-support';

export default function ItSupportCreate() {
    return (
        <>
            <Head title="Add IT Support" />

            <div className="flex h-full flex-1 flex-col gap-6 p-4 md:p-6">
                <Heading
                    title="Add IT Support contact"
                    description="Register a new support contact and PBX."
                />

                <div className="border-border bg-card w-full rounded-xl border p-4 md:p-6">
                    <Form
                        {...ItSupportController.store.form()}
                        className="space-y-6"
                    >
                        {({ processing, errors }) => (
                            <>
                                <div className="grid gap-6 sm:grid-cols-2">
                                    <div className="grid gap-2">
                                        <Label htmlFor="name">Name</Label>
                                        <Input
                                            id="name"
                                            name="name"
                                            required
                                            placeholder="First name"
                                            autoFocus
                                        />
                                        <InputError message={errors.name} />
                                    </div>
                                    <div className="grid gap-2">
                                        <Label htmlFor="lastname">
                                            Last name
                                        </Label>
                                        <Input
                                            id="lastname"
                                            name="lastname"
                                            required
                                            placeholder="Last name"
                                        />
                                        <InputError message={errors.lastname} />
                                    </div>
                                    <div className="grid gap-2">
                                        <Label htmlFor="pbx">PBX</Label>
                                        <Input
                                            id="pbx"
                                            name="pbx"
                                            placeholder="Extension"
                                        />
                                        <InputError message={errors.pbx} />
                                    </div>
                                </div>

                                <div className="flex items-center gap-3">
                                    <Button disabled={processing}>
                                        {processing && <Spinner />}
                                        Create contact
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

ItSupportCreate.layout = {
    breadcrumbs: [
        {
            title: 'IT Support',
            href: index(),
        },
        {
            title: 'Add contact',
            href: create(),
        },
    ],
};
