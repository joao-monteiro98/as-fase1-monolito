// src/infrastructure/auth/BasicAuthToken.js

class BasicAuthToken {
    // token estatico
    generateToken() {
        return "super-secret-token-fase1";
    }

    validateToken(token) {
        return token === "super-secret-token-fase1";
    }
}

module.exports = BasicAuthToken;