import { Form, Head, Link } from '@inertiajs/react';
import ActiveDirectoryUserController from '@/actions/App/Http/Controllers/ActiveDirectoryUserController';
import AdUserFormFields, {
    type AdUserFormValues,
} from '@/components/ad-user-form-fields';
import Heading from '@/components/heading';
import { Button } from '@/components/ui/button';
import { Spinner } from '@/components/ui/spinner';
import { index } from '@/routes/ad-users';
export default function AdUsersEdit({ user }: { user: AdUserFormValues & { id: number } }) {
    return (
        <>
            <Head title={`Edit ${user.username}`} />

            <div className="flex h-full flex-1 flex-col gap-6 p-4 md:p-6">
                <Heading
                    title="Edit Active Directory user"
                    description={`Update account details for ${user.username}.`}
                />

                <div className="border-border/80 bg-card w-full rounded-lg border shadow-regal p-4 md:p-6">
                    <Form
                        {...ActiveDirectoryUserController.update.form(user.id)}
                        className="space-y-6"
                    >
                        {({ processing, errors }) => (
                            <>
                                <AdUserFormFields
                                    values={user}
                                    errors={errors}
                                />

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

AdUsersEdit.layout = {
    breadcrumbs: [
        {
            title: 'Active Directory Users',
            href: index(),
        },
        {
            title: 'Edit user',
            href: '#',
        },
    ],
};
