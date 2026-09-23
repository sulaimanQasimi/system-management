import { Head, Link } from '@inertiajs/react';
import { Pencil, UserRound } from 'lucide-react';
import { DetailField, DetailSection } from '@/components/detail-fields';
import { Button } from '@/components/ui/button';
import { useCan } from '@/hooks/use-can';
import { useTranslations } from '@/hooks/use-locale';
import { edit, index } from '@/routes/ad-users';

type AdUserShow = {
    id: number;
    name: string;
    lastname: string;
    username: string;
    email: string;
    department: string | null;
    job: string | null;
    pbx: string | null;
    phone: string | null;
    date: string | null;
    created_by: string | null;
    created_at: string | null;
    updated_at: string | null;
};

export default function AdUsersShow({ user }: { user: AdUserShow }) {
    const { can } = useCan();
    const { t } = useTranslations();

    return (
        <>
            <Head title={`${user.name} ${user.lastname}`} />

            <div className="flex h-full flex-1 flex-col gap-6 p-4 md:p-6">
                <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
                    <div className="flex items-start gap-3">
                        <div className="bg-primary-light text-primary flex size-11 items-center justify-center rounded-lg">
                            <UserRound className="size-5" />
                        </div>
                        <div>
                            <h1 className="text-xl font-semibold tracking-tight">
                                {user.name} {user.lastname}
                            </h1>
                            <p className="text-muted-foreground text-sm">
                                {user.username} · {user.email}
                            </p>
                        </div>
                    </div>
                    <div className="flex flex-wrap gap-2">
                        <Button variant="outline" asChild>
                            <Link href={index()}>{t('adUsers.backToAdUsers')}</Link>
                        </Button>
                        {can('ad_user.update') && (
                            <Button asChild>
                                <Link href={edit(user.id)}>
                                    <Pencil />
                                    {t('common.edit')}
                                </Link>
                            </Button>
                        )}
                    </div>
                </div>

                <DetailSection title={t('adUsers.accountDetails')}>
                    <DetailField label={t('common.name')} value={user.name} />
                    <DetailField
                        label={t('common.lastName')}
                        value={user.lastname}
                    />
                    <DetailField
                        label={t('common.username')}
                        value={user.username}
                    />
                    <DetailField label={t('common.email')} value={user.email} />
                    <DetailField
                        label={t('common.department')}
                        value={user.department}
                    />
                    <DetailField label={t('common.job')} value={user.job} />
                    <DetailField label={t('common.pbx')} value={user.pbx} />
                    <DetailField label={t('common.phone')} value={user.phone} />
                    <DetailField label={t('common.date')} value={user.date} />
                    <DetailField
                        label={t('common.createdBy')}
                        value={user.created_by}
                    />
                    <DetailField
                        label={t('common.createdAt')}
                        value={user.created_at}
                    />
                    <DetailField
                        label={t('common.updatedAt')}
                        value={user.updated_at}
                    />
                </DetailSection>
            </div>
        </>
    );
}

AdUsersShow.layout = {
    breadcrumbs: [
        { title: 'adUsers.title', href: index() },
        { title: 'adUsers.breadcrumbDetails', href: '#' },
    ],
};
