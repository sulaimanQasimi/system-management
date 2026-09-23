import {
    Activity,
    Building2,
    HardDrive,
    Headset,
    KeyRound,
    Network,
    Plus,
    Server,
    ServerCog,
} from 'lucide-react';
import { useEffect, useState, type ReactNode } from 'react';
import InputError from '@/components/input-error';
import QuickCreateItSupportDialog from '@/components/quick-create-it-support-dialog';
import QuickCreateNameDialog from '@/components/quick-create-name-dialog';
import { Button } from '@/components/ui/button';
import { Checkbox } from '@/components/ui/checkbox';
import { Input } from '@/components/ui/input';
import IpInput from '@/components/ui/ip-input';
import { Label } from '@/components/ui/label';
import { useCan } from '@/hooks/use-can';
import { useTranslations } from '@/hooks/use-locale';
import { statusLabel } from '@/lib/status-label';

export type Option = { id: number; name: string };
export type ItSupportOption = {
    id: number;
    name: string;
    phone: string | null;
};
export type StatusOption = { value: string; label: string };

export type ServerFormValues = {
    site_name?: string;
    department_id?: number | string;
    server_model_id?: number | string;
    name?: string;
    ip_address?: string;
    subnet_mask?: string | null;
    default_gateway?: string | null;
    description?: string | null;
    it_support_id?: number | string | null;
    it_support_phone?: string | null;
    idrac_ip_address?: string | null;
    idrac_subnet_mask?: string | null;
    idrac_default_gateway?: string | null;
    username?: string | null;
    status?: string;
    is_vm?: boolean;
    service_ids?: number[];
    has_password?: boolean;
};

type Errors = Partial<Record<string, string>>;

const EMPTY_VALUES: ServerFormValues = {};

function Section({
    title,
    description,
    icon,
    action,
    children,
}: {
    title: string;
    description?: string;
    icon: ReactNode;
    action?: ReactNode;
    children: ReactNode;
}) {
    return (
        <section className="border-border/80 bg-card/40 space-y-5 rounded-lg border shadow-regal p-5 md:p-6">
            <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
                <div className="flex items-start gap-3">
                    <div className="bg-primary-light text-primary flex size-10 shrink-0 items-center justify-center rounded-lg">
                        {icon}
                    </div>
                    <div>
                        <h3 className="text-base font-semibold tracking-tight">
                            {title}
                        </h3>
                        {description && (
                            <p className="text-muted-foreground mt-1 text-sm">
                                {description}
                            </p>
                        )}
                    </div>
                </div>
                {action}
            </div>
            {children}
        </section>
    );
}

function FieldIconLabel({
    htmlFor,
    icon,
    children,
}: {
    htmlFor: string;
    icon: ReactNode;
    children: ReactNode;
}) {
    return (
        <Label htmlFor={htmlFor} className="flex items-center gap-2">
            <span className="text-muted-foreground">{icon}</span>
            {children}
        </Label>
    );
}

