import { z } from 'zod';

export const SiteContentSchema = z.object({
	title: z.string().nonoptional(),
	image_url: z.url().nonoptional(),
	link_url: z.url().optional(),
	section: z.string().optional(),
	is_active: z.boolean().nonoptional().default(true),
});
