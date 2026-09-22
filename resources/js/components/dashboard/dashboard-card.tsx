import type { ReactNode } from 'react';
import { cn } from '@/lib/utils';

export type DashboardCardProps = {
    title?: string;
    description?: string;
    action?: ReactNode;
    children: ReactNode;
    className?: string;
    contentClassName?: string;
    /** Optional footer region below the main content. */
    footer?: ReactNode;
};

/**
 * Generic dashboard section container.
 * Provides consistent title, description, action, and content spacing
 * so analytics panels, tables, and lists share one visual structure.
 */
export function DashboardCard({
    title,
    description,
    action,
    children,
    className,
    contentClassName,
    footer,
}: DashboardCardProps) {
    const hasHeader = Boolean(title || description || action);

    return (
        <section
            className={cn(
                'border-border/80 bg-card text-card-foreground flex flex-col rounded-lg border shadow-regal',
                className,
            )}
        >
            {hasHeader && (
                <header className="flex flex-col gap-3 border-b border-border/60 px-5 py-4 sm:flex-row sm:items-start sm:justify-between md:px-6">
                    <div className="min-w-0">
                        {title && (
                            <h2 className="text-section-title text-foreground">
                                {title}
                            </h2>
                        )}
                        {description && (
                            <p className="text-muted-foreground mt-1 text-body">
                                {description}
                            </p>
                        )}
                    </div>
                    {action && (
                        <div className="flex shrink-0 items-center gap-2">
                            {action}
                        </div>
                    )}
                </header>
            )}

            <div className={cn('flex-1 px-5 py-5 md:px-6', contentClassName)}>
                {children}
            </div>

            {footer && (
                <footer className="border-border/60 border-t px-5 py-3 md:px-6">
                    {footer}
                </footer>
            )}
        </section>
    );
}
