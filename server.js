const http = require('http');
const url = require('url');
const fs = require('fs');
const path = require('path');
const WebSocket = require('ws');

// Crear el servidor HTTP
const server = http.createServer((req, res) => {
  const parsedUrl = url.parse(req.url, true);
  const query = parsedUrl.query;

  if (parsedUrl.pathname === '/api/values' && req.method === 'GET') {
    const { x, y, z } = query;
    const responseData = JSON.stringify({ x, y, z });

    // Enviar respuesta HTTP
    res.writeHead(200, { 'Content-Type': 'application/json' });
    res.end(responseData);

    // Enviar datos a través de WebSocket a todos los clientes conectados
    wss.clients.forEach(client => {
      if (client.readyState === WebSocket.OPEN) {
        client.send(responseData);
      }
    });
  } else if (parsedUrl.pathname === '/' && req.method === 'GET') {
    fs.readFile(path.join(__dirname, 'index.html'), (err, data) => {
      if (err) {
        res.writeHead(500, { 'Content-Type': 'text/plain' });
        res.end('Internal Server Error');
      } else {
        res.writeHead(200, { 'Content-Type': 'text/html' });
        res.end(data);
      }
    });
  } else {
    res.writeHead(404, { 'Content-Type': 'text/plain' });
    res.end('Not Found');
  }
});

// Crear el servidor WebSocket
const wss = new WebSocket.Server({ server });

// Definir el puerto
const PORT = 3000;

// Iniciar el servidor
server.listen(PORT, () => {
  console.log(`Servidor corriendo en http://localhost:${PORT}`);
});