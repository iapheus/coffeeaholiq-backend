import type { Request, Response } from 'express';
import { db } from '../database/index.js';
import { CampaignSchema } from '../types/Campaign.schema.js';

export const getCampaigns = async (req: Request, res: Response) => {
	try {
		const campaigns = await db.selectFrom('campaigns').selectAll().execute();
		res.status(200).json({ success: true, data: campaigns });
	} catch (error: any) {
		res.status(500).json({ success: false, error: error.message });
	}
};

export const createCampaign = async (req: Request, res: Response) => {
	try {
		const campaign = CampaignSchema.parse(req.body);

		await db
			.insertInto('campaigns')
			.values({
				title: campaign.title,
				description: campaign.description,
				image_url: campaign.image_url,
				discount_percent: campaign.discount_percent,
				start_date: new Date(campaign.start_date),
				end_date: new Date(campaign.end_date),
			})
			.execute();

		res.status(201).json({ success: true, message: 'Campaign created!' });
	} catch (error: any) {
		if (error.name === 'ZodError') {
			res.status(400).json({ success: false, error: error });
			return;
		}
		res.status(400).json({ success: false, error: error.message });
	}
};

export const updateCampaign = async (req: Request, res: Response) => {
	try {
		const campaign = CampaignSchema.partial().parse(req.body);
		const campaignId = parseInt(req.params.campaignId);

		const isExist = await db
			.selectFrom('campaigns')
			.select('id')
			.where('id', '=', campaignId)
			.executeTakeFirst();

		if (!isExist) {
			res.status(404).json({ success: false, message: 'Campaign not found!' });
			return;
		}

		await db
			.updateTable('campaigns')
			.set(campaign)
			.where('id', '=', campaignId)
			.executeTakeFirst();

		res.status(200).json({ success: true, message: 'Campaign updated!' });
	} catch (error: any) {
		if (error.name === 'ZodError') {
			res.status(400).json({ success: false, error: error.errors[0].message });
			return;
		}
		res.status(400).json({ success: false, error: error.message });
	}
};

export const deleteCampaign = async (req: Request, res: Response) => {
	try {
		const campaignId = parseInt(req.params.campaignId);

		const isExist = await db
			.selectFrom('campaigns')
			.select('id')
			.where('id', '=', campaignId)
			.executeTakeFirst();

		if (!isExist) {
			res.status(404).json({ success: false, message: 'Campaign not found!' });
			return;
		}

		await db.deleteFrom('campaigns').where('id', '=', campaignId).execute();

		res.status(200).json({ success: true, message: 'Campaign deleted!' });
	} catch (error: any) {
		res.status(400).json({ success: false, error: error.message });
	}
};
