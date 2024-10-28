const mongoose = require('mongoose');

const productoSchema = new mongoose.Schema(
    {
        nombre:{
            type:String,
            required:true,
        },
        descripcion:{
            type:String,
        },
        precio:{
            type:Number,
            required:true,
        },
        cantidad:{
            type:Number,
            required:true,
        },
        categoria:{
            type:String,
        },
        stock:{
            type:Number,
            required:true
        },
        Fecha_ingreso:{
            type:Date,
            default: Date.now(),
        }
    },//Configuraciones adicionales
    {
        timestamps:true,//fecha cracion y modificacion como columna
    }
);

const productos_model = mongoose.model("Producto",productoSchema);
module.exports = productos_model;