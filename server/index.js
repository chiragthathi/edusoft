const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const rateLimit = require('express-rate-limit');
const path = require('path');

const productsRouter = require('./routes/products');
const newsRouter = require('./routes/news');
const jobsRouter = require('./routes/jobs');
const faqsRouter = require('./routes/faqs');
const officesRouter = require('./routes/offices');
const contactRouter = require('./routes/contact');
const seoRouter = require('./routes/seo');
const legacyRedirects = require('./lib/legacyRedirects');

const app = express();
const PORT = process.env.PORT || 5000;
const isProd = process.env.NODE_ENV === 'production';

app.disable('x-powered-by');
app.set('trust proxy', 1);

// Security middleware. CSP allows Google Fonts, the no-cookie YouTube embed
// used by the video facade, and brochure links on edusofthealth.com.
app.use(helmet({
  crossOriginResourcePolicy: { policy: 'cross-origin' },
  contentSecurityPolicy: isProd ? {
    directives: {
      defaultSrc: ["'self'"],
      scriptSrc: ["'self'", "'unsafe-inline'"],
      styleSrc: ["'self'", "'unsafe-inline'", 'https://fonts.googleapis.com'],
      fontSrc: ["'self'", 'https://fonts.gstatic.com'],
      imgSrc: ["'self'", 'data:', 'https://edusofthealth.com', 'https://i.ytimg.com', 'https://images.unsplash.com'],
      frameSrc: ['https://www.youtube-nocookie.com'],
      connectSrc: ["'self'"],
    },
  } : false,
}));

// CORS
app.use(cors({
  origin: process.env.CLIENT_ORIGIN || 'http://localhost:5173',
  methods: ['GET', 'POST'],
  allowedHeaders: ['Content-Type']
}));

// 301s from the legacy PHP site so rankings and inbound links carry over.
app.use((req, res, next) => {
  const target = legacyRedirects[req.path];
  if (target) return res.redirect(301, target);
  next();
});

// Rate limiting
const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: Number(process.env.RATE_LIMIT_MAX) || 300,
  standardHeaders: true,
  legacyHeaders: false
});
app.use('/api/', limiter);

// Form submission stricter limit
const formLimiter = rateLimit({
  windowMs: 60 * 60 * 1000, // 1 hour
  max: 10,
  message: { error: 'Too many submissions. Please try again later.' }
});

// Body parsing
app.use(express.json({ limit: '10kb' }));
app.use(express.urlencoded({ extended: true, limit: '10kb' }));

// API Routes
app.use('/api/products', productsRouter);
app.use('/api/news', newsRouter);
app.use('/api/jobs', jobsRouter);
app.use('/api/faqs', faqsRouter);
app.use('/api/offices', officesRouter);
app.use('/api/contact', formLimiter, contactRouter);

// Health check
app.get('/api/health', (req, res) => {
  res.json({ status: 'ok', timestamp: new Date().toISOString() });
});

// 404 handler for API routes
app.use('/api/{*path}', (req, res) => {
  res.status(404).json({ error: 'API endpoint not found' });
});

// sitemap.xml + robots.txt (generated from live data)
app.use(seoRouter);

// Serve static React build in production
if (isProd) {
  const dist = path.join(__dirname, '../client/dist');
  // Hashed bundles and processed media never change for a given URL.
  app.use('/assets', express.static(path.join(dist, 'assets'), { immutable: true, maxAge: '1y' }));
  app.use('/media', express.static(path.join(dist, 'media'), { maxAge: '30d' }));
  app.use(express.static(dist, { maxAge: '1h' }));
  app.get('/{*path}', (req, res) => {
    res.sendFile(path.join(dist, 'index.html'));
  });
}

// Global error handler
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({ error: 'Internal server error' });
});

app.listen(PORT, () => {
  console.log(`EduSoft Healthcare API server running on http://localhost:${PORT}`);
});

module.exports = app;
