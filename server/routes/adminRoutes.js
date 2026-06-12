const express = require('express');
const router  = express.Router();
const ctrl    = require('../controllers/adminController');
const { protect, adminOnly } = require('../middleware/authMiddleware');

router.get('/stats', protect, adminOnly, ctrl.getStats);

module.exports = router;
