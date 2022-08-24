const { request, response } = require("express");
const Score = require("./score.model");

const getScore = async (req = request, res = response) => {
  const { limite = 5, desde = 0 } = req.query;
  const query = {};

  const [total, points] = await Promise.all([
    Score.countDocuments(query),
    Score.find(query).skip(Number(desde)).limit(Number(limite))
    .populate("user",["_id","nombre","imagen"]),
  ]);

  res.json({
    total,
    points,
  });
};

const getScoreById = async (req = request, res = response) => {
  const { id } = req.params;
  try {
    const points = await Score.find({ user: id })
    .populate("user",["_id","nombre","imagen"]);

    if (!points) {
      return res.status(404).json({
        msg: "No hay puntos para este usuario",
      });
    }

    res.status(200).json({
      points,
    });
  } catch (error) {
    console.log(error);
    res.status(500).json({
      msg: "Error al obtener los puntos",
    });
  }
};

const postScore = async (req, res = response) => {
    const { user, score } = req.body;
    const pointsNew = new Score({ user, score });
    try {
        await pointsNew.save();
        
        res.status(201).json({
            msg: "Puntos guardados",
            pointsNew,
        });

    } catch (error) {
        res.status(500).json({
            msg: "Error al guardar los puntos",
        });
    }
};

const putScore = async (req, res = response) => {
    const { id } = req.params;
    const { _id, ...resto } = req.body;//eslint-disable-line
    try {
        const points = await Score.findByIdAndUpdate(id, resto);
        res.status(200).json({
            msg: "Puntos actualizados",
            points,
        });
    } catch (error) {
        res.status(500).json({
            msg: "Error al actualizar los puntos",
        });
    }
};

const deleteScore = async (req, res = response) => {
    const { id } = req.params;
    try {
        const points = await Score.findByIdAndDelete(id);
        res.status(200).json({
            msg: "Puntos eliminados",
            points,
        });
    } catch (error) {
        res.status(500).json({
            msg: "Error al eliminar los puntos",
        });
    }
};

module.exports = {
  getScore,
  getScoreById,
  postScore,
  putScore,
  deleteScore
};
