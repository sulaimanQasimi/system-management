import {
    DashboardCard,
    type DashboardCardProps,
} from '@/components/dashboard/dashboard-card';

type ChartCardProps = Omit<DashboardCardProps, 'contentClassName'> & {
    /** Minimum chart area height for empty or loading states. */
    minHeight?: string;
    emptyMessage?: string;
    isEmpty?: boolean;
};

/**
 * Dashboard card specialized for chart/analytics regions.
 * Reuses DashboardCard chrome so charts align with other dashboard panels.
 */
export function ChartCard({
    children,
    minHeight = '16rem',
    emptyMessage = 'No chart data available.',
    isEmpty = false,
    className,
    ...props
}: ChartCardProps) {
    return (
        <DashboardCard
            className={className}
            contentClassName="pt-4"
            {...props}
        >
            <div
                className="relative w-full"
                style={{ minHeight }}
            >
                {isEmpty ? (
                    <div className="bg-muted/40 text-muted-foreground flex h-full min-h-[inherit] items-center justify-center rounded-md text-sm">
                        {emptyMessage}
                    </div>
                ) : (
                    children
                )}
            </div>
        </DashboardCard>
    );
}

/** Placeholder series row for when real chart libs are not yet wired. */
export function ChartPlaceholder({
    label,
    value,
    percent,
}: {
    label: string;
    value: string;
    percent: number;
}) {
    return (
        <div className="space-y-2">
            <div className="flex items-center justify-between gap-3 text-sm">
                <span className="text-foreground font-medium">{label}</span>
                <span className="text-muted-foreground tabular-nums">
                    {value}
                </span>
            </div>
            <div
                className="bg-muted h-2 overflow-hidden rounded-full"
                role="meter"
                aria-label={label}
                aria-valuenow={percent}
                aria-valuemin={0}
                aria-valuemax={100}
            >
                <div
                    className="bg-primary h-full rounded-full transition-[width]"
                    style={{ width: `${Math.min(100, Math.max(0, percent))}%` }}
                />
            </div>
        </div>
    );
}
