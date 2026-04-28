import { z } from 'zod';

export const ProductSchema = z.object({
    id: z.number(),
    name: z.string(),
    image: z.string(),
    price: z.coerce.number(),
    inventory: z.number(),
    categoryId: z.number(),
    createdAt: z.coerce.date(),
    updatedAt: z.coerce.date(),
    deletedAt: z.coerce.date().nullable(),
});

export const CategorySchema = z.object({
    id: z.number(),
    name: z.string(),
    createdAt: z.coerce.date(),
    updatedAt: z.coerce.date(),
    deletedAt: z.coerce.date().nullable(),
});

export const CategoriesResponseSchema = z.array(CategorySchema);

export const CategoryWithProductsSchema = CategorySchema.extend({
    products: z.array(ProductSchema)
});

/** Shopping Cart */
const ShoppingCartContentsSchema = ProductSchema.pick({
    name: true,
    image: true,
    price: true,
    inventory: true,
    createdAt: true,
    updatedAt: true,
}).extend({
    productId: z.number(),
    quantity: z.number()
});

export const ShoppingCartSchema = z.array(ShoppingCartContentsSchema);

export const CouponResponseSchema = z.object({
    name: z.string().default(''),
    message: z.string(),
    percentage: z.coerce.number().min(0).max(100).default(0),
});

const OrderContentSchema = z.object({
    productId: z.number(),
    quantity: z.number(),
    price: z.number()
});

export const OrderSchema = z.object({
    total: z.number(),
    coupon: z.string(),
    contents: z.array(OrderContentSchema).min(1, { message: 'El Carrito no puede ir vacio' })
});

/** Success / Error Response */
export const SuccessResponseSchema = z.object({
    message: z.string()
})
export const ErrorResponseSchema = z.object({
    message: z.array(z.string()),
    error: z.string(),
    statusCode: z.number()
})

export type Product = z.infer<typeof ProductSchema>;
export type ShoppingCart = z.infer<typeof ShoppingCartSchema>;
export type CartItem = z.infer<typeof ShoppingCartContentsSchema>;
export type Coupon = z.infer<typeof CouponResponseSchema>