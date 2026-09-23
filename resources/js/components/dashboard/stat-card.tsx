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
    | 'secondary'
    | 'violet'
    | 'teal'
    | 'rose'
    | 'indigo'
    | 'orange'
    | 'cyan';

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
    {
        card: string;
        icon: string;
        ring: string;
        track: string;
        value: string;
        title: string;
    }
> = {
    primary: {
        card: 'border-[#1557B0]/30 bg-gradient-to-br from-[#E8F1FF] via-[#E8F1FF] to-[#cfe0ff]  dark:border-[#2563EB]/40 dark:from-[#0B1F3A] dark:via-[#132a47] dark:to-[#1557B0]/35 ',
        icon: 'bg-[#1557B0] text-white dark:bg-[#2563EB]',
        ring: 'stroke-[#1557B0] dark:stroke-[#60a5fa]',
        track: 'stroke-[#1557B0]/20 dark:stroke-white/15',
        value: 'text-[#0B1F3A] dark:text-white',
        title: 'text-[#1557B0] dark:text-[#93c5fd]',
    },
    info: {
        card: 'border-[#2563EB]/30 bg-gradient-to-br from-[#eff6ff] via-[#dbeafe] to-[#bfdbfe]  dark:border-[#3b82f6]/40 dark:from-[#0c1a33] dark:via-[#132a47] dark:to-[#2563EB]/40',
        icon: 'bg-[#2563EB] text-white ',
        ring: 'stroke-[#2563EB] dark:stroke-[#93c5fd]',
        track: 'stroke-[#2563EB]/20 dark:stroke-white/15',
        value: 'text-[#1e3a8a] dark:text-white',
        title: 'text-[#2563EB] dark:text-[#93c5fd]',
    },
    cyan: {
        card: 'border-cyan-400/40 bg-gradient-to-br from-cyan-50 via-sky-50 to-cyan-100  dark:border-cyan-400/35 dark:from-cyan-950/60 dark:via-slate-900 dark:to-cyan-900/40',
        icon: 'bg-cyan-500 text-white ',
        ring: 'stroke-cyan-500 dark:stroke-cyan-300',
        track: 'stroke-cyan-500/20 dark:stroke-white/15',
        value: 'text-cyan-950 dark:text-cyan-50',
        title: 'text-cyan-700 dark:text-cyan-300',
    },
    teal: {
        card: 'border-teal-400/40 bg-gradient-to-br from-teal-50 via-emerald-50 to-teal-100  dark:border-teal-400/35 dark:from-teal-950/60 dark:via-slate-900 dark:to-teal-900/40',
        icon: 'bg-teal-500 text-white ',
        ring: 'stroke-teal-500 dark:stroke-teal-300',
        track: 'stroke-teal-500/20 dark:stroke-white/15',
        value: 'text-teal-950 dark:text-teal-50',
        title: 'text-teal-700 dark:text-teal-300',
    },
    success: {
        card: 'border-emerald-400/40 bg-gradient-to-br from-emerald-50 via-green-50 to-emerald-100  dark:border-emerald-400/35 dark:from-emerald-950/60 dark:via-slate-900 dark:to-emerald-900/40',
        icon: 'bg-emerald-500 text-white ',
        ring: 'stroke-emerald-500 dark:stroke-emerald-300',
        track: 'stroke-emerald-500/20 dark:stroke-white/15',
        value: 'text-emerald-950 dark:text-emerald-50',
        title: 'text-emerald-700 dark:text-emerald-300',
    },
    warning: {
        card: 'border-amber-400/45 bg-gradient-to-br from-amber-50 via-yellow-50 to-amber-100  dark:border-amber-400/35 dark:from-amber-950/50 dark:via-slate-900 dark:to-amber-900/35',
        icon: 'bg-amber-500 text-white ',
        ring: 'stroke-amber-500 dark:stroke-amber-300',
        track: 'stroke-amber-500/25 dark:stroke-white/15',
        value: 'text-amber-950 dark:text-amber-50',
        title: 'text-amber-700 dark:text-amber-300',
    },
    orange: {
        card: 'border-orange-400/45 bg-gradient-to-br from-orange-50 via-amber-50 to-orange-100  dark:border-orange-400/35 dark:from-orange-950/50 dark:via-slate-900 dark:to-orange-900/35',
        icon: 'bg-orange-500 text-white ',
        ring: 'stroke-orange-500 dark:stroke-orange-300',
        track: 'stroke-orange-500/25 dark:stroke-white/15',
        value: 'text-orange-950 dark:text-orange-50',
        title: 'text-orange-700 dark:text-orange-300',
    },
    destructive: {
        card: 'border-[#E53935]/35 bg-gradient-to-br from-[#FDECEC] via-[#ffe2e2] to-[#fecaca]  dark:border-[#E53935]/40 dark:from-[#3b1212] dark:via-[#1f1010] dark:to-[#C62828]/40',
        icon: 'bg-[#E53935] text-white ',
        ring: 'stroke-[#E53935] dark:stroke-[#fb7185]',
        track: 'stroke-[#E53935]/20 dark:stroke-white/15',
        value: 'text-[#C62828] dark:text-[#fecaca]',
        title: 'text-[#E53935] dark:text-[#fda4af]',
    },
    rose: {
        card: 'border-rose-400/40 bg-gradient-to-br from-rose-50 via-pink-50 to-rose-100  dark:border-rose-400/35 dark:from-rose-950/55 dark:via-slate-900 dark:to-rose-900/40',
        icon: 'bg-rose-500 text-white ',
        ring: 'stroke-rose-500 dark:stroke-rose-300',
        track: 'stroke-rose-500/20 dark:stroke-white/15',
        value: 'text-rose-950 dark:text-rose-50',
        title: 'text-rose-700 dark:text-rose-300',
    },
    violet: {
        card: 'border-violet-400/40 bg-gradient-to-br from-violet-50 via-purple-50 to-violet-100  dark:border-violet-400/35 dark:from-violet-950/55 dark:via-slate-900 dark:to-violet-900/40',
        icon: 'bg-violet-500 text-white ',
        ring: 'stroke-violet-500 dark:stroke-violet-300',
        track: 'stroke-violet-500/20 dark:stroke-white/15',
        value: 'text-violet-950 dark:text-violet-50',
        title: 'text-violet-700 dark:text-violet-300',
    },
    indigo: {
        card: 'border-indigo-400/40 bg-gradient-to-br from-indigo-50 via-blue-50 to-indigo-100  dark:border-indigo-400/35 dark:from-indigo-950/55 dark:via-slate-900 dark:to-indigo-900/40',
        icon: 'bg-indigo-500 text-white ',
        ring: 'stroke-indigo-500 dark:stroke-indigo-300',
        track: 'stroke-indigo-500/20 dark:stroke-white/15',
        value: 'text-indigo-950 dark:text-indigo-50',
        title: 'text-indigo-700 dark:text-indigo-300',
    },
    secondary: {
        card: 'border-slate-300/70 bg-gradient-to-br from-slate-50 via-slate-100 to-slate-200  dark:border-slate-500/35 dark:from-slate-900 dark:via-slate-800 dark:to-slate-700/60',
        icon: 'bg-slate-600 text-white dark:bg-slate-500',
        ring: 'stroke-slate-600 dark:stroke-slate-300',
        track: 'stroke-slate-500/25 dark:stroke-white/15',
        value: 'text-slate-900 dark:text-slate-50',
        title: 'text-slate-600 dark:text-slate-300',
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
    const styles = toneStyles[tone] ?? toneStyles.primary;
    const progressValue =
        progress === undefined
            ? undefined
            : Math.min(100, Math.max(0, Math.round(progress)));

    return (
        <article
            className={cn(
                'relative flex flex-col overflow-hidden rounded-2xl border p-5 transition-transform duration-200 hover:-translate-y-0.5',
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
                        <p
                            className={cn(
                                'text-3xl font-semibold tracking-tight tabular-nums',
                                styles.value,
                            )}
                        >
                            {value}
                        </p>
                        <p
                            className={cn(
                                'mt-1 text-sm font-semibold',
                                styles.title,
                            )}
                        >
                            {title}
                        </p>
                        {(hint || subtitle || description) && (
                            <p className="text-muted-foreground mt-1 truncate text-xs">
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
                            valueClassName={styles.value}
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
    valueClassName,
}: {
    value: number;
    ringClassName: string;
    trackClassName: string;
    valueClassName: string;
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
            <span
                className={cn(
                    'absolute inset-0 flex items-center justify-center text-xs font-semibold tabular-nums',
                    valueClassName,
                )}
            >
                {value}%
            </span>
        </div>
    );
}
