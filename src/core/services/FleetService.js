// src/core/services/FleetService.js

const Vehicle = require('../domain/Vehicle');

class FleetService {
    // DIP (Dependency Inversion Principle)
    // O serviço recebe o repositório no construtor em vez de o importar diretamente
    constructor(vehicleRepository) {
        this.vehicleRepository = vehicleRepository;
    }

    async registerVehicle(vehicleData) {
        // 1. Criar e validar o veículo usando a Entidade de Domínio
        const newVehicle = new Vehicle(vehicleData);

        // 2. Guardar usando o contrato (Porto)
        return await this.vehicleRepository.save(newVehicle);
    }

    async getVehicleDetails(id) {
        return await this.vehicleRepository.findById(id);
    }
    
    async listAllVehicles() {
        return await this.vehicleRepository.findAll();
    }
}

module.exports = FleetService;