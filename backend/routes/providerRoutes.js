const express = require('express');
const { getProviders, getProviderById, updateProviderProfile } = require('../controllers/providerController');
const { protect, authorize } = require('../middleware/auth');

const router = express.Router();

router.get('/', getProviders);
router.get('/:id', getProviderById);
router.put('/profile', protect, authorize('provider'), updateProviderProfile);

module.exports = router;
