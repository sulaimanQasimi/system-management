import { Link, usePage } from '@inertiajs/react';
import { LocaleSwitcher } from '@/components/locale-switcher';
import { useTranslations } from '@/hooks/use-locale';
import { home } from '@/routes';
import type { AuthLayoutProps } from '@/types';

export default function AuthSplitLayout({
    children,
    title,
    description,
}: AuthLayoutProps) {
    const { name } = usePage().props;
    const { t } = useTranslations();

    const resolvedTitle = title ? t(title) : '';
    const resolvedDescription = description ? t(description) : '';

    return (
        <div className="relative grid min-h-svh lg:grid-cols-2">
            {/* Brand panel — institutional imagery + navy wash */}
            <aside className="bg-sidebar text-sidebar-foreground relative hidden overflow-hidden lg:flex lg:flex-col">
                <img
                    src="/images/background.png"
                    alt=""
                    className="absolute inset-0 size-full object-cover object-center"
                />
                <div
                    aria-hidden
                    className="absolute inset-0"
                    style={{
                        backgroundImage: `
                            linear-gradient(
                                115deg,
                                color-mix(in srgb, var(--sidebar) 92%, transparent) 0%,
                                color-mix(in srgb, var(--sidebar) 78%, transparent) 48%,
                                color-mix(in srgb, var(--sidebar) 55%, transparent) 100%
                            )
                        `,
                    }}
                />
                <div
                    aria-hidden
                    className="absolute inset-0"
                    style={{
                        backgroundImage: `
                            radial-gradient(
                                ellipse 65% 50% at 20% 35%,
                                color-mix(in srgb, var(--primary) 22%, transparent),
                                transparent 62%
                            )
                        `,
                    }}
                />

                <div className="relative z-10 flex h-full flex-col items-center justify-center p-10 text-center xl:p-12">
                    <Link href={home()} className="inline-flex">
                        <img
                            src="/images/logo.jpg"
                            alt={name}
                            className="border-sidebar-foreground/20 size-36 rounded-full border-2 object-cover shadow-regal xl:size-44"
                        />
                    </Link>
                    <h1 className="mt-6 text-3xl font-semibold tracking-tight text-balance xl:text-4xl">
                        {t('brand.welcome')}
                    </h1>
                    <p className="text-sidebar-foreground/70 mt-3 max-w-md text-sm leading-relaxed text-pretty xl:text-base">
                        {t('brand.tagline')}
                    </p>
                </div>
            </aside>

            {/* Form panel */}
            <div className="bg-background relative flex flex-col justify-center px-6 py-12 sm:px-10 lg:px-12">
                <div
                    aria-hidden
                    className="pointer-events-none absolute inset-0"
                    style={{
                        backgroundImage: `
                            radial-gradient(ellipse 60% 40% at 80% 0%, color-mix(in srgb, var(--primary) 10%, transparent), transparent 55%),
                            radial-gradient(ellipse 45% 35% at 0% 100%, color-mix(in srgb, var(--primary) 8%, transparent), transparent 50%)
                        `,
                    }}
                />

                <div className="absolute end-6 top-6 z-20 sm:end-10">
                    <LocaleSwitcher />
                </div>

                <div className="relative z-10 mx-auto w-full max-w-[24rem]">
                    <Link
                        href={home()}
                        className="mb-10 flex justify-center lg:hidden"
                    >
                        <img
                            src="/images/logo.jpg"
                            alt={name}
                            className="border-border size-16 rounded-xl border object-cover shadow-regal"
                        />
                    </Link>

                    <header className="mb-8 space-y-2 opacity-100 transition-all duration-500 starting:translate-y-2 starting:opacity-0">
                        <h1 className="text-section-title text-balance">
                            {resolvedTitle}
                        </h1>
                        {resolvedDescription && (
                            <p className="text-muted-foreground text-body text-pretty">
                                {resolvedDescription}
                            </p>
                        )}
                    </header>

                    <div className="opacity-100 transition-all delay-75 duration-500 starting:translate-y-2 starting:opacity-0">
                        {children}
                    </div>
                </div>
            </div>
        </div>
    );
}
