import { Link, usePage } from '@inertiajs/react';
import AppLogoIcon from '@/components/app-logo-icon';
import { home } from '@/routes';
import type { AuthLayoutProps } from '@/types';

export default function AuthSplitLayout({
    children,
    title,
    description,
}: AuthLayoutProps) {
    const { name } = usePage().props;

    return (
        <div className="relative grid h-dvh flex-col items-center justify-center px-8 sm:px-0 lg:max-w-none lg:grid-cols-2 lg:px-0">
            <div className="relative hidden h-full flex-col overflow-hidden p-10 text-white lg:flex dark:border-r">
                <div
                    className="absolute inset-0"
                    style={{
                        backgroundImage: `
                            radial-gradient(ellipse 80% 60% at 20% 20%, oklch(0.45 0.12 195 / 0.4), transparent 55%),
                            linear-gradient(165deg, oklch(0.2 0.045 245), oklch(0.14 0.035 240))
                        `,
                    }}
                />
                <div
                    aria-hidden
                    className="pointer-events-none absolute inset-0 opacity-20"
                    style={{
                        backgroundImage: `
                            linear-gradient(oklch(0.75 0.08 195 / 0.2) 1px, transparent 1px),
                            linear-gradient(90deg, oklch(0.75 0.08 195 / 0.2) 1px, transparent 1px)
                        `,
                        backgroundSize: '40px 40px',
                    }}
                />
                <Link
                    href={home()}
                    className="relative z-20 flex items-center text-lg font-semibold"
                >
                    <AppLogoIcon className="mr-2 size-8 text-[oklch(0.78_0.12_195)]" />
                    {name}
                </Link>
                <div className="relative z-20 mt-auto">
                    <p className="text-lg font-medium">
                        Network Section Department
                    </p>
                    <p className="mt-2 max-w-sm text-sm text-white/65">
                        Secure access to infrastructure operations, connectivity
                        oversight, and department systems.
                    </p>
                </div>
            </div>
            <div className="w-full lg:p-8">
                <div className="mx-auto flex w-full flex-col justify-center space-y-6 sm:w-[350px]">
                    <Link
                        href={home()}
                        className="relative z-20 flex items-center justify-center lg:hidden"
                    >
                        <div className="bg-primary text-primary-foreground flex size-11 items-center justify-center rounded-lg">
                            <AppLogoIcon className="size-6" />
                        </div>
                    </Link>
                    <div className="flex flex-col items-start gap-2 text-left sm:items-center sm:text-center">
                        <h1 className="text-xl font-semibold tracking-tight">
                            {title}
                        </h1>
                        <p className="text-muted-foreground text-sm text-balance">
                            {description}
                        </p>
                    </div>
                    {children}
                </div>
            </div>
        </div>
    );
}
