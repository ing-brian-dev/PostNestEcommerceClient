import { z } from 'zod';

export const ProductSchema = z.object({
    id: z.number(),
    name: z.string(),
    image: z.string(),
    price: z.coerce.number(),
    inventory: z.number(),
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

export type Product = z.infer<typeof ProductSchema>