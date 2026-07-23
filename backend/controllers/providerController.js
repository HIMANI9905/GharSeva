const Provider = require('../models/Provider');
const User = require('../models/User');

// Helper to filter sensitive data from public provider listings
const filterProviderSensitiveData = (provider) => {
  const p = provider.toObject ? provider.toObject() : provider;
  if (p.user) {
    p.user.phone = undefined;
    p.user.email = undefined;
    if (p.user.address) {
      p.user.address.street = undefined;
    }
  }
  return p;
};

// @desc    Get all providers with filters (search, category, availability, rating)
// @route   GET /api/providers
// @access  Public
exports.getProviders = async (req, res, next) => {
  try {
    const { category, minRating, isAvailable, search } = req.query;

    let query = { status: 'approved' };

    const providers = await Provider.find(query)
      .populate('user', 'name email phone avatar address location')
      .populate('servicesOffered');

    let filtered = providers.filter(p => p.user !== null);

    if (category) {
      filtered = filtered.filter(p =>
        p.servicesOffered.some(s => s.category.toLowerCase() === category.toLowerCase())
      );
    }

    if (minRating) {
      filtered = filtered.filter(p => p.rating.average >= parseFloat(minRating));
    }

    if (isAvailable === 'true') {
      filtered = filtered.filter(p => p.availability.isAvailable === true);
    }

    if (search) {
      const term = search.toLowerCase();
      filtered = filtered.filter(
        p =>
          p.user.name.toLowerCase().includes(term) ||
          p.bio.toLowerCase().includes(term) ||
          p.servicesOffered.some(s => s.name.toLowerCase().includes(term))
      );
    }

    // Filter out phone numbers and full addresses before sending to client
    const safeFiltered = filtered.map(filterProviderSensitiveData);

    res.status(200).json({
      success: true,
      count: safeFiltered.length,
      data: safeFiltered
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Get provider profile details by User ID or Provider ID
// @route   GET /api/providers/:id
// @access  Public
exports.getProviderById = async (req, res, next) => {
  try {
    let provider = await Provider.findById(req.params.id)
      .populate('user', 'name email phone avatar address location')
      .populate('servicesOffered');

    if (!provider) {
      provider = await Provider.findOne({ user: req.params.id })
        .populate('user', 'name email phone avatar address location')
        .populate('servicesOffered');
    }

    if (!provider) {
      return res.status(404).json({ success: false, error: 'Provider details not found' });
    }

    const safeProvider = filterProviderSensitiveData(provider);

    res.status(200).json({
      success: true,
      data: safeProvider
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Update provider details (hourlyRate, availability, bio, services)
// @route   PUT /api/providers/profile
// @access  Private (Provider)
exports.updateProviderProfile = async (req, res, next) => {
  try {
    const { hourlyRate, bio, experienceYears, availability, servicesOffered, documents } = req.body;

    let provider = await Provider.findOne({ user: req.user.id });

    if (!provider) {
      provider = await Provider.create({ user: req.user.id });
    }

    if (hourlyRate !== undefined) provider.hourlyRate = hourlyRate;
    if (bio) provider.bio = bio;
    if (experienceYears) provider.experienceYears = experienceYears;
    if (availability) provider.availability = { ...provider.availability, ...availability };
    if (servicesOffered) provider.servicesOffered = servicesOffered;
    if (documents) provider.documents = { ...provider.documents, ...documents };

    await provider.save();

    res.status(200).json({
      success: true,
      data: provider
    });
  } catch (error) {
    next(error);
  }
};
