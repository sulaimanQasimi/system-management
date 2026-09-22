import { Head, Link } from '@inertiajs/react';
import { Pencil, UserRound } from 'lucide-react';
import { DetailField, DetailSection } from '@/components/detail-fields';
import { Button } from '@/components/ui/button';
import { useCan } from '@/hooks/use-can';
import { edit, index } from '@/routes/ad-users';

type AdUserShow = {
    id: number;
    name: string;
    lastname: string;
    username: string;
    email: string;
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
                            <Link href={index()}>Back to AD users</Link>
                        </Button>
                        {can('ad_user.update') && (
                            <Button asChild>
                                <Link href={edit(user.id)}>
                                    <Pencil />
                                    Edit
                                </Link>
                            </Button>
                        )}
                    </div>
                </div>

                <DetailSection title="Account details">
                    <DetailField label="Name" value={user.name} />
                    <DetailField label="Last name" value={user.lastname} />
                    <DetailField label="Username" value={user.username} />
                    <DetailField label="Email" value={user.email} />
                    <DetailField label="Job" value={user.job} />
                    <DetailField label="PBX" value={user.pbx} />
                    <DetailField label="Phone" value={user.phone} />
                    <DetailField label="Date" value={user.date} />
                    <DetailField label="Created by" value={user.created_by} />
                    <DetailField label="Created at" value={user.created_at} />
                    <DetailField label="Updated at" value={user.updated_at} />
                </DetailSection>
            </div>
        </>
    );
}

AdUsersShow.layout = {
    breadcrumbs: [
        { title: 'Active Directory Users', href: index() },
        { title: 'Details', href: '#' },
    ],
};
