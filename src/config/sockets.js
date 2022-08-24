// import pedidoslist
// const { usuarioConectado } = require("../socket/socket");
// const { comprobarJWT } = require("../helpers/generar-jwt");
const { comprobarJWT } = require("../helpers");
// const Message = require("../message/message.model");
const {
  postScore,
  getScore,
  getUsers,
  usuarioConectado,
  usuarioDesconectado,
  grabarMensaje,
} = require("../socket/socket");
const Usuario = require("../user/user.model");

class Sockets {
  constructor(io) {
    this.io = io;

    this.socketEvents();
  }

  socketEvents() {
    // On connection
    this.io.on("connect", async (socket) => {
      const [valido, uid] = comprobarJWT(socket.handshake.query["x-token"]);
      socket.on("connect-user", async () => {
        if (!valido) {
          console.log("socket no identificado");
          // return socket.disconnect();
        }
        // usuario conectado
        if (uid) {
          const usuario = await usuarioConectado(uid);
          console.log("usuario conectado", usuario.nombre);
          // Emitir la lista de usuarios conectados
          this.io.emit("list-users", await getUsers());
          // unir al usuario a una sala de socket.io
          // socket.join(uid);
        }
      });
      socket.join(uid);
      // console.log("cliente conectado", socket.id);
      // Escuchar evento: mensaje-to-server
      socket.on("mensaje-to-server", (data) => {
        const user = Usuario.findById(data.id);
        if (user) {
          console.log("mensaje", data);
          this.io.emit("mensaje-from-server", data);
        }
      });
      // Escuchar evento: mensaje-privado
      socket.on("mensaje-privado", async (data) => {
        const user = Usuario.findById(data.de);
        if (user) {
          const mensaje = await grabarMensaje(data);
          console.log("mensaje", mensaje);
          // const mensajePrivado = Message.findById(mensaje._id)
          //   .populate("de", ["_id", "nombre", "imagen"])
          //   .populate("para", ["_id", "nombre", "imagen"]);
          this.io.to(data.para).emit("mensaje-privado", mensaje);
          this.io.to(data.de).emit("mensaje-privado", mensaje);
        }
      });
      // Escuchar cuando el cliente agrega un nuevo puntaje
      /**
       * data={
       *  user: id del usuario,
       * score: puntaje
       * }
       * **/
      socket.on("new-score", async (data) => {
        const { user, score } = data;
        if (user === "") return;
        if (score < 0) return;
        // console.log(data);
        await postScore(data); //eslint-disable-line
        // console.log(points);
        this.io.emit("list-scores", await getScore());
      });
      // Escuchar cuando el cliente solicita la lista de puntajes
      socket.on("get-scores", async () => {
        console.log("get-scores");
        this.io.emit("list-scores", await getScore());
      });
      //  Escuchar cuando el cliente solicita la lista de usuarios
      socket.on("get-users", async () => {
        console.log("get-users");
        this.io.emit("list-users", await getUsers());
      });
      socket.on("disconnect-user", async () => {
        // usuario desconectado
        if (uid) {
          const usuario = await usuarioDesconectado(uid);
          console.log("usuario desconectado", usuario.nombre);
          // emitir la lista de usuarios actualizada
          this.io.emit("list-users", await getUsers());
        }
      });
    });
    // On disconnection
    this.io.on("disconnect", () => {
      console.log("cliente desconectado");
    });
  }
}

module.exports = Sockets;
