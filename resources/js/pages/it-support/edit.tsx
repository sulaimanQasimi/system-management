import { Form, Head, Link } from '@inertiajs/react';
import ItSupportController from '@/actions/App/Http/Controllers/ItSupportController';
import Heading from '@/components/heading';
import InputError from '@/components/input-error';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Spinner } from '@/components/ui/spinner';
import { useTranslations } from '@/hooks/use-locale';
import { index } from '@/routes/it-support';

export default function ItSupportEdit({
    contact,
}: {
    contact: {
        id: number;
        name: string;
        lastname: string;
        pbx: string | null;
    };
}) {
    const { t } = useTranslations();
    const fullName = `${contact.name} ${contact.lastname}`;

    return (
        <>
            <Head title={t('itSupport.headEdit', { name: fullName })} />

            <div className="flex h-full flex-1 flex-col gap-6 p-4 md:p-6">
                <Heading
                    title={t('itSupport.editTitle')}
                    description={t('itSupport.editDescription', {
                        name: fullName,
                    })}
                />

                <div className="border-border/80 bg-card w-full rounded-lg border shadow-regal p-4 md:p-6">
                    <Form
                        {...ItSupportController.update.form(contact.id)}
                        className="space-y-6"
                    >
                        {({ processing, errors }) => (
                            <>
                                <div className="grid gap-6 sm:grid-cols-2">
                                    <div className="grid gap-2">
                                        <Label htmlFor="name">
                                            {t('common.name')}
                                        </Label>
                                        <Input
                                            id="name"
                                            name="name"
                                            required
                                            defaultValue={contact.name}
                                            autoFocus
                                        />
                                        <InputError message={errors.name} />
                                    </div>
                                    <div className="grid gap-2">
                                        <Label htmlFor="lastname">
                                            {t('common.lastName')}
                                        </Label>
                                        <Input
                                            id="lastname"
                                            name="lastname"
                                            required
                                            defaultValue={contact.lastname}
                                        />
                                        <InputError message={errors.lastname} />
                                    </div>
                                    <div className="grid gap-2">
                                        <Label htmlFor="pbx">
                                            {t('common.pbx')}
                                        </Label>
                                        <Input
                                            id="pbx"
                                            name="pbx"
                                            defaultValue={contact.pbx ?? ''}
                                        />
                                        <InputError message={errors.pbx} />
                                    </div>
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

ItSupportEdit.layout = {
    breadcrumbs: [
        {
            title: 'itSupport.title',
            href: index(),
        },
        {
            title: 'itSupport.breadcrumbEdit',
            href: '#',
        },
    ],
};
