import { useState, type ChangeEvent, type ComponentProps } from 'react';
import { Input } from '@/components/ui/input';

function sanitizeIpInput(value: string): string {
    const cleaned = value.replace(/[^\d.]/g, '');
    const parts = cleaned.split('.');
    const octets: string[] = [];

    for (const part of parts) {
        if (octets.length >= 4) {
            break;
        }

        let digits = part.replace(/\D/g, '');

        while (digits.length > 3 && octets.length < 4) {
            const chunk = digits.slice(0, 3);
            octets.push(Number(chunk) > 255 ? '255' : chunk);
            digits = digits.slice(3);
        }

        if (octets.length < 4) {
            if (digits !== '' && Number(digits) > 255) {
                digits = '255';
            }
            octets.push(digits.slice(0, 3));
        }
    }

    let result = octets.slice(0, 4).join('.');

    if (
        cleaned.endsWith('.') &&
        octets.length < 4 &&
        octets.length > 0 &&
        octets[octets.length - 1] !== ''
    ) {
        result += '.';
    }

    return result.slice(0, 15);
}

function withAutoDot(previous: string, next: string): string {
    const prevDigits = previous.replace(/\D/g, '');
    const nextDigits = next.replace(/\D/g, '');

    // Only auto-insert when the user added digits (not when deleting)
    if (nextDigits.length <= prevDigits.length) {
        return next;
    }

    const trimmed = next.replace(/\.$/, '');
    const parts = trimmed.split('.');

    if (
        parts.length < 4 &&
        parts.length > 0 &&
        parts[parts.length - 1].length === 3 &&
        !next.endsWith('.')
    ) {
        return `${trimmed}.`;
    }

    return next;
}

type IpInputProps = Omit<
    ComponentProps<typeof Input>,
    'type' | 'inputMode' | 'value' | 'onChange'
> & {
    defaultValue?: string;
    value?: string;
    onValueChange?: (value: string) => void;
};

export default function IpInput({
    defaultValue = '',
    value,
    onValueChange,
    onBlur,
    placeholder = 'xxx.xxx.xxx.xxx',
    ...props
}: IpInputProps) {
    const isControlled = value !== undefined;
    const [internal, setInternal] = useState(
        sanitizeIpInput(String(defaultValue ?? '')),
    );

    const current = isControlled
        ? sanitizeIpInput(String(value ?? ''))
        : internal;

    const handleChange = (event: ChangeEvent<HTMLInputElement>) => {
        const sanitized = sanitizeIpInput(event.target.value);
        const next = withAutoDot(current, sanitized);

        if (!isControlled) {
            setInternal(next);
        }

        onValueChange?.(next);
    };

    return (
        <Input
            {...props}
            type="text"
            inputMode="numeric"
            autoComplete="off"
            placeholder={placeholder}
            maxLength={15}
            pattern="^(?:\d{1,3}\.){3}\d{1,3}$"
            title="Format: xxx.xxx.xxx.xxx"
            value={current}
            onChange={handleChange}
            onBlur={(event) => {
                const normalized = current.replace(/\.$/, '');

                if (!isControlled) {
                    setInternal(normalized);
                }

                onValueChange?.(normalized);
                onBlur?.(event);
            }}
        />
    );
}
