import { Languages } from 'lucide-react';
import { Button } from '@/components/ui/button';
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuLabel,
    DropdownMenuSeparator,
    DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import {
    Tooltip,
    TooltipContent,
    TooltipTrigger,
} from '@/components/ui/tooltip';
import { useLocale } from '@/hooks/use-locale';
import type { LocaleCode } from '@/locales';
import { cn } from '@/lib/utils';

/**
 * Compact header control for English (LTR) / Dari (RTL).
 */
export function LocaleSwitcher({ className }: { className?: string }) {
    const { locale, setLocale, availableLocales, t, definition } = useLocale();

    return (
        <DropdownMenu>
            <Tooltip>
                <TooltipTrigger asChild>
                    <DropdownMenuTrigger asChild>
                        <Button
                            type="button"
                            variant="ghost"
                            size="icon"
                            className={cn('size-8 shrink-0', className)}
                            aria-label={t('locale.switchLanguage')}
                        >
                            <Languages className="size-4" aria-hidden />
                        </Button>
                    </DropdownMenuTrigger>
                </TooltipTrigger>
                <TooltipContent side="bottom">
                    {t('locale.switchLanguage')} · {definition.native}
                </TooltipContent>
            </Tooltip>

            <DropdownMenuContent align="end" className="min-w-44">
                <DropdownMenuLabel>{t('locale.label')}</DropdownMenuLabel>
                <DropdownMenuSeparator />
                {availableLocales.map((item) => {
                    const code = item.code as LocaleCode;
                    const selected = locale === code;

                    return (
                        <DropdownMenuItem
                            key={code}
                            onSelect={() => {
                                if (!selected) {
                                    setLocale(code);
                                }
                            }}
                            className={cn(
                                'flex cursor-pointer items-center justify-between gap-3',
                                selected && 'bg-accent',
                            )}
                        >
                            <span className="flex flex-col">
                                <span className="font-medium">
                                    {code === 'fa'
                                        ? t('locale.dari')
                                        : t('locale.english')}
                                </span>
                                <span
                                    className="text-muted-foreground text-xs"
                                    lang={item.htmlLang}
                                    dir={item.dir}
                                >
                                    {item.native} · {item.dir.toUpperCase()}
                                </span>
                            </span>
                            {selected && (
                                <span className="text-primary text-xs font-semibold">
                                    ✓
                                </span>
                            )}
                        </DropdownMenuItem>
                    );
                })}
            </DropdownMenuContent>
        </DropdownMenu>
    );
}
