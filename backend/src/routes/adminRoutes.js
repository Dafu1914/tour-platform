const express = require('express');
const router = express.Router();
const adminController = require('../controllers/adminController');
const { protect, authorize } = require('../middlewares/auth');

// All admin routes require authentication and admin role
router.use(protect);
router.use(authorize('admin', 'super_admin'));

// Dashboard stats
router.get('/stats', adminController.getStats);

// User management
router.get('/users', adminController.getUsers);
router.put('/users/:id/verify', adminController.verifyUser);
router.delete('/users/:id', adminController.deleteUser);

// Listing management
router.get('/listings', adminController.getListings);
router.put('/listings/:id/approve', adminController.approveListing);
router.delete('/listings/:id', adminController.deleteListing);

module.exports = router;