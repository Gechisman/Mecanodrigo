// Función para obtener la configuración de la conexión a SQL Server
const get_config = (database) => {
    return {
        user: 'rodrigoDev',  // Tu usuario de SQL Server
        password: 'C4poaltower',    // Tu contraseña de SQL Server
        server: 'PC-RODRIGO', // El nombre de tu servidor SQL Server
        database: database,
        pool: {
            max: 10,
            min: 0,
            idleTimeoutMillis: 30000
        },  // Nombre de la base de datos que se pasa dinámicamente
        options: {
            encrypt: false,  // Establece en false para instancias locales
            trustServerCertificate: true  // Necesario para conexiones locales a SQL Server
        }
    }
}

module.exports.get_config = get_config;
