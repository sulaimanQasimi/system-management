import { useState } from 'react';
import InputError from '@/components/input-error';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { useTranslations } from '@/hooks/use-locale';

const EMAIL_DOMAIN = 'mov.gov.af';

export type DepartmentOption = { id: number; name: string };

export type AdUserFormValues = {
    name?: string;
    lastname?: string;
    username?: string;
    email?: string;
    department_id?: number | string | null;
    job?: string | null;
    pbx?: string | null;
    phone?: string | null;
};

function emailFromUsername(username: string): string {
    const local = username.trim();

    return local ? `${local}@${EMAIL_DOMAIN}` : '';
}

function fieldName(field: keyof AdUserFormValues, index?: number): string {
    return index === undefined ? field : `users[${index}][${field}]`;
}

function fieldId(field: keyof AdUserFormValues, index?: number): string {
    return index === undefined ? field : `user-${index}-${field}`;
}

export default function AdUserFormFields({
    values = {},
    errors = {},
    departments = [],
    index,
}: {
    values?: AdUserFormValues;
    errors?: Partial<Record<keyof AdUserFormValues, string>>;
    departments?: DepartmentOption[];
    index?: number;
}) {
    const { t } = useTranslations();
    const [username, setUsername] = useState(values.username ?? '');
    const [email, setEmail] = useState(
        values.email ?? emailFromUsername(values.username ?? ''),
    );
    const [departmentId, setDepartmentId] = useState(
        values.department_id ? String(values.department_id) : '',
    );

    return (
        <div className="grid gap-6 sm:grid-cols-2 xl:grid-cols-3">
            <div className="grid gap-2">
                <Label htmlFor={fieldId('name', index)}>{t('common.name')}</Label>
                <Input
                    id={fieldId('name', index)}
                    name={fieldName('name', index)}
                    required
                    defaultValue={values.name ?? ''}
                    placeholder={t('adUsers.placeholderFirstName')}
                    autoComplete="given-name"
                />
                <InputError message={errors.name} />
            </div>

            <div className="grid gap-2">
                <Label htmlFor={fieldId('lastname', index)}>
                    {t('common.lastName')}
                </Label>
                <Input
                    id={fieldId('lastname', index)}
                    name={fieldName('lastname', index)}
                    required
                    defaultValue={values.lastname ?? ''}
                    placeholder={t('adUsers.placeholderLastName')}
                    autoComplete="family-name"
                />
                <InputError message={errors.lastname} />
            </div>

            <div className="grid gap-2">
                <Label htmlFor={fieldId('username', index)}>
                    {t('common.username')}
                </Label>
                <Input
                    id={fieldId('username', index)}
                    name={fieldName('username', index)}
                    required
                    value={username}
                    onChange={(event) => {
                        const next = event.target.value;
                        setUsername(next);
                        setEmail(emailFromUsername(next));
                    }}
                    placeholder={t('adUsers.placeholderAdUsername')}
                    autoComplete="username"
                />
                <InputError message={errors.username} />
            </div>

            <div className="grid gap-2">
                <Label htmlFor={fieldId('email', index)}>
                    {t('common.email')}
                </Label>
                <Input
                    id={fieldId('email', index)}
                    name={fieldName('email', index)}
                    type="email"
                    required
                    readOnly
                    value={email}
                    className="bg-muted"
                    placeholder={`username@${EMAIL_DOMAIN}`}
                    autoComplete="email"
                />
                <InputError message={errors.email} />
            </div>

            <div className="grid gap-2">
                <Label htmlFor={fieldId('department_id', index)}>
                    {t('common.department')}
                </Label>
                <select
                    id={fieldId('department_id', index)}
                    name={fieldName('department_id', index)}
                    value={departmentId}
                    onChange={(event) => setDepartmentId(event.target.value)}
                    className="border-input bg-background h-9 w-full rounded-md border px-3 text-sm shadow-xs"
                >
                    <option value="">{t('adUsers.selectDepartment')}</option>
                    {departments.map((department) => (
                        <option key={department.id} value={department.id}>
                            {department.name}
                        </option>
                    ))}
                </select>
                <InputError message={errors.department_id} />
            </div>

            <div className="grid gap-2">
                <Label htmlFor={fieldId('job', index)}>{t('common.job')}</Label>
                <Input
                    id={fieldId('job', index)}
                    name={fieldName('job', index)}
                    defaultValue={values.job ?? ''}
                    placeholder={t('adUsers.placeholderJobTitle')}
                />
                <InputError message={errors.job} />
            </div>

            <div className="grid gap-2">
                <Label htmlFor={fieldId('pbx', index)}>{t('common.pbx')}</Label>
                <Input
                    id={fieldId('pbx', index)}
                    name={fieldName('pbx', index)}
                    defaultValue={values.pbx ?? ''}
                    placeholder={t('adUsers.placeholderPbxExtension')}
                />
                <InputError message={errors.pbx} />
            </div>

            <div className="grid gap-2">
                <Label htmlFor={fieldId('phone', index)}>
                    {t('common.phone')}
                </Label>
                <Input
                    id={fieldId('phone', index)}
                    name={fieldName('phone', index)}
                    defaultValue={values.phone ?? ''}
                    placeholder={t('adUsers.placeholderPhoneNumber')}
                    autoComplete="tel"
                />
                <InputError message={errors.phone} />
            </div>
        </div>
    );
}
