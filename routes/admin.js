const express = require('express');
const adminCtrl = require('../controllers/admin');
const { checkToken } = require('../middleware/auth');

const adminRouter = express.Router();

// adminRouter.post('/add', userCtrl.registerUser);
// adminRouter.post('/login', userCtrl.loginUser);
// adminRouter.put('/update/:id', checkToken, userCtrl.updateUserProfile);
// adminRouter.get('/url', userCtrl.getUrl);

module.exports = adminRouter;
