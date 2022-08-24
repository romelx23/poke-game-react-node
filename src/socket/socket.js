const Message = require("../message/message.model");
const Score = require("../score/score.model");
const Usuario = require("./../user/user.model");
const usuarioConectado = async (uid) => {
  const usuario = await Usuario.findById(uid);
  usuario.online = true;
  await usuario.save();
  if (!usuario) {
    return false;
  }
  return usuario;
};

const usuarioDesconectado = async (uid) => {
  const usuario = await Usuario.findById(uid);
  usuario.online = false;
  await usuario.save();
  if (!usuario) {
    return false;
  }
  return usuario;
};

const postScore = async (payload) => {
  const pointsNew = new Score(payload);
  try {
    await pointsNew.save();

    return {
      msg: "Puntos guardados",
      pointsNew,
    };
  } catch (error) {
    return {
      msg: "Error al guardar los puntos",
    };
  }
};

const getScore = async () => {
  const points = await Score.find()
    .sort({ score: -1 })
    .populate("user", ["_id", "nombre", "imagen"]);
  // console.log(points);
  return {
    total: points.length,
    points,
  };
};

const getUsers = async () => {
  const users = await Usuario.find();
  return {
    total: users.length,
    users,
  };
};

const grabarMensaje = async (payload) => {
  try {
    const mensaje = new Message(payload);
    await mensaje.save();
    const userDe= await Usuario.findById(mensaje.de);
    const userPara= await Usuario.findById(mensaje.para);
    // populate del usuario que envia el mensaje
    return {
      ...mensaje._doc,
      de: userDe,
      para: userPara,
    };
  } catch (error) {
    return false;
  }
};

module.exports = {
  usuarioConectado,
  usuarioDesconectado,
  postScore,
  getScore,
  getUsers,
  grabarMensaje,
};
