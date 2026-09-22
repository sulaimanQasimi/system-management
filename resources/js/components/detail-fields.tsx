import type { ReactNode } from 'react';

export function DetailSection({
    title,
    description,
    icon,
    children,
}: {
    title: string;
    description?: string;
    icon?: ReactNode;
    children: ReactNode;
}) {
    return (
        <section className="border-border bg-card/40 space-y-5 rounded-xl border p-5 md:p-6">
            <div className="flex items-start gap-3">
                {icon && (
                    <div className="bg-primary/10 text-primary flex size-10 shrink-0 items-center justify-center rounded-lg">
                        {icon}
                    </div>
                )}
                <div>
                    <h3 className="text-base font-semibold tracking-tight">
                        {title}
                    </h3>
                    {description && (
                        <p className="text-muted-foreground mt-1 text-sm">
                            {description}
                        </p>
                    )}
                </div>
            </div>
            <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
                {children}
            </div>
        </section>
    );
}

export function DetailField({
    label,
    value,
    className,
}: {
    label: string;
    value?: ReactNode;
    className?: string;
}) {
    const empty =
        value === null ||
        value === undefined ||
        value === '' ||
        (Array.isArray(value) && value.length === 0);

    return (
        <div className={className}>
            <dt className="text-muted-foreground text-xs font-medium tracking-wide uppercase">
                {label}
            </dt>
            <dd className="mt-1 text-sm font-medium break-words">
                {empty ? '—' : value}
            </dd>
        </div>
    );
}
