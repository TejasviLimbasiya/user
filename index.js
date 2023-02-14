const Fastify = require('fastify');
const routes = require('./app/routes');
const config = require('./app/config');
const { dbConnection } = require('./app/models');

const fastify = Fastify({
    logger: true,
});
fastify.register(require('@fastify/helmet'));
fastify.register(require('@fastify/cors'), config.cors);
/**
 * Run the server!
 */
async function start() {
    try {
        // eslint-disable-next-line global-require
        await fastify.register(require('@fastify/swagger'), config.swagger);


        // register the routes
        await fastify.register(routes);
        fastify.swagger();
        await fastify.listen({ port: config.server.port || 3000 });
        // eslint-disable-next-line no-console
        await dbConnection(config.server.db_url)
        console.log(fastify.printRoutes());
    } catch (err) {
        fastify.log.error(err);
        process.exit(1);
    }
}
start();

module.exports = fastify