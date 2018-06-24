const express = require('express');
const router = express.Router();
const UsersController = require('../controllers/users');
const checkAuth = require('../middleware/check-auth');

console.log('>>>>', process.env.JWT_KEY);

router.get('/', checkAuth, UsersController.users_get_user);
router.post('/signup', UsersController.users_user_signup);
router.post('/login', checkAuth, UsersController.users_user_login);
router.delete('/:userId', checkAuth, UsersController.users_user_delete)

module.exports = router;