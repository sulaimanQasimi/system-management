import { Link, usePage } from '@inertiajs/react';
import { Network } from 'lucide-react';
import AppLogoIcon from '@/components/app-logo-icon';
import { home } from '@/routes';
import type { AuthLayoutProps } from '@/types';

export default function AuthSimpleLayout({
    children,
    title,
    description,
}: AuthLayoutProps) {
    const { name } = usePage().props;

    return (
        <div className="relative flex min-h-svh flex-col items-center justify-center overflow-hidden p-6 md:p-10">
            <div
                aria-hidden
                className="pointer-events-none absolute inset-0"
                style={{
                    backgroundImage: `
                        radial-gradient(ellipse 70% 50% at 50% -10%, oklch(0.72 0.12 195 / 0.18), transparent 55%),
                        radial-gradient(ellipse 50% 40% at 100% 100%, oklch(0.42 0.1 220 / 0.12), transparent 50%)
                    `,
                }}
            />
            <div className="relative z-10 w-full max-w-sm">
                <div className="flex flex-col gap-8">
                    <div className="flex flex-col items-center gap-4">
                        <Link
                            href={home()}
                            className="flex flex-col items-center gap-3 font-medium"
                        >
                            <div className="bg-primary text-primary-foreground flex size-11 items-center justify-center rounded-lg shadow-sm">
                                <AppLogoIcon className="size-6" />
                            </div>
                            <div className="text-center leading-tight">
                                <p className="font-semibold">{name}</p>
                                <p className="text-muted-foreground mt-0.5 flex items-center justify-center gap-1.5 text-xs">
                                    <Network className="size-3" />
                                    Department Portal
                                </p>
                            </div>
                            <span className="sr-only">{title}</span>
                        </Link>

                        <div className="space-y-2 text-center">
                            <h1 className="text-xl font-semibold tracking-tight">
                                {title}
                            </h1>
                            <p className="text-muted-foreground text-center text-sm text-balance">
                                {description}
                            </p>
                        </div>
                    </div>
                    {children}
                </div>
            </div>
        </div>
    );
}
