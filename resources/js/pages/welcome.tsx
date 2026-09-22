import { Head, Link, usePage } from '@inertiajs/react';
import { ArrowRight, Network } from 'lucide-react';
import { dashboard, login } from '@/routes';

/**
 * Public landing — Regal/Majestic brand surface.
 * Uses design tokens via CSS variables rather than one-off teal accents.
 */
export default function Welcome() {
    const { auth, name } = usePage().props;

    return (
        <>
            <Head title="Welcome" />
            <div className="bg-sidebar text-sidebar-foreground relative min-h-svh overflow-hidden">
                <div
                    aria-hidden
                    className="animate-mesh-drift pointer-events-none absolute inset-0 opacity-80"
                    style={{
                        backgroundImage: `
                            radial-gradient(ellipse 80% 60% at 15% 20%, color-mix(in oklch, var(--accent-gold) 28%, transparent), transparent 55%),
                            radial-gradient(ellipse 70% 50% at 85% 75%, color-mix(in oklch, var(--secondary-foreground) 22%, transparent), transparent 50%),
                            linear-gradient(165deg, var(--sidebar), color-mix(in oklch, var(--sidebar) 85%, black) 55%, color-mix(in oklch, var(--sidebar) 90%, var(--primary)) )
                        `,
                    }}
                />
                <div
                    aria-hidden
                    className="pointer-events-none absolute inset-0 opacity-[0.14]"
                    style={{
                        backgroundImage: `
                            linear-gradient(color-mix(in oklch, var(--accent-gold) 20%, transparent) 1px, transparent 1px),
                            linear-gradient(90deg, color-mix(in oklch, var(--accent-gold) 20%, transparent) 1px, transparent 1px)
                        `,
                        backgroundSize: '48px 48px',
                        maskImage:
                            'radial-gradient(ellipse 70% 60% at 50% 40%, black, transparent)',
                    }}
                />

                <svg
                    aria-hidden
                    className="pointer-events-none absolute inset-0 h-full w-full opacity-35"
                    viewBox="0 0 1200 800"
                    fill="none"
                >
                    <path
                        className="animate-link-draw"
                        d="M180 160 L420 280 L600 220 L820 340 L980 240"
                        stroke="var(--accent-gold)"
                        strokeWidth="1.5"
                        strokeOpacity="0.55"
                    />
                    <path
                        className="animate-link-draw"
                        style={{ animationDelay: '0.25s' }}
                        d="M220 520 L420 400 L600 480 L760 390 L960 520"
                        stroke="var(--sidebar-foreground)"
                        strokeWidth="1.5"
                        strokeOpacity="0.35"
                    />
                    <circle
                        className="animate-node-pulse origin-center"
                        cx="420"
                        cy="280"
                        r="5"
                        fill="var(--accent-gold)"
                    />
                    <circle
                        className="animate-node-pulse origin-center"
                        style={{ animationDelay: '0.8s' }}
                        cx="600"
                        cy="220"
                        r="4"
                        fill="var(--sidebar-foreground)"
                        fillOpacity="0.7"
                    />
                    <circle
                        className="animate-node-pulse origin-center"
                        style={{ animationDelay: '1.4s' }}
                        cx="820"
                        cy="340"
                        r="5"
                        fill="var(--accent-gold)"
                    />
                </svg>

                <header className="relative z-10 mx-auto flex w-full max-w-6xl items-center justify-between px-6 py-6 lg:px-8">
                    <div className="flex items-center gap-3">
                        <div className="bg-sidebar-primary text-sidebar-primary-foreground flex size-10 items-center justify-center rounded-md">
                            <Network className="size-5" strokeWidth={2.25} />
                        </div>
                        <div className="leading-tight">
                            <p className="text-sm font-semibold tracking-wide">
                                {name}
                            </p>
                            <p className="text-sidebar-foreground/55 text-xs">
                                Department Portal
                            </p>
                        </div>
                    </div>
                    <nav className="flex items-center gap-3 text-sm">
                        {auth.user ? (
                            <Link
                                href={dashboard()}
                                className="bg-sidebar-primary text-sidebar-primary-foreground inline-flex items-center gap-2 rounded-md px-4 py-2 font-medium transition hover:brightness-110"
                            >
                                Open dashboard
                                <ArrowRight className="size-4" />
                            </Link>
                        ) : (
                            <Link
                                href={login()}
                                className="bg-sidebar-primary text-sidebar-primary-foreground inline-flex items-center gap-2 rounded-md px-4 py-2 font-medium transition hover:brightness-110"
                            >
                                Log in
                                <ArrowRight className="size-4" />
                            </Link>
                        )}
                    </nav>
                </header>

                <main className="relative z-10 mx-auto flex min-h-[calc(100svh-5.5rem)] w-full max-w-6xl flex-col justify-center px-6 pb-16 lg:px-8">
                    <p className="text-accent-gold mb-4 text-xs font-medium tracking-[0.22em] uppercase opacity-100 transition-opacity duration-700 starting:opacity-0">
                        Operations · Connectivity · Control
                    </p>
                    <h1 className="text-display max-w-3xl text-balance opacity-100 transition-all duration-700 starting:translate-y-3 starting:opacity-0 sm:text-5xl lg:text-6xl">
                        {name}
                    </h1>
                    <p className="text-sidebar-foreground/65 mt-5 max-w-xl text-base leading-relaxed opacity-100 transition-all delay-100 duration-700 sm:text-lg starting:translate-y-3 starting:opacity-0">
                        Secure system management for the Network Section
                        Department — monitor infrastructure, coordinate teams,
                        and keep every link online.
                    </p>
                    <div className="mt-10 flex flex-wrap items-center gap-4 opacity-100 transition-all delay-200 duration-700 starting:translate-y-3 starting:opacity-0">
                        {auth.user ? (
                            <Link
                                href={dashboard()}
                                className="bg-surface-elevated text-foreground inline-flex items-center gap-2 rounded-md px-5 py-2.5 text-sm font-semibold transition hover:opacity-90"
                            >
                                Go to dashboard
                                <ArrowRight className="size-4" />
                            </Link>
                        ) : (
                            <Link
                                href={login()}
                                className="bg-surface-elevated text-foreground inline-flex items-center gap-2 rounded-md px-5 py-2.5 text-sm font-semibold transition hover:opacity-90"
                            >
                                Sign in
                                <ArrowRight className="size-4" />
                            </Link>
                        )}
                    </div>
                </main>
            </div>
        </>
    );
}
