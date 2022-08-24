const { Schema, model } = require("mongoose");

const UsuarioSchema = new Schema({
  nombre: {
    type: String,
    required: [true, "El nombre es obligatorio"],
    unique:true,
  },
  correo: {
    type: String,
    required: [true, "El correo es obligatorio"],
    unique:true,
  },
  password: {
    type: String,
    required: [true, "La contraseña es obligatoria"],
  },
  imagen:{
    type: String,
    default: "https://media.discordapp.net/attachments/789940470578544682/1006755574526005268/3.png",
  },
  estado: {
    type: Boolean,
    default: true,
    required: true,
  },
  online:{
    type: Boolean,
    default: false,
    required: true,
  },
  google: {
    type: Boolean,
    default: false,
  },
});

// Modificamos el json que nos devuelve mongoose
UsuarioSchema.methods.toJSON = function () {
  const { __v, password, _id, ...usuario } = this.toObject(); //eslint-disable-line
  usuario.uid = _id;
  return usuario;
};

const Usuario = model("Usuario", UsuarioSchema);
module.exports = Usuario;

