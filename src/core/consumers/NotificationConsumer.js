// src/core/consumers/NotificationConsumer.js

class NotificationConsumer {
    constructor(eventBus) {
        this.eventBus = eventBus;
    }

    start() {
        this.eventBus.subscribe('RelatorioGerado', (eventData) => {
            const { payload, correlationId } = eventData;
            // Simula o envio de um alerta ao gestor da frota
            console.log(`[CorrelationID: ${correlationId}] 📧 [Notificação] Alerta: O relatório do veículo está pronto em ${payload.reportUrl}`);
        });
    }
}

module.exports = NotificationConsumer;