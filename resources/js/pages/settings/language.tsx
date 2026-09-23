import { Head } from '@inertiajs/react';
import AppearanceTabs from '@/components/appearance-tabs';
import Heading from '@/components/heading';
import LanguageTabs from '@/components/language-tabs';
import { useTranslations } from '@/hooks/use-locale';
import { edit as editLanguage } from '@/routes/language';

export default function Language() {
    const { t } = useTranslations();

    return (
        <>
            <Head title={t('pages.languageSettings')} />

            <h1 className="sr-only">{t('pages.languageSettings')}</h1>

            <div className="space-y-10">
                <div className="space-y-6">
                    <Heading
                        variant="small"
                        title={t('locale.title')}
                        description={t('locale.description')}
                    />
                    <LanguageTabs />
                </div>

                <div className="space-y-6">
                    <Heading
                        variant="small"
                        title={t('settings.appearanceTitle')}
                        description={t('settings.appearanceDescription')}
                    />
                    <AppearanceTabs />
                </div>
            </div>
        </>
    );
}

Language.layout = {
    breadcrumbs: [
        {
            title: 'pages.languageSettings',
            href: editLanguage(),
        },
    ],
};
