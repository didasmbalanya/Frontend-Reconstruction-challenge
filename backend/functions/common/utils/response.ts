export const success = (body: Record<string, any>) => ({
    statusCode: 200,
    headers: {
        'Content-Type': 'application/json',
    },
    body: JSON.stringify(body),
});

export const error = (e: any) => ({
    statusCode: 400,
    headers: {
        'Content-Type': 'application/json',
    },
    body: JSON.stringify({
        message: e.message,
        code: e.code,
    }),
});
