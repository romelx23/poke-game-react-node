const { Router } = require("express");
const { body, check } = require("express-validator");

const {
  usuariosGet,
  usuariosPut,
  usuariosPost,
  usuariosDelete,
  usuariosPatch,
  usuariosGetId,
} = require("./user.controller");
const {
  emailExiste,
  existeUsuarioPorId,
} = require("../helpers/db-validators");

const { validarJWT, tieneRole, validarCampos } = require("../middlewares");

const router = Router();

router.get("/",validarJWT,usuariosGet);

router.get("/:id",
[
  check("id", "No es un mongo ID").isMongoId(),
  validarJWT,
  validarCampos,
],usuariosGetId);

router.put(
  "/:id",
  [
    check("id", "No es un mongo ID").isMongoId(),
    check("id").custom(existeUsuarioPorId),
    validarCampos,
  ],
  usuariosPut
);

router.post(
  "/",
  [
    body("nombre", "El nombre es obligatorio").not().isEmpty(),
    body("password", "El password debe de ser más de 6 letras").isLength({
      min: 6,
    }),
    body("correo", "El correo no es valido").isEmail().custom(emailExiste),
    // body("rol","No es un rol valido").isIn(["ADMIN_ROLE", "USER_ROLE"]),
    validarCampos,
  ],
  usuariosPost
);

router.delete(
  "/:id",
  [
    validarJWT,
    // esAdminRole,
    tieneRole("ADMIN_ROLE", "VENTAS_ROLE"),
    check("id", "No es un mongo ID").isMongoId(),
    check("id").custom(existeUsuarioPorId),
    validarCampos,
  ],
  usuariosDelete
);

router.patch("/", usuariosPatch);

module.exports = router;
