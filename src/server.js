// src/server.js

const express = require('express');
const fleetRoutes = require('./api/routes/fleetRoutes');

const app = express();

// Middleware nativo do Express para ler JSON no corpo dos pedidos HTTP
app.use(express.json());

// Registar as nossas rotas da frota com o prefixo /api
app.use('/api', fleetRoutes);

const PORT = process.env.PORT || 3000;

app.listen(PORT, () => {
    console.log(`Servidor de Telemetria a correr na porta ${PORT}`);
    console.log(`Usa o header Authorization: 'super-secret-token-fase1'`);
});