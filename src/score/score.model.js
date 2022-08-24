const { Schema, model } = require("mongoose");


const ScoreSchema = new Schema({
    user: {
        type: Schema.Types.ObjectId,
        ref: "Usuario",
        required: true,
    },
    score: {
        type: Number,
        required: true,
    },
    date: {
        type: Date,
        default: Date.now,
    },
});

ScoreSchema.methods.toJSON = function () {
    const { __v, _id, ...points } = this.toObject(); //eslint-disable-line
    points.uid = _id;
    return points;
};

const Score = model("Points", ScoreSchema);
module.exports = Score;