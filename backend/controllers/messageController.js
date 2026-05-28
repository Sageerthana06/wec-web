const Message = require('../models/Message');
const sendEmail = require('../utils/sendEmail');

// @desc    Submit a message (contact form)
// @route   POST /api/messages
// @access  Public
const sendMessage = async (req, res, next) => {
  try {
    const { name, email, phone, subject, message } = req.body;

    if (!name || !email || !subject || !message) {
      res.status(400);
      throw new Error('Please fill in all required fields');
    }

    const newMessage = await Message.create({
      name,
      email,
      phone: phone || '',
      subject,
      message,
    });

    // Send email notification to admin
    const adminEmail = process.env.ADMIN_EMAIL || 'admin@example.com';
    const emailSubject = `New Business Inquiry: ${subject}`;
    const emailBody = `
      You have received a new customer inquiry from your website.
      
      Details:
      Name: ${name}
      Email: ${email}
      Phone: ${phone || 'Not provided'}
      Subject: ${subject}
      
      Message:
      ${message}
    `;

    try {
      await sendEmail({
        to: adminEmail,
        subject: emailSubject,
        text: emailBody,
        html: `<p>You have received a new customer inquiry from your website.</p>
              <h3>Details:</h3>
              <ul>
                <li><strong>Name:</strong> ${name}</li>
                <li><strong>Email:</strong> ${email}</li>
                <li><strong>Phone:</strong> ${phone || 'Not provided'}</li>
                <li><strong>Subject:</strong> ${subject}</li>
              </ul>
              <h3>Message:</h3>
              <p>${message.replace(/\n/g, '<br>')}</p>`,
      });
    } catch (mailError) {
      console.error('Mail notification failed to send:', mailError.message);
      // Don't crash request, let it succeed since message is saved to DB
    }

    res.status(201).json({
      success: true,
      message: 'Message sent successfully',
      data: newMessage,
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Get all messages (admin)
// @route   GET /api/messages
// @access  Private
const getMessages = async (req, res, next) => {
  try {
    const messages = await Message.find().sort({ createdAt: -1 });

    res.status(200).json({
      success: true,
      count: messages.length,
      data: messages,
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Update message read status (admin)
// @route   PUT /api/messages/:id
// @access  Private
const updateMessageStatus = async (req, res, next) => {
  try {
    const message = await Message.findById(req.params.id);

    if (!message) {
      res.status(404);
      throw new Error('Message not found');
    }

    message.status = req.body.status || 'read';
    await message.save();

    res.status(200).json({
      success: true,
      data: message,
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Delete message (admin)
// @route   DELETE /api/messages/:id
// @access  Private
const deleteMessage = async (req, res, next) => {
  try {
    const message = await Message.findById(req.params.id);

    if (!message) {
      res.status(404);
      throw new Error('Message not found');
    }

    await message.deleteOne();

    res.status(200).json({
      success: true,
      message: 'Message deleted successfully',
    });
  } catch (error) {
    next(error);
  }
};

module.exports = {
  sendMessage,
  getMessages,
  updateMessageStatus,
  deleteMessage,
};
