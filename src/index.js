'use strict'

const fastify = require('fastify')()
const path = require('path')

fastify.register(require('fastify-static'), {
  root: path.join(__dirname, '../', 'public'),
  prefix: '/'
})

fastify.register(require('fastify-ws'), {
  library: 'uws'
})

fastify.register(require('./routes'))

fastify.ready(err => {
  if (err) throw err

  fastify.ws
    .on('connection', socket => {
      console.log("New user connected.")

      socket.on('close', () => {
        console.log("User disconnected.")
      });
    })
})

fastify.listen(3000)