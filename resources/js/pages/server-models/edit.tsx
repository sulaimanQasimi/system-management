import { Form, Head, Link } from '@inertiajs/react';
import ServerModelController from '@/actions/App/Http/Controllers/ServerModelController';
import Heading from '@/components/heading';
import InputError from '@/components/input-error';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Spinner } from '@/components/ui/spinner';
import { useTranslations } from '@/hooks/use-locale';
import { index } from '@/routes/server-models';

export default function ServerModelsEdit({
    model,
}: {
    model: { id: number; name: string };
}) {
    const { t } = useTranslations();

    return (
        <>
            <Head
                title={t('serverModels.headEdit', { name: model.name })}
            />

            <div className="flex h-full flex-1 flex-col gap-6 p-4 md:p-6">
                <Heading
                    title={t('serverModels.editTitle')}
                    description={t('serverModels.editDescription', {
                        name: model.name,
                    })}
                />

                <div className="border-border/80 bg-card w-full rounded-lg border shadow-regal p-4 md:p-6">
                    <Form
                        {...ServerModelController.update.form(model.id)}
                        className="space-y-6"
                    >
                        {({ processing, errors }) => (
                            <>
                                <div className="grid gap-2">
                                    <Label htmlFor="name">{t('common.name')}</Label>
                                    <Input
                                        id="name"
                                        name="name"
                                        required
                                        defaultValue={model.name}
                                        autoFocus
                                    />
                                    <InputError message={errors.name} />
                                </div>

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

ServerModelsEdit.layout = {
    breadcrumbs: [
        {
            title: 'serverModels.title',
            href: index(),
        },
        {
            title: 'serverModels.breadcrumbEdit',
            href: '#',
        },
    ],
};
