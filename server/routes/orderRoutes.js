const express = require('express');
const router  = express.Router();
const ctrl    = require('../controllers/orderController');
const { protect, adminOnly } = require('../middleware/authMiddleware');

router.post('/',       protect, ctrl.createOrder);
router.get('/my',      protect, ctrl.getUserOrders);
router.get('/',        protect, adminOnly, ctrl.getAllOrders);
router.put('/:id/status', protect, adminOnly, ctrl.updateOrderStatus);

module.exports = router;
