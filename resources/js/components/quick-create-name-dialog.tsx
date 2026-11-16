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
import SearchableSelect from '@/components/ui/searchable-select';
import { Spinner } from '@/components/ui/spinner';
import { useTranslations } from '@/hooks/use-locale';
import { postJson } from '@/lib/post-json';

type CreatedOption = {
    id: number;
    name: string;
    label?: string;
    parent_id?: number | null;
};

type ParentOption = {
    id: number;
    name: string;
    label?: string;
};

export default function QuickCreateNameDialog({
    open,
    onOpenChange,
    title,
    description,
    endpoint,
    placeholder,
    icon,
    onCreated,
    parentOptions,
}: {
    open: boolean;
    onOpenChange: (open: boolean) => void;
    title: string;
    description: string;
    endpoint: string;
    placeholder: string;
    icon: ReactNode;
    onCreated: (option: CreatedOption) => void;
    parentOptions?: ParentOption[];
}) {
    const { t } = useTranslations();
    const [name, setName] = useState('');
    const [parentId, setParentId] = useState('');
    const [error, setError] = useState<string | null>(null);
    const [parentError, setParentError] = useState<string | null>(null);
    const [processing, setProcessing] = useState(false);
    const supportsParent = Array.isArray(parentOptions);

    const reset = () => {
        setName('');
        setParentId('');
        setError(null);
        setParentError(null);
        setProcessing(false);
    };

    const submit = async (event: FormEvent) => {
        event.preventDefault();
        setProcessing(true);
        setError(null);
        setParentError(null);

        const payload: Record<string, string | null> = { name };

        if (supportsParent) {
            payload.parent_id = parentId || null;
        }

        const result = await postJson<CreatedOption>(endpoint, payload);

        setProcessing(false);

        if (result.errors?.name?.[0]) {
            setError(result.errors.name[0]);
            return;
        }

        if (result.errors?.parent_id?.[0]) {
            setParentError(result.errors.parent_id[0]);
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

                    {supportsParent && (
                        <div className="grid gap-2">
                            <Label htmlFor="quick-create-parent">
                                {t('departments.parent')}
                            </Label>
                            <SearchableSelect
                                id="quick-create-parent"
                                name="quick-create-parent"
                                value={parentId}
                                onValueChange={setParentId}
                                options={(parentOptions ?? []).map(
                                    (option) => ({
                                        value: String(option.id),
                                        label: option.label ?? option.name,
                                    }),
                                )}
                                placeholder={t('departments.selectParent')}
                                searchPlaceholder={t(
                                    'departments.searchPlaceholder',
                                )}
                                allowClear
                            />
                            {parentError && (
                                <p className="text-destructive text-sm">
                                    {parentError}
                                </p>
                            )}
                        </div>
                    )}

                    <DialogFooter>
                        <Button
                            type="button"
                            variant="outline"
                            onClick={() => onOpenChange(false)}
                        >
                            {t('common.cancel')}
                        </Button>
                        <Button
                            type="submit"
                            disabled={processing || !name.trim()}
                        >
                            {processing ? <Spinner /> : <Plus />}
                            {t('common.create')}
                        </Button>
                    </DialogFooter>
                </form>
            </DialogContent>
        </Dialog>
    );
}
