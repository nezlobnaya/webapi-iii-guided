const express = require('express'); // importing a CommonJS module
const helmet = require('helmet')
const logger = require('morgan')

const hubsRouter = require('./hubs/hubs-router.js');

const server = express();

server.use(helmet())
server.use(logger('dev'))
server.use(express.json());



server.use(typeLogger)
server.use(addName)
// server.use(lockout)
// server.use(moodyGateKeeper)
server.use((req, res, next) => {
  next()
})

server.use('/api/hubs', hubsRouter);

server.get('/', (req, res) => {
  const nameInsert = (req.name) ? ` ${req.name}` : '';

  res.send(`
    <h2>Lambda Hubs API</h2>
    <p>Welcome${nameInsert} to the Lambda Hubs API</p>
    `);
});

function typeLogger(req, res, next) {
  console.log(`${req.method} Request`)
  next()
}

function addName(req, res, next) {
  req.name = req.name || "Vlad"
  next()
}

function lockout(req, res, next) {
  res.status(403).json({
    message: 'API lockout'
  })
}

function moodyGateKeeper(req, res, next) {
  const seconds = new Date().getSeconds()

  if (seconds % 3 === 0) {
    res.status(403).json({
      message: 'You shall not pass'
    })
  } else {
    next()
  }
}

server.use((err, req, res, next) => {
  res.status(500).json({
    message: "Bad mistake", err
  })
})

module.exports = server;
