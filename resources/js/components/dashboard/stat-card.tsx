import type { LucideIcon } from 'lucide-react';
import { ArrowDownRight, ArrowRight, ArrowUpRight } from 'lucide-react';
import type { ReactNode } from 'react';
import { Skeleton } from '@/components/ui/skeleton';
import { cn } from '@/lib/utils';

export type StatTrendType = 'positive' | 'negative' | 'neutral';

export type StatCardProps = {
    title: string;
    value: string | number;
    icon?: LucideIcon;
    description?: string;
    subtitle?: string;
    trend?: string;
    trendType?: StatTrendType;
    /** Contextual label next to trend, e.g. "vs last month". */
    trendLabel?: string;
    loading?: boolean;
    action?: ReactNode;
    className?: string;
};

const trendStyles: Record<
    StatTrendType,
    { text: string; icon: typeof ArrowUpRight }
> = {
    positive: { text: 'text-success', icon: ArrowUpRight },
    negative: { text: 'text-destructive', icon: ArrowDownRight },
    neutral: { text: 'text-muted-foreground', icon: ArrowRight },
};

/**
 * Shared StatCard used across dashboard pages.
 * Keeps metric presentation consistent while allowing
 * different data, icons, and trend states.
 */
export function StatCard({
    title,
    value,
    icon: Icon,
    description,
    subtitle,
    trend,
    trendType = 'neutral',
    trendLabel,
    loading = false,
    action,
    className,
}: StatCardProps) {
    const trendConfig = trendStyles[trendType];
    const TrendIcon = trendConfig.icon;

    return (
        <article
            className={cn(
                'border-border/80 bg-card text-card-foreground relative flex flex-col gap-4 rounded-lg border p-5 shadow-regal',
                className,
            )}
        >
            <div className="flex items-start justify-between gap-3">
                <div className="min-w-0">
                    <p className="text-muted-foreground text-label truncate">
                        {title}
                    </p>
                    {subtitle && (
                        <p className="text-caption mt-0.5">{subtitle}</p>
                    )}
                </div>
                {Icon && (
                    <div
                        className="bg-primary-light text-primary flex size-10 shrink-0 items-center justify-center rounded-lg"
                        aria-hidden
                    >
                        <Icon className="size-5" />
                    </div>
                )}
            </div>

            {loading ? (
                <div className="space-y-3" aria-busy="true" aria-live="polite">
                    <Skeleton className="h-9 w-28" />
                    <Skeleton className="h-4 w-36" />
                </div>
            ) : (
                <>
                    <p className="text-foreground text-3xl font-semibold tracking-tight tabular-nums">
                        {value}
                    </p>

                    {(description || trend) && (
                        <div className="mt-auto flex flex-wrap items-center gap-x-2 gap-y-1">
                            {trend && (
                                <span
                                    className={cn(
                                        'inline-flex items-center gap-0.5 text-xs font-medium',
                                        trendConfig.text,
                                    )}
                                >
                                    <TrendIcon
                                        className="size-3.5"
                                        aria-hidden
                                    />
                                    <span>{trend}</span>
                                    <span className="sr-only">
                                        {trendType === 'positive'
                                            ? 'increase'
                                            : trendType === 'negative'
                                              ? 'decrease'
                                              : 'change'}
                                    </span>
                                </span>
                            )}
                            {(trendLabel || description) && (
                                <span className="text-caption">
                                    {trendLabel ?? description}
                                </span>
                            )}
                        </div>
                    )}

                    {action && <div className="pt-1">{action}</div>}
                </>
            )}
        </article>
    );
}
