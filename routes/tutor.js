const express = require('express');
const tutorCtrl = require('../controllers/tutor');

const tutorRouter = express.Router();

tutorRouter.post('/add', tutorCtrl.addTutor);
tutorRouter.get('/search', tutorCtrl.findTutor);

module.exports = tutorRouter;
