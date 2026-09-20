import type { SVGAttributes } from 'react';

export default function AppLogoIcon(props: SVGAttributes<SVGElement>) {
    return (
        <svg
            {...props}
            viewBox="0 0 40 40"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
        >
            <circle cx="20" cy="8" r="3.5" fill="currentColor" />
            <circle cx="8" cy="28" r="3.5" fill="currentColor" />
            <circle cx="32" cy="28" r="3.5" fill="currentColor" />
            <circle cx="20" cy="22" r="2.5" fill="currentColor" opacity="0.9" />
            <path
                d="M20 11.5V19.5M18.2 23.2L10.5 27.2M21.8 23.2L29.5 27.2M11.5 28H28.5"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
            />
        </svg>
    );
}
