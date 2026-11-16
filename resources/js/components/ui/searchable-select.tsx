import { Check, ChevronsUpDown, Search, X } from 'lucide-react';
import {
    useEffect,
    useId,
    useMemo,
    useRef,
    useState,
    type KeyboardEvent,
} from 'react';
import { useTranslations } from '@/hooks/use-locale';
import { cn } from '@/lib/utils';

export type SearchableSelectOption = {
    value: string;
    label: string;
};

export default function SearchableSelect({
    id,
    name,
    value,
    onValueChange,
    options,
    placeholder,
    searchPlaceholder,
    required = false,
    allowClear = false,
    disabled = false,
    className,
}: {
    id: string;
    name: string;
    value: string;
    onValueChange: (value: string) => void;
    options: SearchableSelectOption[];
    placeholder: string;
    searchPlaceholder?: string;
    required?: boolean;
    allowClear?: boolean;
    disabled?: boolean;
    className?: string;
}) {
    const { t } = useTranslations();
    const listboxId = useId();
    const rootRef = useRef<HTMLDivElement>(null);
    const searchRef = useRef<HTMLInputElement>(null);
    const [open, setOpen] = useState(false);
    const [query, setQuery] = useState('');
    const [highlightIndex, setHighlightIndex] = useState(0);

    const selected = options.find((option) => option.value === value) ?? null;

    const filtered = useMemo(() => {
        const term = query.trim().toLowerCase();

        if (!term) {
            return options;
        }

        return options.filter((option) =>
            option.label.toLowerCase().includes(term),
        );
    }, [options, query]);

    useEffect(() => {
        if (!open) {
            return;
        }

        setQuery('');
        setHighlightIndex(0);
        const timer = window.setTimeout(() => searchRef.current?.focus(), 0);

        const onPointerDown = (event: MouseEvent) => {
            if (!rootRef.current?.contains(event.target as Node)) {
                setOpen(false);
            }
        };

        document.addEventListener('mousedown', onPointerDown);

        return () => {
            window.clearTimeout(timer);
            document.removeEventListener('mousedown', onPointerDown);
        };
    }, [open]);

    useEffect(() => {
        setHighlightIndex(0);
    }, [query]);

    const selectOption = (next: string) => {
        onValueChange(next);
        setOpen(false);
    };

    const onTriggerKeyDown = (event: KeyboardEvent<HTMLButtonElement>) => {
        if (disabled) {
            return;
        }

        if (
            event.key === 'ArrowDown' ||
            event.key === 'Enter' ||
            event.key === ' '
        ) {
            event.preventDefault();
            setOpen(true);
        }
    };

    const onSearchKeyDown = (event: KeyboardEvent<HTMLInputElement>) => {
        if (event.key === 'Escape') {
            event.preventDefault();
            setOpen(false);
            return;
        }

        if (event.key === 'ArrowDown') {
            event.preventDefault();
            setHighlightIndex((current) =>
                filtered.length === 0
                    ? 0
                    : Math.min(current + 1, filtered.length - 1),
            );
            return;
        }

        if (event.key === 'ArrowUp') {
            event.preventDefault();
            setHighlightIndex((current) => Math.max(current - 1, 0));
            return;
        }

        if (event.key === 'Enter') {
            event.preventDefault();
            const option = filtered[highlightIndex];

            if (option) {
                selectOption(option.value);
            }
        }
    };

    return (
        <div ref={rootRef} className={cn('relative', className)}>
            <input
                type="hidden"
                name={name}
                value={value}
                required={required}
            />

            <button
                type="button"
                id={id}
                disabled={disabled}
                aria-haspopup="listbox"
                aria-expanded={open}
                aria-controls={listboxId}
                onClick={() => setOpen((current) => !current)}
                onKeyDown={onTriggerKeyDown}
                className={cn(
                    'border-input bg-background focus-visible:border-ring focus-visible:ring-ring/50 flex h-9 w-full items-center justify-between gap-2 rounded-md border px-3 text-sm shadow-xs outline-none focus-visible:ring-[3px] disabled:cursor-not-allowed disabled:opacity-50',
                    !selected && 'text-muted-foreground',
                )}
            >
                <span className="truncate text-start">
                    {selected?.label ?? placeholder}
                </span>
                <span className="flex shrink-0 items-center gap-1">
                    {allowClear && value !== '' && (
                        <span
                            role="button"
                            tabIndex={-1}
                            aria-label={t('common.clearFilters')}
                            className="text-muted-foreground hover:text-foreground rounded p-0.5"
                            onClick={(event) => {
                                event.stopPropagation();
                                onValueChange('');
                            }}
                        >
                            <X className="size-3.5" />
                        </span>
                    )}
                    <ChevronsUpDown className="text-muted-foreground size-4 opacity-60" />
                </span>
            </button>

            {open && (
                <div className="border-border bg-popover text-popover-foreground absolute z-50 mt-1 w-full overflow-hidden rounded-md border shadow-md">
                    <div className="border-border flex items-center gap-2 border-b px-3 py-2">
                        <Search className="text-muted-foreground size-4 shrink-0" />
                        <input
                            ref={searchRef}
                            value={query}
                            onChange={(event) => setQuery(event.target.value)}
                            onKeyDown={onSearchKeyDown}
                            placeholder={
                                searchPlaceholder ?? t('common.searchEllipsis')
                            }
                            className="placeholder:text-muted-foreground h-7 w-full bg-transparent text-sm outline-none"
                            autoComplete="off"
                        />
                    </div>

                    <ul
                        id={listboxId}
                        role="listbox"
                        className="max-h-60 overflow-y-auto p-1"
                    >
                        {filtered.length === 0 ? (
                            <li className="text-muted-foreground px-2 py-3 text-center text-sm">
                                {t('common.noResults')}
                            </li>
                        ) : (
                            filtered.map((option, index) => {
                                const isSelected = option.value === value;
                                const isHighlighted = index === highlightIndex;

                                return (
                                    <li key={option.value} role="option">
                                        <button
                                            type="button"
                                            className={cn(
                                                'flex w-full items-center gap-2 rounded-sm px-2 py-1.5 text-start text-sm',
                                                isHighlighted && 'bg-accent',
                                                isSelected && 'font-medium',
                                            )}
                                            onMouseEnter={() =>
                                                setHighlightIndex(index)
                                            }
                                            onClick={() =>
                                                selectOption(option.value)
                                            }
                                        >
                                            <Check
                                                className={cn(
                                                    'size-3.5 shrink-0',
                                                    isSelected
                                                        ? 'opacity-100'
                                                        : 'opacity-0',
                                                )}
                                            />
                                            <span className="truncate">
                                                {option.label}
                                            </span>
                                        </button>
                                    </li>
                                );
                            })
                        )}
                    </ul>
                </div>
            )}
        </div>
    );
}
