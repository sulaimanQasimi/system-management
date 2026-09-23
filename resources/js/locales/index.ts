import en from './en';
import fa from './fa';
import type {
    LocaleCode,
    LocaleDefinition,
    TextDirection,
    TranslationDictionary,
    TranslationKey,
    TranslationValues,
} from './types';

export type {
    LocaleCode,
    LocaleDefinition,
    TextDirection,
    TranslationDictionary,
    TranslationKey,
    TranslationValues,
};

export const LOCALE_COOKIE = 'locale';

export const locales: Record<LocaleCode, LocaleDefinition> = {
    en: {
        code: 'en',
        name: 'English',
        native: 'English',
        dir: 'ltr',
        htmlLang: 'en',
    },
    fa: {
        code: 'fa',
        name: 'Dari',
        native: 'دری',
        dir: 'rtl',
        htmlLang: 'fa-AF',
    },
};

export const dictionaries: Record<LocaleCode, TranslationDictionary> = {
    en,
    fa,
};

export const defaultLocale: LocaleCode = 'en';

export function isLocaleCode(value: unknown): value is LocaleCode {
    return value === 'en' || value === 'fa';
}

export function resolveLocale(value: unknown): LocaleCode {
    return isLocaleCode(value) ? value : defaultLocale;
}

export function getLocaleDefinition(code: LocaleCode): LocaleDefinition {
    return locales[code];
}

function getNested(
    dictionary: TranslationDictionary,
    key: string,
): string | undefined {
    const [group, item] = key.split('.') as [keyof TranslationDictionary, string];

    if (!group || !item) {
        return undefined;
    }

    const section = dictionary[group] as Record<string, string> | undefined;

    return section?.[item];
}

export function translate(
    locale: LocaleCode,
    key: TranslationKey | string,
    values?: TranslationValues,
): string {
    const primary = getNested(dictionaries[locale], key);
    const fallback = getNested(dictionaries[defaultLocale], key);
    let message = primary ?? fallback ?? key;

    if (values) {
        for (const [name, value] of Object.entries(values)) {
            message = message.replaceAll(`{${name}}`, String(value));
        }
    }

    return message;
}

export function applyDocumentLocale(code: LocaleCode): void {
    if (typeof document === 'undefined') {
        return;
    }

    const definition = getLocaleDefinition(code);
    const root = document.documentElement;

    root.lang = definition.htmlLang;
    root.dir = definition.dir;
    root.dataset.locale = definition.code;
    root.style.colorScheme = root.classList.contains('dark') ? 'dark' : 'light';
}

export function localeDirection(code: LocaleCode): TextDirection {
    return getLocaleDefinition(code).dir;
}
