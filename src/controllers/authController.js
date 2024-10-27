const database = require('../database/database');

const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const mssql = require('mssql');

const seeUsers = async (req, res) => {
    //Devuelve el puerto y la database (config.js)
        console.log('Config: ', req.app.get("config").database);  // Verificar los valores de configuración
    try {
        let pool = await mssql.connect(database.get_config(req.app.get("config").database));
        let query = `
            SELECT [id], [username], [email] 
            FROM ${req.app.get("config").database}.[dbo].[Users]`;
        
        const result = await pool.query(query);
        console.log('query: ' + query);

        const datos = result.recordset[0]
        console.log('datos1: ', datos)
        res.render("index", {
            datos: datos
        })
    } catch (error) {
        console.error(error);
    }
};

const register = async (req, res) => {  // Verificar los valores de configuración
    /*Es lo mismo que:
        const username = req.body.username */
    const { username, email, password, passwordConfirm } = req.body;

    if (password !== passwordConfirm) {
        return res.status(400).send('Las contraseñas no coinciden');
    }

    // Encriptar la contraseña
    const hashedPassword = await bcrypt.hash(password, 10);

    try {
        let pool = await mssql.connect(database.get_config(req.app.get("config").database));
        let query = `
            INSERT INTO ${req.app.get("config").database}.[dbo].[Users] (username, email, password)
            VALUES (@username, @Email, @hashedPassword)`;
        
        const request = pool.request();
        request.input('username', mssql.NVarChar, username);
        request.input('email', mssql.NVarChar, email);
        request.input('hashedPassword', mssql.NVarChar, hashedPassword);

        await request.query(query);

        req.session.username = username;
        req.session.userId = id;
        console.log('Usuario: ', req.session.username);
        console.log('Id: ', req.session.userId);
        res.redirect('/');
    } catch (error) {
        if (error.number === 2627) { // Código de error para violación de clave única
            return res.status(400).send('El usuario o correo electrónico ya está registrado');
        }
        console.error(error);
        res.status(500).send('Error en el registro');
    }  
};

// Iniciar sesión de usuario
const login = async (req, res) => {
    const { username, password } = req.body;

    try {
        let pool = await mssql.connect(database.get_config(req.app.get("config").database));
        // Query para encontrar al usuario por su nombre de usuario o email
        const query = `
            SELECT *
            FROM ${req.app.get("config").database}.[dbo].[Users]
            WHERE username = @username OR email = @username
        `;

        const request = pool.request();
        request.input('username', mssql.NVarChar, username);

        const result = await request.query(query);
        const user = result.recordset[0];

        if (!user) return res.status(404).send('Usuario no encontrado');

        // Comparar la contraseña
        const isPasswordValid = await bcrypt.compare(password, user.password);
        if (!isPasswordValid) return res.status(401).send('Contraseña incorrecta');

        req.session.username = user.username;
        req.session.userId = user.id;
        console.log('Usuario: ', req.session.username);
        console.log('Id: ', req.session.userId);
        res.redirect('/');
    } catch (error) {
        console.error(error);
        res.status(500).send('Error en el inicio de sesión');
    }
};

const logout = (req, res) => {
    try {
        req.session.destroy()
        res.redirect('/');
        console.log('Sesion cerrada correctamente');
    } catch (error) {
        res.redirect('/');
        console.log('Error: ', error);
    }
}

const saveResult = async (req, res) => {
    const { accuracy, wpm } = req.body; // Recibe la precisión y WPM desde el frontend
    const userId = req.session.userId; // Usa el ID del usuario desde la sesión
    
    try {
        // Asegurarte de que el usuario tiene sesión iniciada
        if (!userId) {
            return res.status(401).send('Usuario no autenticado');
        }

        let pool = await mssql.connect(database.get_config(req.app.get("config").database));
        
        // Insertar la puntuación en la tabla Results
        let query = `
            INSERT INTO ${req.app.get("config").database}.[dbo].[Results] (userId, accuracy, wpm, dateScore)
            VALUES (@userId, @accuracy, @wpm, FORMAT(SYSDATETIMEOFFSET(), 'yyyy-MM-dd HH:mm:ss'));
        `;

        const request = pool.request();
        request.input('userId', mssql.Int, userId);
        request.input('accuracy', mssql.Decimal(5, 2), accuracy);
        request.input('wpm', mssql.Decimal(5, 2), wpm);

        await request.query(query);
        
        res.status(200).send('Puntuación guardada correctamente');
    } catch (error) {
        console.error('Error al guardar la puntuación:', error);
        res.status(500).send('Error al guardar la puntuación');
    }
};


module.exports = {
    seeUsers: seeUsers,
    register: register,
    login: login,
    logout: logout,
    saveResult: saveResult
}