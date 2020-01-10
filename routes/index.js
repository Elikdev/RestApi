const express = require('express');
const indexCtrl = require('../controllers/index');
const tutorCtrl = require('../controllers/tutor');

const router = express.Router();

router.get('/page2', indexCtrl.renderPage);
router.post('/tutoradd', tutorCtrl.addTutor);

module.exports = router;
