const redisClient = require('redis');

module.exports = (config, logger) => {
    if (!config.host || !config.port || typeof config.database === 'undefined') {
        throw new Error("Config for Redis Adapter is not defined");
    }
    return {
        connect: async () => {
            const redis = redisClient.createClient({
                url: `redis://${config.host}:${config.port}`,
                socket: {
                    reconnectStrategy: () => config.reconnect_after || 2000
                }
            });

            redis.on('error', (err) => logger.info(`The redis main connection has error'd, error message: ${err}`));
            redis.on('reconnecting', (warning) => logger.info(`The redis main connection has issued a warning: ${warning}`));
            redis.on('connect', () => {
                logger.info(`Redis connected to ${config.host}:${config.port}/${config.database}`);
            });

            try {
                await redis.connect();
                await redis.select(config.database);
                return redis;
            } catch (err) {
                logger.info(`The redis could not connect: ${err.message}`)
            }
        }
    }
};



