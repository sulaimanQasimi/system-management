import { useState } from 'react';
import InputError from '@/components/input-error';
import { Checkbox } from '@/components/ui/checkbox';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { useTranslations } from '@/hooks/use-locale';

type PermissionGroup = {
    model: string;
    label: string;
    permissions: string[];
};

export default function RoleFormFields({
    values = {},
    errors = {},
    permissionGroups,
    nameLocked = false,
}: {
    values?: {
        name?: string;
        permissions?: string[];
    };
    errors?: Partial<Record<string, string>>;
    permissionGroups: PermissionGroup[];
    nameLocked?: boolean;
}) {
    const { t } = useTranslations();
    const [selected, setSelected] = useState<string[]>(
        values.permissions ?? [],
    );

    const toggle = (permission: string, checked: boolean) => {
        setSelected((current) =>
            checked
                ? [...current, permission]
                : current.filter((item) => item !== permission),
        );
    };

    const toggleGroup = (permissions: string[], checked: boolean) => {
        setSelected((current) => {
            if (checked) {
                return [...new Set([...current, ...permissions])];
            }

            return current.filter((item) => !permissions.includes(item));
        });
    };

    return (
        <div className="space-y-6">
            <section className="border-border/80 space-y-4 rounded-lg border p-5">
                <h3 className="text-sm font-semibold tracking-tight">
                    {t('roles.sectionDetails')}
                </h3>
                <div className="grid gap-2 sm:max-w-md">
                    <Label htmlFor="name">{t('common.name')}</Label>
                    <Input
                        id="name"
                        name="name"
                        required
                        readOnly={nameLocked}
                        className={nameLocked ? 'bg-muted' : undefined}
                        defaultValue={values.name ?? ''}
                        placeholder={t('roles.placeholderName')}
                        autoFocus={!nameLocked}
                    />
                    {nameLocked && (
                        <p className="text-muted-foreground text-xs">
                            {t('roles.superAdminNameLocked')}
                        </p>
                    )}
                    <InputError message={errors.name} />
                </div>
            </section>

            <section className="border-border/80 space-y-4 rounded-lg border p-5">
                <div>
                    <h3 className="text-sm font-semibold tracking-tight">
                        {t('roles.sectionPermissions')}
                    </h3>
                    <p className="text-muted-foreground mt-1 text-sm">
                        {t('roles.sectionPermissionsDesc')}
                    </p>
                </div>

                <div className="grid gap-4 lg:grid-cols-2">
                    {permissionGroups.map((group) => {
                        const allChecked = group.permissions.every((permission) =>
                            selected.includes(permission),
                        );
                        const someChecked =
                            !allChecked &&
                            group.permissions.some((permission) =>
                                selected.includes(permission),
                            );

                        return (
                            <div
                                key={group.model}
                                className="bg-muted/30 space-y-3 rounded-lg p-4"
                            >
                                <label className="flex cursor-pointer items-center gap-3">
                                    <Checkbox
                                        checked={
                                            allChecked
                                                ? true
                                                : someChecked
                                                  ? 'indeterminate'
                                                  : false
                                        }
                                        onCheckedChange={(value) =>
                                            toggleGroup(
                                                group.permissions,
                                                value === true,
                                            )
                                        }
                                    />
                                    <span className="text-sm font-medium">
                                        {group.label}
                                    </span>
                                </label>
                                <div className="ms-7 grid gap-2">
                                    {group.permissions.map((permission) => {
                                        const checked =
                                            selected.includes(permission);
                                        const action = permission.split('.')[1];

                                        return (
                                            <label
                                                key={permission}
                                                className="flex cursor-pointer items-center gap-3"
                                            >
                                                <Checkbox
                                                    checked={checked}
                                                    onCheckedChange={(value) =>
                                                        toggle(
                                                            permission,
                                                            value === true,
                                                        )
                                                    }
                                                />
                                                <span className="text-sm capitalize">
                                                    {action}
                                                </span>
                                                <span className="text-muted-foreground font-mono text-xs">
                                                    {permission}
                                                </span>
                                                {checked && (
                                                    <input
                                                        type="hidden"
                                                        name="permissions[]"
                                                        value={permission}
                                                    />
                                                )}
                                            </label>
                                        );
                                    })}
                                </div>
                            </div>
                        );
                    })}
                </div>
                <InputError message={errors.permissions} />
            </section>
        </div>
    );
}
