import { Form, Head, Link } from '@inertiajs/react';
import ActiveDirectoryUserController from '@/actions/App/Http/Controllers/ActiveDirectoryUserController';
import AdUserFormFields from '@/components/ad-user-form-fields';
import Heading from '@/components/heading';
import { Button } from '@/components/ui/button';
import { Spinner } from '@/components/ui/spinner';
import { create, index } from '@/routes/ad-users';

export default function AdUsersCreate() {
    return (
        <>
            <Head title="Add AD User" />

            <div className="flex h-full flex-1 flex-col gap-6 p-4 md:p-6">
                <Heading
                    title="Add Active Directory user"
                    description="Create a new directory account record."
                />

                <div className="border-border bg-card w-full rounded-xl border p-4 md:p-6">
                    <Form
                        {...ActiveDirectoryUserController.store.form()}
                        className="space-y-6"
                    >
                        {({ processing, errors }) => (
                            <>
                                <AdUserFormFields errors={errors} />

                                <div className="flex items-center gap-3">
                                    <Button disabled={processing}>
                                        {processing && <Spinner />}
                                        Create user
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

AdUsersCreate.layout = {
    breadcrumbs: [
        {
            title: 'Active Directory Users',
            href: index(),
        },
        {
            title: 'Add user',
            href: create(),
        },
    ],
};
