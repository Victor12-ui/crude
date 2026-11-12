
const express = require("express");
const mongoose = require("mongoose");
const Tarea = require("../models/Tarea");

const router = express.Router();

// Validar el identificador de MongoDB
function validarId(req, res, next) {
  if (!mongoose.isValidObjectId(req.params.id)) {
    return res.status(400).json({
      mensaje: "El ID proporcionado no es válido"
    });
  }

  next();
}

// GET: Obtener todas las tareas
router.get("/", async (req, res) => {
  try {
    const tareas = await Tarea.find().sort({ fechaCreacion: -1 });

    res.status(200).json({
      mensaje: "Lista de tareas",
      total: tareas.length,
      tareas
    });
  } catch (error) {
    res.status(500).json({
      mensaje: "Error al consultar las tareas",
      error: error.message
    });
  }
});

// GET: Obtener una tarea por ID
router.get("/:id", validarId, async (req, res) => {
  try {
    const tarea = await Tarea.findById(req.params.id);

    if (!tarea) {
      return res.status(404).json({
        mensaje: "Tarea no encontrada"
      });
    }

    res.status(200).json(tarea);
  } catch (error) {
    res.status(500).json({
      mensaje: "Error al consultar la tarea",
      error: error.message
    });
  }
});

// POST: Crear una nueva tarea
router.post("/", async (req, res) => {
  try {
    const { titulo, descripcion, estado } = req.body;

    if (!titulo || !titulo.trim()) {
      return res.status(400).json({
        mensaje: "El título es obligatorio"
      });
    }

    const nuevaTarea = new Tarea({
      titulo,
      descripcion,
      estado
    });

    const tareaGuardada = await nuevaTarea.save();

    res.status(201).json({
      mensaje: "Tarea creada correctamente",
      tarea: tareaGuardada
    });
  } catch (error) {
    if (error.name === "ValidationError") {
      return res.status(400).json({
        mensaje: "Datos de la tarea no válidos",
        error: error.message
      });
    }

    res.status(500).json({
      mensaje: "Error al crear la tarea",
      error: error.message
    });
  }
});

// PUT: Actualizar una tarea
router.put("/:id", validarId, async (req, res) => {
  try {
    const { titulo, descripcion, estado } = req.body;

    const tareaActualizada = await Tarea.findByIdAndUpdate(
      req.params.id,
      {
        titulo,
        descripcion,
        estado
      },
      {
        new: true,
        runValidators: true
      }
    );

    if (!tareaActualizada) {
      return res.status(404).json({
        mensaje: "Tarea no encontrada"
      });
    }

    res.status(200).json({
      mensaje: "Tarea actualizada correctamente",
      tarea: tareaActualizada
    });
  } catch (error) {
    if (error.name === "ValidationError") {
      return res.status(400).json({
        mensaje: "Datos de actualización no válidos",
        error: error.message
      });
    }

    res.status(500).json({
      mensaje: "Error al actualizar la tarea",
      error: error.message
    });
  }
});

// DELETE: Eliminar una tarea
router.delete("/:id", validarId, async (req, res) => {
  try {
    const tareaEliminada = await Tarea.findByIdAndDelete(req.params.id);

    if (!tareaEliminada) {
      return res.status(404).json({
        mensaje: "Tarea no encontrada"
      });
    }

    res.status(200).json({
      mensaje: "Tarea eliminada correctamente",
      tarea: tareaEliminada
    });
  } catch (error) {
    res.status(500).json({
      mensaje: "Error al eliminar la tarea",
      error: error.message
    });
  }
});

module.exports = router;
