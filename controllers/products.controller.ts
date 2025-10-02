import type { Request, Response } from 'express';
import { db } from '../database/index.js';
import { ProductSchema } from '../types/Product.schema.js';

export const getProductById = async (req: Request, res: Response) => {
	try {
		const productId = req.params.productId;
		const product = await db
			.selectFrom('products')
			.selectAll()
			.where('id', '=', productId)
			.executeTakeFirst();

		res.status(200).json({ success: true, data: product });
		return;
	} catch (error: any) {
		res.status(500).json({ success: false, error: error.message });
	}
};

export const getRandomProducts = async (req: Request, res: Response) => {
	try {
		const howMany = parseInt(req.params.howManyProducts);
		const products = await db
			.selectFrom('products')
			.selectAll()
			.limit(howMany)
			.execute();
		res.status(200).json({ success: true, data: products });
		return;
	} catch (error: any) {
		res.status(500).json({ success: false, error: error.message });
		return;
	}
};

export const getProductsByQuery = async (req: Request, res: Response) => {
	try {
		const search = req.query.search?.toString().toLowerCase() ?? '';

		const products = await db
			.selectFrom('products')
			.selectAll()
			.where('name', 'ilike', `%${search}%`)
			.execute();

		res.status(200).json({ success: true, data: products });
		return;
	} catch (error: any) {
		res.status(500).json({ success: false, error: error.message });
		return;
	}
};

export const getProductsByCategory = async (req: Request, res: Response) => {
	try {
		let category = req.params.productCategory || 'coffees';
		if (category?.includes('-')) {
			category = category.replace('-', ' ');
		}
		const products = await db
			.selectFrom('products')
			.selectAll()
			.where('category', 'ilike', `%${category}%`)
			.execute();

		res.status(200).json({ success: true, data: products });
		return;
	} catch (error: any) {
		res.status(500).json({ success: false, error: error.message });
		return;
	}
};

export const createProduct = async (req: Request, res: Response) => {
	try {
		const product = ProductSchema.parse(req.body);

		await db
			.insertInto('products')
			.values({
				name: product.name,
				price: product.price,
				category: product.category,
				description: product.description,
				image: product.image,
				quantity: product.quantity,
			})
			.execute();

		res.status(201).json({ success: true, message: 'Product created!' });
		return;
	} catch (error: any) {
		if (error.name === 'ZodError') {
			res.status(400).json({ success: false, error: error.errors[0].message });
			return;
		}
		res.status(400).json({ success: false, error: error.message });
		return;
	}
};

export const updateProduct = async (req: Request, res: Response) => {
	try {
		const product = ProductSchema.partial().parse(req.body);
		const productId = parseInt(req.params.productId);
		const isExist = await db
			.selectFrom('products')
			.select('id')
			.where('id', '=', productId)
			.executeTakeFirst();

		if (!isExist) {
			res.status(404).json({ success: false, message: 'Product not found!' });
			return;
		}

		await db
			.updateTable('products')
			.set(product)
			.where('id', '=', productId)
			.executeTakeFirst();

		res.status(200).json({ success: true, message: 'Product updated!' });
		return;
	} catch (error: any) {
		if (error.name === 'ZodError') {
			res.status(400).json({ success: false, error: error });
			return;
		}
		res.status(400).json({ success: false, error: error.message });
		return;
	}
};

export const deleteProduct = async (req: Request, res: Response) => {
	try {
		const productId = parseInt(req.params.productId);

		const isExist = await db
			.selectFrom('products')
			.select('id')
			.where('id', '=', productId)
			.executeTakeFirst();

		if (!isExist) {
			res.status(404).json({ success: false, message: 'Product not found!' });
			return;
		}

		await db.deleteFrom('products').where('id', '=', productId).execute();

		res.status(200).json({ success: true, message: 'Product deleted!' });
		return;
	} catch (error: any) {
		res.status(400).json({ success: false, error: error.message });
		return;
	}
};
