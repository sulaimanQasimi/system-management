import { Form, Link } from '@inertiajs/react';
import {
    ChevronDown,
    ChevronRight,
    Eye,
    FolderTree,
    Pencil,
    Trash2,
} from 'lucide-react';
import { useState } from 'react';
import ServerController from '@/actions/App/Http/Controllers/ServerController';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import {
    Collapsible,
    CollapsibleContent,
    CollapsibleTrigger,
} from '@/components/ui/collapsible';
import { useCan } from '@/hooks/use-can';
import { useTranslations } from '@/hooks/use-locale';
import { statusLabel } from '@/lib/status-label';
import { cn } from '@/lib/utils';
import { edit, show } from '@/routes/servers';

export type ServerTreeRow = {
    id: number;
    site_name: string;
    name: string;
    ip_address: string;
    status: string;
    status_label: string;
    is_vm: boolean;
    department: string | null;
    server_model: string | null;
    it_support: string | null;
    it_support_phone: string | null;
    services: string[];
    created_by: string | null;
    created_at: string | null;
};

export type DepartmentTreeNode = {
    id: number;
    name: string;
    parent_id: number | null;
    server_count: number;
    total_server_count: number;
    servers: ServerTreeRow[];
    children: DepartmentTreeNode[];
};

function statusVariant(status: string) {
    switch (status) {
        case 'active':
            return 'success' as const;
        case 'maintenance':
            return 'warning' as const;
        case 'inactive':
            return 'outline' as const;
        case 'decommissioned':
            return 'destructive' as const;
        default:
            return 'outline' as const;
    }
}

function ServerRows({
    servers,
    depth,
}: {
    servers: ServerTreeRow[];
    depth: number;
}) {
    const { can } = useCan();
    const { t } = useTranslations();

    if (servers.length === 0) {
        return null;
    }

    return (
        <div className="space-y-2">
            {servers.map((server) => (
                <div
                    key={server.id}
                    className="border-border/80 bg-background/80 flex flex-col gap-3 rounded-md border p-3 sm:flex-row sm:items-center sm:justify-between"
                    style={{ marginInlineStart: `${(depth + 1) * 1.25}rem` }}
                >
                    <div className="min-w-0 space-y-1">
                        <div className="flex flex-wrap items-center gap-2">
                            <Link
                                href={show(server.id)}
                                className="hover:text-primary font-medium hover:underline"
                            >
                                {server.name}
                            </Link>
                            {server.is_vm && (
                                <Badge variant="secondary">
                                    {t('common.vm')}
                                </Badge>
                            )}
                            <Badge variant={statusVariant(server.status)}>
                                {statusLabel(
                                    t,
                                    server.status,
                                    server.status_label,
                                )}
                            </Badge>
                        </div>
                        <div className="text-muted-foreground flex flex-wrap gap-x-3 gap-y-1 text-xs">
                            <span>{server.site_name}</span>
                            <span className="font-mono">
                                {server.ip_address}
                            </span>
                            <span>{server.server_model ?? '—'}</span>
                            {!server.is_vm && (
                                <span>{server.it_support ?? '—'}</span>
                            )}
                            <span>{server.created_by ?? '—'}</span>
                        </div>
                        {server.services.length > 0 && (
                            <div className="flex flex-wrap gap-1 pt-1">
                                {server.services.map((service) => (
                                    <Badge key={service} variant="secondary">
                                        {service}
                                    </Badge>
                                ))}
                            </div>
                        )}
                    </div>
                    <div className="flex shrink-0 items-center gap-1">
                        {can('server.view') && (
                            <Button variant="ghost" size="icon" asChild>
                                <Link href={show(server.id)}>
                                    <Eye />
                                    <span className="sr-only">
                                        {t('common.view')}
                                    </span>
                                </Link>
                            </Button>
                        )}
                        {can('server.update') && (
                            <Button variant="ghost" size="icon" asChild>
                                <Link href={edit(server.id)}>
                                    <Pencil />
                                    <span className="sr-only">
                                        {t('common.edit')}
                                    </span>
                                </Link>
                            </Button>
                        )}
                        {can('server.delete') && (
                            <Form
                                {...ServerController.destroy.form(server.id)}
                                options={{ preserveScroll: true }}
                                onSubmit={(event) => {
                                    if (
                                        !confirm(t('servers.deleteConfirm'))
                                    ) {
                                        event.preventDefault();
                                    }
                                }}
                            >
                                {({ processing }) => (
                                    <Button
                                        type="submit"
                                        variant="ghost"
                                        size="icon"
                                        disabled={processing}
                                        className="text-destructive hover:text-destructive"
                                    >
                                        <Trash2 />
                                        <span className="sr-only">
                                            {t('common.delete')}
                                        </span>
                                    </Button>
                                )}
                            </Form>
                        )}
                    </div>
                </div>
            ))}
        </div>
    );
}

