const Service = require('../models/Service');

// @desc    Get all services with optional search & category filter
// @route   GET /api/services
// @access  Public
exports.getServices = async (req, res, next) => {
  try {
    const { category, search, sort } = req.query;
    let query = { isActive: true };

    if (category) {
      query.category = category;
    }

    if (search) {
      query.$or = [
        { name: { $regex: search, $options: 'i' } },
        { description: { $regex: search, $options: 'i' } },
        { popularTags: { $in: [new RegExp(search, 'i')] } }
      ];
    }

    let servicesQuery = Service.find(query);

    if (sort === 'price_asc') {
      servicesQuery = servicesQuery.sort('basePrice');
    } else if (sort === 'price_desc') {
      servicesQuery = servicesQuery.sort('-basePrice');
    } else {
      servicesQuery = servicesQuery.sort('-createdAt');
    }

    const services = await servicesQuery;

    res.status(200).json({
      success: true,
      count: services.length,
      data: services
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Get single service by ID
// @route   GET /api/services/:id
// @access  Public
exports.getServiceById = async (req, res, next) => {
  try {
    const service = await Service.findById(req.params.id);
    if (!service) {
      return res.status(404).json({ success: false, error: 'Service not found' });
    }

    res.status(200).json({
      success: true,
      data: service
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Create new service (Admin)
// @route   POST /api/services
// @access  Private (Admin)
exports.createService = async (req, res, next) => {
  try {
    const service = await Service.create(req.body);
    res.status(201).json({
      success: true,
      data: service
    });
  } catch (error) {
    next(error);
  }
};
