const Message = require('../models/Message');

// @desc    Get messages for a conversation
// @route   GET /api/chat/:conversationId
// @access  Private
exports.getMessages = async (req, res, next) => {
  try {
    const messages = await Message.find({ conversationId: req.params.conversationId })
      .populate('sender', 'name avatar role')
      .populate('receiver', 'name avatar role')
      .sort('createdAt');

    res.status(200).json({
      success: true,
      count: messages.length,
      data: messages
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Send a message
// @route   POST /api/chat
// @access  Private
exports.sendMessage = async (req, res, next) => {
  try {
    const { conversationId, receiverId, bookingId, content } = req.body;

    const message = await Message.create({
      conversationId,
      sender: req.user.id,
      receiver: receiverId,
      booking: bookingId || null,
      content
    });

    const populated = await Message.findById(message._id)
      .populate('sender', 'name avatar role')
      .populate('receiver', 'name avatar role');

    res.status(201).json({
      success: true,
      data: populated
    });
  } catch (error) {
    next(error);
  }
};
