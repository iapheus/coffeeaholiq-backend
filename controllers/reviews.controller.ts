import type { Request, Response } from 'express';
import { db } from '../database/index.js';
import { ReviewSchema } from '../types/Review.schema.js';

export const getReviews = async (req: Request, res: Response) => {
	try {
		const reviews = await db.selectFrom('reviews').selectAll().execute();
		res.status(200).json({ success: true, data: reviews });
	} catch (error: any) {
		res.status(500).json({ success: false, error: error.message });
	}
};

export const createReview = async (req: Request, res: Response) => {
	try {
		const review = ReviewSchema.parse(req.body);

		await db
			.insertInto('reviews')
			.values({
				user_id: parseInt(req.id.id),
				product_id: review.product_id,
				rating: review.rating,
				comment: review.comment,
			})
			.execute();

		res.status(201).json({ success: true, message: 'Review created!' });
	} catch (error: any) {
		if (error.name === 'ZodError') {
			res.status(400).json({ success: false, error: error.errors[0].message });
			return;
		}
		res.status(400).json({ success: false, error: error.message });
	}
};

export const updateReviewAsAdmin = async (req: Request, res: Response) => {
	try {
		const reviewId = parseInt(req.params.id);

		const isExist = await db
			.updateTable('reviews')
			.set(req.body)
			.where('id', '=', reviewId)
			.executeTakeFirst();

		if (!isExist) {
			res.status(404).json({ success: false, message: 'Review not found!' });
			return;
		}

		res.status(200).json({ success: true, message: 'Review updated!' });
	} catch (error: any) {
		res.status(400).json({ success: false, error: error.message });
	}
};

export const deleteReview = async (req: Request, res: Response) => {
	try {
		const reviewId = parseInt(req.params.id);

		const review = await db
			.selectFrom('reviews')
			.select(['id', 'user_id'])
			.where('id', '=', reviewId)
			.executeTakeFirst();

		if (!review) {
			res.status(404).json({ success: false, message: 'Review not found!' });
			return;
		}

		if (review.user_id !== parseInt(req.id)) {
			res.status(403).json({ success: false, message: 'Unauthorized!' });
			return;
		}

		await db.deleteFrom('reviews').where('id', '=', reviewId).execute();

		res.status(200).json({ success: true, message: 'Review deleted!' });
	} catch (error: any) {
		res.status(400).json({ success: false, error: error.message });
	}
};

export const deleteReviewAsAdmin = async (req: Request, res: Response) => {
	try {
		const reviewId = parseInt(req.params.id);

		const isExist = await db
			.selectFrom('reviews')
			.select('id')
			.where('id', '=', reviewId)
			.executeTakeFirst();

		if (!isExist) {
			res.status(404).json({ success: false, message: 'Review not found!' });
			return;
		}

		await db.deleteFrom('reviews').where('id', '=', reviewId).execute();

		res
			.status(200)
			.json({ success: true, message: 'Review deleted by admin!' });
	} catch (error: any) {
		res.status(400).json({ success: false, error: error.message });
	}
};
