const Server = require("./server");
const Database = require("./database");

class api {
	constructor(config, logger) {
		this.config = config;
		this.logger = logger.child({ context: "api" });
		this.isRunning = false;
		this.database = new Database(config, this.logger);
		this.server = new Server(config, this.logger, this.database, this.s3);
	}

	async start() {
		if (this.isRunning) {
			throw new Error("No se puede iniciar la api porque ya se está ejecutando");
		}
		this.isRunning = true;

		this.logger.verbose("Comenzando Api");
		await Promise.all([this.database.connect(), this.server.listen()]);
		this.logger.verbose("Api lista y en espera de solicitudes");

		return { url: this.config.server.url };
	}

	async stop() {
		if (!this.isRunning) {
			throw new Error("No se puede detener la api porque ya se detuvo");
		}
		this.isRunning = false;

		this.logger.verbose("Deteniendo api");
		await Promise.all([this.database.disconnect(), this.server.close()]);
		this.logger.verbose("La api cerró todas las conexiones y las detuvo con éxito");
	}
}

module.exports = api;
