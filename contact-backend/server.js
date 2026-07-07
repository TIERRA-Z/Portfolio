require('dotenv').config();

const express = require('express');
const cors = require('cors');
const rateLimit = require('express-rate-limit');
const { Resend } = require('resend');

const app = express();
const PORT = process.env.PORT || 3001;
app.set('trust proxy', 1);

app.use(express.json({ limit: '10kb' }));

const allowedOrigins = (process.env.ALLOWED_ORIGINS || '')
  .split(',')
  .map((o) => o.trim())
  .filter(Boolean);

app.use(
  cors({
    origin: (origin, callback) => {
      if (!origin || allowedOrigins.includes(origin)) {
        callback(null, true);
      } else {
        callback(new Error('Not allowed by CORS'));
      }
    },
  })
);

const contactLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 3,
  message: { error: 'Too many messages sent. Please try again later.' },
  standardHeaders: true,
  legacyHeaders: false,
});

const resend = new Resend(process.env.RESEND_API_KEY);

function isValidEmail(email) {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
}

function escapeHtml(str) {
  return str
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#039;');
}

app.post('/api/contact', contactLimiter, async (req, res) => {
  const { name, email, subject, message, mood, website } = req.body || {};

  if (website) {
    return res.status(200).json({ ok: true });
  }

  if (!email || !subject || !message) {
    return res.status(400).json({ error: 'Missing required fields.' });
  }
  if (!isValidEmail(email)) {
    return res.status(400).json({ error: "That email address doesn't look valid." });
  }
  if (subject.length > 150 || message.length > 3000) {
    return res.status(400).json({ error: 'Subject or message is too long.' });
  }

  const moodTag = mood ? `[${mood}] ` : '';
  const safeName = name ? escapeHtml(name) : 'Someone';
  const safeEmail = escapeHtml(email);
  const safeSubject = escapeHtml(subject);
  const safeMessage = escapeHtml(message).replace(/\n/g, '<br>');

  try {
    const { error } = await resend.emails.send({
      from: 'Portfolio Contact Form <onboarding@resend.dev>',
      to: process.env.TO_EMAIL,
      reply_to: email,
      subject: `${moodTag}New message: ${subject}`,
      html: `
        <p><strong>${safeName}</strong> (${safeEmail}) sent you a message${mood ? ` feeling <strong>${escapeHtml(mood)}</strong>` : ''}:</p>
        <p><strong>Subject:</strong> ${safeSubject}</p>
        <p>${safeMessage}</p>
      `,
    });

    if (error) {
      console.error('Resend error:', error);
      return res.status(500).json({ error: 'Something went wrong sending your message. Please try again shortly.' });
    }

    return res.status(200).json({ ok: true });
  } catch (err) {
    console.error('Failed to send contact email:', err);
    return res.status(500).json({ error: 'Something went wrong sending your message. Please try again shortly.' });
  }
});

app.get('/health', (req, res) => res.send('ok'));

app.listen(PORT, () => {
  console.log(`Contact form backend running on port ${PORT}`);
});