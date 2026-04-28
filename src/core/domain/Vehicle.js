class Vehicle {
    constructor({ id, licensePlate, brand, currentSpeed = 0 }) {
        if (!licensePlate) throw new Error("A matrícula é obrigatória.");
        if (currentSpeed < 0) throw new Error("A velocidade do veículo não pode ser negativa.");

        this.id = id;
        this.licensePlate = licensePlate;
        this.brand = brand;
        this.currentSpeed = currentSpeed;
    }
}
module.exports = Vehicle;