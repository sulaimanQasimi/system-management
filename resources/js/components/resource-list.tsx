import { router } from '@inertiajs/react';
import {
    ArrowDown,
    ArrowUp,
    ArrowUpDown,
    Search,
    X,
} from 'lucide-react';
import { useEffect, useRef, useState, type ReactNode } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';

export type ListFilters = {
    search: string;
    sort: string;
    direction: 'asc' | 'desc';
    per_page: number;
    created_from: string;
    created_to: string;
    [key: string]: string | number;
};

export type Paginated<T> = {
    data: T[];
    from: number | null;
    to: number | null;
    total: number;
    links: { url: string | null; label: string; active: boolean }[];
};

type Defaults = {
    sort?: string;
    direction?: 'asc' | 'desc';
    per_page?: number;
};

export function applyListFilters(
    indexUrl: string,
    next: Partial<ListFilters>,
    current: ListFilters,
    defaults: Defaults = {},
) {
    const defaultSort = defaults.sort ?? 'created_at';
    const defaultDirection = defaults.direction ?? 'desc';
    const defaultPerPage = defaults.per_page ?? 15;
    const merged = { ...current, ...next };
    const params: Record<string, string | number> = {};

    Object.entries(merged).forEach(([key, value]) => {
        if (value === '' || value === null || value === undefined) {
            return;
        }

        if (key === 'sort' && value === defaultSort) {
            return;
        }

        if (key === 'direction' && value === defaultDirection) {
            return;
        }

        if (key === 'per_page' && Number(value) === defaultPerPage) {
            return;
        }

        params[key] = value;
    });

    if (next.sort !== undefined || next.direction !== undefined) {
        params.sort = merged.sort;
        params.direction = merged.direction;
    }

    router.get(indexUrl, params, {
        preserveState: true,
        preserveScroll: true,
        replace: true,
    });
}

export function SortHeader({
    label,
    column,
    filters,
    indexUrl,
}: {
    label: string;
    column: string;
    filters: ListFilters;
    indexUrl: string;
}) {
    const active = filters.sort === column;
    const Icon = !active
        ? ArrowUpDown
        : filters.direction === 'asc'
          ? ArrowUp
          : ArrowDown;

    return (
        <button
            type="button"
            className="hover:text-foreground inline-flex items-center gap-1 font-medium"
            onClick={() =>
                applyListFilters(
                    indexUrl,
                    {
                        sort: column,
                        direction:
                            active && filters.direction === 'asc'
                                ? 'desc'
                                : 'asc',
                    },
                    filters,
                )
            }
        >
            {label}
            <Icon className="size-3.5 opacity-60" />
        </button>
    );
}

