// src/server.js

const express = require('express');
const tracingMiddleware = require('./api/middlewares/tracingMiddleware');
const fleetRoutes = require('./api/routes/fleetRoutes');

// Importa as dependências instanciadas na Composição
const { fleetService, authService, reportRoutes } = require('./composition');

const app = express();

//Permite que o Express leia JSON no body dos pedidos (req.body)
app.use(express.json());

//Regista o middleware de Tracing globalmente
app.use(tracingMiddleware);

//Montar a rota da Fase 1 (Veículos) - Injetando o fleetService
app.use('/api/vehicles', fleetRoutes(fleetService, authService));

//Montar a nova rota da Fase 2 (Relatórios) - reportRoutes já traz as dependências
app.use('/api/reports', reportRoutes);

// Iniciar o servidor
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log(`Servidor a correr na porta ${PORT}`);
});