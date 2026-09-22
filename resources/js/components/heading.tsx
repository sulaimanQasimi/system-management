/**
 * Shared page heading for settings and nested sections.
 * Prefer PageHeader for top-level resource pages.
 */
export default function Heading({
    title,
    description,
    variant = 'default',
}: {
    title: string;
    description?: string;
    variant?: 'default' | 'small';
}) {
    return (
        <header className={variant === 'small' ? '' : 'mb-8 space-y-0.5'}>
            <h2
                className={
                    variant === 'small'
                        ? 'text-heading mb-0.5'
                        : 'text-section-title'
                }
            >
                {title}
            </h2>
            {description && (
                <p className="text-muted-foreground text-body">{description}</p>
            )}
        </header>
    );
}
