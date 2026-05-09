// src/composition.js

// --- Imports da Fase 1 ---
const InMemoryVehicleRepo = require('./infrastructure/database/InMemoryVehicleRepo');
const FleetService = require('./core/services/FleetService');

// --- Imports da Fase 2 ---
const ConsoleLogger = require('./infrastructure/logging/ConsoleLogger');
const InMemoryJobQueue = require('./infrastructure/queue/InMemoryJobQueue');
const InMemoryJobStore = require('./infrastructure/database/InMemoryJobStore');
const InMemoryEventBus = require('./infrastructure/events/InMemoryEventBus');

const ReportWorker = require('./core/workers/ReportWorker');
const NotificationConsumer = require('./core/consumers/NotificationConsumer');
const AuditConsumer = require('./core/consumers/AuditConsumer');

// 1. Instanciar Infraestrutura e Utilitários Transversais
const logger = new ConsoleLogger();
const eventBus = new InMemoryEventBus();
const jobQueue = new InMemoryJobQueue();
const jobStore = new InMemoryJobStore();

// (Mantém a tua instância da Fase 1 aqui)
const vehicleRepo = new InMemoryVehicleRepo();
const fleetService = new FleetService(vehicleRepo);

// 2. Instanciar e Ligar Consumidores (Subscritores)
// Passamos o logger também se tiveres atualizado os consumers no Passo 3
const notificationConsumer = new NotificationConsumer(eventBus, logger);
const auditConsumer = new AuditConsumer(eventBus, logger);

// Ativar os consumidores (eles ficam à escuta do EventBus)
notificationConsumer.start();
auditConsumer.start();

// 3. Instanciar e Ligar o Worker (Produtor)
const reportWorker = new ReportWorker(jobQueue, jobStore, eventBus, logger);

// Ativar o worker (ele fica à escuta da JobQueue)
reportWorker.start();

// 4. Configurar as Rotas da API
// Injetamos a fila e a store na rota de relatórios para a API não conhecer o domínio
const reportRoutes = require('./api/routes/reportRoutes')(jobQueue, jobStore);

// Exportamos tudo o que a API precisa para arrancar
module.exports = {
    fleetService,   // Da Fase 1
    reportRoutes,   // Da Fase 2
    logger          // Exportamos o logger caso o server.js queira usar
};