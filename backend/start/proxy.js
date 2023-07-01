const express = require('express');
const { createProxyMiddleware } = require('http-proxy-middleware');

const app = express();

// Proxy pour /
app.use('/', createProxyMiddleware({ target: 'http://localhost:3000', changeOrigin: true }));

// Proxy pour /api
app.use('/api/', createProxyMiddleware({ target: 'http://localhost:3001', changeOrigin: true }));

// Démarrer le serveur sur le port spécifié
const port = 8000;
app.listen(port, () => {
  console.log(`Serveur de proxy démarré sur le port ${port}`);
});