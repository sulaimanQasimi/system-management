import { useState } from 'react';
import InputError from '@/components/input-error';
import { Checkbox } from '@/components/ui/checkbox';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';

type RoleOption = { id: number; name: string };

type PermissionGroup = {
    model: string;
    label: string;
    permissions: string[];
};

export default function UserFormFields({
    values = {},
    errors = {},
    roles,
    permissionGroups,
    isEdit = false,
}: {
    values?: {
        name?: string;
        email?: string;
        roles?: string[];
    };
    errors?: Partial<Record<string, string>>;
    roles: RoleOption[];
    permissionGroups: PermissionGroup[];
    isEdit?: boolean;
}) {
    const [selectedRoles, setSelectedRoles] = useState<string[]>(
        values.roles ?? [],
    );

    const toggleRole = (role: string, checked: boolean) => {
        setSelectedRoles((current) =>
            checked
                ? [...current, role]
                : current.filter((item) => item !== role),
        );
    };

    return (
        <div className="space-y-6">
            <section className="border-border space-y-4 rounded-xl border p-5">
                <h3 className="text-sm font-semibold tracking-tight">
                    Account
                </h3>
                <div className="grid gap-4 sm:grid-cols-2">
                    <div className="grid gap-2">
                        <Label htmlFor="name">Name</Label>
                        <Input
                            id="name"
                            name="name"
                            required
                            defaultValue={values.name ?? ''}
                            autoComplete="name"
                        />
                        <InputError message={errors.name} />
                    </div>
                    <div className="grid gap-2">
                        <Label htmlFor="email">Email</Label>
                        <Input
                            id="email"
                            name="email"
                            type="email"
                            required
                            defaultValue={values.email ?? ''}
                            autoComplete="username"
                        />
                        <InputError message={errors.email} />
                    </div>
                    <div className="grid gap-2">
                        <Label htmlFor="password">
                            Password
                            {isEdit ? ' (optional)' : ''}
                        </Label>
                        <Input
                            id="password"
                            name="password"
                            type="password"
                            required={!isEdit}
                            autoComplete="new-password"
                        />
                        <InputError message={errors.password} />
                    </div>
                    <div className="grid gap-2">
                        <Label htmlFor="password_confirmation">
                            Confirm password
                        </Label>
                        <Input
                            id="password_confirmation"
                            name="password_confirmation"
                            type="password"
                            required={!isEdit}
                            autoComplete="new-password"
                        />
                    </div>
                </div>
            </section>

            <section className="border-border space-y-4 rounded-xl border p-5">
                <div>
                    <h3 className="text-sm font-semibold tracking-tight">
                        Roles
                    </h3>
                    <p className="text-muted-foreground mt-1 text-sm">
                        Roles grant model.action permissions across the app.
                    </p>
                </div>
                <div className="grid gap-3 sm:grid-cols-2">
                    {roles.map((role) => {
                        const checked = selectedRoles.includes(role.name);

                        return (
                            <label
                                key={role.id}
                                className="border-border hover:bg-muted/40 flex cursor-pointer items-center gap-3 rounded-lg border px-3 py-2.5"
                            >
                                <Checkbox
                                    checked={checked}
                                    onCheckedChange={(value) =>
                                        toggleRole(role.name, value === true)
                                    }
                                />
                                <span className="text-sm font-medium">
                                    {role.name}
                                </span>
                                {checked && (
                                    <input
                                        type="hidden"
                                        name="roles[]"
                                        value={role.name}
                                    />
                                )}
                            </label>
                        );
                    })}
                </div>
                <InputError message={errors.roles} />
            </section>

            <section className="border-border space-y-4 rounded-xl border p-5">
                <div>
                    <h3 className="text-sm font-semibold tracking-tight">
                        Permission matrix
                    </h3>
                    <p className="text-muted-foreground mt-1 text-sm">
                        Reference of model.action permissions available in the
                        system.
                    </p>
                </div>
                <div className="grid gap-4 lg:grid-cols-2">
                    {permissionGroups.map((group) => (
                        <div
                            key={group.model}
                            className="bg-muted/30 rounded-lg p-4"
                        >
                            <p className="mb-2 text-sm font-medium">
                                {group.label}
                            </p>
                            <div className="flex flex-wrap gap-1.5">
                                {group.permissions.map((permission) => (
                                    <span
                                        key={permission}
                                        className="bg-background text-muted-foreground rounded-md border px-2 py-0.5 font-mono text-xs"
                                    >
                                        {permission}
                                    </span>
                                ))}
                            </div>
                        </div>
                    ))}
                </div>
            </section>
        </div>
    );
}
