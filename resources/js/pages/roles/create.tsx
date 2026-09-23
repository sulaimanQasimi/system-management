import { Form, Head, Link } from '@inertiajs/react';
import RoleController from '@/actions/App/Http/Controllers/RoleController';
import Heading from '@/components/heading';
import RoleFormFields from '@/components/role-form-fields';
import { Button } from '@/components/ui/button';
import { Spinner } from '@/components/ui/spinner';
import { useTranslations } from '@/hooks/use-locale';
import { create, index } from '@/routes/roles';

type PermissionGroup = {
    model: string;
    label: string;
    permissions: string[];
};

export default function RolesCreate({
    permissionGroups,
}: {
    permissionGroups: PermissionGroup[];
}) {
    const { t } = useTranslations();

    return (
        <>
            <Head title={t('roles.headAdd')} />

            <div className="flex h-full flex-1 flex-col gap-6 p-4 md:p-6">
                <Heading
                    title={t('roles.addTitle')}
                    description={t('roles.addDescription')}
                />

                <div className="border-border/80 bg-card w-full rounded-lg border p-4 shadow-regal md:p-6">
                    <Form
                        {...RoleController.store.form()}
                        className="space-y-6"
                    >
                        {({ processing, errors }) => (
                            <>
                                <RoleFormFields
                                    errors={errors}
                                    permissionGroups={permissionGroups}
                                />

                                <div className="flex items-center gap-3">
                                    <Button disabled={processing}>
                                        {processing && <Spinner />}
                                        {t('roles.createRole')}
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

RolesCreate.layout = {
    breadcrumbs: [
        { title: 'roles.title', href: index() },
        { title: 'roles.breadcrumbAdd', href: create() },
    ],
};
