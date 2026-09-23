import { Form, Head, Link } from '@inertiajs/react';
import DepartmentController from '@/actions/App/Http/Controllers/DepartmentController';
import Heading from '@/components/heading';
import InputError from '@/components/input-error';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Spinner } from '@/components/ui/spinner';
import { useTranslations } from '@/hooks/use-locale';
import { create, index } from '@/routes/departments';

export default function DepartmentsCreate() {
    const { t } = useTranslations();

    return (
        <>
            <Head title={t('departments.headAdd')} />

            <div className="flex h-full flex-1 flex-col gap-6 p-4 md:p-6">
                <Heading
                    title={t('departments.addTitle')}
                    description={t('departments.addDescription')}
                />

                <div className="border-border/80 bg-card w-full rounded-lg border p-4 shadow-regal md:p-6">
                    <Form
                        {...DepartmentController.store.form()}
                        className="space-y-6"
                    >
                        {({ processing, errors }) => (
                            <>
                                <div className="grid gap-2">
                                    <Label htmlFor="name">
                                        {t('common.name')}
                                    </Label>
                                    <Input
                                        id="name"
                                        name="name"
                                        required
                                        placeholder={t(
                                            'departments.placeholderName',
                                        )}
                                        autoFocus
                                    />
                                    <InputError message={errors.name} />
                                </div>

                                <div className="flex items-center gap-3">
                                    <Button disabled={processing}>
                                        {processing && <Spinner />}
                                        {t('departments.createDepartment')}
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

DepartmentsCreate.layout = {
    breadcrumbs: [
        {
            title: 'departments.title',
            href: index(),
        },
        {
            title: 'departments.breadcrumbAdd',
            href: create(),
        },
    ],
};
