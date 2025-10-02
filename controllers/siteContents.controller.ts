import type { Request, Response } from 'express';
import { db } from '../database/index.js';
import { SiteContentSchema } from '../types/SiteContent.schema.js';

export const getContent = async (req: Request, res: Response) => {
	try {
		const contents = await db.selectFrom('site_contents').selectAll().execute();
		res.status(200).json({ success: true, data: contents });
	} catch (error: any) {
		res.status(500).json({ success: false, error: error.message });
	}
};

export const createContent = async (req: Request, res: Response) => {
	try {
		const content = SiteContentSchema.parse(req.body);

		await db
			.insertInto('site_contents')
			.values({
				title: content.title,
				image_url: content.image_url,
				link_url: content.link_url,
				section: content.section,
				is_active: content.is_active ?? true,
			})
			.execute();

		res.status(201).json({ success: true, message: 'Content created!' });
	} catch (error: any) {
		if (error.name === 'ZodError') {
			res.status(400).json({ success: false, error: error.errors[0].message });
			return;
		}
		res.status(400).json({ success: false, error: error.message });
	}
};

export const updateContent = async (req: Request, res: Response) => {
	try {
		const content = SiteContentSchema.partial().parse(req.body);
		const contentId = parseInt(req.params.id);

		const isExist = await db
			.selectFrom('site_contents')
			.select('id')
			.where('id', '=', contentId)
			.executeTakeFirst();

		if (!isExist) {
			res.status(404).json({ success: false, message: 'Content not found!' });
			return;
		}

		await db
			.updateTable('site_contents')
			.set(content)
			.where('id', '=', contentId)
			.executeTakeFirst();

		res.status(200).json({ success: true, message: 'Content updated!' });
	} catch (error: any) {
		if (error.name === 'ZodError') {
			res.status(400).json({ success: false, error: error.errors[0].message });
			return;
		}
		res.status(400).json({ success: false, error: error.message });
	}
};

export const deleteContent = async (req: Request, res: Response) => {
	try {
		const contentId = parseInt(req.params.id);

		const isExist = await db
			.selectFrom('site_contents')
			.select('id')
			.where('id', '=', contentId)
			.executeTakeFirst();

		if (!isExist) {
			res.status(404).json({ success: false, message: 'Content not found!' });
			return;
		}

		await db.deleteFrom('site_contents').where('id', '=', contentId).execute();

		res.status(200).json({ success: true, message: 'Content deleted!' });
	} catch (error: any) {
		res.status(400).json({ success: false, error: error.message });
	}
};
