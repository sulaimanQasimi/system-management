import type { LucideIcon } from 'lucide-react';
import type { ReactNode } from 'react';
import { cn } from '@/lib/utils';

type PageHeaderProps = {
    title: string;
    description?: string;
    /** Optional leading icon shown in a soft primary-light well. */
    icon?: LucideIcon;
    /** Right-side actions (buttons, menus). */
    action?: ReactNode;
    className?: string;
};

/**
 * Shared page header used across list, create, edit, and detail views.
 * Keeps title hierarchy, icon treatment, and action alignment consistent.
 */
export function PageHeader({
    title,
    description,
    icon: Icon,
    action,
    className,
}: PageHeaderProps) {
    return (
        <div
            className={cn(
                'flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between',
                className,
            )}
        >
            <div className="flex min-w-0 items-start gap-3">
                {Icon && (
                    <div
                        className="bg-primary-light text-primary flex size-11 shrink-0 items-center justify-center rounded-lg"
                        aria-hidden
                    >
                        <Icon className="size-5" />
                    </div>
                )}
                <div className="min-w-0">
                    <h1 className="text-page-title text-foreground">{title}</h1>
                    {description && (
                        <p className="text-muted-foreground mt-1 text-body">
                            {description}
                        </p>
                    )}
                </div>
            </div>
            {action && (
                <div className="flex shrink-0 flex-wrap items-center gap-2">
                    {action}
                </div>
            )}
        </div>
    );
}
