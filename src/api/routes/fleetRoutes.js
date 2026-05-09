// src/api/routes/fleetRoutes.js
const express = require('express');

// Padrão de Fábrica (Factory Pattern) - Injetamos os serviços necessários
module.exports = (fleetService, authService) => {
    const router = express.Router();

    // Middleware de Autenticação
    const requireAuth = (req, res, next) => {
        const token = req.headers['authorization'];
        if (!token || !authService.validateToken(token)) {
            return res.status(401).json({ error: "Acesso não autorizado. Token inválido." });
        }
        next();
    };

    // POST: Registar um novo veiculo (O prefixo /api/vehicles já vem do server.js)
    router.post('/', requireAuth, async (req, res) => {
        try {
            // O controlador não faz validações, delega para o core
            const vehicle = await fleetService.registerVehicle(req.body);
            res.status(201).json(vehicle);
        } catch (error) {
            // se a entidade reclamar damos throw
            res.status(400).json({ error: error.message });
        }
    });

    // GET: Listar todos os veiculos
    router.get('/', requireAuth, async (req, res) => {
        try {
            const vehicles = await fleetService.listAllVehicles();
            res.status(200).json(vehicles);
        } catch (error) {
            res.status(500).json({ error: "Erro interno do servidor." });
        }
    });

    // Devolvemos o router montado para o server.js utilizar
    return router;
};