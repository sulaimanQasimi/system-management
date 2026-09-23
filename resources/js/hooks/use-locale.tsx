import { useSyncExternalStore } from 'react';
import { usePage } from '@inertiajs/react';
import {
    LOCALE_COOKIE,
    applyDocumentLocale,
    defaultLocale,
    getLocaleDefinition,
    isLocaleCode,
    localeDirection,
    locales,
    resolveLocale,
    translate,
    type LocaleCode,
    type LocaleDefinition,
    type TextDirection,
    type TranslationKey,
    type TranslationValues,
} from '@/locales';

const listeners = new Set<() => void>();
let currentLocale: LocaleCode = defaultLocale;
let hydrated = false;

const setCookie = (name: string, value: string, days = 365): void => {
    if (typeof document === 'undefined') {
        return;
    }

    const maxAge = days * 24 * 60 * 60;
    document.cookie = `${name}=${value};path=/;max-age=${maxAge};SameSite=Lax`;
};

const subscribe = (callback: () => void) => {
    listeners.add(callback);

    return () => listeners.delete(callback);
};

const notify = (): void => listeners.forEach((listener) => listener());

export function initializeLocale(preferred?: string | null): void {
    if (typeof window === 'undefined') {
        return;
    }

    const fromStorage = localStorage.getItem(LOCALE_COOKIE);
    const initial = resolveLocale(preferred ?? fromStorage ?? defaultLocale);

    if (!fromStorage) {
        localStorage.setItem(LOCALE_COOKIE, initial);
        setCookie(LOCALE_COOKIE, initial);
    }

    currentLocale = initial;
    applyDocumentLocale(initial);
    hydrated = true;
    notify();
}

export function syncLocaleFromServer(code: string): void {
    const resolved = resolveLocale(code);

    currentLocale = resolved;
    localStorage.setItem(LOCALE_COOKIE, resolved);
    setCookie(LOCALE_COOKIE, resolved);
    applyDocumentLocale(resolved);
    hydrated = true;
    notify();
}

export type UseLocaleReturn = {
    readonly locale: LocaleCode;
    readonly dir: TextDirection;
    readonly isRtl: boolean;
    readonly definition: LocaleDefinition;
    readonly availableLocales: LocaleDefinition[];
    readonly t: (
        key: TranslationKey | string,
        values?: TranslationValues,
    ) => string;
    readonly setLocale: (code: LocaleCode) => void;
};

export function useLocale(): UseLocaleReturn {
    const pageLocale = usePage().props.locale;

    const locale = useSyncExternalStore(
        subscribe,
        () => {
            if (!hydrated && pageLocale?.code && isLocaleCode(pageLocale.code)) {
                currentLocale = pageLocale.code;
                applyDocumentLocale(currentLocale);
                hydrated = true;
            }

            return currentLocale;
        },
        () =>
            pageLocale?.code && isLocaleCode(pageLocale.code)
                ? pageLocale.code
                : defaultLocale,
    );

    const setLocale = (code: LocaleCode): void => {
        currentLocale = code;
        localStorage.setItem(LOCALE_COOKIE, code);
        setCookie(LOCALE_COOKIE, code);
        applyDocumentLocale(code);
        notify();
        window.location.reload();
    };

    const t = (
        key: TranslationKey | string,
        values?: TranslationValues,
    ): string => translate(locale, key, values);

    return {
        locale,
        dir: localeDirection(locale),
        isRtl: localeDirection(locale) === 'rtl',
        definition: getLocaleDefinition(locale),
        availableLocales: Object.values(locales),
        t,
        setLocale,
    } as const;
}

export function useTranslations() {
    const { t, locale, dir, isRtl } = useLocale();

    return { t, locale, dir, isRtl };
}
