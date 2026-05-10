// src/composition.js

// --- Imports da Fase 1 ---
const InMemoryVehicleRepo = require('./infrastructure/database/InMemoryVehicleRepo');
const FleetService = require('./core/services/FleetService');

// --- Imports da Fase 2 ---
const ConsoleLogger = require('./infrastructure/logging/ConsoleLogger');
const InMemoryJobQueue = require('./infrastructure/queue/InMemoryJobQueue');
const InMemoryJobStore = require('./infrastructure/database/InMemoryJobStore');
const InMemoryEventBus = require('./infrastructure/events/InMemoryEventBus');
const InMemoryDLQ = require('./infrastructure/queue/InMemoryDLQ');

const ReportWorker = require('./core/workers/ReportWorker');
const NotificationConsumer = require('./core/consumers/NotificationConsumer');
const AuditConsumer = require('./core/consumers/AuditConsumer');

// Instanciamos Infraestrutura e Utilitários Transversais
const logger = new ConsoleLogger();
const eventBus = new InMemoryEventBus();
const jobQueue = new InMemoryJobQueue();
const jobStore = new InMemoryJobStore();

// Instanciamos a Dead-Letter Queue
const dlq = new InMemoryDLQ(logger);

// Instâncias da Fase 1
const vehicleRepo = new InMemoryVehicleRepo();
const fleetService = new FleetService(vehicleRepo);

// Instanciamos e ligamos os consumidores (subscritores)
const notificationConsumer = new NotificationConsumer(eventBus, logger);
const auditConsumer = new AuditConsumer(eventBus, logger);

// Ativamos os consumidores
notificationConsumer.start();
auditConsumer.start();
    
// Instanciamos e ligamos o Worker (Produtor) - Passando a DLQ como 5º argumento
const reportWorker = new ReportWorker(jobQueue, jobStore, eventBus, logger, dlq);

// Ativamos o worker
reportWorker.start();

// Configuramos as rotas da API - Injetando as dependências necessárias
// Injetamos a fila e a store na rota de relatórios para a API não conhecer o domínio
const reportRoutes = require('./api/routes/reportRoutes')(jobQueue, jobStore);

// Exportamos tudo o que a API precisa para arrancar
module.exports = {
    fleetService,   
    reportRoutes,   
    logger          
};