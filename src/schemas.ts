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

export const ProductResponseSchema = z.object({
    products: z.array(ProductSchema),
    total: z.number()
})

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
    expirationDate: z.coerce.date(),
    createdAt: z.coerce.date(),
    updatedAt: z.coerce.date(),
    deletedAt: z.coerce.date().nullable(),
});

const OrderContentSchema = z.object({
    productId: z.number(),
    quantity: z.number(),
    price: z.number()
});

export const OrderSchema = z.object({
    total: z.number(),
    coupon_name: z.string().optional(),
    contents: z.array(OrderContentSchema).min(1, { error: 'El Carrito no puede ir vacio' })
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

export const ContentsSchema = z.object({
    id: z.number(),
    quantity: z.number(),
    price: z.string(),
    product: ProductSchema,
    createdAt: z.coerce.date(),
    updatedAt: z.coerce.date(),
    deletedAt: z.coerce.date().nullable(),
});

export const TransactionResponseSchema = z.object({
    id: z.number(),
    total: z.coerce.number(),
    discount: z.coerce.number().nullable(),
    coupon_name: z.string().nullable(),
    contents: z.array(ContentsSchema),
    createdAt: z.coerce.date(),
    updatedAt: z.coerce.date(),
    deletedAt: z.coerce.date().nullable(),
});

export const TransactionsResponseSchema = z.array(TransactionResponseSchema);

export const ProductFormSchema = z.object({
    name: z.string()
        .min(1, { error: 'El nombre es requerido.' }),
    price: z.coerce.number({ error: 'Precio no válido.' })
        .min(1, { error: 'El Precio debe ser mayor a 0.' }),
    inventory: z.coerce.number({ error: 'Inventario no válido.' })
        .min(1, { error: 'El inventario debe ser mayor a 0.' }),
    categoryId: z.coerce.number({ error: 'La Categoria no es válida.' })
})

export type Product = z.infer<typeof ProductSchema>;
export type ShoppingCart = z.infer<typeof ShoppingCartSchema>;
export type CartItem = z.infer<typeof ShoppingCartContentsSchema>;
export type Coupon = z.infer<typeof CouponResponseSchema>;
export type Transaction = z.infer<typeof TransactionResponseSchema>;