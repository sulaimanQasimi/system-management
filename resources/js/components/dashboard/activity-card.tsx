import type { LucideIcon } from 'lucide-react';
import type { ReactNode } from 'react';
import {
    DashboardCard,
    type DashboardCardProps,
} from '@/components/dashboard/dashboard-card';
import { cn } from '@/lib/utils';

export type ActivityItem = {
    id: string | number;
    title: string;
    description?: string;
    timestamp?: string;
    icon?: LucideIcon;
    meta?: ReactNode;
};

type ActivityCardProps = Omit<DashboardCardProps, 'children'> & {
    items: ActivityItem[];
    emptyMessage?: string;
};

/**
 * Recent-activity feed card for dashboards.
 * Presentation-only — pass activity data from the page/controller.
 */
export function ActivityCard({
    items,
    emptyMessage = 'No recent activity.',
    ...cardProps
}: ActivityCardProps) {
    return (
        <DashboardCard {...cardProps} contentClassName="px-0 py-0 md:px-0">
            {items.length === 0 ? (
                <p className="text-muted-foreground px-5 py-8 text-center text-sm md:px-6">
                    {emptyMessage}
                </p>
            ) : (
                <ul className="divide-border/60 divide-y" role="list">
                    {items.map((item) => {
                        const Icon = item.icon;

                        return (
                            <li
                                key={item.id}
                                className="flex gap-3 px-5 py-4 md:px-6"
                            >
                                {Icon && (
                                    <div
                                        className="bg-primary-light text-primary mt-0.5 flex size-9 shrink-0 items-center justify-center rounded-md"
                                        aria-hidden
                                    >
                                        <Icon className="size-4" />
                                    </div>
                                )}
                                <div className="min-w-0 flex-1">
                                    <div className="flex flex-wrap items-baseline justify-between gap-x-3 gap-y-1">
                                        <p className="text-heading text-foreground">
                                            {item.title}
                                        </p>
                                        {item.timestamp && (
                                            <time className="text-caption shrink-0">
                                                {item.timestamp}
                                            </time>
                                        )}
                                    </div>
                                    {item.description && (
                                        <p className="text-muted-foreground mt-0.5 text-body">
                                            {item.description}
                                        </p>
                                    )}
                                    {item.meta && (
                                        <div className="mt-2">{item.meta}</div>
                                    )}
                                </div>
                            </li>
                        );
                    })}
                </ul>
            )}
        </DashboardCard>
    );
}

type FocusTileProps = {
    title: string;
    description: string;
    icon?: LucideIcon;
    className?: string;
};

/** Compact focus/feature tile used inside dashboard panels. */
export function FocusTile({
    title,
    description,
    icon: Icon,
    className,
}: FocusTileProps) {
    return (
        <div
            className={cn(
                'bg-muted/50 hover:bg-muted/70 rounded-lg p-4 transition-colors',
                className,
            )}
        >
            {Icon && (
                <div
                    className="bg-primary-light text-primary mb-3 flex size-9 items-center justify-center rounded-md"
                    aria-hidden
                >
                    <Icon className="size-4" />
                </div>
            )}
            <h3 className="text-heading text-foreground">{title}</h3>
            <p className="text-muted-foreground mt-1.5 text-body">{description}</p>
        </div>
    );
}
