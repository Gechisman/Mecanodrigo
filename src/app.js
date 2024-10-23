const express = require('express');
const { connectDB } = require('./config/db');
require('dotenv').config(); // Cargar variables de entorno
const path = require('path'); // Importar el módulo path

const app = express();
const PORT = process.env.PORT || 3000;

// Nombre de la base de datos que quieres conectar
const databaseName = 'MECANODRIGO';

// Conectar a la base de datos SQL Server
connectDB(databaseName);

// Middleware
app.use(express.json());

// Rutas
app.use('/auth', require('./routes/authRoutes'));

// Servir archivos estáticos desde la carpeta "public"
app.use(express.static(path.join(__dirname, 'public')));

// Establece la carpeta donde se almacenarán las vistas
app.set('views', path.join(__dirname, 'views'));

// Ruta para la raíz ("/")
app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'public', 'index.html'));
});

// Iniciar el servidor
app.listen(PORT, () => {
    console.log(`Servidor corriendo en http://localhost:${PORT}`);
});
