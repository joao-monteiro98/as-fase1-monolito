// src/core/workers/ReportWorker.js

class ReportWorker {
    // Adicionamos o 'logger' às dependências
    constructor(jobQueue, jobStore, eventBus, logger) {
        this.jobQueue = jobQueue;
        this.jobStore = jobStore;
        this.eventBus = eventBus;
        this.logger = logger;
    }

    start() {
        this.jobQueue.process('GERAR_RELATORIO', async (job) => {
            const { id: jobId, payload, correlationId } = job;
            
            // Usamos o logger injetado
            this.logger.info(`⚙️ Iniciar processamento do job ${jobId}...`, correlationId);
            await this.jobStore.updateStatus(jobId, 'PROCESSING');

            try {
                // Simula processamento pesado
                await new Promise(resolve => setTimeout(resolve, 3000));
                
                const reportResult = { reportUrl: `/reports/download/req-${payload.vehicleId}` };
                await this.jobStore.updateStatus(jobId, 'DONE', reportResult);
                
                this.logger.info(`Job ${jobId} concluído com sucesso.`, correlationId);
                
                // Dispara o Evento
                this.eventBus.publish('RelatorioGerado', reportResult, correlationId);
                
            } catch (error) {
                await this.jobStore.updateStatus(jobId, 'FAILED', { error: error.message });
                // Usamos o logger de erro
                this.logger.error(`Falha no job ${jobId}: ${error.message}`, correlationId, error);
            }
        });
    }
}

module.exports = ReportWorker;