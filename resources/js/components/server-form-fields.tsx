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
                title="Identity"
                description="Site, department, model, naming, and operational status."
                icon={<HardDrive className="size-5" />}
            >
                <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                    <div className="grid gap-2">
                        <FieldIconLabel
                            htmlFor="site_name"
                            icon={<Building2 className="size-3.5" />}
                        >
                            Site name
                        </FieldIconLabel>
                        <Input
                            id="site_name"
                            name="site_name"
                            required
                            defaultValue={values.site_name ?? ''}
                            placeholder="e.g. HQ Data Center"
                        />
                        <InputError message={errors.site_name} />
                    </div>

                    <div className="grid gap-2">
                        <FieldIconLabel
                            htmlFor="name"
                            icon={<Server className="size-3.5" />}
                        >
                            Server name
                        </FieldIconLabel>
                        <Input
                            id="name"
                            name="name"
                            required
                            defaultValue={values.name ?? ''}
                            placeholder="e.g. DC01-APP"
                        />
                        <InputError message={errors.name} />
                    </div>

                    <div className="grid gap-2">
                        <div className="flex items-center justify-between gap-2">
                            <FieldIconLabel
                                htmlFor="department_id"
                                icon={<Building2 className="size-3.5" />}
                            >
                                Department
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
                                    New
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
                                Select department
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
                                Server model
                            </FieldIconLabel>
                            {can('server_model.create') && (
                                <Button
                                    type="button"
                                    variant="outline"
                                    size="sm"
                                    onClick={() => setModelDialogOpen(true)}
                                >
                                    <Plus />
                                    New
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
                                Select server model
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
                            Status
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
                                    {status.label}
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
                            Virtual machine
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
                                    ? 'This is a VM (no iDRAC / IT Support)'
                                    : 'Mark as virtual machine'}
                            </span>
                        </label>
                        <InputError message={errors.is_vm} />
                    </div>
                </div>
            </Section>

            <Section
                title="Network"
                description="Primary IP addressing for the production interface."
                icon={<Network className="size-5" />}
            >
                <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
                    <div className="grid gap-2">
                        <FieldIconLabel
                            htmlFor="ip_address"
                            icon={<Network className="size-3.5" />}
                        >
                            Server IP address
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
                        <Label htmlFor="subnet_mask">Subnet mask</Label>
                        <IpInput
                            id="subnet_mask"
                            name="subnet_mask"
                            defaultValue={values.subnet_mask ?? ''}
                        />
                        <InputError message={errors.subnet_mask} />
                    </div>
                    <div className="grid gap-2 sm:col-span-2 lg:col-span-1">
                        <Label htmlFor="default_gateway">Default gateway</Label>
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
                title="Running services"
                description="Select all services this server currently runs."
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
                            New service
                        </Button>
                    ) : undefined
                }
            >
                <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-3">
                    {serviceOptions.length === 0 ? (
                        <p className="text-muted-foreground text-sm sm:col-span-2 lg:col-span-3">
                            No services yet. Create one with the button above.
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
                        title="IT Support"
                        description="Assigned support contact and reachable phone / PBX."
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
                                    New
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
                                    IT Support name
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
                                    <option value="">Select contact</option>
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
                                    IT Support phone no
                                </Label>
                                <Input
                                    id="it_support_phone"
                                    name="it_support_phone"
                                    value={itSupportPhone}
                                    onChange={(event) =>
                                        setItSupportPhone(event.target.value)
                                    }
                                    placeholder="PBX / phone"
                                />
                                <InputError message={errors.it_support_phone} />
                            </div>
                        </div>
                    </Section>

                    <Section
                        title="iDRAC / Out-of-band"
                        description="Management network and credentials for remote access."
                        icon={<KeyRound className="size-5" />}
                    >
                        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                            <div className="grid gap-2">
                                <Label htmlFor="idrac_ip_address">
                                    iDRAC IP address
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
                                    Subnet mask
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
                                    Default gateway
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
                                    Username
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
                                <Label htmlFor="password">Password</Label>
                                <Input
                                    id="password"
                                    name="password"
                                    type="password"
                                    placeholder={
                                        isEdit && values.has_password
                                            ? 'Leave blank to keep current password'
                                            : 'Enter password'
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
                title="Description"
                description="Role, dependencies, and maintenance notes."
                icon={<HardDrive className="size-5" />}
            >
                <div className="grid gap-2">
                    <Label htmlFor="description">Notes</Label>
                    <textarea
                        id="description"
                        name="description"
                        rows={5}
                        defaultValue={values.description ?? ''}
                        className="border-input bg-background focus-visible:border-ring focus-visible:ring-ring/50 w-full rounded-md border px-3 py-2 text-sm shadow-xs outline-none focus-visible:ring-[3px]"
                        placeholder="Role, dependencies, maintenance notes…"
                    />
                    <InputError message={errors.description} />
                </div>
            </Section>

            <QuickCreateNameDialog
                open={departmentDialogOpen}
                onOpenChange={setDepartmentDialogOpen}
                title="Create department"
                description="Add a department without leaving this form."
                endpoint="/quick-create/departments"
                placeholder="e.g. Network Section"
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
                title="Create server model"
                description="Register a hardware model for immediate selection."
                endpoint="/quick-create/server-models"
                placeholder="e.g. Dell PowerEdge R760"
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
                title="Create server service"
                description="Add a running service and select it on this server."
                endpoint="/quick-create/server-services"
                placeholder="e.g. DNS, DHCP, Active Directory"
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
