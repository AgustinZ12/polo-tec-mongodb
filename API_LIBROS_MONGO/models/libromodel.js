const mongoose = require('mongoose');

const libroSchema = new mongoose.Schema(
    {
        titulo:{
            type:String,
            required:true,
        },
        autor:{
            type:String,
            required:true,
        },
        categoria:{
            type:String,
            required:true,
        },
        estado:{
            type:String,
            enum:['Disponible','Prestado','Vencido'],
            default:'Disponible',
        },
        Fecha_Prestamo:{
            type:Date,
        },
        Fecha_devolucion:{
            type:Date,
        }
    },//Configuraciones adicionales
    {
        timestamps:true,//fecha cracion y modificacion como columna
    }
);

const ModelLibro = mongoose.model("libros",libroSchema);
module.exports = ModelLibro;