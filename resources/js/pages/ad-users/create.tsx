import { Form, Head, Link } from '@inertiajs/react';
import ActiveDirectoryUserController from '@/actions/App/Http/Controllers/ActiveDirectoryUserController';
import AdUserFormFields from '@/components/ad-user-form-fields';
import Heading from '@/components/heading';
import { Button } from '@/components/ui/button';
import { Spinner } from '@/components/ui/spinner';
import { useTranslations } from '@/hooks/use-locale';
import { create, index } from '@/routes/ad-users';

export default function AdUsersCreate() {
    const { t } = useTranslations();

    return (
        <>
            <Head title={t('adUsers.headAdd')} />

            <div className="flex h-full flex-1 flex-col gap-6 p-4 md:p-6">
                <Heading
                    title={t('adUsers.addTitle')}
                    description={t('adUsers.addDescription')}
                />

                <div className="border-border/80 bg-card w-full rounded-lg border shadow-regal p-4 md:p-6">
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
                                        {t('adUsers.createUser')}
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

AdUsersCreate.layout = {
    breadcrumbs: [
        {
            title: 'adUsers.title',
            href: index(),
        },
        {
            title: 'adUsers.breadcrumbAdd',
            href: create(),
        },
    ],
};
