import { Form, Head, Link } from '@inertiajs/react';
import { UserRound } from 'lucide-react';
import UserController from '@/actions/App/Http/Controllers/UserController';
import UserFormFields from '@/components/user-form-fields';
import { Button } from '@/components/ui/button';
import { Spinner } from '@/components/ui/spinner';
import { index } from '@/routes/users';

type RoleOption = { id: number; name: string };
type PermissionGroup = {
    model: string;
    label: string;
    permissions: string[];
};

export default function UsersEdit({
    user,
    roles,
    permissionGroups,
}: {
    user: {
        id: number;
        name: string;
        email: string;
        roles: string[];
    };
    roles: RoleOption[];
    permissionGroups: PermissionGroup[];
}) {
    return (
        <>
            <Head title={`Edit ${user.name}`} />

            <div className="flex h-full flex-1 flex-col gap-6 p-4 md:p-6">
                <div className="flex items-start gap-3">
                    <div className="bg-primary/10 text-primary flex size-11 items-center justify-center rounded-xl">
                        <UserRound className="size-5" />
                    </div>
                    <div>
                        <h1 className="text-xl font-semibold tracking-tight">
                            Edit user
                        </h1>
                        <p className="text-muted-foreground text-sm">
                            Update account details and role assignments for{' '}
                            {user.name}.
                        </p>
                    </div>
                </div>

                <div className="border-border bg-card w-full rounded-xl border p-4 md:p-6">
                    <Form
                        {...UserController.update.form(user.id)}
                        className="space-y-6"
                    >
                        {({ processing, errors }) => (
                            <>
                                <UserFormFields
                                    values={user}
                                    errors={errors}
                                    roles={roles}
                                    permissionGroups={permissionGroups}
                                    isEdit
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

UsersEdit.layout = {
    breadcrumbs: [
        {
            title: 'Users',
            href: index(),
        },
        {
            title: 'Edit user',
            href: '#',
        },
    ],
};
