import { Form, Head, Link } from '@inertiajs/react';
import { UserRound } from 'lucide-react';
import UserController from '@/actions/App/Http/Controllers/UserController';
import { PageHeader } from '@/components/layout/page-header';
import UserFormFields from '@/components/user-form-fields';
import { Button } from '@/components/ui/button';
import { Spinner } from '@/components/ui/spinner';
import { create, index } from '@/routes/users';

type RoleOption = { id: number; name: string };
type PermissionGroup = {
    model: string;
    label: string;
    permissions: string[];
};

export default function UsersCreate({
    roles,
    permissionGroups,
}: {
    roles: RoleOption[];
    permissionGroups: PermissionGroup[];
}) {
    return (
        <>
            <Head title="Add User" />

            <div className="flex h-full flex-1 flex-col gap-6 p-4 md:p-6">
                <PageHeader
                    title="Add user"
                    description="Create a portal account and assign roles."
                    icon={UserRound}
                />

                <div className="border-border/80 bg-card w-full rounded-lg border p-4 shadow-regal md:p-6">
                    <Form
                        {...UserController.store.form()}
                        className="space-y-6"
                    >
                        {({ processing, errors }) => (
                            <>
                                <UserFormFields
                                    errors={errors}
                                    roles={roles}
                                    permissionGroups={permissionGroups}
                                />
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

UsersCreate.layout = {
    breadcrumbs: [
        {
            title: 'Users',
            href: index(),
        },
        {
            title: 'Add user',
            href: create(),
        },
    ],
};
