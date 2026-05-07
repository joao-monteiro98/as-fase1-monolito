// src/infrastructure/database/InMemoryJobStore.js
const IJobStore = require('../../core/ports/IJobStore');

class InMemoryJobStore extends IJobStore {
    constructor() {
        super();
        this.jobs = new Map(); // Usamos Map para acesso rápido pelo jobId
    }

    async save(jobId, status, correlationId) {
        const job = { id: jobId, status, correlationId, result: null, createdAt: new Date() };
        this.jobs.set(jobId, job);
        return job;
    }

    async get(jobId) {
        return this.jobs.get(jobId) || null;
    }

    async updateStatus(jobId, status, result = null) {
        const job = this.jobs.get(jobId);
        if (job) {
            job.status = status;
            job.result = result;
            job.updatedAt = new Date();
        }
        return job;
    }
}
module.exports = InMemoryJobStore;