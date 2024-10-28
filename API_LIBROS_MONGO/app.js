const express = require('express');
const app = express();
const dbconnect = require('./config/db.js');
const ModelLibro = require ('./models/libromodel.js')

app.use(express.json());//Middleware para interpretar JSON
const router = express.Router();
app.use(router);

//Ruta de prueba
router.get('/hola',(req,res)=>{
    res.send("Hello world")
})

//Obtener todos los libros(GET)
router.get('/libros',async(req,res)=>{
    try{
        const libros = await ModelLibro.find();//obtener todos los libros
        res.status(200).send(libros);
    } catch (error){
        res.status(500).send({mensaje:'Error al obtener los libros:',error});
    }
});

//Obtener  un libro por ID
router.get('/libros/:id',async(req,res)=>{
    try{
        const libro = await ModelLibro.findById(req.params.id); //Me comunico con la base de datos, y pongo el await, porque la conexion no es inmediata
        if (!libro) {
            return res.status(404).send({mensaje:'Libro no encontrado'});
        }
        res.status(200).send(libro);
    } catch(error) {
        res.status(500).send({mensaje:'Error al obetner el libro',error});
    }
});

//Crear un nuevo libro(POST)
router.post('/libros',async (req,res)=>{
    const body = req.body; //Le estoy diciendo que obtenga de la peticion, el body
    try {
        const nuevoLibro = await ModelLibro.create(body)//Insertar en la base de datos
        res.status(201).send(nuevoLibro);// 201 indica que se ha creado un recurso
    } catch (error){
        res.status(400).send(error);//enviar el error si hay un fallo de validacion
    }
})

//Actualizar un libro por id
router.put('/libros/:id/',async(req,res)=>{
    try{
        const libroActualizado = await ModelLibro.findByIdAndUpdate(req.params.id,req.body,{new:true,runValidators:true});
        if(!libroActualizado){
            return res.status(404).send({mensaje:'Libro no encontrado'});
        }
        res.status(200).send(libroActualizado);
    } catch (error){
        res.status(400).send({mensaje:'Error al actualizar el libro',error});
    }
});

//Eliminar un libro por id
router.delete('/libros/:id',async(req,res)=>{
    try{
        const libroEliminado = await ModelLibro.findByIdAndDelete(req.params.id);
        if(!libroEliminado){
            return res.status(404).send({mensaje:'Libro no encontrado'});
        }
        res.status(200).send({mensaje:'Libro eliminado correctamente'});
    }catch(error){
        res.status(500).send({mensaje:'Error al eliminar el libro',error});
    }
});

//Obtener libros segun filtro de busqueda(autor,categoria,estado)
router.get('/libros/negocio/busqueda',async (req,res)=>{
    const{autor,categoria,estado} = req.query; //Le estoy diciendo que obtenga de la peticion, la query
    try{
        const query = {} //Creamos un objeto vacio para almacenar los filtros
        if (autor) query.autor = autor;//Si el autor esta en la query params, lo va a agregar al filtro
        if (categoria) query.categoria = categoria;//Si el autor esta en la query params, lo va a agregar al filtro
        if (estado) query.estado = estado;//Si el autor esta en la query params, lo va a agregar al filtro
        const libros = await ModelLibro.find(query);
        if(!libros.length){
            return res.status(404).send({mensaje:'no se encontraron los libros con los filtros proporcionados'});
        }
        res.status(200).send(libros);

    }catch(error){
        res.status(500).send({mensaje:'No pudo encontrarse el libro',error});
    };
})

//Actualizar el estado de un libro de prestado,y agregar la fecha de prestamo y devolucion
router.put('/libros/:id/prestar',async(req,res)=>{
    try{
        //Encontrar el libro
        const libro = await ModelLibro.findById(req.params.id);
        if(!libro){
            return res.status(404).send({mensaje:'Libro no encontrado'});
        }
        //Cambiar el estado del libro
        libro.estado = "Prestado";
        libro.Fecha_Prestamo = new Date();//Fecha de prestamo = fecha actual
        //Definir la fecha de devolucion,(por ejemplo, 14 dias despues de la fecha de prestamo)
        const Fecha_devolucion = new Date(); //Obtenemos la fecha actual
        Fecha_devolucion.setDate(Fecha_devolucion.getDate() + 14); //Le sumamos a la fecha actual 14 dias
        libro.Fecha_devolucion = Fecha_devolucion; //Asignamos la fecha de devolucion
        //guardar el libro
        await libro.save();
        res.status(200).send(libro);
    } catch (error){
        res.status(400).send({mensaje:'Error al actualizar el estado del libro',error});
    }
});

//Endpoint para devolver un libro
router.put('/libros/:id/devolver',async(req,res)=>{
    try{
        //Encontrar el libro
        const libro = await ModelLibro.findById(req.params.id);
        if(!libro){
            return res.status(404).send({mensaje:'Libro no encontrado'});
        }
        //Cambiar el estado del libro
        libro.estado = "Disponible";
        libro.Fecha_Prestamo = null;
        libro.Fecha_devolucion = null; 
        //guardar los cambios
        await libro.save();
        res.status(200).send(libro);
    } catch (error){
        res.status(400).send({mensaje:'Error al devolver el libro',error});
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