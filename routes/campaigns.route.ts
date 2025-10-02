import express from 'express';
import {
	getCampaigns,
	createCampaign,
	updateCampaign,
	deleteCampaign,
} from '../controllers/campaigns.controller.js';
import { areYouAdmin } from '../middlewares/areYouAdmin.js';

const router = express.Router();

router.get('/', getCampaigns);

router.post('/', areYouAdmin, createCampaign);

router.patch('/:campaignId', areYouAdmin, updateCampaign);

router.delete('/:campaignId', areYouAdmin, deleteCampaign);

export default router;
