const app = require('./app')

app.listen(app.get('port'), () => {
    console.log(`App funcionando en el puerto ${app.get('port')} el día ${(new Date()).getFullYear()}-${((new Date()).getMonth()+1).toString().padStart(2,'0')}-${(new Date()).getDate().toString().padStart(2,'0')} a las ${(new Date()).getHours().toString().padStart(2,'0')}:${(new Date()).getMinutes().toString().padStart(2,'0')}:${(new Date()).getSeconds().toString().padStart(2,'0')}.`)
})