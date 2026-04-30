export function formatCurrency(amount: number) {
    return new Intl.NumberFormat('en-US', {
        style: 'currency',
        currency: 'USD'
    }).format(amount);
}


export function isValidPage(value: number): boolean {
    const rules = {
        notNull: value != null,
        isNumber: typeof value === 'number' && !isNaN(value),
        greaterThanZero: value > 0,
        isInteger: Number.isInteger(value),
    };

    return (Object.keys(rules) as Array<keyof typeof rules>)
        .every(key => rules[key]);
}