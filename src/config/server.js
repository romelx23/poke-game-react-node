const express = require("express");
const cors = require("cors");
const http = require("http");
const { dbConnection } = require("../database/connection");
const { Server: SocketServer } = require("socket.io");
const fileUpload = require("express-fileupload");
const morgan=require("morgan");
const Sockets = require("./sockets");
class Server {
  constructor() {
    this.app = express();
    this.port = process.env.PORT;
    this.httpServer = http.createServer(this.app);
     // Sockets
     this.io = new SocketServer(this.httpServer, {
      origins: "*",
    });
    // Rutas de mi aplicacion
    this.paths = {
      auth: "/api/auth",
      buscar: "/api/buscar",
      user: "/api/user",
      score: "/api/score",
      message: "/api/message",
    };
    // this.usuariosPath = "/api/usuarios";
    // this.authPath = "/api/auth";

    // Morgan
    this.app.use(morgan("dev"));

    // Conectar a base de datos
    this.conectarDB();

    // Midelwares
    this.middleware();

    // rutas de mi aplicacion
    this.routes();

    // Directorio publico
    this.app.use(express.static("public"));

    // Configurar sockets
    this.configurarSockets();
  }

  async conectarDB() {
    await dbConnection();
  }

  middleware() {
    // Directorio publico
    this.app.use(express.static("public"));
    // Lestura y parseo del codigo
    this.app.use(express.json());
    // CORS
    this.app.use(cors());
    // File upload- Carga de archivo
    this.app.use(
      fileUpload({
        useTempFiles: true,
        tempFileDir: "/tmp/",
        createParentPath:true
      })
    );
  }

  configurarSockets() {
    new Sockets(this.io);
  }

  routes() {
    this.app.use(this.paths.auth, require("../auth/auth.routes"));
    this.app.use(this.paths.buscar, require("../buscar/buscar.routes"));
    this.app.use(this.paths.score, require("../score/score.routes"));
    this.app.use(
      this.paths.user,
      require("../user/user.routes")
    );
    this.app.use(this.paths.message, require("../message/message.routes"));
  }

  listen() {
    // this.app.listen(this.port, () => {
    //   console.log("servidor corriendo el puerto ", this.port);
    // });
    this.httpServer.listen(this.port, () => {
      console.log("servidor corriendo el puerto ", this.port);
    });
  }
}

module.exports = Server;
