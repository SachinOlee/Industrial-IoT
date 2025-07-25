const sendEmail = require('../utils/email');
const User = require('../models/User');
const crypto = require('crypto');

// Register, login, logout controllers...

exports.forgotPassword = async (req, res) => {
  const user = await User.findOne({ email: req.body.email });
  
  if (!user) {
    return res.status(404).json({ message: 'User not found' });
  }

  const resetToken = user.createPasswordResetToken();
  await user.save({ validateBeforeSave: false });

  const resetURL = `${req.protocol}://${req.get('host')}/reset-password/${resetToken}`;
  const message = `Forgot your password? Submit a PATCH request with your new password to: ${resetURL}`;

  try {
    await sendEmail({
      email: user.email,
      subject: 'Password Reset Token (valid for 10 min)',
      message
    });

    res.status(200).json({ message: 'Token sent to email' });
  } catch (err) {
    user.passwordResetToken = undefined;
    user.passwordResetExpires = undefined;
    await user.save({ validateBeforeSave: false });

    return res.status(500).json({ message: 'Error sending email' });
  }
};