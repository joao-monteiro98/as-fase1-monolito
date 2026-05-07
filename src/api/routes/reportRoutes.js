// src/api/routes/reportRoutes.js
const express = require('express');
const router = express.Router();

// Iremos injetar as dependências no server.js ou na composition.
// Para manter a API "Thin", passamos o jobQueue e jobStore injetados na configuração.
module.exports = (jobQueue, jobStore) => {
    
    // POST: Iniciar a criação do relatório assíncrono
    router.post('/generate', async (req, res) => {
        const payload = req.body;
        const correlationId = req.correlationId;

        try {
            // 1. Põe na fila
            const jobId = await jobQueue.add('GERAR_RELATORIO', payload, correlationId);
            
            // 2. Guarda o estado inicial na base de dados
            await jobStore.save(jobId, 'PENDING', correlationId);

            // 3. Devolve 202 Accepted imediatamente
            res.status(202).json({ 
                message: "Relatório em processamento.", 
                jobId: jobId 
            });
        } catch (error) {
            res.status(500).json({ error: error.message });
        }
    });

    // GET: Fazer Polling do estado do Job
    router.get('/:jobId', async (req, res) => {
        const job = await jobStore.get(req.params.jobId);
        if (!job) {
            return res.status(404).json({ error: "Job não encontrado." });
        }
        res.status(200).json(job);
    });

    return router;
};