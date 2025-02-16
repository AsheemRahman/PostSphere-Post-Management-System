import express from 'express';
import { createPost, getPosts, updatePost, deletePost, getUserPosts } from '../Controller/postController.js';
import { signup, login, google, signout, updateUser, deleteUser } from '../Controller/userController.js';
import { verifyToken } from '../Middleware/verifyToken.js';

const router = express.Router();


router.post('/signup', signup)
router.post('/login', login);
router.post('/google', google);
router.get('/signout', signout);


router.post('/addPost', verifyToken, createPost);
router.get('/posts', verifyToken, getPosts);
router.put('/updatePost/:id', verifyToken, updatePost);
router.delete('/deletePost/:id', verifyToken, deletePost);


router.get('/user/posts/:id', verifyToken, getUserPosts);
router.post('/user/update/:id', updateUser)
router.delete('/user/delete/:id', deleteUser)


export default router;
