// src/api/routes/fleetRoutes.js

const express = require('express');
const router = express.Router();

// Importamos o nosso serviço já instanciado do ficheiro de composição
const { fleetService, authService } = require('../../composition');

// Middleware de Autenticação (placeholder fase3)
const requireAuth = (req, res, next) => {
    const token = req.headers['authorization'];
    if (!token || !authService.validateToken(token)) {
        return res.status(401).json({ error: "Acesso não autorizado. Token inválido." });
    }
    next();
};

// POST: Registar um novo veiculo
router.post('/vehicles', requireAuth, async (req, res) => {
    try {
        // O controlador não faz validações
        // Delega para o core
        const vehicle = await fleetService.registerVehicle(req.body);
        res.status(201).json(vehicle);
    } catch (error) {
        // se a entidade reclamar da-mos throw
        res.status(400).json({ error: error.message });
    }
});

// GET: Listar todos os veiculos
router.get('/vehicles', requireAuth, async (req, res) => {
    try {
        const vehicles = await fleetService.listAllVehicles();
        res.status(200).json(vehicles);
    } catch (error) {
        res.status(500).json({ error: "Erro interno do servidor." });
    }
});

module.exports = router;