import type { Request, Response } from 'express';
import { db } from '../database/index.js';
import { UserSchema } from '../types/User.schema.js';
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';

import 'dotenv/config';

const bcrypt_salt: number = 10;

export const getAllUsers = async (req: Request, res: Response) => {
	try {
		const allUsers = await db.selectFrom('users').selectAll().execute();
		res.status(200).json({ success: true, data: allUsers });
		return;
	} catch (error) {
		res.status(500).json({ success: false, error: error });
		return;
	}
};

export const userlogin = async (req: Request, res: Response) => {
	try {
		const userInputFromBody = UserSchema.partial().parse(req.body);
		const userFromDB = await db
			.selectFrom('users')
			.selectAll()
			.where('email', '=', userInputFromBody.email!)
			.executeTakeFirst();

		if (userFromDB && userInputFromBody.password) {
			bcrypt.compare(
				userInputFromBody.password!,
				userFromDB.password,
				(err, result) => {
					if (result) {
						const token = jwt.sign(
							{ id: userFromDB.id },
							process.env.JWT_SECRET!,
							{ expiresIn: '1w' }
						);
						res.status(200).json({ success: true, data: token });
					} else {
						res.status(401).json({ success: false, message: 'Password wrong' });
					}
				}
			);
		}
	} catch (error: any) {
		res.status(400).json({ success: false, error: error.message });
		return;
	}
};

export const adminlogin = async (req: Request, res: Response) => {
	try {
		const userInputFromBody = UserSchema.partial().parse(req.body);
		const userFromDB = await db
			.selectFrom('users')
			.selectAll()
			.where('email', '=', userInputFromBody.email!)
			.executeTakeFirst();

		if (
			userFromDB?.role == 'admin' &&
			userFromDB &&
			userInputFromBody.password
		) {
			bcrypt.compare(
				userInputFromBody.password!,
				userFromDB.password,
				(err, result) => {
					if (result) {
						const token = jwt.sign(
							{ id: userFromDB.id },
							process.env.JWT_SECRET!,
							{ expiresIn: '1w' }
						);
						res.status(200).json({ success: true, data: token });
						return;
					}
				}
			);
		}
	} catch (error: any) {
		res.status(400).json({ success: false, error: error.message });
		return;
	}
};

export const createUser = async (req: Request, res: Response) => {
	try {
		console.log(req.body);
		const user = UserSchema.parse(req.body);
		const isExist = await db
			.selectFrom('users')
			.select('email')
			.where('email', '=', user.email)
			.executeTakeFirst();
		if (!isExist) {
			user.password = await bcrypt.hash(user.password, bcrypt_salt);
			const __ = await db
				.insertInto('users')
				.values({
					firstName: user.firstName,
					lastName: user.lastName,
					email: user.email,
					password: user.password,
					role: user.role || 'customer',
				})
				.execute();
			res.status(200).json({ success: true, message: 'User created!' });
		} else {
			res.status(400).json({ success: false, message: 'User exist!' });
		}
	} catch (error: any) {
		if (error.name === 'ZodError') {
			res
				.status(400)
				.json({ success: false, error: JSON.parse(error.message)[0].message });
			return;
		}
		res.status(400).json({ success: false, error: error.message });
		return;
	}
};

export const updateUser = async (req: Request, res: Response) => {
	try {
		const user = UserSchema.partial().parse(req.body);
		console.log(user);
		const isExist = await db
			.selectFrom('users')
			.select('id')
			.where('id', '=', parseInt(req.id.id))
			.executeTakeFirst();

		if (isExist) {
			if (user?.password) {
				user.password = await bcrypt.hash(user.password, bcrypt_salt);
				const __ = await db
					.updateTable('users')
					.set({ password: user.password })
					.where('id', '=', parseInt(req.id.id))
					.executeTakeFirst();
			} else {
				const __ = await db
					.updateTable('users')
					.set(user)
					.where('id', '=', parseInt(req.id.id))
					.executeTakeFirst();
			}
			res.status(200).json({ success: true, message: 'User updated!' });
			return;
		} else {
			res.status(404).json({ success: false, message: 'User not found!' });
			return;
		}
	} catch (error: any) {
		if (error.name === 'ZodError') {
			res
				.status(400)
				.json({ success: false, error: JSON.parse(error.message)[0].message });
			return;
		}
		res.status(400).json({ success: false, error: error.message });
		return;
	}
};

export const deleteUser = async (req: Request, res: Response) => {
	try {
		const isExist = await db
			.selectFrom('users')
			.select('id')
			.where('id', '=', parseInt(req.id))
			.executeTakeFirst();

		if (isExist) {
			await db.deleteFrom('users').where('id', '=', parseInt(req.id));
			res.status(200).json({ success: true, message: 'User deleted!' });
			return;
		} else {
			res.status(404).json({ success: false, message: 'User not found!' });
			return;
		}
	} catch (error: any) {
		res.status(400).json({ success: false, error: error.message });
		return;
	}
};

export const deleteUserAsAdmin = async (req: Request, res: Response) => {
	try {
		const givenId: string = req.params.id!;
		const isExist = await db
			.selectFrom('users')
			.select('id')
			.where('id', '=', parseInt(givenId))
			.executeTakeFirst();

		if (isExist) {
			await db
				.deleteFrom('users')
				.where('id', '=', parseInt(req.params.id))
				.execute();
			res.status(200).json({ success: true, message: 'User deleted!' });
			return;
		} else {
			res.status(404).json({ success: false, message: 'User not found!' });
			return;
		}
	} catch (error: any) {
		res.status(400).json({ success: false, error: error.message });
		return;
	}
};
