const express = require('express');
const router = express.Router();

const TYPES = ['contact', 'general', 'sales', 'quote', 'support', 'service', 'partnerships', 'media', 'newsletter'];
const LIMITS = { name: 120, email: 200, phone: 40, company: 160, department: 40, subject: 200, productInterest: 160, product: 160, message: 2000 };

/**
 * POST /api/contact
 * Accepts contact / quote / support / service-request submissions.
 * In production, configure SMTP via environment variables to forward to email.
 */
router.post('/', (req, res) => {
  const body = req.body || {};

  // Honeypot: real users never fill the hidden "website" field.
  if (body.website) return res.status(200).json({ success: true });

  const clean = {};
  for (const [key, max] of Object.entries(LIMITS)) {
    if (body[key] == null) continue;
    if (typeof body[key] !== 'string') return res.status(400).json({ error: `Invalid ${key}.` });
    clean[key] = body[key].trim().slice(0, max === 2000 ? undefined : max);
  }
  const type = TYPES.includes(body.type) ? body.type : 'contact';
  // Newsletter sign-ups only carry an email address.
  if (type === 'newsletter') { clean.name = clean.name || 'Newsletter subscriber'; clean.message = clean.message || 'Subscribe to product updates'; }
  const { name, email, message } = clean;

  // Basic validation
  if (!name || !email || !message) {
    return res.status(400).json({ error: 'Name, email, and message are required.' });
  }

  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!emailRegex.test(email)) {
    return res.status(400).json({ error: 'Invalid email address.' });
  }

  if (message.length > LIMITS.message) {
    return res.status(400).json({ error: 'Message too long (max 2000 characters).' });
  }

  // Log submission (replace with nodemailer/CRM integration in production)
  console.log('[Contact Form Submission]', {
    type,
    ...clean,
    message: message.length > 100 ? message.substring(0, 100) + '...' : message,
    timestamp: new Date().toISOString()
  });

  /*
  // Nodemailer example (configure via environment variables):
  const transporter = nodemailer.createTransport({
    host: process.env.SMTP_HOST,
    port: process.env.SMTP_PORT,
    auth: { user: process.env.SMTP_USER, pass: process.env.SMTP_PASS }
  });
  await transporter.sendMail({
    from: `"EduSoft Website" <noreply@edusofthealth.com>`,
    to: 'info@edusofthealth.com',
    subject: `[${type}] ${clean.subject || `New inquiry from ${name}`}`,
    text: Object.entries(clean).map(([k, v]) => `${k}: ${v}`).join('\n')
  });
  */

  res.status(200).json({
    success: true,
    message: 'Thank you for your inquiry. Our team will respond within one business day.'
  });
});

module.exports = router;
