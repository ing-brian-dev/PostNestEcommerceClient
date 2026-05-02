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

export function getImagePath(imageUrl: string) {
    const cloudinaryBaseUrl = 'https://res.cloudinary.com/';
    if (imageUrl.startsWith(cloudinaryBaseUrl)) {
        return imageUrl;
    }else {
        return `${process.env.API_URL}/img/${imageUrl}`;
    }
}

export const isAvailable = (inventory: number) => inventory > 0;