/* inicio npm 
npm init -y
npm i -D nodemon
npm i express
cambiar en package.json en apartado "scripts": { "start": "nodemon ./index.js" }
para iniciarlo es npm start
al subirlo a git para luego glitch cambio en el "scripts": { "start": "node ./index.js"},
*/

const fs = require("fs");

class Contenedor {
  constructor(filename) {
        this.filename = filename;
        fs.promises.writeFile(filename, "[]");
  }
  
  save = async (objecto) => {
        //Recibe un objeto, lo guarda en el archivo, devuelve el ID asignado al producto
        let data = await fs.promises.readFile(this.filename, "utf-8");
        let arr = JSON.parse(data);
    try {
            arr = [...arr, objecto];
            objecto.id = arr.length;
            await fs.promises.writeFile(this.filename, JSON.stringify(arr, null, 2));
            console.log(`Producto creado con el ID: ${objecto.id}`) 
            return objecto.id;
        } catch (err) {
            console.log(`No se ha podido guardar el objeto: ${err}`);
    }
  };
  getAll = async () => {
      //Devuelve un array con los objetos presentes en el archivo
        let data = await fs.promises.readFile(this.filename, "utf-8");
        let arr = JSON.parse(data);
        console.log(arr, "arr");
        return arr;
  };
}

//genero el archivo contendor
const file = new Contenedor("./productos.txt");

//obj que quiero guardar en archivo
const saveFunction = async () => {
    await file.save({
          title: "HILUX",
          price: "10000",
          thumbnail: "https://cdn.motor1.com/images/mgl/vkekA/s1/toyota-hilux-2021.jpg",
  });

    await file.save({
        title: "RANGER",
        price: "20000",
        thumbnail: "https://acroadtrip.blob.core.windows.net/catalogo-imagenes/s/RT_V_57e26e28b95a4620ae3b3dec50fb5a22.jpg",
  });

    await file.save({
        title: "F100",
        price: "30000",
        thumbnail: "https://i0.wp.com/www.motorwebargentina.com/wp-content/uploads/2021/11/Ford-F-100-Eluminator-7.jpg?fit=1024%2C647&ssl=1",
  });

    await file.save({
        title: "BRONCO",
        price: "40000",
        thumbnail: "https://acroadtrip.blob.core.windows.net/catalogo-imagenes/m/RT_V_5094a44b425b4953a52505a7018e410d.jpg",
  });

//   await file.getById(2);

//   await file.getAll();

//   await file.deleteById(2);

//   await file.deleteAll();
};

saveFunction();


// iniciar servidor express:
const express = require('express')
const app = express()
const puerto = 8080
//configuracion
app.use(express.json())
app.use(express.urlencoded({ extended: true }))

//codigo
app.get('/', (req,res)=>{
    res.send("Desafío de la clase 6 - SERVIDORES WEB")
})

//get /productos me devuelve array de todos los productos disponibles
app.get('/productos', async (req,res)=>{
    let productos = await file.getAll()
    res.send(productos)
    // let productosNombres = productos.map(({title}) => title)
    // res.json(`Los vehículos disponibles son: ${productosNombres.join(', ')}`)
});

//get /productoRanom me devuelve un producto al azar entre todo lo disponible
app.get('/productoRandom', async (req,res)=>{
    let productos = await file.getAll()
    let random = Math.floor(Math.random() * (productos.length))
    // console.log(random, productos.length)
    res.send(`  
                <a href='http://localhost:8080'>
                    <button type="submit">Volver al inicio</button>
                </a>
                <button onClick="window.location.reload()">Elegir producto random</button>
                <h1>Producto: ${productos[random].title}</h1>
                <h2>Precio: $${productos[random].price}</h2>
                <img src="${productos[random].thumbnail}" style="max-width:600px; max-height:600px; border:4px solid" alt="Producto"/>
            `);
});

app.listen(puerto, err =>{
    if(err){
        console.log(`Hubo error en el servidor ${err}`)
    } else {
        console.log(`servidor escucha a puerto: ${puerto}`)
    }
})