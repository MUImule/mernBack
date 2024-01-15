const express = require('express');
const router = express.Router();
const { signup, signin, logout, userProfile, forgotPassword, resetPassword } = require('../controllers/authController');
const { isAuthenticated } = require('../middleware/auth');

// /api/signup
router.post('/signup', signup);
// /api/signin
router.post('/signin', signin);
// /api/logout
router.get('/logout', logout);
// /api/me
router.get('/me', isAuthenticated, userProfile);
// /api/forgot-password
//router.post('/forgot-password', forgotPassword);
// /api/reset-password/:id/:token
//router.post('/reset-password/:id/:token', resetPassword);

module.exports = router;
