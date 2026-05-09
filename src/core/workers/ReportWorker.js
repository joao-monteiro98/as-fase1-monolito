// src/core/workers/ReportWorker.js

class ReportWorker {
    constructor(jobQueue, jobStore, eventBus, logger) {
        this.jobQueue = jobQueue;
        this.jobStore = jobStore;
        this.eventBus = eventBus;
        this.logger = logger;
        this.MAX_RETRIES = 3; // Limite máximo de tentativas
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

                    // === INJEÇÃO DE FALHA (Para a Prova de Conceito) ===
                    // Se enviarmos o veículo 'FAIL', o sistema "rebenta" de propósito
                    if (payload.vehicleId === 'FAIL') {
                        throw new Error("Falha temporária simulada na ligação ao sistema de GPS.");
                    }

                    // Simula o processamento normal (2 segundos)
                    await new Promise(resolve => setTimeout(resolve, 2000));
                    
                    const reportResult = { reportUrl: `/reports/download/req-${payload.vehicleId}` };
                    
                    // Atualiza a base de dados e dispara o evento
                    await this.jobStore.updateStatus(jobId, 'DONE', reportResult);
                    this.logger.info(`Job ${jobId} concluído com sucesso!`, correlationId);
                    this.eventBus.publish('RelatorioGerado', reportResult, correlationId);
                    
                    success = true; // Quebra o ciclo while

                } catch (error) {
                    this.logger.error(`⚠️ Erro no job ${jobId} (Tentativa ${attempt}): ${error.message}`, correlationId);

                    if (attempt < this.MAX_RETRIES) {
                        // Exponential Backoff: Espera 2s, 4s, 8s...
                        const delay = Math.pow(2, attempt) * 1000;
                        this.logger.info(`⏳ A aguardar ${delay}ms antes da próxima tentativa...`, correlationId);
                        
                        await new Promise(resolve => setTimeout(resolve, delay));
                        attempt++;
                    } else {
                        // Esgotou as tentativas, marca como FAILED definitivamente
                        await this.jobStore.updateStatus(jobId, 'FAILED', { error: error.message });
                        this.logger.error(`Falha definitiva no job ${jobId} após ${this.MAX_RETRIES} tentativas.`, correlationId, error);
                        break;
                    }
                }
            }
        });
    }
}

module.exports = ReportWorker;