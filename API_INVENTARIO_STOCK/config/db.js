const mongoose = require('mongoose');

//Funcion para conectar a Mongo DB
const dbconnect = async () =>{
    try {
        await mongoose.connect("mongodb://localhost:27017/dbGestorBiblioteca");
        console.log('Conexion a la base de datos establecida')
    } catch (err){
        console.error('Error en la conexion a la base de datos:',err);
        process.exit(1);//Detenemos el proceso si hay un error en la conexion
    }
}

module.exports = dbconnect;