
const express = require("express");
const authController = require('../controllers/auth');
const router = express.Router();

router.post('/login_student',authController.login_student);
router.post('/login_faculty',authController.login_faculty);

router.get('/',authController.logout);

router.post('/password',authController.forgotPassword);

module.exports = router;