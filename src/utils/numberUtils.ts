export const formatNumber = (
    value: number | null | undefined,
    defaultValue: number = 0,
    locale: string = 'en-US'
): string => {
    if (value === null || value === undefined || isNaN(value)) {
        return defaultValue.toLocaleString(locale);
    }
    return value.toLocaleString(locale);
};

export const formatCurrency = (
    value: number | null | undefined,
    currency: string = 'USD',
    locale: string = 'en-US',
    defaultValue: number = 0
): string => {
    const numValue =
        value === null || value === undefined || isNaN(value)
            ? defaultValue
            : value;

    return new Intl.NumberFormat(locale, {
        style: 'currency',
        currency,
        minimumFractionDigits: 0,
        maximumFractionDigits: 2,
    }).format(numValue);
};

export const formatNumberWithOptions = (
    value: number | null | undefined,
    options: Intl.NumberFormatOptions = {},
    defaultValue: number = 0,
    locale: string = 'en-US'
): string => {
    const numValue =
        value === null || value === undefined || isNaN(value)
            ? defaultValue
            : value;

    return new Intl.NumberFormat(locale, options).format(numValue);
};
