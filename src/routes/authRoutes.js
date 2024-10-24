const express = require('express');
const { register, login, seeUsers } = require('../controllers/authController');

const router = express.Router();

router.post('/seeUsers', seeUsers);
router.post('/register', register);
router.post('/login', login);

router.get('/', (req, res) => {
    res.render('index'); // O la vista que quieras mostrar
});

module.exports = router;
