const { sql } = require('../config/db');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');

// Registrar un nuevo usuario
exports.register = async (req, res) => {
    const { username, email, password } = req.body;

    try {
        // Encriptar la contraseña
        const hashedPassword = await bcrypt.hash(password, 10);

        // Query para insertar el nuevo usuario
        const query = `
            INSERT INTO Users (username, email, password)
            VALUES (@username, @email, @password)
        `;

        const request = new sql.Request();
        request.input('username', sql.NVarChar, username);
        request.input('email', sql.NVarChar, email);
        request.input('password', sql.NVarChar, hashedPassword);

        await request.query(query);

        res.status(201).send('Usuario registrado correctamente');
    } catch (error) {
        console.error(error);
        res.status(500).send('Error en el registro');
    }
};

// Iniciar sesión de usuario
exports.login = async (req, res) => {
    const { username, password } = req.body;

    try {
        // Query para encontrar al usuario por su nombre de usuario o email
        const query = `
            SELECT * FROM Users WHERE username = @username OR email = @username
        `;

        const request = new sql.Request();
        request.input('username', sql.NVarChar, username);

        const result = await request.query(query);
        const user = result.recordset[0];

        if (!user) return res.status(404).send('Usuario no encontrado');

        // Comparar la contraseña
        const isPasswordValid = await bcrypt.compare(password, user.password);
        if (!isPasswordValid) return res.status(401).send('Contraseña incorrecta');

        // Generar token JWT
        const token = jwt.sign({ userId: user.id }, process.env.SECRET_KEY);
        res.status(200).json({ token });
    } catch (error) {
        console.error(error);
        res.status(500).send('Error en el inicio de sesión');
    }
};
