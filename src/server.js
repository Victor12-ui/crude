
require("dotenv").config();

const express = require("express");
const mongoose = require("mongoose");
const tareaRoutes = require("./routes/tareaRoutes");

const app = express();

const PORT = process.env.PORT || 4000;
const DATABASE_URL = process.env.DATABASE_URL;

// Middleware para recibir JSON
app.use(express.json());

// Ruta principal de comprobación
app.get("/", (req, res) => {
  res.status(200).json({
    mensaje: "API CRUD de tareas funcionando correctamente",
    estado: "En línea",
    documentacion: "/api/tareas"
  });
});

// Ruta de salud
app.get("/health", (req, res) => {
  res.status(200).json({
    aplicacion: "activa",
    baseDatos: mongoose.connection.readyState === 1
      ? "conectada"
      : "desconectada"
  });
});

// Rutas del CRUD
app.use("/api/tareas", tareaRoutes);

// Ruta para endpoints inexistentes
app.use((req, res) => {
  res.status(404).json({
    mensaje: "La ruta solicitada no existe"
  });
});

// Middleware general de errores
app.use((error, req, res, next) => {
  console.error(error);

  res.status(500).json({
    mensaje: "Error interno del servidor"
  });
});

// Conexión e inicio del servidor
async function iniciarServidor() {
  try {
    if (!DATABASE_URL) {
      throw new Error("No se ha configurado DATABASE_URL");
    }

    await mongoose.connect(DATABASE_URL);

    console.log("Conexión con MongoDB establecida correctamente");

    const server = app.listen(PORT, "0.0.0.0", () => {
      console.log(`Servidor ejecutándose en el puerto ${PORT}`);
    });

    // Cierre ordenado del servidor
    async function cerrarServidor() {
      console.log("Cerrando aplicación...");

      server.close(async () => {
        await mongoose.disconnect();
        console.log("Conexión con MongoDB cerrada");
        process.exit(0);
      });
    }

    process.on("SIGTERM", cerrarServidor);
    process.on("SIGINT", cerrarServidor);

  } catch (error) {
    console.error("Error al iniciar la aplicación:", error.message);
    process.exit(1);
  }
}

iniciarServidor();
