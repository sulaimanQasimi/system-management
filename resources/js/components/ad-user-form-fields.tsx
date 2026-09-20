import InputError from '@/components/input-error';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';

export type AdUserFormValues = {
    name?: string;
    lastname?: string;
    username?: string;
    email?: string;
    job?: string | null;
    pbx?: string | null;
    phone?: string | null;
    date?: string | null;
};

export default function AdUserFormFields({
    values = {},
    errors = {},
}: {
    values?: AdUserFormValues;
    errors?: Partial<Record<keyof AdUserFormValues, string>>;
}) {
    return (
        <div className="grid gap-6 sm:grid-cols-2">
            <div className="grid gap-2">
                <Label htmlFor="name">Name</Label>
                <Input
                    id="name"
                    name="name"
                    required
                    defaultValue={values.name ?? ''}
                    placeholder="First name"
                    autoComplete="given-name"
                />
                <InputError message={errors.name} />
            </div>

            <div className="grid gap-2">
                <Label htmlFor="lastname">Last name</Label>
                <Input
                    id="lastname"
                    name="lastname"
                    required
                    defaultValue={values.lastname ?? ''}
                    placeholder="Last name"
                    autoComplete="family-name"
                />
                <InputError message={errors.lastname} />
            </div>

            <div className="grid gap-2">
                <Label htmlFor="username">Username</Label>
                <Input
                    id="username"
                    name="username"
                    required
                    defaultValue={values.username ?? ''}
                    placeholder="AD username"
                    autoComplete="username"
                />
                <InputError message={errors.username} />
            </div>

            <div className="grid gap-2">
                <Label htmlFor="email">Email</Label>
                <Input
                    id="email"
                    name="email"
                    type="email"
                    required
                    defaultValue={values.email ?? ''}
                    placeholder="user@example.com"
                    autoComplete="email"
                />
                <InputError message={errors.email} />
            </div>

            <div className="grid gap-2">
                <Label htmlFor="job">Job</Label>
                <Input
                    id="job"
                    name="job"
                    defaultValue={values.job ?? ''}
                    placeholder="Job title"
                />
                <InputError message={errors.job} />
            </div>

            <div className="grid gap-2">
                <Label htmlFor="pbx">PBX</Label>
                <Input
                    id="pbx"
                    name="pbx"
                    defaultValue={values.pbx ?? ''}
                    placeholder="PBX extension"
                />
                <InputError message={errors.pbx} />
            </div>

            <div className="grid gap-2">
                <Label htmlFor="phone">Phone</Label>
                <Input
                    id="phone"
                    name="phone"
                    defaultValue={values.phone ?? ''}
                    placeholder="Phone number"
                    autoComplete="tel"
                />
                <InputError message={errors.phone} />
            </div>

            <div className="grid gap-2">
                <Label htmlFor="date">Date</Label>
                <Input
                    id="date"
                    name="date"
                    type="date"
                    defaultValue={values.date ?? ''}
                />
                <InputError message={errors.date} />
            </div>
        </div>
    );
}
