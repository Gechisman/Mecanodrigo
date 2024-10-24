const express = require('express');
require('dotenv').config(); // Cargar variables de entorno
const path = require('path'); // Importar el módulo path

const app = express();

const config = require('./config');
app.set('port', config.port)
app.set('database', config.database)
app.set('config', config);

// Middleware
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Rutas
app.use('/auth', require('./routes/authRoutes'));

// Servir archivos estáticos desde la carpeta "public"
app.use(express.static(path.join(__dirname, 'public')));
app.set('view engine', 'ejs'); // o el motor de vistas que estés utilizando

// Establece la carpeta donde se almacenarán las vistas
app.set('views', path.join(__dirname, 'public', 'views'));

// Ruta para la raíz ("/")
app.use(require('./routes/authRoutes'));


module.exports = app