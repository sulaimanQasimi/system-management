import { usePage } from '@inertiajs/react';
import { useCallback } from 'react';
import type { Auth } from '@/types';
import { AppPermissions } from '@/support/permissions';

type PageProps = {
    auth: Auth;
};

export function useCan() {
    const { auth } = usePage<PageProps>().props;
    const permissions = auth.permissions ?? [];
    const roles = auth.roles ?? [];

    const can = useCallback(
        (permission: string) => {
            if (roles.includes(AppPermissions.ROLE_SUPER_ADMIN)) {
                return true;
            }

            return permissions.includes(permission);
        },
        [permissions, roles],
    );

    const canAny = useCallback(
        (checks: string[]) => checks.some((permission) => can(permission)),
        [can],
    );

    return { can, canAny, permissions, roles };
}
