const express = require('express');
const router = express.Router();
// const checkAuth = require('../middleware/check-auth');
const ContentController = require('../controllers/content');

router.post('/', ContentController.content_create);
router.get('/', ContentController.content_get);
// router.delete('/:orderId', checkAuth, OrdersController.orders_get_order);

module.exports = router;