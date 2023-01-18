async function connectBackendServices(Redis, SQLite) {
  const redisClient = await Redis.connect();
  const dbDriver = await SQLite.connect();

  const disconnectBackendServices = async () => {
    await dbDriver.close();
    await redisClient.disconnect();
  };

  return {
    services: { redisClient, dbDriver },
    disconnectBackendServices,
  };
}

module.exports = {
  connectBackendServices,
};
