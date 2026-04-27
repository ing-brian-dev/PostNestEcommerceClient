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

export type Product = z.infer<typeof ProductSchema>;
export type ShoppingCart = z.infer<typeof ShoppingCartSchema>;
export type CartItem = z.infer<typeof ShoppingCartContentsSchema>;