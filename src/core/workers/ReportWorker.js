// src/core/workers/ReportWorker.js

class ReportWorker {
    constructor(jobQueue, jobStore, eventBus, logger, dlq) {
        this.jobQueue = jobQueue;
        this.jobStore = jobStore;
        this.eventBus = eventBus;
        this.logger = logger;
        this.dlq = dlq;
        this.MAX_RETRIES = 3;
    }

    start() {
        this.jobQueue.process('GERAR_RELATORIO', async (job) => {
            const { id: jobId, payload, correlationId } = job;
            let attempt = 1;
            let success = false;

            await this.jobStore.updateStatus(jobId, 'PROCESSING');

            while (attempt <= this.MAX_RETRIES && !success) {
                try {
                    this.logger.info(`⚙️ Processar job ${jobId} (Tentativa ${attempt}/${this.MAX_RETRIES})...`, correlationId);

                    if (payload.vehicleId === 'FAIL') {
                        throw new Error("Falha crítica: Perda de ligação ao GPS do veículo.");
                    }

                    await new Promise(resolve => setTimeout(resolve, 2000));
                    const reportResult = { reportUrl: `/reports/download/req-${payload.vehicleId}` };
                    
                    await this.jobStore.updateStatus(jobId, 'DONE', reportResult);
                    this.logger.info(`✅ Job ${jobId} concluído.`, correlationId);
                    this.eventBus.publish('RelatorioGerado', reportResult, correlationId);
                    success = true;

                } catch (error) {
                    this.logger.error(`Erro na tentativa ${attempt}: ${error.message}`, correlationId);

                    if (attempt < this.MAX_RETRIES) {
                        const delay = Math.pow(2, attempt) * 1000;
                        this.logger.info(`⏳ Backoff: Aguardar ${delay}ms...`, correlationId);
                        await new Promise(resolve => setTimeout(resolve, delay));
                        attempt++;
                    } else {
                        // DLQ: Após a última tentativa, movemos o job para a Dead-Letter Queue
                        await this.jobStore.updateStatus(jobId, 'FAILED', { error: error.message });
                        
                        this.dlq.push(jobId, payload, error.message, correlationId);
                        
                        this.logger.error(`Job ${jobId} falhou definitivamente. Movido para DLQ.`, correlationId);
                        break;
                    }
                }
            }
        });
    }
}

module.exports = ReportWorker;