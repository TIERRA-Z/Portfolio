require('dotenv').config();

const express = require('express');
const cors = require('cors');
const rateLimit = require('express-rate-limit');
const nodemailer = require('nodemailer');

const app = express();
const PORT = process.env.PORT || 3001;

// ---- Basic setup ----

app.use(express.json({ limit: '10kb' })); // small limit, this is just a contact form

const allowedOrigins = (process.env.ALLOWED_ORIGINS || '')
  .split(',')
  .map((o) => o.trim())
  .filter(Boolean);

app.use(
  cors({
    origin: (origin, callback) => {
      // allow tools like curl/postman (no origin) and any explicitly allowed origin
      if (!origin || allowedOrigins.includes(origin)) {
        callback(null, true);
      } else {
        callback(new Error('Not allowed by CORS'));
      }
    },
  })
);

// ---- Spam prevention: rate limiting ----
// Caps how many submissions a single IP can make in a time window.

const contactLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 3, // 3 submissions per IP per window
  message: { error: 'Too many messages sent. Please try again later.' },
  standardHeaders: true,
  legacyHeaders: false,
});

// ---- Mail transporter ----

const transporter = nodemailer.createTransport({
     host: '172.217.204.108', // smtp.gmail.com
     port: 465,
     secure: true,
     tls: {
        servername: 'smtp.gmail.com',
        dns.resolve4('smtp.gmail.com', (err, addresses) => {
          if (err) {
            console.error('DNS resolution error:', err);
          } else {
            console.log('Resolved addresses for smtp.gmail.com:', addresses);
          }
        }),
     },
     auth: {
       user: process.env.SMTP_EMAIL,
       pass: process.env.SMTP_APP_PASSWORD,
     },
     family: 4,
   });

// ---- Helpers ----

function isValidEmail(email) {
  // simple, good-enough email shape check (not exhaustive RFC 5322)
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

// ---- Route ----

app.post('/api/contact', contactLimiter, async (req, res) => {
  const { name, email, subject, message, mood, website } = req.body || {};

  // Honeypot check: "website" field is invisible to real users.
  // If it's filled in, a bot did it — pretend success, don't send anything.
  if (website) {
    return res.status(200).json({ ok: true });
  }

  // Server-side validation (never trust the client)
  if (!email || !subject || !message) {
    return res.status(400).json({ error: 'Missing required fields.' });
  }
  if (!isValidEmail(email)) {
    return res.status(400).json({ error: 'That email address doesn\'t look valid.' });
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
    await transporter.sendMail({
      from: `"Portfolio Contact Form" <${process.env.SMTP_EMAIL}>`,
      to: process.env.TO_EMAIL,
      replyTo: email,
      subject: `${moodTag}New message: ${subject}`,
      html: `
        <p><strong>${safeName}</strong> (${safeEmail}) sent you a message${mood ? ` feeling <strong>${escapeHtml(mood)}</strong>` : ''}:</p>
        <p><strong>Subject:</strong> ${safeSubject}</p>
        <p>${safeMessage}</p>
      `,
    });

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
