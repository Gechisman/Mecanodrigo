const express = require('express');
const { register, login, seeUsers, logout, saveResult } = require('../controllers/authController');

const router = express.Router();

router.post('/seeUsers', seeUsers);
router.post('/register', register);
router.post('/login', login);
router.post('/save-result', saveResult);

router.get('/', (req, res) => {
    const username = req.session.username || ''; // Si no hay usuario, pasar una cadena vacía
    res.render('index', { username });
});

// Ruta para cerrar sesión
router.get('/logout', logout)

module.exports = router;
