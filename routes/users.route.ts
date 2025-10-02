import express from 'express';
import {
	createUser,
	deleteUser,
	deleteUserAsAdmin,
	getAllUsers,
	updateUser,
	userlogin,
} from '../controllers/users.controller.js';
import { areYouAdmin } from '../middlewares/areYouAdmin.js';
import { verifyMe } from '../middlewares/verifyMe.js';

const router = express.Router();

router.get('/', areYouAdmin, getAllUsers);

router.post('/auth/login', userlogin);
router.post('/auth/login/admin', userlogin);

router.post('/', createUser);

router.patch('/', verifyMe, updateUser);

router.delete('/', verifyMe, deleteUser);

router.delete('/:id', areYouAdmin, deleteUserAsAdmin);

export default router;