function DepartmentNode({
    node,
    depth = 0,
}: {
    node: DepartmentTreeNode;
    depth?: number;
}) {
    const { t } = useTranslations();
    const [open, setOpen] = useState(false);
    const hasContent =
        node.children.length > 0 || node.servers.length > 0;

    return (
        <Collapsible open={open} onOpenChange={setOpen}>
            <div
                className={cn(
                    'border-border/80 bg-card/60 rounded-lg border',
                    depth > 0 && 'border-dashed',
                )}
                style={{ marginInlineStart: `${depth * 1.25}rem` }}
            >
                <CollapsibleTrigger asChild>
                    <button
                        type="button"
                        disabled={!hasContent}
                        className="hover:bg-muted/40 flex w-full items-center gap-3 px-3 py-3 text-start disabled:cursor-default disabled:opacity-70"
                    >
                        <span className="bg-primary-light text-primary flex size-8 shrink-0 items-center justify-center rounded-md">
                            {open ? (
                                <ChevronDown className="size-4" />
                            ) : (
                                <ChevronRight className="size-4" />
                            )}
                        </span>
                        <span className="bg-muted text-muted-foreground flex size-8 shrink-0 items-center justify-center rounded-md">
                            <FolderTree className="size-4" />
                        </span>
                        <span className="min-w-0 flex-1">
                            <span className="block truncate font-medium">
                                {node.name}
                            </span>
                            <span className="text-muted-foreground text-xs">
                                {t('servers.treeServerCount', {
                                    count: node.total_server_count,
                                })}
                                {node.children.length > 0
                                    ? ` · ${t('servers.treeChildCount', {
                                          count: node.children.length,
                                      })}`
                                    : ''}
                            </span>
                        </span>
                    </button>
                </CollapsibleTrigger>

                <CollapsibleContent>
                    <div className="space-y-3 border-t px-3 py-3">
                        {node.servers.length === 0 &&
                        node.children.length === 0 ? (
                            <p className="text-muted-foreground text-sm">
                                {t('servers.treeEmptyDepartment')}
                            </p>
                        ) : (
                            <>
                                <ServerRows
                                    servers={node.servers}
                                    depth={0}
                                />
                                {node.children.map((child) => (
                                    <DepartmentNode
                                        key={child.id}
                                        node={child}
                                        depth={depth + 1}
                                    />
                                ))}
                            </>
                        )}
                    </div>
                </CollapsibleContent>
            </div>
        </Collapsible>
    );
}

export default function ServersDepartmentTree({
    tree,
}: {
    tree: DepartmentTreeNode[];
}) {
    const { t } = useTranslations();

    if (tree.length === 0) {
        return (
            <div className="border-border/80 bg-card text-muted-foreground rounded-lg border px-4 py-10 text-center text-sm shadow-regal">
                {t('servers.noResults')}
            </div>
        );
    }

    return (
        <div className="space-y-3">
            {tree.map((node) => (
                <DepartmentNode key={node.id} node={node} />
            ))}
        </div>
    );
}
