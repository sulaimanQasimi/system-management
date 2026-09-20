import { Head, Link, usePage } from '@inertiajs/react';
import { ArrowRight, Network } from 'lucide-react';
import { dashboard, login, register } from '@/routes';

export default function Welcome() {
    const { auth, name } = usePage().props;

    return (
        <>
            <Head title="Welcome" />
            <div className="relative min-h-svh overflow-hidden bg-[oklch(0.16_0.04_240)] text-white">
                <div
                    aria-hidden
                    className="animate-mesh-drift pointer-events-none absolute inset-0 opacity-80"
                    style={{
                        backgroundImage: `
                            radial-gradient(ellipse 80% 60% at 15% 20%, oklch(0.45 0.12 195 / 0.35), transparent 55%),
                            radial-gradient(ellipse 70% 50% at 85% 75%, oklch(0.4 0.1 230 / 0.3), transparent 50%),
                            linear-gradient(165deg, oklch(0.18 0.045 245), oklch(0.14 0.035 240) 55%, oklch(0.2 0.05 210))
                        `,
                    }}
                />
                <div
                    aria-hidden
                    className="pointer-events-none absolute inset-0 opacity-[0.18]"
                    style={{
                        backgroundImage: `
                            linear-gradient(oklch(0.75 0.08 195 / 0.15) 1px, transparent 1px),
                            linear-gradient(90deg, oklch(0.75 0.08 195 / 0.15) 1px, transparent 1px)
                        `,
                        backgroundSize: '48px 48px',
                        maskImage:
                            'radial-gradient(ellipse 70% 60% at 50% 40%, black, transparent)',
                    }}
                />

                <svg
                    aria-hidden
                    className="pointer-events-none absolute inset-0 h-full w-full opacity-40"
                    viewBox="0 0 1200 800"
                    fill="none"
                >
                    <path
                        className="animate-link-draw"
                        d="M180 160 L420 280 L600 220 L820 340 L980 240"
                        stroke="oklch(0.72 0.12 195)"
                        strokeWidth="1.5"
                        strokeOpacity="0.55"
                    />
                    <path
                        className="animate-link-draw"
                        style={{ animationDelay: '0.25s' }}
                        d="M220 520 L420 400 L600 480 L760 390 L960 520"
                        stroke="oklch(0.65 0.1 210)"
                        strokeWidth="1.5"
                        strokeOpacity="0.4"
                    />
                    <circle
                        className="animate-node-pulse origin-center"
                        cx="420"
                        cy="280"
                        r="5"
                        fill="oklch(0.78 0.12 195)"
                    />
                    <circle
                        className="animate-node-pulse origin-center"
                        style={{ animationDelay: '0.8s' }}
                        cx="600"
                        cy="220"
                        r="4"
                        fill="oklch(0.75 0.1 210)"
                    />
                    <circle
                        className="animate-node-pulse origin-center"
                        style={{ animationDelay: '1.4s' }}
                        cx="820"
                        cy="340"
                        r="5"
                        fill="oklch(0.78 0.12 195)"
                    />
                </svg>

                <header className="relative z-10 mx-auto flex w-full max-w-6xl items-center justify-between px-6 py-6 lg:px-8">
                    <div className="flex items-center gap-3">
                        <div className="flex size-10 items-center justify-center rounded-md bg-[oklch(0.72_0.12_195)] text-[oklch(0.16_0.04_240)]">
                            <Network className="size-5" strokeWidth={2.25} />
                        </div>
                        <div className="leading-tight">
                            <p className="text-sm font-semibold tracking-wide">
                                {name}
                            </p>
                            <p className="text-xs text-white/55">
                                Department Portal
                            </p>
                        </div>
                    </div>
                    <nav className="flex items-center gap-3 text-sm">
                        {auth.user ? (
                            <Link
                                href={dashboard()}
                                className="inline-flex items-center gap-2 rounded-md bg-[oklch(0.72_0.12_195)] px-4 py-2 font-medium text-[oklch(0.16_0.04_240)] transition hover:brightness-110"
                            >
                                Open dashboard
                                <ArrowRight className="size-4" />
                            </Link>
                        ) : (
                            <>
                                <Link
                                    href={login()}
                                    className="rounded-md px-4 py-2 text-white/80 transition hover:bg-white/10 hover:text-white"
                                >
                                    Log in
                                </Link>
                                <Link
                                    href={register()}
                                    className="inline-flex items-center gap-2 rounded-md bg-[oklch(0.72_0.12_195)] px-4 py-2 font-medium text-[oklch(0.16_0.04_240)] transition hover:brightness-110"
                                >
                                    Request access
                                    <ArrowRight className="size-4" />
                                </Link>
                            </>
                        )}
                    </nav>
                </header>

                <main className="relative z-10 mx-auto flex min-h-[calc(100svh-5.5rem)] w-full max-w-6xl flex-col justify-center px-6 pb-16 lg:px-8">
                    <p className="mb-4 text-xs font-medium tracking-[0.22em] text-[oklch(0.78_0.1_195)] uppercase opacity-100 transition-opacity duration-700 starting:opacity-0">
                        Operations · Connectivity · Control
                    </p>
                    <h1 className="max-w-3xl text-4xl font-semibold tracking-tight text-balance opacity-100 transition-all duration-700 sm:text-5xl lg:text-6xl starting:translate-y-3 starting:opacity-0">
                        {name}
                    </h1>
                    <p className="mt-5 max-w-xl text-base leading-relaxed text-white/65 opacity-100 transition-all delay-100 duration-700 sm:text-lg starting:translate-y-3 starting:opacity-0">
                        Secure system management for the Network Section
                        Department — monitor infrastructure, coordinate teams,
                        and keep every link online.
                    </p>
                    <div className="mt-10 flex flex-wrap items-center gap-4 opacity-100 transition-all delay-200 duration-700 starting:translate-y-3 starting:opacity-0">
                        {auth.user ? (
                            <Link
                                href={dashboard()}
                                className="inline-flex items-center gap-2 rounded-md bg-white px-5 py-2.5 text-sm font-semibold text-[oklch(0.18_0.04_240)] transition hover:bg-white/90"
                            >
                                Go to dashboard
                                <ArrowRight className="size-4" />
                            </Link>
                        ) : (
                            <>
                                <Link
                                    href={login()}
                                    className="inline-flex items-center gap-2 rounded-md bg-white px-5 py-2.5 text-sm font-semibold text-[oklch(0.18_0.04_240)] transition hover:bg-white/90"
                                >
                                    Sign in
                                    <ArrowRight className="size-4" />
                                </Link>
                                <Link
                                    href={register()}
                                    className="rounded-md border border-white/25 px-5 py-2.5 text-sm font-medium text-white/90 transition hover:border-white/45 hover:bg-white/5"
                                >
                                    Create account
                                </Link>
                            </>
                        )}
                    </div>
                </main>
            </div>
        </>
    );
}
