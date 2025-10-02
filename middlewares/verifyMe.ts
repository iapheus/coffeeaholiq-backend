import type { NextFunction, Request, Response } from 'express';
import jwt from 'jsonwebtoken';
import 'dotenv/config';
import type { db } from '../database/index.js';

export const verifyMe = async (
	req: Request,
	res: Response,
	next: NextFunction
): Promise<void> => {
	const authHeader = req.headers.authorization;
	const token = authHeader && authHeader.split(' ')[1];
	if (token) {
		jwt.verify(token, process.env.JWT_SECRET!, async (err, decoded) => {
			if (err) {
				res.status(401).json({ success: false, message: 'Invalid token!' });
				return;
			}
			if (decoded != null) {
				decoded = decoded as { id: number };
				req.id = decoded;
				next();
			}
		});
	}
};
