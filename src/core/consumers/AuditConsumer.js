// src/core/consumers/AuditConsumer.js

class AuditConsumer {
    constructor(eventBus) {
        this.eventBus = eventBus;
    }

    start() {
        this.eventBus.subscribe('RelatorioGerado', (eventData) => {
            const { payload, correlationId } = eventData;
            // Regista a operação para auditoria
            console.log(`[CorrelationID: ${correlationId}] 🛡️ [Auditoria] Registo: Relatório gerado com sucesso para a url ${payload.reportUrl}`);
        });
    }
}

module.exports = AuditConsumer;