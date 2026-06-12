const express = require('express');
const router  = express.Router();
const ctrl    = require('../controllers/productController');
const { protect, adminOnly } = require('../middleware/authMiddleware');

router.get('/',               ctrl.getProducts);
router.get('/recommended',    ctrl.getRecommended);
router.get('/:id',            ctrl.getProductById);
router.post('/',   protect, adminOnly, ctrl.createProduct);
router.put('/:id', protect, adminOnly, ctrl.updateProduct);
router.delete('/:id', protect, adminOnly, ctrl.deleteProduct);

module.exports = router;
