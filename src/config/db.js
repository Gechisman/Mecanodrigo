const sql = require('mssql');

// Función para obtener la configuración de la conexión a SQL Server
const get_config = (database) => {
    return {
        user: 'rodrigoDev',  // Tu usuario de SQL Server
        password: 'C4poaltower',    // Tu contraseña de SQL Server
        server: 'PC-RODRIGO', // El nombre de tu servidor SQL Server
        database: database,  // Nombre de la base de datos que se pasa dinámicamente
        options: {
            encrypt: false,  // Establece en false para instancias locales
            trustServerCertificate: true  // Necesario para conexiones locales a SQL Server
        }
    };
};

// Función para conectar a la base de datos
const connectDB = async (database) => {
    const config = get_config(database);  // Obtener la configuración para la base de datos
    try {
        await sql.connect(config);
        console.log(`Conectado a la base de datos ${database}`);
    } catch (error) {
        console.error('Error al conectar a SQL Server:', error);
        process.exit(1);  // Salir si hay error en la conexión
    }
};

module.exports = { get_config, connectDB };
