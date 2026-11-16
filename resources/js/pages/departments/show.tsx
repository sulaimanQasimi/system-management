import { Head, Link } from '@inertiajs/react';
import { Building2, Pencil } from 'lucide-react';
import { DetailField, DetailSection } from '@/components/detail-fields';
import { Button } from '@/components/ui/button';
import { useCan } from '@/hooks/use-can';
import { useTranslations } from '@/hooks/use-locale';
import { edit, index, show } from '@/routes/departments';

type PathItem = { id: number; name: string };

type DepartmentShow = {
    id: number;
    name: string;
    parent_id: number | null;
    parent: PathItem | null;
    path: PathItem[];
    children: PathItem[];
    created_at: string | null;
    updated_at: string | null;
};

export default function DepartmentsShow({
    department,
}: {
    department: DepartmentShow;
}) {
    const { can } = useCan();
    const { t } = useTranslations();
    const pathLabel = department.path.map((item) => item.name).join(' › ');

    return (
        <>
            <Head title={department.name} />

            <div className="flex h-full flex-1 flex-col gap-6 p-4 md:p-6">
                <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
                    <div className="flex items-start gap-3">
                        <div className="bg-primary-light text-primary flex size-11 items-center justify-center rounded-lg">
                            <Building2 className="size-5" />
                        </div>
                        <div>
                            <h1 className="text-xl font-semibold tracking-tight">
                                {department.name}
                            </h1>
                            <p className="text-muted-foreground text-sm">
                                {pathLabel || t('departments.departmentSubtitle')}
                            </p>
                        </div>
                    </div>
                    <div className="flex flex-wrap gap-2">
                        <Button variant="outline" asChild>
                            <Link href={index()}>
                                {t('departments.backToDepartments')}
                            </Link>
                        </Button>
                        {can('department.update') && (
                            <Button asChild>
                                <Link href={edit(department.id)}>
                                    <Pencil />
                                    {t('common.edit')}
                                </Link>
                            </Button>
                        )}
                    </div>
                </div>

                <DetailSection title={t('departments.departmentDetails')}>
                    <DetailField
                        label={t('common.name')}
                        value={department.name}
                    />
                    <DetailField
                        label={t('departments.parent')}
                        value={
                            department.parent ? (
                                <Link
                                    href={show(department.parent.id)}
                                    className="hover:text-primary hover:underline"
                                >
                                    {department.parent.name}
                                </Link>
                            ) : (
                                t('departments.noParent')
                            )
                        }
                    />
                    <DetailField
                        label={t('departments.hierarchy')}
                        value={pathLabel || '—'}
                    />
                    <DetailField
                        label={t('departments.children')}
                        value={
                            department.children.length === 0 ? (
                                '—'
                            ) : (
                                <div className="flex flex-wrap gap-2">
                                    {department.children.map((child) => (
                                        <Link
                                            key={child.id}
                                            href={show(child.id)}
                                            className="hover:text-primary hover:underline"
                                        >
                                            {child.name}
                                        </Link>
                                    ))}
                                </div>
                            )
                        }
                    />
                    <DetailField
                        label={t('common.createdAt')}
                        value={department.created_at}
                    />
                    <DetailField
                        label={t('common.updatedAt')}
                        value={department.updated_at}
                    />
                </DetailSection>
            </div>
        </>
    );
}

DepartmentsShow.layout = {
    breadcrumbs: [
        { title: 'departments.title', href: index() },
        { title: 'departments.breadcrumbDetails', href: '#' },
    ],
};
