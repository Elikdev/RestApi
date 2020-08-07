const express = require('express');
const userCtrl = require('../controllers/users');
const { checkToken } = require('../middleware/auth');

const userRouter = express.Router();

userRouter.get('/register', userCtrl.registerForm);
userRouter.post('/register', userCtrl.registerUser);
userRouter.get('/login', userCtrl.loginForm);
userRouter.post('/login', userCtrl.loginUser);
userRouter.put('/update/:id', checkToken, userCtrl.updateUserProfile);
userRouter.get('/allusers', checkToken, userCtrl.getAllUsers);
userRouter.get('/users', userCtrl.tutorsearch);
module.exports = userRouter;
