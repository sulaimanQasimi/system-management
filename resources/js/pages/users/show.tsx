import { Head, Link } from '@inertiajs/react';
import { Pencil, UserRound } from 'lucide-react';
import { DetailField, DetailSection } from '@/components/detail-fields';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { useCan } from '@/hooks/use-can';
import { edit, index } from '@/routes/users';

type UserShow = {
    id: number;
    name: string;
    email: string;
    roles: string[];
    created_at: string | null;
    updated_at: string | null;
};

export default function UsersShow({ user }: { user: UserShow }) {
    const { can } = useCan();

    return (
        <>
            <Head title={user.name} />

            <div className="flex h-full flex-1 flex-col gap-6 p-4 md:p-6">
                <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
                    <div className="flex items-start gap-3">
                        <div className="bg-primary/10 text-primary flex size-11 items-center justify-center rounded-xl">
                            <UserRound className="size-5" />
                        </div>
                        <div>
                            <h1 className="text-xl font-semibold tracking-tight">
                                {user.name}
                            </h1>
                            <p className="text-muted-foreground text-sm">
                                {user.email}
                            </p>
                        </div>
                    </div>
                    <div className="flex flex-wrap gap-2">
                        <Button variant="outline" asChild>
                            <Link href={index()}>Back to users</Link>
                        </Button>
                        {can('user.update') && (
                            <Button asChild>
                                <Link href={edit(user.id)}>
                                    <Pencil />
                                    Edit
                                </Link>
                            </Button>
                        )}
                    </div>
                </div>

                <DetailSection title="User details">
                    <DetailField label="Name" value={user.name} />
                    <DetailField label="Email" value={user.email} />
                    <DetailField
                        label="Roles"
                        className="md:col-span-2 xl:col-span-3"
                        value={
                            user.roles.length > 0 ? (
                                <div className="flex flex-wrap gap-1">
                                    {user.roles.map((role) => (
                                        <Badge key={role} variant="secondary">
                                            {role}
                                        </Badge>
                                    ))}
                                </div>
                            ) : null
                        }
                    />
                    <DetailField label="Created at" value={user.created_at} />
                    <DetailField label="Updated at" value={user.updated_at} />
                </DetailSection>
            </div>
        </>
    );
}

UsersShow.layout = {
    breadcrumbs: [
        { title: 'Users', href: index() },
        { title: 'Details', href: '#' },
    ],
};
