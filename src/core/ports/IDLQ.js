// src/core/ports/IDLQ.js

class IDLQ {
    // Adiciona um job que falhou definitivamente à fila de mensagens mortas
    push(jobId, payload, error, correlationId) {
        throw new Error("Método 'push' não implementado.");
    }

    // Permite consultar as mensagens que falharam (para auditoria)
    getAll() {
        throw new Error("Método 'getAll' não implementado.");
    }
}

module.exports = IDLQ;