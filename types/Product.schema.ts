import { z } from 'zod';

export const ProductSchema = z.object({
	name: z.string(),
	price: z.coerce.number().positive(),
	category: z.string(),
	description: z.string(),
	image: z.url().nonoptional(),
	quantity: z.string().nonoptional(),
});
