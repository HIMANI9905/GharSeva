const crypto = require('crypto');
const User = require('../models/User');
const Provider = require('../models/Provider');
const sendEmail = require('../services/emailService');

// Helper to send token response
const sendTokenResponse = (user, statusCode, res) => {
  const token = user.getSignedJwtToken();
  const userObj = user.toObject();
  delete userObj.password;

  res.status(statusCode).json({
    success: true,
    token,
    user: userObj
  });
};

// @desc    Register Customer
// @route   POST /api/auth/register
// @access  Public
exports.register = async (req, res, next) => {
  try {
    const { name, email, password, phone, role } = req.body;

    const userExists = await User.findOne({ email });
    if (userExists) {
      return res.status(400).json({ success: false, error: 'Email already registered' });
    }

    const assignedRole = role === 'provider' ? 'provider' : (role === 'admin' ? 'admin' : 'customer');

    const user = await User.create({
      name,
      email,
      password,
      phone: phone || '',
      role: assignedRole
    });

    if (assignedRole === 'provider') {
      await Provider.create({
        user: user._id,
        status: 'approved'
      });
    }

    sendTokenResponse(user, 201, res);
  } catch (error) {
    next(error);
  }
};

// @desc    Login User
// @route   POST /api/auth/login
// @access  Public
exports.login = async (req, res, next) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({ success: false, error: 'Please provide email and password' });
    }

    const user = await User.findOne({ email }).select('+password');

    if (!user) {
      return res.status(401).json({ success: false, error: 'Invalid credentials' });
    }

    const isMatch = await user.matchPassword(password);
    if (!isMatch) {
      return res.status(401).json({ success: false, error: 'Invalid credentials' });
    }

    sendTokenResponse(user, 200, res);
  } catch (error) {
    next(error);
  }
};

// @desc    Get Current Logged-in User
// @route   GET /api/auth/me
// @access  Private
exports.getMe = async (req, res, next) => {
  try {
    const user = await User.findById(req.user.id);
    let providerDetails = null;

    if (user.role === 'provider') {
      providerDetails = await Provider.findOne({ user: user._id }).populate('servicesOffered');
    }

    res.status(200).json({
      success: true,
      user,
      providerDetails
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Update Profile
// @route   PUT /api/auth/updateprofile
// @access  Private
exports.updateProfile = async (req, res, next) => {
  try {
    const { name, phone, address, avatar } = req.body;

    const fieldsToUpdate = {};
    if (name) fieldsToUpdate.name = name;
    if (phone) fieldsToUpdate.phone = phone;
    if (address) fieldsToUpdate.address = address;
    if (avatar) fieldsToUpdate.avatar = avatar;

    const user = await User.findByIdAndUpdate(req.user.id, fieldsToUpdate, {
      new: true,
      runValidators: true
    });

    res.status(200).json({
      success: true,
      user
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Forgot Password - generate reset OTP
// @route   POST /api/auth/forgotpassword
// @access  Public
exports.forgotPassword = async (req, res, next) => {
  try {
    const { email } = req.body;

    const user = await User.findOne({ email });
    if (!user) {
      return res.status(404).json({ success: false, error: 'No account found with this email address' });
    }

    // Generate 6-digit OTP
    const otp = Math.floor(100000 + Math.random() * 900000).toString();
    const otpExpire = new Date(Date.now() + 15 * 60 * 1000); // 15 minutes

    user.otpCode = otp;
    user.otpExpire = otpExpire;
    await user.save({ validateBeforeSave: false });

    // Try sending email (graceful fallback if SMTP not configured)
    try {
      await sendEmail({
        email: user.email,
        subject: 'HomeEase AI - Password Reset OTP',
        html: `
          <div style="font-family:sans-serif;max-width:480px;margin:auto;padding:32px;background:#0f172a;border-radius:16px;color:#e2e8f0">
            <h2 style="color:#38bdf8">HomeEase AI</h2>
            <p>Your password reset OTP is:</p>
            <div style="font-size:40px;font-weight:900;letter-spacing:12px;color:#fff;background:#1e293b;padding:16px;border-radius:12px;text-align:center;margin:20px 0">${otp}</div>
            <p style="color:#94a3b8">This OTP expires in <strong>15 minutes</strong>. Do not share it with anyone.</p>
          </div>
        `
      });
    } catch (emailErr) {
      console.warn('Email not sent (SMTP not configured):', emailErr.message);
    }

    res.status(200).json({
      success: true,
      message: 'OTP sent to your email address',
      // For development: return OTP directly so user can test without SMTP
      devOtp: process.env.NODE_ENV === 'development' ? otp : undefined
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Reset Password using OTP
// @route   POST /api/auth/resetpassword
// @access  Public
exports.resetPassword = async (req, res, next) => {
  try {
    const { email, otp, newPassword } = req.body;

    if (!email || !otp || !newPassword) {
      return res.status(400).json({ success: false, error: 'Email, OTP and new password are required' });
    }

    const user = await User.findOne({
      email,
      otpCode: otp,
      otpExpire: { $gt: Date.now() }
    });

    if (!user) {
      return res.status(400).json({ success: false, error: 'Invalid or expired OTP. Please request a new one.' });
    }

    if (newPassword.length < 6) {
      return res.status(400).json({ success: false, error: 'New password must be at least 6 characters' });
    }

    user.password = newPassword;
    user.otpCode = undefined;
    user.otpExpire = undefined;
    await user.save();

    res.status(200).json({
      success: true,
      message: 'Password reset successful! You can now sign in with your new password.'
    });
  } catch (error) {
    next(error);
  }
};