export function ResourceFilters({
    indexUrl,
    filters,
    perPageOptions,
    extraFields,
    searchPlaceholder = 'Search…',
}: {
    indexUrl: string;
    filters: ListFilters;
    perPageOptions: number[];
    extraFields?: ReactNode;
    searchPlaceholder?: string;
}) {
    const [search, setSearch] = useState(String(filters.search ?? ''));
    const [createdFrom, setCreatedFrom] = useState(
        String(filters.created_from ?? ''),
    );
    const [createdTo, setCreatedTo] = useState(
        String(filters.created_to ?? ''),
    );
    const searchTimeout = useRef<ReturnType<typeof setTimeout> | null>(null);

    useEffect(() => {
        setSearch(String(filters.search ?? ''));
        setCreatedFrom(String(filters.created_from ?? ''));
        setCreatedTo(String(filters.created_to ?? ''));
    }, [filters]);

    useEffect(() => {
        return () => {
            if (searchTimeout.current) {
                clearTimeout(searchTimeout.current);
            }
        };
    }, []);

    const hasActiveFilters = Object.entries(filters).some(([key, value]) => {
        if (key === 'sort') {
            return value !== 'created_at';
        }
        if (key === 'direction') {
            return value !== 'desc';
        }
        if (key === 'per_page') {
            return Number(value) !== 15;
        }

        return value !== '' && value !== null && value !== undefined;
    });

    const onSearchChange = (value: string) => {
        setSearch(value);
        if (searchTimeout.current) {
            clearTimeout(searchTimeout.current);
        }
        searchTimeout.current = setTimeout(() => {
            applyListFilters(indexUrl, { search: value }, filters);
        }, 350);
    };

    return (
        <div className="border-border bg-card rounded-xl border p-4">
            <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
                <div className="grid gap-2 xl:col-span-2">
                    <Label htmlFor="resource-search">Search</Label>
                    <div className="relative">
                        <Search className="text-muted-foreground absolute top-1/2 left-3 size-4 -translate-y-1/2" />
                        <Input
                            id="resource-search"
                            value={search}
                            onChange={(event) =>
                                onSearchChange(event.target.value)
                            }
                            placeholder={searchPlaceholder}
                            className="pl-9"
                        />
                    </div>
                </div>

                <div className="grid gap-2">
                    <Label htmlFor="created_from">Created from</Label>
                    <Input
                        id="created_from"
                        type="date"
                        value={createdFrom}
                        onChange={(event) => {
                            const value = event.target.value;
                            setCreatedFrom(value);
                            applyListFilters(
                                indexUrl,
                                { created_from: value },
                                filters,
                            );
                        }}
                    />
                </div>

                <div className="grid gap-2">
                    <Label htmlFor="created_to">Created to</Label>
                    <Input
                        id="created_to"
                        type="date"
                        value={createdTo}
                        onChange={(event) => {
                            const value = event.target.value;
                            setCreatedTo(value);
                            applyListFilters(
                                indexUrl,
                                { created_to: value },
                                filters,
                            );
                        }}
                    />
                </div>

                {extraFields}
            </div>

            <div className="mt-4 flex flex-wrap items-center justify-end gap-3">
                <div className="flex items-center gap-2">
                    <Label
                        htmlFor="per_page"
                        className="text-muted-foreground whitespace-nowrap"
                    >
                        Per page
                    </Label>
                    <select
                        id="per_page"
                        className="border-input bg-background h-9 rounded-md border px-2 text-sm shadow-xs"
                        value={Number(filters.per_page)}
                        onChange={(event) =>
                            applyListFilters(
                                indexUrl,
                                { per_page: Number(event.target.value) },
                                filters,
                            )
                        }
                    >
                        {perPageOptions.map((option) => (
                            <option key={option} value={option}>
                                {option}
                            </option>
                        ))}
                    </select>
                </div>

                {hasActiveFilters && (
                    <Button
                        type="button"
                        variant="outline"
                        size="sm"
                        onClick={() =>
                            router.get(
                                indexUrl,
                                {},
                                {
                                    preserveState: true,
                                    preserveScroll: true,
                                    replace: true,
                                },
                            )
                        }
                    >
                        <X />
                        Clear filters
                    </Button>
                )}
            </div>
        </div>
    );
}

export function ResourcePagination({
    links,
}: {
    links: Paginated<unknown>['links'];
}) {
    if (links.length <= 3) {
        return null;
    }

    return (
        <div className="flex flex-wrap gap-2">
            {links.map((link, i) =>
                link.url ? (
                    <Button
                        key={i}
                        variant={link.active ? 'default' : 'outline'}
                        size="sm"
                        asChild
                    >
                        <a
                            href={link.url}
                            onClick={(event) => {
                                event.preventDefault();
                                if (link.url) {
                                    router.get(
                                        link.url,
                                        {},
                                        {
                                            preserveState: true,
                                            preserveScroll: true,
                                        },
                                    );
                                }
                            }}
                            dangerouslySetInnerHTML={{ __html: link.label }}
                        />
                    </Button>
                ) : (
                    <Button
                        key={i}
                        variant="outline"
                        size="sm"
                        disabled
                        dangerouslySetInnerHTML={{ __html: link.label }}
                    />
                ),
            )}
        </div>
    );
}

export function ResultSummary({
    from,
    to,
    total,
}: {
    from: number | null;
    to: number | null;
    total: number;
}) {
    return (
        <p className="text-muted-foreground text-sm">
            Showing {from ?? 0}–{to ?? 0} of {total}
        </p>
    );
}
