const { Router } = require("express");
const { check, body } = require("express-validator");
const { validarJWT, validarCampos } = require("../middlewares");
const {
  getScore,
  getScoreById,
  postScore,
  putScore,
  deleteScore,
} = require("./score.controller");

const router = Router();

router.get("/", getScore);

router.get(
  "/:id",
  [check("id", "No es un mongo ID").isMongoId(), validarJWT, validarCampos],
  getScoreById
);

router.post(
  "/",
  [
    validarJWT,
    body("user", "El usuario es obligatorio").not().isEmpty(),
    body("score", "Los puntos son obligatorios").not().isEmpty(),
    validarCampos,
  ],
  postScore
);

router.put(
  "/:id",
  [
    validarJWT,
    body("user", "El usuario es obligatorio").not().isEmpty(),
    body("score", "Los puntos son obligatorios").not().isEmpty(),
    check("id", "No es un mongo ID").isMongoId(),
    validarCampos,
  ],
  putScore
);

router.delete(
  "/:id",
  [validarJWT, check("id", "No es un mongo ID").isMongoId(), validarCampos],
  deleteScore
);

module.exports = router;
