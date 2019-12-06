const express = require("express");
const helmet = require("helmet");
const server = express();
const projectRoutes = require("./projects/projectsRouter");
const actionRoutes = require("./actions/actionsRouter")


server.use(helmet());

const logger = (req, res, next) => {
    console.log(`${req.method} to ${req.originalUrl} at ${new Date()}`);
    next();
}


server.use(logger)
server.use(express.json());

server.use("/api/projects", projectRoutes)
server.use("/api/actions", actionRoutes)

server.get('/', (req, res) => {
    res.send("<h2> its working</h2>")
})

module.exports = server;