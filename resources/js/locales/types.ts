export type LocaleCode = 'en' | 'fa';
export type TextDirection = 'ltr' | 'rtl';

export type LocaleDefinition = {
    code: LocaleCode;
    name: string;
    native: string;
    dir: TextDirection;
    htmlLang: string;
};

export type TranslationDictionary = {
    brand: {
        portal: string;
        welcome: string;
        tagline: string;
    };
    common: {
        save: string;
        cancel: string;
        delete: string;
        edit: string;
        create: string;
        search: string;
        actions: string;
        back: string;
        loading: string;
        yes: string;
        no: string;
        close: string;
        confirm: string;
        view: string;
        all: string;
        none: string;
        optional: string;
        required: string;
        status: string;
        name: string;
        email: string;
        password: string;
        description: string;
        details: string;
        noResults: string;
        perPage: string;
        of: string;
        previous: string;
        next: string;
        showing: string;
        results: string;
        clearFilters: string;
        filters: string;
        openMenu: string;
        toggleSidebar: string;
        searchEllipsis: string;
        showingRange: string;
    };
    nav: {
        platform: string;
        directory: string;
        infrastructure: string;
        support: string;
        administration: string;
        dashboard: string;
        adUsers: string;
        servers: string;
        serverModels: string;
        serverServices: string;
        itSupport: string;
        users: string;
        settings: string;
        logout: string;
        language: string;
        profile: string;
        security: string;
        appearance: string;
    };
    theme: {
        light: string;
        dark: string;
        system: string;
        switchToLight: string;
        switchToDark: string;
        lightMode: string;
        darkMode: string;
    };
    locale: {
        title: string;
        description: string;
        label: string;
        english: string;
        dari: string;
        switchLanguage: string;
        directionHint: string;
    };
    settings: {
        title: string;
        description: string;
        profile: string;
        security: string;
        language: string;
        appearance: string;
        appearanceTitle: string;
        appearanceDescription: string;
        navLabel: string;
    };
    auth: {
        loginTitle: string;
        loginDescription: string;
        loginHead: string;
        email: string;
        password: string;
        forgotPassword: string;
        remember: string;
        signIn: string;
        signingIn: string;
        continuePasskey: string;
        waitingPasskey: string;
        orEmail: string;
        passwordPlaceholder: string;
        emailPlaceholder: string;
        forgotTitle: string;
        forgotDescription: string;
        resetTitle: string;
        resetDescription: string;
        confirmTitle: string;
        confirmDescription: string;
        verifyTitle: string;
        verifyDescription: string;
        registerTitle: string;
        registerDescription: string;
    };
    dashboard: {
        title: string;
        description: string;
        networkOperations: string;
        serversByService: string;
        serversByServiceDesc: string;
        noServices: string;
        manageServices: string;
        viewAll: string;
        statServers: string;
        statVirtualMachines: string;
        statPhysicalServers: string;
        statAdUsers: string;
        statPortalUsers: string;
        statItSupport: string;
        hintActive: string;
        hintPercentOfServers: string;
        hintWithPhone: string;
        hintVerified: string;
        hintWithPbx: string;
    };
    twoFactor: {
        head: string;
        authTitle: string;
        authDescription: string;
        recoveryTitle: string;
        recoveryDescription: string;
        toggleToRecovery: string;
        toggleToAuth: string;
        recoveryPlaceholder: string;
        continue: string;
        orYouCan: string;
    };
    pages: {
        users: string;
        adUsers: string;
        servers: string;
        serverModels: string;
        serverServices: string;
        itSupport: string;
        profileSettings: string;
        securitySettings: string;
        languageSettings: string;
        appearanceSettings: string;
    };
};

export type TranslationKey = {
    [K in keyof TranslationDictionary]: {
        [P in keyof TranslationDictionary[K]]: `${K & string}.${P & string}`;
    }[keyof TranslationDictionary[K]];
}[keyof TranslationDictionary];

export type TranslationValues = Record<string, string | number>;
