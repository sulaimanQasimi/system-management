import type { Auth } from '@/types/auth';

declare module 'react' {
    interface InputHTMLAttributes<T> {
        passwordrules?: string;
    }
}

type SharedLocale = {
    code: string;
    name: string;
    native: string;
    dir: 'ltr' | 'rtl';
    htmlLang: string;
};

type SharedAvailableLocale = {
    code: string;
    name: string;
    native: string;
    dir: 'ltr' | 'rtl';
    html_lang: string;
};

declare module '@inertiajs/core' {
    export interface InertiaConfig {
        sharedPageProps: {
            name: string;
            auth: Auth;
            sidebarOpen: boolean;
            locale: SharedLocale;
            availableLocales: SharedAvailableLocale[];
            [key: string]: unknown;
        };
    }
}
