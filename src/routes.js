'use strict'

async function routes(fastify, options) {

  fastify.get('/', async (request, reply) => {
    reply.sendFile('index.html')
  })

  fastify.post('/message', async (request, reply) => {
    fastify.ws.clients.forEach(client => {
      let message = {
        text: request.body['message'],
        date: Date.now()
      }
      client.send(JSON.stringify(message));
    });
    return request.body;
  })
}

module.exports = routes