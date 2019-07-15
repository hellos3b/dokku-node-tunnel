import express from "express";
import chalk from "chalk";
import Tunnel from "./Tunnel";
import log from "./log";
import http from "http";

export const Server = {
  start: ({ port }) => {
    const PORT = port;
    const app = express();
  
    app.get("/*", (req, res) => {
      const url = req.originalUrl;
  
      log(`[GET] ${url}`);
  
      Tunnel.request(url)
        .then(({ stream, data }) => {
          res.writeHead(data.status, data.headers);
          stream.pipe(res);
        })
        .catch(() => {
          res.status(404).send("Error: No Active Tunnel Connection");
        });
    });
  
    const server = http.createServer(app);
  
    server.listen(PORT, () =>
      log(`${chalk.green("\u2714")} Server listening on port ${PORT}!`)
    );
    Tunnel.listen(server);
  }
};
