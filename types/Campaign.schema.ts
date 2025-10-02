import { z } from 'zod';

export const CampaignSchema = z.object({
	title: z.string().nonoptional(),
	description: z.string().nonoptional(),
	image_url: z.url().nonoptional(),
	discount_percent: z.number().min(0).max(100).nonoptional(),
	start_date: z.coerce.date(),
	end_date: z.coerce.date(),
});
