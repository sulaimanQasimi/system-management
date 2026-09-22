import { Head, Link } from '@inertiajs/react';
import { Headset, Pencil } from 'lucide-react';
import { DetailField, DetailSection } from '@/components/detail-fields';
import { Button } from '@/components/ui/button';
import { useCan } from '@/hooks/use-can';
import { edit, index } from '@/routes/it-support';

type ContactShow = {
    id: number;
    name: string;
    lastname: string;
    pbx: string | null;
    created_at: string | null;
    updated_at: string | null;
};

export default function ItSupportShow({ contact }: { contact: ContactShow }) {
    const { can } = useCan();

    return (
        <>
            <Head title={`${contact.name} ${contact.lastname}`} />

            <div className="flex h-full flex-1 flex-col gap-6 p-4 md:p-6">
                <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
                    <div className="flex items-start gap-3">
                        <div className="bg-primary-light text-primary flex size-11 items-center justify-center rounded-lg">
                            <Headset className="size-5" />
                        </div>
                        <div>
                            <h1 className="text-xl font-semibold tracking-tight">
                                {contact.name} {contact.lastname}
                            </h1>
                            <p className="text-muted-foreground text-sm">
                                IT Support contact
                            </p>
                        </div>
                    </div>
                    <div className="flex flex-wrap gap-2">
                        <Button variant="outline" asChild>
                            <Link href={index()}>Back to IT Support</Link>
                        </Button>
                        {can('it_support.update') && (
                            <Button asChild>
                                <Link href={edit(contact.id)}>
                                    <Pencil />
                                    Edit
                                </Link>
                            </Button>
                        )}
                    </div>
                </div>

                <DetailSection title="Contact details">
                    <DetailField label="Name" value={contact.name} />
                    <DetailField label="Last name" value={contact.lastname} />
                    <DetailField label="PBX" value={contact.pbx} />
                    <DetailField label="Created at" value={contact.created_at} />
                    <DetailField label="Updated at" value={contact.updated_at} />
                </DetailSection>
            </div>
        </>
    );
}

ItSupportShow.layout = {
    breadcrumbs: [
        { title: 'IT Support', href: index() },
        { title: 'Details', href: '#' },
    ],
};
