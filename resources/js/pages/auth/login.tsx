import { Form, Head } from '@inertiajs/react';
import { LockKeyhole } from 'lucide-react';
import InputError from '@/components/input-error';
import PasskeyVerify from '@/components/passkey-verify';
import PasswordInput from '@/components/password-input';
import TextLink from '@/components/text-link';
import { Button } from '@/components/ui/button';
import { Checkbox } from '@/components/ui/checkbox';
import { Input } from '@/components/ui/input';
import { Spinner } from '@/components/ui/spinner';
import { store } from '@/routes/login';
import { request } from '@/routes/password';

type Props = {
    status?: string;
    canResetPassword: boolean;
};

export default function Login({ status, canResetPassword }: Props) {
    return (
        <>
            <Head title="Log in" />

            <div className="flex flex-col gap-6">
                {status && (
                    <div
                        role="status"
                        className="border-success/25 bg-success/10 text-success rounded-lg border px-3.5 py-2.5 text-center text-sm font-medium"
                    >
                        {status}
                    </div>
                )}

                <PasskeyVerify
                    label="Continue with passkey"
                    loadingLabel="Waiting for passkey…"
                    separator="Or continue with email"
                />

                <Form
                    {...store.form()}
                    resetOnSuccess={['password']}
                    className="flex flex-col gap-5"
                >
                    {({ processing, errors }) => (
                        <>
                            <div className="space-y-2">
                                <label
                                    htmlFor="email"
                                    className="text-foreground text-sm font-medium"
                                >
                                    Email address
                                </label>
                                <Input
                                    id="email"
                                    type="email"
                                    name="email"
                                    required
                                    autoFocus
                                    tabIndex={1}
                                    autoComplete="email"
                                    placeholder="name@organization.local"
                                    className="h-10"
                                />
                                <InputError message={errors.email} />
                            </div>

                            <div className="space-y-2">
                                <div className="flex items-center justify-between gap-3">
                                    <label
                                        htmlFor="password"
                                        className="text-foreground text-sm font-medium"
                                    >
                                        Password
                                    </label>
                                    {canResetPassword && (
                                        <TextLink
                                            href={request()}
                                            className="text-muted-foreground hover:text-foreground text-xs font-medium"
                                            tabIndex={5}
                                        >
                                            Forgot password?
                                        </TextLink>
                                    )}
                                </div>
                                <PasswordInput
                                    id="password"
                                    name="password"
                                    required
                                    tabIndex={2}
                                    autoComplete="current-password"
                                    placeholder="Enter your password"
                                    className="h-10"
                                />
                                <InputError message={errors.password} />
                            </div>

                            <div className="flex items-center gap-2.5">
                                <Checkbox
                                    id="remember"
                                    name="remember"
                                    tabIndex={3}
                                />
                                <label
                                    htmlFor="remember"
                                    className="text-muted-foreground text-sm leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                                >
                                    Keep me signed in on this device
                                </label>
                            </div>

                            <Button
                                type="submit"
                                className="mt-1 h-10 w-full font-semibold"
                                tabIndex={4}
                                disabled={processing}
                                data-test="login-button"
                            >
                                {processing ? (
                                    <Spinner />
                                ) : (
                                    <LockKeyhole
                                        className="size-4"
                                        aria-hidden
                                    />
                                )}
                                {processing ? 'Signing in…' : 'Sign in'}
                            </Button>
                        </>
                    )}
                </Form>
            </div>
        </>
    );
}

Login.layout = {
    title: 'Welcome back',
    description:
        'Sign in with your department credentials to open the operations portal.',
};
