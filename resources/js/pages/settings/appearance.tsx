import { Head } from '@inertiajs/react';
import AppearanceTabs from '@/components/appearance-tabs';
import Heading from '@/components/heading';
import { useTranslations } from '@/hooks/use-locale';
import { edit as editAppearance } from '@/routes/appearance';

export default function Appearance() {
    const { t } = useTranslations();

    return (
        <>
            <Head title={t('pages.appearanceSettings')} />

            <h1 className="sr-only">{t('pages.appearanceSettings')}</h1>

            <div className="space-y-6">
                <Heading
                    variant="small"
                    title={t('settings.appearanceTitle')}
                    description={t('settings.appearanceDescription')}
                />
                <AppearanceTabs />
            </div>
        </>
    );
}

Appearance.layout = {
    breadcrumbs: [
        {
            title: 'pages.appearanceSettings',
            href: editAppearance(),
        },
    ],
};
