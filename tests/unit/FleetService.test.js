// tests/unit/FleetService.test.js

const FleetService = require('../../src/core/services/FleetService');
const InMemoryVehicleRepo = require('../../src/infrastructure/database/InMemoryVehicleRepo');

describe('FleetService - Testes Unitários (Core)', () => {
    let fleetService;
    let mockRepo;

    // Antes de cada teste, criamos uma base de dados nova e limpa
    beforeEach(() => {
        mockRepo = new InMemoryVehicleRepo();
        
        // Função do DIP nos testes, injetamos o mock no serviço
        fleetService = new FleetService(mockRepo);
    });

    test('Deve registar um veículo com sucesso', async () => {
        const vehicleData = {
            id: 'v1',
            licensePlate: 'AA-11-BB',
            brand: 'Toyota',
            currentSpeed: 60
        };

        const result = await fleetService.registerVehicle(vehicleData);

        // Verifica se o serviço devolveu o carro certo
        expect(result.licensePlate).toBe('AA-11-BB');
        
        // Verifica se o carro foi realmente guardado no repo mock
        const vehiclesInDb = await fleetService.listAllVehicles();
        expect(vehiclesInDb.length).toBe(1);
    });

    test('Deve impedir o registo de um veículo com velocidade negativa (Regra de Domínio)', async () => {
        const invalidVehicleData = {
            id: 'v2',
            licensePlate: 'XX-99-YY',
            brand: 'Ferrari',
            currentSpeed: -20 // Inválido segundo a nossa Entidade
        };

        // Verifica se o serviço "rebenta" com a mensagem de erro exata da Entidade
        await expect(fleetService.registerVehicle(invalidVehicleData))
            .rejects
            .toThrow("A velocidade do veículo não pode ser negativa.");

        // Verifica que o carro NÃO foi guardado no repositório
        const vehiclesInDb = await fleetService.listAllVehicles();
        expect(vehiclesInDb.length).toBe(0);
    });
});