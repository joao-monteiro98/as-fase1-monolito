// src/infrastructure/events/InMemoryEventBus.js
const IEventBus = require('../../core/ports/IEventBus');
const EventEmitter = require('events');

class InMemoryEventBus extends IEventBus {
    constructor() {
        super();
        this.emitter = new EventEmitter();
    }

    publish(eventName, payload, correlationId) {
        // Empacotamos o payload e o correlationId para o contexto viajar com o evento
        this.emitter.emit(eventName, { payload, correlationId });
    }

    subscribe(eventName, handler) {
        this.emitter.on(eventName, handler);
    }
}

module.exports = InMemoryEventBus;