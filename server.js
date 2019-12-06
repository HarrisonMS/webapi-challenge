const express = require("express");
const helmet = require("helmet");
const server = express();
const projectRoutes = require("./projects/projectsRouter");


server.use(helmet());

const logger = (req, res, next) => {
    console.log(`${req.method} to ${req.originalUrl} at ${new Date()}`);
    next();
  }
server.use(express.json());

server.use(logger)

server.use("/api/projects", projectRoutes)

server.get('/', (req, res) => {
    res.send("<h2> its working</h2>")
})

module.exports = server;