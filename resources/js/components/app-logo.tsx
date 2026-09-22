import { usePage } from '@inertiajs/react';

import AppLogoIcon from '@/components/app-logo-icon';

export default function AppLogo() {
    const { name } = usePage().props;

    return (
        <>
            <div className="bg-sidebar-primary/95 text-sidebar-primary-foreground ring-sidebar-primary/30 flex aspect-square size-8 items-center justify-center rounded-lg shadow-[0_0_18px_-4px_var(--sidebar-glow)] ring-1">
                <AppLogoIcon className="size-5 text-current" />
            </div>
            <div className="ml-1 grid flex-1 text-left text-sm">
                <span className="truncate leading-tight font-semibold tracking-tight">
                    {name}
                </span>
                <span className="text-sidebar-foreground/55 truncate text-[11px] leading-tight">
                    Department Portal
                </span>
            </div>
        </>
    );
}
