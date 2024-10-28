const express = require('express');
const app = express();
const dbconnect = require('./config/db.js');
const productos_model = require ('./models/productos_model.js')

app.use(express.json());//Middleware para interpretar JSON
const router = express.Router();
app.use(router);

//Ruta de prueba
router.get('/hola',(req,res)=>{
    res.send("Hello world")
})

// Endpoint para actualizar el stock de múltiples productos
app.put('/productos/actualizar-stock', async (req, res) => {
    try {
        const productosActualizados = req.body.productos; // Array de productos con id y nueva cantidad

        const operaciones = productosActualizados.map(prod =>
            productos_model.findByIdAndUpdate(
                prod.id,
                { stock: prod.stock },
                { new: true } // Para que retorne el documento actualizado
            )
        );

        const resultados = await Promise.all(operaciones);
        res.status(200).json({ mensaje: 'Stock actualizado', productos: resultados });
    } catch (error) {
        res.status(500).json({ mensaje: 'Error al actualizar el stock', error });
    }
});


// Endpoint para obtener productos por categoría
app.get('/productos/categoria/:categoria', async (req, res) => {
    try {
        const categoria = req.params.categoria;
        const productos = await productos_model.find({ categoria });
        res.status(200).json(productos);
    } catch (error) {
        res.status(500).json({ mensaje: 'Error al obtener productos por categoría', error });
    }
});


// Endpoint para obtener productos con stock inferior a una cantidad especificada
app.get('/productos/bajo-stock/:cantidad', async (req, res) => {
    try {
        const cantidad = parseInt(req.params.cantidad);
        const productos = await Producto.find({ stock: { $lt: cantidad } });
        res.status(200).json(productos);
    } catch (error) {
        res.status(500).json({ mensaje: 'Error al obtener productos con bajo stock', error });
    }
});

//Conectar a la base de datos
dbconnect().then(()=>{
    app.listen(3000,()=>{
        console.log('El servidor esta corriendo en el puerto 3000');
    });
}).catch(err=>{
    console.error('No se pudo iniciar el servidor debido a un error en la base de datos')
});


module.exports = router;