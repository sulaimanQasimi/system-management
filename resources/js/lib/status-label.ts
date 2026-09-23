export function statusLabel(
    t: (key: string) => string,
    value: string,
    fallback?: string,
): string {
    const key = `status.${value}`;
    const translated = t(key);

    return translated === key ? (fallback ?? value) : translated;
}
