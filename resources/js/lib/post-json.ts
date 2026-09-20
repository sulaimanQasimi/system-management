function getXsrfToken(): string {
    const match = document.cookie.match(/(?:^|; )XSRF-TOKEN=([^;]*)/);

    return match ? decodeURIComponent(match[1]) : '';
}

export async function postJson<T>(
    url: string,
    body: Record<string, unknown>,
): Promise<{ data?: T; errors?: Record<string, string[]>; message?: string }> {
    const response = await fetch(url, {
        method: 'POST',
        credentials: 'same-origin',
        headers: {
            Accept: 'application/json',
            'Content-Type': 'application/json',
            'X-Requested-With': 'XMLHttpRequest',
            'X-XSRF-TOKEN': getXsrfToken(),
        },
        body: JSON.stringify(body),
    });

    const payload = (await response.json().catch(() => ({}))) as {
        id?: number;
        name?: string;
        message?: string;
        errors?: Record<string, string[]>;
    };

    if (!response.ok) {
        return {
            errors: payload.errors,
            message: payload.message ?? 'Unable to save.',
        };
    }

    return { data: payload as T };
}
