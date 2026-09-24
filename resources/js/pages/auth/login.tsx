import { Form, Head } from '@inertiajs/react';
import { LockKeyhole } from 'lucide-react';
import InputError from '@/components/input-error';
import PasskeyVerify from '@/components/passkey-verify';
import PasswordInput from '@/components/password-input';
import { Button } from '@/components/ui/button';
import { Checkbox } from '@/components/ui/checkbox';
import { Input } from '@/components/ui/input';
import { Spinner } from '@/components/ui/spinner';
import { useTranslations } from '@/hooks/use-locale';
import { store } from '@/routes/login';

type Props = {
    status?: string;
};

export default function Login({ status }: Props) {
    const { t } = useTranslations();

    return (
        <>
            <Head title={t('auth.loginHead')} />

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
                    label={t('auth.continuePasskey')}
                    loadingLabel={t('auth.waitingPasskey')}
                    separator={t('auth.orEmail')}
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
                                    {t('auth.email')}
                                </label>
                                <Input
                                    id="email"
                                    type="email"
                                    name="email"
                                    required
                                    autoFocus
                                    tabIndex={1}
                                    autoComplete="email"
                                    placeholder={t('auth.emailPlaceholder')}
                                    className="h-10"
                                />
                                <InputError message={errors.email} />
                            </div>

                            <div className="space-y-2">
                                <label
                                    htmlFor="password"
                                    className="text-foreground text-sm font-medium"
                                >
                                    {t('auth.password')}
                                </label>
                                <PasswordInput
                                    id="password"
                                    name="password"
                                    required
                                    tabIndex={2}
                                    autoComplete="current-password"
                                    placeholder={t('auth.passwordPlaceholder')}
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
                                    {t('auth.remember')}
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
                                {processing
                                    ? t('auth.signingIn')
                                    : t('auth.signIn')}
                            </Button>
                        </>
                    )}
                </Form>
            </div>
        </>
    );
}

Login.layout = {
    title: 'auth.loginTitle',
    description: 'auth.loginDescription',
};