export default function ServerFormFields({
    values = EMPTY_VALUES,
    errors = {},
    departments,
    serverModels,
    services,
    itSupports,
    statusOptions,
    isEdit = false,
}: {
    values?: ServerFormValues;
    errors?: Errors;
    departments: Option[];
    serverModels: Option[];
    services: Option[];
    itSupports: ItSupportOption[];
    statusOptions: StatusOption[];
    isEdit?: boolean;
}) {
    const { can } = useCan();
    const { t } = useTranslations();
    const [departmentOptions, setDepartmentOptions] =
        useState<Option[]>(departments);
    const [modelOptions, setModelOptions] = useState<Option[]>(serverModels);
    const [serviceOptions, setServiceOptions] = useState<Option[]>(services);
    const [itSupportOptions, setItSupportOptions] =
        useState<ItSupportOption[]>(itSupports);

    const [departmentId, setDepartmentId] = useState(
        values.department_id ? String(values.department_id) : '',
    );
    const [serverModelId, setServerModelId] = useState(
        values.server_model_id ? String(values.server_model_id) : '',
    );
    const [selectedServices, setSelectedServices] = useState<number[]>(
        values.service_ids ?? [],
    );
    const [itSupportId, setItSupportId] = useState(
        values.it_support_id ? String(values.it_support_id) : '',
    );
    const [itSupportPhone, setItSupportPhone] = useState(
        values.it_support_phone ?? '',
    );
    const [isVm, setIsVm] = useState(Boolean(values.is_vm));

    const [departmentDialogOpen, setDepartmentDialogOpen] = useState(false);
    const [modelDialogOpen, setModelDialogOpen] = useState(false);
    const [serviceDialogOpen, setServiceDialogOpen] = useState(false);
    const [itSupportDialogOpen, setItSupportDialogOpen] = useState(false);

    useEffect(() => {
        setDepartmentOptions(departments);
        setModelOptions(serverModels);
        setServiceOptions(services);
        setItSupportOptions(itSupports);
    }, [departments, serverModels, services, itSupports]);

    useEffect(() => {
        setDepartmentId(
            values.department_id ? String(values.department_id) : '',
        );
    }, [values.department_id]);

    useEffect(() => {
        setServerModelId(
            values.server_model_id ? String(values.server_model_id) : '',
        );
    }, [values.server_model_id]);

    useEffect(() => {
        setSelectedServices(values.service_ids ?? []);
    }, [values.service_ids]);

    useEffect(() => {
        setItSupportId(values.it_support_id ? String(values.it_support_id) : '');
        setItSupportPhone(values.it_support_phone ?? '');
    }, [values.it_support_id, values.it_support_phone]);

    useEffect(() => {
        setIsVm(Boolean(values.is_vm));
    }, [values.is_vm]);

    const toggleService = (id: number, checked: boolean) => {
        setSelectedServices((current) =>
            checked
                ? [...current, id]
                : current.filter((serviceId) => serviceId !== id),
        );
    };

    const onItSupportChange = (value: string) => {
        setItSupportId(value);
        const contact = itSupportOptions.find(
            (item) => String(item.id) === value,
        );
        if (contact?.phone) {
            setItSupportPhone(contact.phone);
        }
    };

    return (
        <div className="space-y-6">
            <Section
                title={t('servers.sectionIdentity')}
                icon={<HardDrive className="size-5" />}
            >
                <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                    <div className="grid gap-2">
                        <FieldIconLabel
                            htmlFor="site_name"
                            icon={<Building2 className="size-3.5" />}
                        >
                            {t('servers.siteName')}
                        </FieldIconLabel>
                        <Input
                            id="site_name"
                            name="site_name"
                            required
                            defaultValue={values.site_name ?? ''}
                            placeholder={t('servers.placeholderSiteName')}
                        />
                        <InputError message={errors.site_name} />
                    </div>

                    <div className="grid gap-2">
                        <FieldIconLabel
                            htmlFor="name"
                            icon={<Server className="size-3.5" />}
                        >
                            {t('servers.serverName')}
                        </FieldIconLabel>
                        <Input
                            id="name"
                            name="name"
                            required
                            defaultValue={values.name ?? ''}
                            placeholder={t('servers.placeholderServerName')}
                        />
                        <InputError message={errors.name} />
                    </div>

                    <div className="grid gap-2">
                        <div className="flex items-center justify-between gap-2">
                            <FieldIconLabel
                                htmlFor="department_id"
                                icon={<Building2 className="size-3.5" />}
                            >
                                {t('common.department')}
                            </FieldIconLabel>
                            {can('department.create') && (
                                <Button
                                    type="button"
                                    variant="outline"
                                    size="sm"
                                    onClick={() =>
                                        setDepartmentDialogOpen(true)
                                    }
                                >
                                    <Plus />
                                    {t('common.newItem')}
                                </Button>
                            )}
                        </div>
                        <select
                            id="department_id"
                            name="department_id"
                            required
                            value={departmentId}
                            onChange={(event) =>
                                setDepartmentId(event.target.value)
                            }
                            className="border-input bg-background h-9 w-full rounded-md border px-3 text-sm shadow-xs"
                        >
                            <option value="" disabled>
                                {t('servers.selectDepartment')}
                            </option>
                            {departmentOptions.map((department) => (
                                <option
                                    key={department.id}
                                    value={department.id}
                                >
                                    {department.name}
                                </option>
                            ))}
                        </select>
                        <InputError message={errors.department_id} />
                    </div>

                    <div className="grid gap-2">
                        <div className="flex items-center justify-between gap-2">
                            <FieldIconLabel
                                htmlFor="server_model_id"
                                icon={<Server className="size-3.5" />}
                            >
                                {t('servers.serverModel')}
                            </FieldIconLabel>
                            {can('server_model.create') && (
                                <Button
                                    type="button"
                                    variant="outline"
                                    size="sm"
                                    onClick={() => setModelDialogOpen(true)}
                                >
                                    <Plus />
                                    {t('common.newItem')}
                                </Button>
                            )}
                        </div>
                        <select
                            id="server_model_id"
                            name="server_model_id"
                            required
                            value={serverModelId}
                            onChange={(event) =>
                                setServerModelId(event.target.value)
                            }
                            className="border-input bg-background h-9 w-full rounded-md border px-3 text-sm shadow-xs"
                        >
                            <option value="" disabled>
                                {t('servers.selectServerModel')}
                            </option>
                            {modelOptions.map((model) => (
                                <option key={model.id} value={model.id}>
                                    {model.name}
                                </option>
                            ))}
                        </select>
                        <InputError message={errors.server_model_id} />
                    </div>

                    <div className="grid gap-2">
                        <FieldIconLabel
                            htmlFor="status"
                            icon={<Activity className="size-3.5" />}
                        >
                            {t('common.status')}
                        </FieldIconLabel>
                        <select
                            id="status"
                            name="status"
                            required
                            defaultValue={values.status ?? 'active'}
                            className="border-input bg-background h-9 w-full rounded-md border px-3 text-sm shadow-xs"
                        >
                            {statusOptions.map((status) => (
                                <option
                                    key={status.value}
                                    value={status.value}
                                >
                                    {statusLabel(
                                        t,
                                        status.value,
                                        status.label,
                                    )}
                                </option>
                            ))}
                        </select>
                        <InputError message={errors.status} />
                    </div>

                    <div className="grid gap-2">
                        <Label htmlFor="is_vm" className="flex items-center gap-2">
                            <span className="text-muted-foreground">
                                <ServerCog className="size-3.5" />
                            </span>
                            {t('common.virtualMachine')}
                        </Label>
                        <input
                            type="hidden"
                            name="is_vm"
                            value={isVm ? '1' : '0'}
                        />
                        <label
                            htmlFor="is_vm"
                            className="border-input bg-background hover:bg-muted/40 flex h-9 cursor-pointer items-center gap-3 rounded-md border px-3 text-sm shadow-xs"
                        >
                            <Checkbox
                                id="is_vm"
                                checked={isVm}
                                onCheckedChange={(checked) =>
                                    setIsVm(checked === true)
                                }
                            />
                            <span>
                                {isVm
                                    ? t('servers.vmChecked')
                                    : t('servers.vmUnchecked')}
                            </span>
                        </label>
                        <InputError message={errors.is_vm} />
                    </div>
                </div>
            </Section>

            <Section
                title={t('servers.sectionNetwork')}
                icon={<Network className="size-5" />}
            >
                <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
                    <div className="grid gap-2">
                        <FieldIconLabel
                            htmlFor="ip_address"
                            icon={<Network className="size-3.5" />}
                        >
                            {t('servers.serverIpAddress')}
                        </FieldIconLabel>
                        <IpInput
                            id="ip_address"
                            name="ip_address"
                            required
                            defaultValue={values.ip_address ?? ''}
                        />
                        <InputError message={errors.ip_address} />
                    </div>
                    <div className="grid gap-2">
                        <Label htmlFor="subnet_mask">
                            {t('servers.subnetMask')}
                        </Label>
                        <IpInput
                            id="subnet_mask"
                            name="subnet_mask"
                            defaultValue={values.subnet_mask ?? ''}
                        />
                        <InputError message={errors.subnet_mask} />
                    </div>
                    <div className="grid gap-2 sm:col-span-2 lg:col-span-1">
                        <Label htmlFor="default_gateway">
                            {t('servers.defaultGateway')}
                        </Label>
                        <IpInput
                            id="default_gateway"
                            name="default_gateway"
                            defaultValue={values.default_gateway ?? ''}
                        />
                        <InputError message={errors.default_gateway} />
                    </div>
                </div>
            </Section>

            <Section
                title={t('servers.sectionRunningServices')}
                icon={<ServerCog className="size-5" />}
                action={
                    can('server_service.create') ? (
                        <Button
                            type="button"
                            variant="outline"
                            size="sm"
                            onClick={() => setServiceDialogOpen(true)}
                        >
                            <Plus />
                            {t('servers.newService')}
                        </Button>
                    ) : undefined
                }
            >
                <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-3">
                    {serviceOptions.length === 0 ? (
                        <p className="text-muted-foreground text-sm sm:col-span-2 lg:col-span-3">
                            {t('servers.noServicesYet')}
                        </p>
                    ) : (
                        serviceOptions.map((service) => {
                            const checked = selectedServices.includes(
                                service.id,
                            );

                            return (
                                <label
                                    key={service.id}
                                    className="border-border hover:bg-muted/40 flex cursor-pointer items-center gap-3 rounded-lg border px-3 py-2.5 transition-colors"
                                >
                                    <Checkbox
                                        checked={checked}
                                        onCheckedChange={(value) =>
                                            toggleService(
                                                service.id,
                                                value === true,
                                            )
                                        }
                                    />
                                    <span className="flex items-center gap-2 text-sm font-medium">
                                        <ServerCog className="text-muted-foreground size-3.5" />
                                        {service.name}
                                    </span>
                                    {checked && (
                                        <input
                                            type="hidden"
                                            name="service_ids[]"
                                            value={service.id}
                                        />
                                    )}
                                </label>
                            );
                        })
                    )}
                </div>
                <InputError message={errors.service_ids} />
            </Section>

            {!isVm && (
                <>
                    <Section
                        title={t('servers.sectionItSupport')}
                        icon={<Headset className="size-5" />}
                        action={
                            can('it_support.create') ? (
                                <Button
                                    type="button"
                                    variant="outline"
                                    size="sm"
                                    onClick={() => setItSupportDialogOpen(true)}
                                >
                                    <Plus />
                                    {t('common.newItem')}
                                </Button>
                            ) : undefined
                        }
                    >
                        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                            <div className="grid gap-2">
                                <FieldIconLabel
                                    htmlFor="it_support_id"
                                    icon={<Headset className="size-3.5" />}
                                >
                                    {t('servers.itSupportName')}
                                </FieldIconLabel>
                                <select
                                    id="it_support_id"
                                    name="it_support_id"
                                    value={itSupportId}
                                    onChange={(event) =>
                                        onItSupportChange(event.target.value)
                                    }
                                    className="border-input bg-background h-9 w-full rounded-md border px-3 text-sm shadow-xs"
                                >
                                    <option value="">
                                        {t('servers.selectContact')}
                                    </option>
                                    {itSupportOptions.map((contact) => (
                                        <option
                                            key={contact.id}
                                            value={contact.id}
                                        >
                                            {contact.name}
                                        </option>
                                    ))}
                                </select>
                                <InputError message={errors.it_support_id} />
                            </div>
                            <div className="grid gap-2">
                                <Label htmlFor="it_support_phone">
                                    {t('servers.itSupportPhone')}
                                </Label>
                                <Input
                                    id="it_support_phone"
                                    name="it_support_phone"
                                    value={itSupportPhone}
                                    onChange={(event) =>
                                        setItSupportPhone(event.target.value)
                                    }
                                    placeholder={t(
                                        'servers.placeholderItSupportPhone',
                                    )}
                                />
                                <InputError message={errors.it_support_phone} />
                            </div>
                        </div>
                    </Section>

                    <Section
                        title={t('servers.sectionIdrac')}
                        icon={<KeyRound className="size-5" />}
                    >
                        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                            <div className="grid gap-2">
                                <Label htmlFor="idrac_ip_address">
                                    {t('servers.idracIpAddress')}
                                </Label>
                                <IpInput
                                    id="idrac_ip_address"
                                    name="idrac_ip_address"
                                    defaultValue={values.idrac_ip_address ?? ''}
                                />
                                <InputError message={errors.idrac_ip_address} />
                            </div>
                            <div className="grid gap-2">
                                <Label htmlFor="idrac_subnet_mask">
                                    {t('servers.subnetMask')}
                                </Label>
                                <IpInput
                                    id="idrac_subnet_mask"
                                    name="idrac_subnet_mask"
                                    defaultValue={
                                        values.idrac_subnet_mask ?? ''
                                    }
                                />
                                <InputError
                                    message={errors.idrac_subnet_mask}
                                />
                            </div>
                            <div className="grid gap-2">
                                <Label htmlFor="idrac_default_gateway">
                                    {t('servers.defaultGateway')}
                                </Label>
                                <IpInput
                                    id="idrac_default_gateway"
                                    name="idrac_default_gateway"
                                    defaultValue={
                                        values.idrac_default_gateway ?? ''
                                    }
                                />
                                <InputError
                                    message={errors.idrac_default_gateway}
                                />
                            </div>
                            <div className="grid gap-2">
                                <FieldIconLabel
                                    htmlFor="username"
                                    icon={<KeyRound className="size-3.5" />}
                                >
                                    {t('common.username')}
                                </FieldIconLabel>
                                <Input
                                    id="username"
                                    name="username"
                                    defaultValue={values.username ?? ''}
                                    autoComplete="off"
                                />
                                <InputError message={errors.username} />
                            </div>
                            <div className="grid gap-2 sm:col-span-2">
                                <Label htmlFor="password">
                                    {t('common.password')}
                                </Label>
                                <Input
                                    id="password"
                                    name="password"
                                    type="password"
                                    placeholder={
                                        isEdit && values.has_password
                                            ? t('servers.leavePasswordBlank')
                                            : t('servers.enterPassword')
                                    }
                                    autoComplete="new-password"
                                />
                                <InputError message={errors.password} />
                            </div>
                        </div>
                    </Section>
                </>
            )}

            <Section
                title={t('servers.sectionDescription')}
                icon={<HardDrive className="size-5" />}
            >
                <div className="grid gap-2">
                    <Label htmlFor="description">{t('common.notes')}</Label>
                    <textarea
                        id="description"
                        name="description"
                        rows={5}
                        defaultValue={values.description ?? ''}
                        className="border-input bg-background focus-visible:border-ring focus-visible:ring-ring/50 w-full rounded-md border px-3 py-2 text-sm shadow-xs outline-none focus-visible:ring-[3px]"
                        placeholder={t('servers.placeholderNotes')}
                    />
                    <InputError message={errors.description} />
                </div>
            </Section>

            <QuickCreateNameDialog
                open={departmentDialogOpen}
                onOpenChange={setDepartmentDialogOpen}
                title={t('servers.quickCreateDepartmentTitle')}
                description={t('servers.quickCreateDepartmentDescription')}
                endpoint="/quick-create/departments"
                placeholder={t('servers.quickCreateDepartmentPlaceholder')}
                icon={<Building2 className="size-4" />}
                onCreated={(option) => {
                    setDepartmentOptions((current) =>
                        [...current, option].sort((a, b) =>
                            a.name.localeCompare(b.name),
                        ),
                    );
                    setDepartmentId(String(option.id));
                }}
            />

            <QuickCreateNameDialog
                open={modelDialogOpen}
                onOpenChange={setModelDialogOpen}
                title={t('servers.quickCreateModelTitle')}
                description={t('servers.quickCreateModelDescription')}
                endpoint="/quick-create/server-models"
                placeholder={t('servers.quickCreateModelPlaceholder')}
                icon={<Server className="size-4" />}
                onCreated={(option) => {
                    setModelOptions((current) =>
                        [...current, option].sort((a, b) =>
                            a.name.localeCompare(b.name),
                        ),
                    );
                    setServerModelId(String(option.id));
                }}
            />

            <QuickCreateNameDialog
                open={serviceDialogOpen}
                onOpenChange={setServiceDialogOpen}
                title={t('servers.quickCreateServiceTitle')}
                description={t('servers.quickCreateServiceDescription')}
                endpoint="/quick-create/server-services"
                placeholder={t('servers.quickCreateServicePlaceholder')}
                icon={<ServerCog className="size-4" />}
                onCreated={(option) => {
                    setServiceOptions((current) =>
                        [...current, option].sort((a, b) =>
                            a.name.localeCompare(b.name),
                        ),
                    );
                    setSelectedServices((current) =>
                        current.includes(option.id)
                            ? current
                            : [...current, option.id],
                    );
                }}
            />

            <QuickCreateItSupportDialog
                open={itSupportDialogOpen}
                onOpenChange={setItSupportDialogOpen}
                onCreated={(contact) => {
                    setItSupportOptions((current) =>
                        [...current, contact].sort((a, b) =>
                            a.name.localeCompare(b.name),
                        ),
                    );
                    setItSupportId(String(contact.id));
                    if (contact.phone) {
                        setItSupportPhone(contact.phone);
                    }
                }}
            />
        </div>
    );
}
