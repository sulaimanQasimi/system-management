import { Form, Head, Link } from '@inertiajs/react';
import RoleController from '@/actions/App/Http/Controllers/RoleController';
import Heading from '@/components/heading';
import RoleFormFields from '@/components/role-form-fields';
import { Button } from '@/components/ui/button';
import { Spinner } from '@/components/ui/spinner';
import { useTranslations } from '@/hooks/use-locale';
import { index } from '@/routes/roles';

type PermissionGroup = {
    model: string;
    label: string;
    permissions: string[];
};

export default function RolesEdit({
    role,
    permissionGroups,
}: {
    role: {
        id: number;
        name: string;
        permissions: string[];
        is_protected: boolean;
    };
    permissionGroups: PermissionGroup[];
}) {
    const { t } = useTranslations();

    return (
        <>
            <Head title={t('roles.headEdit', { name: role.name })} />

            <div className="flex h-full flex-1 flex-col gap-6 p-4 md:p-6">
                <Heading
                    title={t('roles.editTitle')}
                    description={t('roles.editDescription', {
                        name: role.name,
                    })}
                />

                <div className="border-border/80 bg-card w-full rounded-lg border p-4 shadow-regal md:p-6">
                    <Form
                        {...RoleController.update.form(role.id)}
                        className="space-y-6"
                    >
                        {({ processing, errors }) => (
                            <>
                                <RoleFormFields
                                    values={role}
                                    errors={errors}
                                    permissionGroups={permissionGroups}
                                    nameLocked={role.is_protected}
                                />

                                <div className="flex items-center gap-3">
                                    <Button disabled={processing}>
                                        {processing && <Spinner />}
                                        {t('common.saveChanges')}
                                    </Button>
                                    <Button variant="outline" asChild>
                                        <Link href={index()}>
                                            {t('common.cancel')}
                                        </Link>
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

RolesEdit.layout = {
    breadcrumbs: [
        { title: 'roles.title', href: index() },
        { title: 'roles.breadcrumbEdit', href: '#' },
    ],
};
