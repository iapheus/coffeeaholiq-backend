import express from 'express';
import {
	getReviews,
	createReview,
	deleteReview,
	deleteReviewAsAdmin,
	updateReviewAsAdmin,
} from '../controllers/reviews.controller.js';
import { areYouAdmin } from '../middlewares/areYouAdmin.js';
import { verifyMe } from '../middlewares/verifyMe.js';

const router = express.Router();

router.get('/', getReviews);

router.post('/', verifyMe, createReview);

router.patch('/:id', areYouAdmin, updateReviewAsAdmin);

router.delete('/:id', verifyMe, deleteReview);
router.delete('/admin/:id', areYouAdmin, deleteReviewAsAdmin);

export default router;
