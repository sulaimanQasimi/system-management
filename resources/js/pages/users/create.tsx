import { Form, Head, Link } from '@inertiajs/react';
import { UserRound } from 'lucide-react';
import UserController from '@/actions/App/Http/Controllers/UserController';
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
                <div className="flex items-start gap-3">
                    <div className="bg-primary/10 text-primary flex size-11 items-center justify-center rounded-xl">
                        <UserRound className="size-5" />
                    </div>
                    <div>
                        <h1 className="text-xl font-semibold tracking-tight">
                            Add user
                        </h1>
                        <p className="text-muted-foreground text-sm">
                            Create a portal account and assign roles.
                        </p>
                    </div>
                </div>

                <div className="border-border bg-card w-full rounded-xl border p-4 md:p-6">
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
