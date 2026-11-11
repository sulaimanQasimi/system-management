import { useState } from 'react';
import { Form, Head, Link } from '@inertiajs/react';
import { Plus, Trash2 } from 'lucide-react';
import ActiveDirectoryUserController from '@/actions/App/Http/Controllers/ActiveDirectoryUserController';
import AdUserFormFields, {
    type AdUserFormValues,
    type DepartmentOption,
} from '@/components/ad-user-form-fields';
import Heading from '@/components/heading';
import InputError from '@/components/input-error';
import { Button } from '@/components/ui/button';
import { Spinner } from '@/components/ui/spinner';
import { useTranslations } from '@/hooks/use-locale';
import { create, index } from '@/routes/ad-users';

type FormEntry = {
    key: string;
};

const USER_FIELDS = [
    'name',
    'lastname',
    'username',
    'email',
    'department_id',
    'job',
    'pbx',
    'phone',
] as const satisfies ReadonlyArray<keyof AdUserFormValues>;

function createEntry(): FormEntry {
    return {
        key:
            typeof crypto !== 'undefined' && 'randomUUID' in crypto
                ? crypto.randomUUID()
                : `user-${Date.now()}-${Math.random().toString(36).slice(2)}`,
    };
}

function errorsForIndex(
    errors: Record<string, string>,
    index: number,
): Partial<Record<keyof AdUserFormValues, string>> {
    const mapped: Partial<Record<keyof AdUserFormValues, string>> = {};

    for (const field of USER_FIELDS) {
        const message = errors[`users.${index}.${field}`];

        if (message) {
            mapped[field] = message;
        }
    }

    return mapped;
}

export default function AdUsersCreate({
    departments,
}: {
    departments: DepartmentOption[];
}) {
    const { t } = useTranslations();
    const [entries, setEntries] = useState<FormEntry[]>(() => [createEntry()]);

    const addEntry = () => {
        setEntries((current) => [...current, createEntry()]);
    };

    const removeEntry = (key: string) => {
        setEntries((current) =>
            current.length <= 1
                ? current
                : current.filter((entry) => entry.key !== key),
        );
    };

    return (
        <>
            <Head title={t('adUsers.headAdd')} />

            <div className="flex h-full flex-1 flex-col gap-6 p-4 md:p-6">
                <Heading
                    title={t('adUsers.addTitle')}
                    description={t('adUsers.addDescription')}
                />

                <div className="border-border/80 bg-card w-full rounded-lg border p-4 shadow-regal md:p-6">
                    <Form
                        {...ActiveDirectoryUserController.store.form()}
                        className="space-y-6"
                    >
                        {({ processing, errors }) => (
                            <>
                                <div className="space-y-4">
                                    {entries.map((entry, index) => (
                                        <div
                                            key={entry.key}
                                            className="border-border/80 space-y-4 rounded-lg border p-4 md:p-5"
                                        >
                                            <div className="flex items-center justify-between gap-3">
                                                <h2 className="text-sm font-medium">
                                                    {t('adUsers.userNumber', {
                                                        number: String(
                                                            index + 1,
                                                        ),
                                                    })}
                                                </h2>
                                                {entries.length > 1 && (
                                                    <Button
                                                        type="button"
                                                        variant="outline"
                                                        size="sm"
                                                        onClick={() =>
                                                            removeEntry(
                                                                entry.key,
                                                            )
                                                        }
                                                    >
                                                        <Trash2 />
                                                        {t(
                                                            'adUsers.removeUser',
                                                        )}
                                                    </Button>
                                                )}
                                            </div>

                                            <AdUserFormFields
                                                index={index}
                                                errors={errorsForIndex(
                                                    errors,
                                                    index,
                                                )}
                                                departments={departments}
                                            />
                                        </div>
                                    ))}
                                </div>

                                <InputError message={errors.users} />

                                <div className="flex flex-wrap items-center gap-3">
                                    <Button
                                        type="button"
                                        variant="outline"
                                        onClick={addEntry}
                                    >
                                        <Plus />
                                        {t('adUsers.addAnotherUser')}
                                    </Button>

                                    <Button disabled={processing}>
                                        {processing && <Spinner />}
                                        {entries.length > 1
                                            ? t('adUsers.createUsers')
                                            : t('adUsers.createUser')}
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
