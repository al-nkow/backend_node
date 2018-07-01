const express = require('express');
const router = express.Router();
const UsersController = require('../controllers/users');
const checkAuth = require('../middleware/check-auth');

const passport = require('passport');
const passportConf = require('../../passport');
const passportJWT = passport.authenticate('jwt', { session: false });

router.get('/', passportJWT, UsersController.users_get_user);
router.post('/signup', UsersController.users_user_signup);
router.post('/login', UsersController.users_user_login);
router.delete('/:userId', passportJWT, UsersController.users_user_delete)

router.get('/protected', passportJWT, (req, res) => {
  res.send('I\'m protected!');
});



module.exports = router;