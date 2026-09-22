import { Head, Link, usePage } from '@inertiajs/react';
import { ArrowRight } from 'lucide-react';
import { dashboard, login } from '@/routes';
/**
 * Public landing — full-bleed institutional imagery with a calm Regal overlay.
 * Brand title is the primary signal; CTA lives in the hero (no separate header).
 */
export default function Welcome() {
    const { auth } = usePage().props;
    const ctaHref = auth.user ? dashboard() : login();
    const ctaLabel = auth.user ? 'Open dashboard' : 'Sign in';

    return (
        <>
            <Head title = "system management & network section" />
            <div className="relative min-h-svh overflow-hidden">
                <img src="/images/background.jpg" alt="" className="absolute inset-0 size-full object-cover object-center" />

                {/* Regal navy wash for contrast over the photograph */}
                <div
                    aria-hidden
                    className="absolute inset-0"
                    style={{
                        backgroundImage: `
                            linear-gradient(
                                105deg,
                                color-mix(in oklch, var(--sidebar) 88%, transparent) 0%,
                                color-mix(in oklch, var(--sidebar) 72%, transparent) 42%,
                                color-mix(in oklch, var(--sidebar) 35%, transparent) 100%
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
                                ellipse 70% 55% at 18% 40%,
                                color-mix(in oklch, var(--accent-gold) 14%, transparent),
                                transparent 60%
                            )
                        `,
                    }}
                />

                <main className="relative z-10 mx-auto flex min-h-svh w-full max-w-6xl flex-col justify-center px-6 py-16 lg:px-8">
                    <div className="max-w-xl opacity-100 transition-all duration-700 starting:translate-y-3 starting:opacity-0">
                        <p className="text-accent-gold mb-4 text-xs font-semibold tracking-[0.22em] uppercase">
                            Network Section · Department Portal
                        </p>

                        <h1 className="text-sidebar-foreground text-4xl font-semibold tracking-tight text-balance sm:text-5xl lg:text-6xl">
                            System Management
                        </h1>

                        <p className="text-sidebar-foreground/75 mt-5 max-w-md text-base leading-relaxed sm:text-lg">
                            Secure infrastructure oversight for the Network
                            Section — servers, directory accounts, and support
                            operations in one place.
                        </p>

                        <div className="mt-10">
                            <Link
                                href={ctaHref}
                                className="bg-sidebar-primary text-sidebar-primary-foreground inline-flex items-center gap-2 rounded-md px-5 py-2.5 text-sm font-semibold shadow-regal transition hover:brightness-110 focus-visible:ring-sidebar-ring focus-visible:ring-2 focus-visible:outline-none"
                            >
                                {ctaLabel}
                                <ArrowRight className="size-4" aria-hidden />
                            </Link>
                        </div>
                    </div>
                </main>
            </div>
        </>
    );
}
