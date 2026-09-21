import { Headset, Plus } from 'lucide-react';
import { useState, type FormEvent } from 'react';
import { toast } from 'sonner';
import { Button } from '@/components/ui/button';
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
} from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Spinner } from '@/components/ui/spinner';
import { postJson } from '@/lib/post-json';

export type CreatedItSupport = {
    id: number;
    name: string;
    phone: string | null;
};

export default function QuickCreateItSupportDialog({
    open,
    onOpenChange,
    onCreated,
}: {
    open: boolean;
    onOpenChange: (open: boolean) => void;
    onCreated: (contact: CreatedItSupport) => void;
}) {
    const [name, setName] = useState('');
    const [lastname, setLastname] = useState('');
    const [pbx, setPbx] = useState('');
    const [errors, setErrors] = useState<Record<string, string>>({});
    const [processing, setProcessing] = useState(false);

    const reset = () => {
        setName('');
        setLastname('');
        setPbx('');
        setErrors({});
        setProcessing(false);
    };

    const submit = async (event: FormEvent) => {
        event.preventDefault();
        setProcessing(true);
        setErrors({});

        const result = await postJson<CreatedItSupport>(
            '/quick-create/it-support',
            {
                name,
                lastname,
                pbx: pbx || null,
            },
        );

        setProcessing(false);

        if (result.errors) {
            const mapped: Record<string, string> = {};
            Object.entries(result.errors).forEach(([key, messages]) => {
                mapped[key] = messages[0] ?? 'Invalid value.';
            });
            setErrors(mapped);
            return;
        }

        if (!result.data) {
            toast.error(result.message ?? 'Unable to save.');
            return;
        }

        onCreated(result.data);
        toast.success('IT Support contact created.');
        reset();
        onOpenChange(false);
    };

    return (
        <Dialog
            open={open}
            onOpenChange={(next) => {
                if (!next) {
                    reset();
                }
                onOpenChange(next);
            }}
        >
            <DialogContent>
                <DialogHeader>
                    <DialogTitle className="flex items-center gap-2">
                        <span className="bg-primary/10 text-primary flex size-8 items-center justify-center rounded-md">
                            <Headset className="size-4" />
                        </span>
                        Create IT Support
                    </DialogTitle>
                    <DialogDescription>
                        Add a support contact without leaving this form.
                    </DialogDescription>
                </DialogHeader>

                <form onSubmit={submit} className="space-y-4">
                    <div className="grid gap-4 sm:grid-cols-2">
                        <div className="grid gap-2">
                            <Label htmlFor="it-support-name">Name</Label>
                            <Input
                                id="it-support-name"
                                value={name}
                                onChange={(event) =>
                                    setName(event.target.value)
                                }
                                placeholder="First name"
                                autoFocus
                                required
                            />
                            {errors.name && (
                                <p className="text-destructive text-sm">
                                    {errors.name}
                                </p>
                            )}
                        </div>
                        <div className="grid gap-2">
                            <Label htmlFor="it-support-lastname">
                                Last name
                            </Label>
                            <Input
                                id="it-support-lastname"
                                value={lastname}
                                onChange={(event) =>
                                    setLastname(event.target.value)
                                }
                                placeholder="Last name"
                                required
                            />
                            {errors.lastname && (
                                <p className="text-destructive text-sm">
                                    {errors.lastname}
                                </p>
                            )}
                        </div>
                        <div className="grid gap-2 sm:col-span-2">
                            <Label htmlFor="it-support-pbx">PBX / Phone</Label>
                            <Input
                                id="it-support-pbx"
                                value={pbx}
                                onChange={(event) => setPbx(event.target.value)}
                                placeholder="Extension or phone"
                            />
                            {errors.pbx && (
                                <p className="text-destructive text-sm">
                                    {errors.pbx}
                                </p>
                            )}
                        </div>
                    </div>

                    <DialogFooter>
                        <Button
                            type="button"
                            variant="outline"
                            onClick={() => onOpenChange(false)}
                        >
                            Cancel
                        </Button>
                        <Button
                            type="submit"
                            disabled={
                                processing || !name.trim() || !lastname.trim()
                            }
                        >
                            {processing ? <Spinner /> : <Plus />}
                            Create
                        </Button>
                    </DialogFooter>
                </form>
            </DialogContent>
        </Dialog>
    );
}
