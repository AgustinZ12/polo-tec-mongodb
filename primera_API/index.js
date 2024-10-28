const express = require('express'); //Importar express

const app = express();//Usar express y lo asignamos a una constante app

const port = 3000;

app.get('/',(req,res)=>{
    res.send('Bienvenido a mi biblioteca virtual');
});

app.get('/hello',(req,res)=>{
    res.send('Hello world');
});

//Datos
const libros = [
    {id:1,titulo:"Harry Potter y la piedra filosofal",autor:"J.K Rowling"},
    {id:2,titulo:"El señor de los anillos",autor:"J.R.R Tolkien"},
    {id:3,titulo:"El bazar de los malos sueños",autor:"Stephen King"}
]

//Get all
app.get('/libros',(req,res)=>{
    res.json(libros);
})
//Get One
app.get('/libros/:id',(req,res)=>{
    //Accedo al parametro 'id' de la url; los ":" me indican que el parametro va a cambiar
    const libro = libros.find(li => li.id  === parseInt(req.params.id));
    // El "li" hace referencia al elemento del array libros; Y usamos el parseInt para transformar a entero el elemento (String) que nos devuelve el req
    if (libro){
        res.json(libro);
    }else{
        res.status(404).send('Libro no encontrado');
    }
})

//Esto es para recibir en el body un json
app.use(express.json())

//POST:Crear un libro
app.post('/libros',(req,res)=>{

    const nuevoLibro = {id:libros.length+1,...req.body }
    libros.push(nuevoLibro)
    res.status(201).json(nuevoLibro);
})

//DELETE
app.delete('/libros/:id',(req,res)=>{
    const idLibro = parseInt(req.params.id);//Convertir el parametro id a numero
    const indiceLibro = libros.findIndex(l=> l.id === idLibro); //Buscar el indice del libro en el array
    
    //Si el libro existe,eliminarlo
    if(indiceLibro !== -1){
        const libroEliminado = libros.splice(indiceLibro,1);//Eliminar el libro del array
        res.json({mensaje:'libro eliminado',libro:libroEliminado[0]})
    }else {
        res.status(404).json({mensaje:'libro no encontrado'})//si no se encuentra el libro,devolver un error 404
    }
})


app.listen(port,()=>{
    console.log(`El servidor esta corriendo en el puerto:${port}`)
})










