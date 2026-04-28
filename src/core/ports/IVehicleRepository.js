// src/core/ports/IVehicleRepository.js

class IVehicleRepository {
    // Estas funções lançam erro de propósito.
    // Servem apenas para obrigar a infraestrutura a implementá-las mais tarde.
    
    async save(vehicle) {
        throw new Error("O método 'save' tem de ser implementado.");
    }

    async findById(id) {
        throw new Error("O método 'findById' tem de ser implementado.");
    }

    async findAll() {
        throw new Error("O método 'findAll' tem de ser implementado.");
    }
}

module.exports = IVehicleRepository;