// src/core/workers/ReportWorker.js

class ReportWorker {
    // Injeção de Dependências (DIP)
    constructor(jobQueue, jobStore) {
        this.jobQueue = jobQueue;
        this.jobStore = jobStore;
    }

    start() {
        // Subscreve-se à fila com o nome 'GERAR_RELATORIO'
        this.jobQueue.process('GERAR_RELATORIO', async (job) => {
            const { id: jobId, payload, correlationId } = job;
            
            // Log estruturado com Observabilidade
            console.log(`[CorrelationID: ${correlationId}] ⚙️ Iniciar processamento do job ${jobId}...`);
            await this.jobStore.updateStatus(jobId, 'PROCESSING');

            try {
                // Simula um processamento pesado de 3 segundos
                await new Promise(resolve => setTimeout(resolve, 3000));
                
                // Sucesso
                const reportResult = { reportUrl: `/reports/download/req-${payload.vehicleId}` };
                await this.jobStore.updateStatus(jobId, 'DONE', reportResult);
                
                console.log(`[CorrelationID: ${correlationId}] ✅ Job ${jobId} concluído com sucesso.`);
                
            } catch (error) {
                await this.jobStore.updateStatus(jobId, 'FAILED', { error: error.message });
                console.error(`[CorrelationID: ${correlationId}] ❌ Falha no job ${jobId}: ${error.message}`);
            }
        });
    }
}
module.exports = ReportWorker;