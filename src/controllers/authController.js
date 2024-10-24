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

        const result = await request.query(query);
        res.status(201).send('Usuario registrado correctamente');

        // const datosRegister = result.recordset[0]
        // console.log('datos1: ', datosRegister)
        // res.render("index", {
        //     datosRegister: datosRegister
        // })
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
        console.log('User: ' + user);
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

module.exports = {
    seeUsers: seeUsers,
    register: register,
    login: login
}