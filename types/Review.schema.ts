import { z } from 'zod';

export const ReviewSchema = z.object({
	product_id: z.number().nonoptional(),
	rating: z.number().min(1).max(5).nonoptional(),
	comment: z.string().nonoptional(),
});
