import type { LucideIcon } from 'lucide-react';
import { Languages } from 'lucide-react';
import type { HTMLAttributes } from 'react';
import { useLocale } from '@/hooks/use-locale';
import type { LocaleCode } from '@/locales';
import { cn } from '@/lib/utils';

type Option = {
    value: LocaleCode;
    label: string;
    native: string;
    dir: 'ltr' | 'rtl';
};

export default function LanguageTabs({
    className = '',
    ...props
}: HTMLAttributes<HTMLDivElement>) {
    const { locale, setLocale, t } = useLocale();

    const tabs: (Option & { icon: LucideIcon })[] = [
        {
            value: 'en',
            label: t('locale.english'),
            native: 'English',
            dir: 'ltr',
            icon: Languages,
        },
        {
            value: 'fa',
            label: t('locale.dari'),
            native: 'دری',
            dir: 'rtl',
            icon: Languages,
        },
    ];

    return (
        <div className={cn('space-y-3', className)} {...props}>
            <div
                role="radiogroup"
                aria-label={t('locale.label')}
                className="bg-muted/80 inline-flex w-full flex-col gap-1 rounded-lg p-1 sm:flex-row"
            >
                {tabs.map(({ value, label, native, dir, icon: Icon }) => {
                    const selected = locale === value;

                    return (
                        <button
                            key={value}
                            type="button"
                            role="radio"
                            aria-checked={selected}
                            onClick={() => {
                                if (!selected) {
                                    setLocale(value);
                                }
                            }}
                            className={cn(
                                'flex flex-1 items-center justify-center gap-2 rounded-md px-3.5 py-2.5 text-sm transition-colors',
                                selected
                                    ? 'bg-background text-foreground shadow-xs'
                                    : 'text-muted-foreground hover:bg-background/60 hover:text-foreground',
                            )}
                        >
                            <Icon className="size-4 shrink-0" aria-hidden />
                            <span className="font-medium">{label}</span>
                            <span
                                className="text-muted-foreground text-xs"
                                lang={value === 'fa' ? 'fa-AF' : 'en'}
                                dir={dir}
                            >
                                {native}
                            </span>
                            <span className="text-muted-foreground/80 ms-auto rounded border px-1.5 py-0.5 font-mono text-[10px] uppercase">
                                {dir}
                            </span>
                        </button>
                    );
                })}
            </div>
            <p className="text-muted-foreground text-sm leading-relaxed">
                {t('locale.directionHint')}
            </p>
        </div>
    );
}
