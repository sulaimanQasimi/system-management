import { Plus } from 'lucide-react';
import { useState, type FormEvent, type ReactNode } from 'react';
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
import { useTranslations } from '@/hooks/use-locale';
import { postJson } from '@/lib/post-json';

type CreatedOption = { id: number; name: string };

export default function QuickCreateNameDialog({
    open,
    onOpenChange,
    title,
    description,
    endpoint,
    placeholder,
    icon,
    onCreated,
}: {
    open: boolean;
    onOpenChange: (open: boolean) => void;
    title: string;
    description: string;
    endpoint: string;
    placeholder: string;
    icon: ReactNode;
    onCreated: (option: CreatedOption) => void;
}) {
    const { t } = useTranslations();
    const [name, setName] = useState('');
    const [error, setError] = useState<string | null>(null);
    const [processing, setProcessing] = useState(false);

    const reset = () => {
        setName('');
        setError(null);
        setProcessing(false);
    };

    const submit = async (event: FormEvent) => {
        event.preventDefault();
        setProcessing(true);
        setError(null);

        const result = await postJson<CreatedOption>(endpoint, { name });

        setProcessing(false);

        if (result.errors?.name?.[0]) {
            setError(result.errors.name[0]);
            return;
        }

        if (!result.data) {
            setError(result.message ?? t('common.unableToSave'));
            toast.error(result.message ?? t('common.unableToSave'));
            return;
        }

        onCreated(result.data);
        toast.success(t('servers.quickCreateCreated', { title }));
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
                        <span className="bg-primary-light text-primary flex size-8 items-center justify-center rounded-md">
                            {icon}
                        </span>
                        {title}
                    </DialogTitle>
                    <DialogDescription>{description}</DialogDescription>
                </DialogHeader>

                <form onSubmit={submit} className="space-y-4">
                    <div className="grid gap-2">
                        <Label htmlFor="quick-create-name">
                            {t('common.name')}
                        </Label>
                        <Input
                            id="quick-create-name"
                            value={name}
                            onChange={(event) => setName(event.target.value)}
                            placeholder={placeholder}
                            autoFocus
                            required
                        />
                        {error && (
                            <p className="text-destructive text-sm">{error}</p>
                        )}
                    </div>

                    <DialogFooter>
                        <Button
                            type="button"
                            variant="outline"
                            onClick={() => onOpenChange(false)}
                        >
                            {t('common.cancel')}
                        </Button>
                        <Button type="submit" disabled={processing || !name.trim()}>
                            {processing ? <Spinner /> : <Plus />}
                            {t('common.create')}
                        </Button>
                    </DialogFooter>
                </form>
            </DialogContent>
        </Dialog>
    );
}
