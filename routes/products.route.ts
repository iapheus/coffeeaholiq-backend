import express from 'express';
import {
	getProductById,
	getRandomProducts,
	getProductsByQuery,
	getProductsByCategory,
	createProduct,
	updateProduct,
	deleteProduct,
} from '../controllers/products.controller.js';
import { areYouAdmin } from '../middlewares/areYouAdmin.js';

const router = express.Router();

router.get('/:productId', getProductById);
router.get('/', getProductsByQuery);
router.get('/byCount/:howManyProducts', getRandomProducts);
router.get('/byCategory/:productCategory', getProductsByCategory);

router.post('/', areYouAdmin, createProduct);

router.patch('/:productId', areYouAdmin, updateProduct);

router.delete('/:productId', areYouAdmin, deleteProduct);

export default router;
