const express = require('express');
const cors = require('cors');

const app = express();
const PORT = process.env.PORT || 3000;

// Middleware
app.use(cors());
app.use(express.json());

// Root endpoint - API welcome page
app.get('/', (req, res) => {
  res.json({
    name: 'Physical Security Sandbox API',
    version: '1.0.16',
    timestamp: new Date().toISOString(),
    documentation: 'https://sandbox.petefox.co.uk/docs',
    endpoints: {
      discovery: `http://localhost:${PORT}/api`,
      health: `http://localhost:${PORT}/health`,
      metrics: `http://localhost:${PORT}/metrics`,
      gallagher: `http://localhost:${PORT}/api/gallagher/*`,
      milestone: `http://localhost:${PORT}/api/milestone/*`
    },
    message: 'Welcome to the Physical Security Sandbox API. Visit /api for full endpoint discovery.'
  });
});

// Health endpoint
app.get('/health', (req, res) => {
  res.json({
    status: 'healthy',
    timestamp: new Date().toISOString(),
    version: '1.0.16',
    services: {
      gallagher: 'operational',
      axis: 'operational',
      milestone: 'operational',
      onvif: 'operational'
    }
  });
});

// API Discovery endpoint (PR#16)
app.get('/api', (req, res) => {
  res.json({
    version: '1.0.16',
    timestamp: new Date().toISOString(),
    documentation: 'https://sandbox.petefox.co.uk/docs',
    _links: {
      self: {
        href: `http://localhost:${PORT}/api`,
        description: 'API discovery endpoint'
      },
      health: {
        href: `http://localhost:${PORT}/health`,
        methods: ['GET'],
        description: 'System health and status check'
      },
      metrics: {
        href: `http://localhost:${PORT}/metrics`,
        methods: ['GET'],
        description: 'System metrics and statistics'
      },
      cardholders: {
        href: `http://localhost:${PORT}/api/gallagher/cardholders`,
        methods: ['GET', 'POST'],
        description: 'Cardholder management',
        authentication: 'X-API-Key required'
      },
      doors: {
        href: `http://localhost:${PORT}/api/gallagher/doors`,
        methods: ['GET', 'POST'],
        description: 'Door management',
        authentication: 'X-API-Key required'
      },
      events: {
        href: `http://localhost:${PORT}/api/gallagher/events`,
        methods: ['GET'],
        description: 'Access control events',
        authentication: 'X-API-Key required'
      },
      accessGroups: {
        href: `http://localhost:${PORT}/api/gallagher/access-groups`,
        methods: ['GET', 'POST'],
        description: 'Access group management',
        authentication: 'X-API-Key required'
      },
      cameras: {
        href: `http://localhost:${PORT}/api/milestone/cameras`,
        methods: ['GET'],
        description: 'Camera management',
        authentication: 'X-API-Key required'
      },
      recordingServers: {
        href: `http://localhost:${PORT}/api/milestone/recording-servers`,
        methods: ['GET'],
        description: 'Recording server management',
        authentication: 'X-API-Key required'
      }
    }
  });
});

// Metrics endpoint
app.get('/metrics', (req, res) => {
  res.json({
    uptime: process.uptime(),
    timestamp: new Date().toISOString(),
    memory: process.memoryUsage(),
    version: '1.0.16'
  });
});

// Mock Gallagher endpoints
app.get('/api/gallagher/cardholders', (req, res) => {
  res.json({
    results: [],
    total: 0,
    skip: 0,
    top: 100
  });
});

app.get('/api/gallagher/doors', (req, res) => {
  res.json({
    results: [],
    total: 0
  });
});

app.get('/api/gallagher/events', (req, res) => {
  res.json({
    results: [],
    total: 0
  });
});

app.get('/api/gallagher/access-groups', (req, res) => {
  res.json({
    results: [],
    total: 0
  });
});

// Mock Milestone endpoints
app.get('/api/milestone/cameras', (req, res) => {
  res.json({
    cameras: []
  });
});

app.get('/api/milestone/recording-servers', (req, res) => {
  res.json({
    servers: []
  });
});

// 404 handler
app.use((req, res) => {
  res.status(404).json({
    error: 'NotFound',
    message: `Endpoint ${req.path} not found`,
    timestamp: new Date().toISOString(),
    path: req.path
  });
});

// Error handler
app.use((err, req, res, next) => {
  console.error('[API Error]', err);
  res.status(500).json({
    error: 'InternalServerError',
    message: 'An unexpected error occurred',
    timestamp: new Date().toISOString(),
    path: req.path
  });
});

// Start server
app.listen(PORT, () => {
  console.log(`
╔═══════════════════════════════════════════════════════╗
║   Physical Security Sandbox API Server v1.0.16       ║
╚═══════════════════════════════════════════════════════╝

🚀 Server running on http://localhost:${PORT}
📊 Health check: http://localhost:${PORT}/health
📈 Metrics: http://localhost:${PORT}/metrics
🔍 API Discovery: http://localhost:${PORT}/api
  `);
});
