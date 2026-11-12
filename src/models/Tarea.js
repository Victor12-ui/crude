
const mongoose = require("mongoose");

const tareaSchema = new mongoose.Schema(
  {
    titulo: {
      type: String,
      required: [true, "El título es obligatorio"],
      trim: true,
      minlength: 3,
      maxlength: 100
    },

    descripcion: {
      type: String,
      trim: true,
      default: ""
    },

    estado: {
      type: String,
      enum: ["pendiente", "en_progreso", "completada"],
      default: "pendiente"
    }
  },
  {
    timestamps: {
      createdAt: "fechaCreacion",
      updatedAt: "fechaActualizacion"
    }
  }
);

module.exports = mongoose.model("Tarea", tareaSchema);
