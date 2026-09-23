import { Form, Head, Link } from '@inertiajs/react';
import ActiveDirectoryUserController from '@/actions/App/Http/Controllers/ActiveDirectoryUserController';
import AdUserFormFields, {
    type AdUserFormValues,
    type DepartmentOption,
} from '@/components/ad-user-form-fields';
import Heading from '@/components/heading';
import { Button } from '@/components/ui/button';
import { Spinner } from '@/components/ui/spinner';
import { useTranslations } from '@/hooks/use-locale';
import { index } from '@/routes/ad-users';

export default function AdUsersEdit({
    user,
    departments,
}: {
    user: AdUserFormValues & { id: number };
    departments: DepartmentOption[];
}) {
    const { t } = useTranslations();

    return (
        <>
            <Head
                title={t('adUsers.headEdit', { name: user.username ?? '' })}
            />

            <div className="flex h-full flex-1 flex-col gap-6 p-4 md:p-6">
                <Heading
                    title={t('adUsers.editTitle')}
                    description={t('adUsers.editDescription', {
                        name: user.username ?? '',
                    })}
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
                                    departments={departments}
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

AdUsersEdit.layout = {
    breadcrumbs: [
        {
            title: 'adUsers.title',
            href: index(),
        },
        {
            title: 'adUsers.breadcrumbEdit',
            href: '#',
        },
    ],
};
