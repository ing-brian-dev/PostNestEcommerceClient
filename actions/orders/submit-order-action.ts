"use server"

import { ErrorResponseSchema, OrderSchema, SuccessResponseSchema } from "@/src/schemas"
import { revalidatePath, revalidateTag } from "next/cache";

export async function submitOrder(data: unknown) {
    
    const order = OrderSchema.parse(data);
    const url = `${process.env.API_URL}/transactions`;
    const req = await fetch(url, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({ ...order })
    });

    const res = await req.json();

    if (!req.ok) { 
        const errors = ErrorResponseSchema.parse(res);

        return {
            errors: errors.message.map(error => error),
            success: ''
        }
    }

    const success = SuccessResponseSchema.parse(res);
    revalidateTag('products-by-categor','') // only use parameter "max" when we are using Route Handlers
    // revalidatePath('/(store)/[categoryId]', 'page')
    return {
        errors: [],
        success: success.message
    }
}