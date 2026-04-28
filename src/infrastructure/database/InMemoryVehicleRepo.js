// src/infrastructure/database/InMemoryVehicleRepo.js

// Importamos o contrato do Core
const IVehicleRepository = require('../../core/ports/IVehicleRepository');

class InMemoryVehicleRepo extends IVehicleRepository {
    constructor() {
        super();
        // Array simula a tabela da base de dados real
        this.vehicles = []; 
    }

    async save(vehicle) {
        this.vehicles.push(vehicle);
        return vehicle; // Devolve o objeto guardado
    }

    // método findById
    async findById(id) {
        return this.vehicles.find(v => v.id === id) || null;
    }

    // método findAll
    async findAll() {
        return this.vehicles;
    }
}

module.exports = InMemoryVehicleRepo;