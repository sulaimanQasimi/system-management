import {
    createContext,
    useContext,
    type ComponentProps,
    type ReactNode,
} from 'react';
import { cn } from '@/lib/utils';

type DataTableProps = {
    children: ReactNode;
    /** Minimum table width for horizontal scroll (e.g. 640, "960px"). */
    minWidth?: number | string;
    /** Use fixed layout with optional column widths. */
    fixed?: boolean;
    /** Percentage or CSS widths for <colgroup> columns. */
    columnWidths?: string[];
    className?: string;
    tableClassName?: string;
};

type DataTableContextValue = {
    fixed: boolean;
};

const DataTableContext = createContext<DataTableContextValue>({
    fixed: false,
});

function resolveMinWidth(minWidth?: number | string) {
    if (minWidth === undefined) {
        return undefined;
    }

    return typeof minWidth === 'number' ? `${minWidth}px` : minWidth;
}

/**
 * Shared list-table shell used across resource index pages.
 * Preserves the Regal card + muted header design.
 *
 * Auto layout (default): content columns shrink to fit; actions absorb leftover space.
 * Fixed layout: use with `columnWidths` for dense multi-column tables (e.g. AD users).
 */
function DataTable({
    children,
    minWidth = 640,
    fixed = false,
    columnWidths,
    className,
    tableClassName,
}: DataTableProps) {
    const minWidthValue = resolveMinWidth(minWidth);
    const isFixed = fixed || Boolean(columnWidths?.length);

    return (
        <DataTableContext.Provider value={{ fixed: isFixed }}>
            <div
                className={cn(
                    'border-border/80 bg-card overflow-hidden rounded-lg border shadow-regal',
                    className,
                )}
            >
                <div className="overflow-x-auto">
                    <table
                        className={cn(
                            'w-full text-start text-sm',
                            isFixed
                                ? 'table-fixed'
                                : [
                                      // Content columns hug their text; last column (actions) takes leftover space.
                                      '[&_tbody_tr>td:not(:last-child)]:w-[1%]',
                                      '[&_tbody_tr>td:not(:last-child)]:whitespace-nowrap',
                                  ],
                            tableClassName,
                        )}
                        style={
                            minWidthValue
                                ? { minWidth: minWidthValue }
                                : undefined
                        }
                    >
                        {columnWidths && columnWidths.length > 0 && (
                            <colgroup>
                                {columnWidths.map((width, index) => (
                                    <col key={index} style={{ width }} />
                                ))}
                            </colgroup>
                        )}
                        {children}
                    </table>
                </div>
            </div>
        </DataTableContext.Provider>
    );
}

function DataTableHeader({
    className,
    ...props
}: ComponentProps<'thead'>) {
    return (
        <thead
            className={cn('bg-muted/50 border-b', className)}
            {...props}
        />
    );
}

function DataTableHeaderRow({
    className,
    ...props
}: ComponentProps<'tr'>) {
    return (
        <tr
            className={cn('text-muted-foreground', className)}
            {...props}
        />
    );
}

type DataTableHeadProps = Omit<ComponentProps<'th'>, 'align'> & {
    align?: 'start' | 'end' | 'center';
};

function DataTableHead({
    className,
    align = 'start',
    ...props
}: DataTableHeadProps) {
    const { fixed } = useContext(DataTableContext);

    return (
        <th
            className={cn(
                'px-4 py-3 font-medium whitespace-nowrap',
                // Shrink label columns to content; actions column takes leftover width.
                !fixed && align !== 'end' && 'w-[1%]',
                align === 'end' && 'text-end',
                align === 'center' && 'text-center',
                className,
            )}
            {...props}
        />
    );
}

function DataTableBody({
    className,
    ...props
}: ComponentProps<'tbody'>) {
    return <tbody className={cn(className)} {...props} />;
}

function DataTableRow({
    className,
    ...props
}: ComponentProps<'tr'>) {
    return (
        <tr
            className={cn('border-b last:border-0', className)}
            {...props}
        />
    );
}

function DataTableCell({
    className,
    truncate = false,
    ...props
}: ComponentProps<'td'> & {
    truncate?: boolean;
}) {
    return (
        <td
            className={cn(
                'px-4 py-3',
                truncate && 'truncate',
                className,
            )}
            {...props}
        />
    );
}

function DataTableEmpty({
    colSpan,
    children,
    className,
}: {
    colSpan: number;
    children: ReactNode;
    className?: string;
}) {
    return (
        <tr>
            <td
                colSpan={colSpan}
                className={cn(
                    'text-muted-foreground px-4 py-10 text-center',
                    className,
                )}
            >
                {children}
            </td>
        </tr>
    );
}

function DataTableActions({
    className,
    ...props
}: ComponentProps<'div'>) {
    return (
        <div
            data-slot="data-table-actions"
            className={cn(
                'flex items-center justify-end gap-1',
                className,
            )}
            {...props}
        />
    );
}

export {
    DataTable,
    DataTableActions,
    DataTableBody,
    DataTableCell,
    DataTableEmpty,
    DataTableHead,
    DataTableHeader,
    DataTableHeaderRow,
    DataTableRow,
};
