const Provider = require('../models/Provider');
const Service = require('../models/Service');

// AI Price Matrix & NLP Parser
const servicePriceMatrix = {
  electrician: { baseMin: 299, baseMax: 799, unit: 'per issue', complexityFactor: 1.2 },
  plumber: { baseMin: 349, baseMax: 899, unit: 'per fix', complexityFactor: 1.3 },
  carpenter: { baseMin: 499, baseMax: 1499, unit: 'per work', complexityFactor: 1.4 },
  painter: { baseMin: 999, baseMax: 4999, unit: 'per room', complexityFactor: 1.5 },
  cleaning: { baseMin: 599, baseMax: 1999, unit: 'per clean', complexityFactor: 1.1 },
  ac: { baseMin: 499, baseMax: 2499, unit: 'per unit', complexityFactor: 1.3 },
  ro: { baseMin: 299, baseMax: 999, unit: 'per filter', complexityFactor: 1.1 },
  pest: { baseMin: 799, baseMax: 2999, unit: 'per flat', complexityFactor: 1.2 },
  beautician: { baseMin: 499, baseMax: 2499, unit: 'per package', complexityFactor: 1.1 },
  appliance: { baseMin: 399, baseMax: 1299, unit: 'per appliance', complexityFactor: 1.2 }
};

// @desc    AI Price Estimator
// @route   POST /api/ai/estimate-price
// @access  Public
exports.estimatePrice = async (req, res, next) => {
  try {
    const { prompt, category } = req.body;
    const text = (prompt || category || '').toLowerCase();

    let matchKey = 'electrician';
    if (text.includes('leak') || text.includes('tap') || text.includes('pipe') || text.includes('plumb')) matchKey = 'plumber';
    else if (text.includes('wire') || text.includes('switch') || text.includes('spark') || text.includes('fan') || text.includes('light')) matchKey = 'electrician';
    else if (text.includes('clean') || text.includes('dust') || text.includes('sofa') || text.includes('deep clean')) matchKey = 'cleaning';
    else if (text.includes('ac') || text.includes('cool') || text.includes('compressor')) matchKey = 'ac';
    else if (text.includes('wood') || text.includes('door') || text.includes('lock') || text.includes('furniture')) matchKey = 'carpenter';
    else if (text.includes('paint') || text.includes('wall') || text.includes('color')) matchKey = 'painter';
    else if (text.includes('pest') || text.includes('cockroach') || text.includes('termite')) matchKey = 'pest';
    else if (text.includes('ro') || text.includes('water filter')) matchKey = 'ro';

    const matrix = servicePriceMatrix[matchKey] || servicePriceMatrix['electrician'];

    // Complexity heuristic
    let multiplier = 1.0;
    if (text.includes('urgent') || text.includes('emergency')) multiplier += 0.25;
    if (text.includes('replacement') || text.includes('major') || text.includes('full')) multiplier += 0.4;
    if (text.includes('multiple') || text.includes('entire')) multiplier += 0.5;

    const estimatedMin = Math.round(matrix.baseMin * multiplier);
    const estimatedMax = Math.round(matrix.baseMax * multiplier);

    res.status(200).json({
      success: true,
      estimation: {
        category: matchKey,
        promptEntered: prompt,
        minPrice: estimatedMin,
        maxPrice: estimatedMax,
        averagePrice: Math.round((estimatedMin + estimatedMax) / 2),
        currency: '₹',
        estimatedDuration: '45 - 90 minutes',
        complexityLevel: multiplier > 1.3 ? 'High' : (multiplier > 1.1 ? 'Medium' : 'Standard'),
        breakdown: [
          { label: 'Inspection & Base Service Charge', amount: Math.round(estimatedMin * 0.4) },
          { label: 'Labor & Repair Work', amount: Math.round(estimatedMin * 0.6) },
          { label: 'Estimated Material Cost (if needed)', amount: Math.round((estimatedMax - estimatedMin) * 0.5) }
        ],
        aiTip: 'Includes 30-day HomeEase Service Guarantee and verified technician protection.'
      }
    });
  } catch (error) {
    next(error);
  }
};

// @desc    AI Recommendation Engine for Top Providers
// @route   POST /api/ai/recommend-providers
// @access  Public
exports.recommendProviders = async (req, res, next) => {
  try {
    const { category, userLat, userLng } = req.body;

    let providers = await Provider.find({ status: 'approved' })
      .populate('user', 'name email phone avatar address location')
      .populate('servicesOffered');

    let scoredProviders = providers.map(p => {
      let score = (p.rating.average || 4.5) * 20; // max 100
      score += Math.min(p.completedJobsCount, 50); // bonus for experience

      // Category matching bonus
      if (category && p.servicesOffered.some(s => s.category.toLowerCase() === category.toLowerCase())) {
        score += 30;
      }

      return {
        provider: p,
        matchScore: Math.min(Math.round(score), 99),
        badge: score > 110 ? 'Top AI Choice' : 'Highly Recommended'
      };
    });

    scoredProviders.sort((a, b) => b.matchScore - a.matchScore);

    res.status(200).json({
      success: true,
      recommendations: scoredProviders.slice(0, 6)
    });
  } catch (error) {
    next(error);
  }
};

// @desc    AI Chatbot Assistant
// @route   POST /api/ai/chatbot
// @access  Public
exports.chatbotQuery = async (req, res, next) => {
  try {
    const { message } = req.body;
    const q = (message || '').toLowerCase();

    let reply = "I'm HomeEase AI Assistant! I can help you find certified electricians, plumbers, cleaners, AC technicians, and get instant price estimates.";
    let suggestedActions = ['Estimate Price', 'Book Electrician', 'View Pest Control', 'Help with Booking'];

    if (q.includes('price') || q.includes('cost') || q.includes('charge')) {
      reply = "Our AI Price Estimator predicts costs dynamically! For basic electrical fixes, costs range between ₹299–₹699. For plumbing leakage fixes, prices start around ₹349. Try our AI Estimator widget above!";
      suggestedActions = ['Calculate Sink Leak', 'AC Service Price', 'Book Now'];
    } else if (q.includes('book') || q.includes('hire') || q.includes('schedule')) {
      reply = "To book a service, simply click 'Services' in the navigation bar, choose your required service, select a date & time slot, and pick a top-rated verified provider!";
      suggestedActions = ['Browse All Services', 'View Top Providers'];
    } else if (q.includes('guarantee') || q.includes('refund') || q.includes('cancel')) {
      reply = "All bookings on HomeEase AI are backed by our 30-Day Service Warranty and free cancellations up to 2 hours before the scheduled appointment time!";
      suggestedActions = ['Service Warranty Info', 'Cancellation Policy'];
    } else if (q.includes('ac') || q.includes('cooling')) {
      reply = "AC Repair & Servicing starts at ₹499. Includes filter washing, gas check, jet pump coil cleaning, and cooling optimization!";
      suggestedActions = ['Book AC Service', 'Estimate AC Repair'];
    } else if (q.includes('clean')) {
      reply = "Deep Home Cleaning includes living room, bedrooms, kitchen degreasing, and bathroom sanitization using high-grade eco-friendly chemicals.";
      suggestedActions = ['Book Home Cleaning', 'View Pricing'];
    }

    res.status(200).json({
      success: true,
      reply,
      suggestedActions,
      timestamp: new Date()
    });
  } catch (error) {
    next(error);
  }
};
