// src/composition.js

// Importar a Infraestrutura
const InMemoryVehicleRepo = require('./infrastructure/database/InMemoryVehicleRepo');
const BasicAuthToken = require('./infrastructure/auth/BasicAuthToken');

// Importar o Core (Serviços/Casos de Uso)
const FleetService = require('./core/services/FleetService');

// 1. Instanciar a tecnologia concreta
const vehicleRepo = new InMemoryVehicleRepo();
const authService = new BasicAuthToken();

// 2. Injetar a infraestrutura no Core (A magia do DIP acontece aqui!)
const fleetService = new FleetService(vehicleRepo);

// 3. Exportar as instâncias já configuradas para a API (Rotas) usar
module.exports = {
    fleetService,
    authService
};