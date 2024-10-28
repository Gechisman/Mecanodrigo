const express = require('express');
const { register, login, seeUsers, logout, saveResult, leaderboard, leaderboardScore } = require('../controllers/authController');

const router = express.Router();

router.post('/seeUsers', seeUsers);
router.post('/register', register);
router.post('/login', login);
router.post('/save-result', saveResult);

router.get('/logout', logout)
router.get('/leaderboard', leaderboardScore)

router.get('/', (req, res) => {
    const username = req.session.username || ''; // Si no hay usuario, pasar una cadena vacía
    res.render('index', { username });
});

// router.get('/leaderboard', (req, res) => {
//     const username = req.session.username || ''; // Si no hay usuario, pasar una cadena vacía
//     res.render('leaderboard', { username }); // Asegúrate de pasar username a la vista
// });


module.exports = router;
