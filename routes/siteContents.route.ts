import express from 'express';
import {
	getContent,
	createContent,
	updateContent,
	deleteContent,
} from '../controllers/siteContents.controller.js';
import { areYouAdmin } from '../middlewares/areYouAdmin.js';

const router = express.Router();

router.get('/', getContent);

router.post('/', areYouAdmin, createContent);

router.put('/:id', areYouAdmin, updateContent);

router.delete('/:id', areYouAdmin, deleteContent);

export default router;
