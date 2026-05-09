// src/core/workers/ReportWorker.js

class ReportWorker {
    // Adicionamos o eventBus às dependências injetadas (DIP)
    constructor(jobQueue, jobStore, eventBus) {
        this.jobQueue = jobQueue;
        this.jobStore = jobStore;
        this.eventBus = eventBus;
    }

    start() {
        this.jobQueue.process('GERAR_RELATORIO', async (job) => {
            const { id: jobId, payload, correlationId } = job;
            
            console.log(`[CorrelationID: ${correlationId}] ⚙️ Iniciar processamento do job ${jobId}...`);
            await this.jobStore.updateStatus(jobId, 'PROCESSING');

            try {
                // Simula processamento pesado de 3 segundos
                await new Promise(resolve => setTimeout(resolve, 3000));
                
                const reportResult = { reportUrl: `/reports/download/req-${payload.vehicleId}` };
                await this.jobStore.updateStatus(jobId, 'DONE', reportResult);
                
                console.log(`[CorrelationID: ${correlationId}] ✅ Job ${jobId} concluído com sucesso.`);
                
                // Disparo do Evento (Pub/Sub)
                this.eventBus.publish('RelatorioGerado', reportResult, correlationId);
                
            } catch (error) {
                await this.jobStore.updateStatus(jobId, 'FAILED', { error: error.message });
                console.error(`[CorrelationID: ${correlationId}] ❌ Falha no job ${jobId}: ${error.message}`);
            }
        });
    }
}

module.exports = ReportWorker;