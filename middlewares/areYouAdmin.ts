import type { NextFunction, Request, Response } from 'express';
import jwt from 'jsonwebtoken';
import { db } from '../database/index.js';
import 'dotenv/config';

const verifyToken = (token: string) =>
	new Promise<{ id: number }>((resolve, reject) => {
		jwt.verify(token, process.env.JWT_SECRET!, (err, decoded) => {
			if (err) return reject(err);
			resolve(decoded as { id: number });
		});
	});

export const areYouAdmin = async (
	req: Request,
	res: Response,
	next: NextFunction
): Promise<void> => {
	const authHeader = req.headers.authorization;
	const token = authHeader && authHeader.split(' ')[1];
	if (token) {
		try {
			const decoded = await verifyToken(token);

			const user = await db
				.selectFrom('users')
				.select('role')
				.where('id', '=', decoded.id)
				.executeTakeFirstOrThrow();

			if (user.role !== 'admin') {
				res.status(403).json({ success: false, message: 'You are not admin!' });
				return;
			}
			next();
		} catch (error: any) {
			if (error.name == 'NoRowsFoundError') {
				res.status(401).json({ success: false, message: 'User not found!' });
				return;
			}
			res.status(401).json({ success: false, message: 'Invalid token!' });
			return;
		}
	}
};
