const express = require('express');
const {
  getAdminStats,
  getAllUsers,
  updateProviderStatus,
  getComplaints,
  resolveComplaint
} = require('../controllers/adminController');
const { protect, authorize } = require('../middleware/auth');

const router = express.Router();

router.use(protect);
router.use(authorize('admin'));

router.get('/stats', getAdminStats);
router.get('/users', getAllUsers);
router.put('/providers/:id/status', updateProviderStatus);
router.get('/complaints', getComplaints);
router.put('/complaints/:id', resolveComplaint);

module.exports = router;
