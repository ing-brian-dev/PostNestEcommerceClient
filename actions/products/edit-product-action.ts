"use server"

import { ErrorResponseSchema, Product, ProductFormSchema } from "@/src/schemas";

type ActionStateType = {
    errors: string[];
    success: string;
}

export async function editProduct(id: Product['id'], prevState: ActionStateType, formData: FormData) {

    const product = ProductFormSchema.safeParse({
        name: formData.get('name'),
        price: formData.get('price'),
        inventory: formData.get('inventory'),
        categoryId: formData.get('categoryId'),
    });

    if (!product.success) {
        return {
            errors: product.error.issues.map(error => error.message),
            success: '',
        }
    }

    const url = `${process.env.API_URL}/products/${id}`;
    const req = await fetch(url, {
        method: 'PUT',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(product.data)
    });

    const res = await req.json();
    if (!req.ok) {
        const errors = ErrorResponseSchema.parse(res);
        return {
            errors: errors.message.map(error => error),
            success: '',
        }
    }

    return {
        errors: [],
        success: 'Producto Actualizado Correctamente.'
    }
}