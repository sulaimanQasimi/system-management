import type { LucideIcon } from 'lucide-react';
import { MoreVertical } from 'lucide-react';
import type { ReactNode } from 'react';
import { Link } from '@inertiajs/react';
import { Button } from '@/components/ui/button';
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { Skeleton } from '@/components/ui/skeleton';
import { cn } from '@/lib/utils';

export type StatTone =
    | 'primary'
    | 'success'
    | 'warning'
    | 'destructive'
    | 'info'
    | 'secondary';

export type StatTrendType = 'positive' | 'negative' | 'neutral';

export type StatMenuItem = {
    label: string;
    href?: string;
    onSelect?: () => void;
};

export type StatCardProps = {
    title: string;
    value: string | number;
    icon?: LucideIcon;
    /** 0–100 circular progress shown on the right. */
    progress?: number;
    tone?: StatTone;
    description?: string;
    subtitle?: string;
    hint?: string;
    trend?: string;
    trendType?: StatTrendType;
    trendLabel?: string;
    menuItems?: StatMenuItem[];
    loading?: boolean;
    action?: ReactNode;
    className?: string;
};

const toneStyles: Record<
    StatTone,
    { card: string; icon: string; ring: string; track: string }
> = {
    primary: {
        card: 'border-primary/15 bg-primary-light/70 dark:bg-primary-light/40',
        icon: 'bg-primary/15 text-primary',
        ring: 'stroke-primary',
        track: 'stroke-primary/20',
    },
    success: {
        card: 'border-success/20 bg-success/10 dark:bg-success/15',
        icon: 'bg-success/20 text-success',
        ring: 'stroke-success',
        track: 'stroke-success/20',
    },
    warning: {
        card: 'border-warning/25 bg-warning/10 dark:bg-warning/15',
        icon: 'bg-warning/20 text-warning-foreground',
        ring: 'stroke-warning',
        track: 'stroke-warning/25',
    },
    destructive: {
        card: 'border-destructive/20 bg-destructive/10 dark:bg-destructive/15',
        icon: 'bg-destructive/20 text-destructive',
        ring: 'stroke-destructive',
        track: 'stroke-destructive/20',
    },
    info: {
        card: 'border-info/20 bg-info/10 dark:bg-info/15',
        icon: 'bg-info/20 text-info',
        ring: 'stroke-info',
        track: 'stroke-info/20',
    },
    secondary: {
        card: 'border-secondary-foreground/15 bg-secondary/80 dark:bg-secondary/50',
        icon: 'bg-secondary-foreground/10 text-secondary-foreground',
        ring: 'stroke-secondary-foreground',
        track: 'stroke-secondary-foreground/20',
    },
};

/**
 * Shared StatCard used across dashboard pages.
 * Layout: icon + optional menu on top, metric + circular progress below.
 */
export function StatCard({
    title,
    value,
    icon: Icon,
    progress,
    tone = 'primary',
    description,
    subtitle,
    hint,
    loading = false,
    action,
    menuItems,
    className,
}: StatCardProps) {
    const styles = toneStyles[tone];
    const progressValue =
        progress === undefined
            ? undefined
            : Math.min(100, Math.max(0, Math.round(progress)));

    return (
        <article
            className={cn(
                'text-card-foreground relative flex flex-col rounded-2xl border p-5 shadow-regal',
                styles.card,
                className,
            )}
        >
            <div className="flex items-start justify-between gap-3">
                {Icon ? (
                    <div
                        className={cn(
                            'flex size-11 shrink-0 items-center justify-center rounded-xl',
                            styles.icon,
                        )}
                        aria-hidden
                    >
                        <Icon className="size-5" />
                    </div>
                ) : (
                    <span />
                )}

                {menuItems && menuItems.length > 0 && (
                    <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                            <Button
                                type="button"
                                variant="ghost"
                                size="icon"
                                className="text-muted-foreground size-8"
                                aria-label={`${title} options`}
                            >
                                <MoreVertical className="size-4" />
                            </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end">
                            {menuItems.map((item) =>
                                item.href ? (
                                    <DropdownMenuItem key={item.label} asChild>
                                        <Link href={item.href}>
                                            {item.label}
                                        </Link>
                                    </DropdownMenuItem>
                                ) : (
                                    <DropdownMenuItem
                                        key={item.label}
                                        onSelect={item.onSelect}
                                    >
                                        {item.label}
                                    </DropdownMenuItem>
                                ),
                            )}
                        </DropdownMenuContent>
                    </DropdownMenu>
                )}
            </div>

            {loading ? (
                <div
                    className="mt-6 flex items-end justify-between gap-4"
                    aria-busy="true"
                    aria-live="polite"
                >
                    <div className="space-y-2">
                        <Skeleton className="h-8 w-20" />
                        <Skeleton className="h-4 w-28" />
                    </div>
                    <Skeleton className="size-16 rounded-full" />
                </div>
            ) : (
                <div className="mt-6 flex items-end justify-between gap-4">
                    <div className="min-w-0">
                        <p className="text-foreground text-3xl font-semibold tracking-tight tabular-nums">
                            {value}
                        </p>
                        <p className="text-muted-foreground mt-1 text-sm font-medium">
                            {title}
                        </p>
                        {(hint || subtitle || description) && (
                            <p className="text-caption mt-1 truncate">
                                {hint ?? subtitle ?? description}
                            </p>
                        )}
                        {action && <div className="mt-2">{action}</div>}
                    </div>

                    {progressValue !== undefined && (
                        <CircularProgress
                            value={progressValue}
                            ringClassName={styles.ring}
                            trackClassName={styles.track}
                        />
                    )}
                </div>
            )}
        </article>
    );
}

function CircularProgress({
    value,
    ringClassName,
    trackClassName,
}: {
    value: number;
    ringClassName: string;
    trackClassName: string;
}) {
    const size = 64;
    const stroke = 5;
    const radius = (size - stroke) / 2;
    const circumference = 2 * Math.PI * radius;
    const offset = circumference - (value / 100) * circumference;

    return (
        <div
            className="relative size-16 shrink-0"
            role="meter"
            aria-label="Progress"
            aria-valuenow={value}
            aria-valuemin={0}
            aria-valuemax={100}
        >
            <svg
                width={size}
                height={size}
                viewBox={`0 0 ${size} ${size}`}
                className="-rotate-90"
                aria-hidden
            >
                <circle
                    cx={size / 2}
                    cy={size / 2}
                    r={radius}
                    fill="none"
                    strokeWidth={stroke}
                    className={trackClassName}
                />
                <circle
                    cx={size / 2}
                    cy={size / 2}
                    r={radius}
                    fill="none"
                    strokeWidth={stroke}
                    strokeLinecap="round"
                    strokeDasharray={circumference}
                    strokeDashoffset={offset}
                    className={cn(
                        'transition-[stroke-dashoffset] duration-500',
                        ringClassName,
                    )}
                />
            </svg>
            <span className="text-foreground absolute inset-0 flex items-center justify-center text-xs font-semibold tabular-nums">
                {value}%
            </span>
        </div>
    );
}
