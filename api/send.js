import nodemailer from 'nodemailer';

export default async function handler(req, res) {
  // Only allow POST requests
  if (req.method !== 'POST') {
    return res.status(405).json({ success: false, error: 'Method Not Allowed' });
  }

  const { email } = req.body;

  // Validate email input
  if (!email || typeof email !== 'string') {
    return res.status(400).json({ success: false, error: 'A valid email is required' });
  }

  try {
    // Create reusable transporter using Gmail SMTP
    const transporter = nodemailer.createTransport({
      service: 'gmail',
      auth: {
        user: process.env.GMAIL_USER,
        pass: process.env.GMAIL_PASS
      }
    });

    // Email content
    const mailOptions = {
      from: `PromoReach <${process.env.GMAIL_USER}>`, // Fixed template syntax
      to: process.env.GMAIL_USER, // You can replace with another inbox or list
      subject: '🚀 New PromoReach Lead!',
      html: `
        <div style="font-family: Arial, sans-serif; padding: 10px;">
          <h2>📩 New Subscriber Alert</h2>
          <p><strong>Email:</strong> ${email}</p>
          <p style="font-size: 12px; color: #999;">Sent from OperatorSync Solutions</p>
        </div>
      `
    };

    // Send mail
    await transporter.sendMail(mailOptions);

    // Success response
    return res.status(200).json({ success: true, message: 'Email sent successfully' });

  } catch (error) {
    console.error('Email send error:', error);
    return res.status(500).json({ success: false, error: 'Failed to send email' });
  }
}
