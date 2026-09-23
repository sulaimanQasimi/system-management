import { Head, Link } from '@inertiajs/react';
import { Pencil, Shield } from 'lucide-react';
import { DetailField, DetailSection } from '@/components/detail-fields';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { useCan } from '@/hooks/use-can';
import { useTranslations } from '@/hooks/use-locale';
import { edit, index } from '@/routes/roles';

type PermissionGroup = {
    model: string;
    label: string;
    permissions: string[];
};

type RoleShow = {
    id: number;
    name: string;
    permissions: string[];
    users_count: number;
    is_protected: boolean;
    created_at: string | null;
    updated_at: string | null;
};

export default function RolesShow({
    role,
    permissionGroups,
}: {
    role: RoleShow;
    permissionGroups: PermissionGroup[];
}) {
    const { can } = useCan();
    const { t } = useTranslations();

    return (
        <>
            <Head title={role.name} />

            <div className="flex h-full flex-1 flex-col gap-6 p-4 md:p-6">
                <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
                    <div className="flex items-start gap-3">
                        <div className="bg-primary-light text-primary flex size-11 items-center justify-center rounded-lg">
                            <Shield className="size-5" />
                        </div>
                        <div>
                            <div className="flex flex-wrap items-center gap-2">
                                <h1 className="text-xl font-semibold tracking-tight">
                                    {role.name}
                                </h1>
                                {role.is_protected && (
                                    <Badge variant="secondary">
                                        {t('roles.protected')}
                                    </Badge>
                                )}
                            </div>
                            <p className="text-muted-foreground text-sm">
                                {t('roles.roleSubtitle')}
                            </p>
                        </div>
                    </div>
                    <div className="flex flex-wrap gap-2">
                        <Button variant="outline" asChild>
                            <Link href={index()}>
                                {t('roles.backToRoles')}
                            </Link>
                        </Button>
                        {can('role.update') && (
                            <Button asChild>
                                <Link href={edit(role.id)}>
                                    <Pencil />
                                    {t('common.edit')}
                                </Link>
                            </Button>
                        )}
                    </div>
                </div>

                <DetailSection title={t('roles.roleDetails')}>
                    <DetailField label={t('common.name')} value={role.name} />
                    <DetailField
                        label={t('roles.users')}
                        value={role.users_count}
                    />
                    <DetailField
                        label={t('common.createdAt')}
                        value={role.created_at}
                    />
                    <DetailField
                        label={t('common.updatedAt')}
                        value={role.updated_at}
                    />
                </DetailSection>

                <DetailSection title={t('roles.sectionPermissions')}>
                    <div className="md:col-span-2 xl:col-span-3 grid gap-4 lg:grid-cols-2">
                        {permissionGroups.map((group) => {
                            const granted = group.permissions.filter(
                                (permission) =>
                                    role.permissions.includes(permission),
                            );

                            return (
                                <div
                                    key={group.model}
                                    className="bg-muted/30 rounded-lg p-4"
                                >
                                    <p className="mb-2 text-sm font-medium">
                                        {group.label}
                                    </p>
                                    {granted.length === 0 ? (
                                        <p className="text-muted-foreground text-sm">
                                            —
                                        </p>
                                    ) : (
                                        <div className="flex flex-wrap gap-1.5">
                                            {granted.map((permission) => (
                                                <Badge
                                                    key={permission}
                                                    variant="secondary"
                                                >
                                                    {permission}
                                                </Badge>
                                            ))}
                                        </div>
                                    )}
                                </div>
                            );
                        })}
                    </div>
                </DetailSection>
            </div>
        </>
    );
}

RolesShow.layout = {
    breadcrumbs: [
        { title: 'roles.title', href: index() },
        { title: 'roles.breadcrumbDetails', href: '#' },
    ],
};
