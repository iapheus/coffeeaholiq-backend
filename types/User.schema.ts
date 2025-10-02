import z from 'zod';

export const UserSchema = z.object({
	firstName: z.string().nonoptional(),
	lastName: z.string().nonoptional(),
	email: z.email().nonoptional(),
	password: z.string().nonoptional(),
	role: z.string().nullable().default('customer'),
});
