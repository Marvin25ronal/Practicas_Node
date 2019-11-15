const express=require('express')
const app = express();
const mysql = require('mysql');
const bodyParser = require('body-parser')
app.use(bodyParser.urlencoded({ extended: false }))
app.use(bodyParser.json())

var connection;
function connect() {
  connection = mysql.createConnection({
    host     : 'database-1.copayjq3jxtu.us-east-2.rds.amazonaws.com',
    user     : 'admin',
    password : '12345678',
    database : 'bd_tienda_practicas',
  });
  console.log("conectado a la BD")
}

app.get('/bd', (req,res)=>{
    console.log("GET init");
    connect();
    connection.query("SELECT * FROM producto", function (err, result, fields) {
      if (err) {
        console.log("Error en el select", err);
      }
      res.send(result)
    });
    console.log("Conectado siuuu");
    connection.end();
});

app.get('/factura', (req,res)=>{
    console.log("GET init");
    connect();
    connection.query("SELECT * FROM factura", function (err, result, fields) {
      if (err) {
        console.log("Error en el select", err);
      }
      res.send(result)
    });
    console.log("Conectado siuuu");
    connection.end();
});

app.get('/detalle_factura', (req,res)=>{
    console.log("GET init");
    connect();
    connection.query("SELECT * FROM detalle_factura", function (err, result, fields) {
      if (err) {
        console.log("Error en el select", err);
      }
      res.send(result)
    });
    console.log("Conectado siuuu");
    connection.end();
});

app.post('/checkout', function (req, res) {	
	var insertar = "INSERT INTO factura (nombre,correo,direccion,nombre_en_la_tarjeta,numero_de_tarjeta,expiracion,cvv) VALUES ('"+req.body.nombre+" "+req.body.apellidos+"','"+req.body.correo+"','"+req.body.direccion+"','"+req.body.nombre_en_la_tarjeta+"'," +req.body.numero_de_tarjeta+",'"+"1-"+req.body.expiracion+"',"+req.body.cvv+")";
	connect();
	connection.query(insertar, function (err, result, fields) {
      if (err) {
        console.log("Error en la inserción de la factura", err);
      }
    });
	connection.end();
	var id_factura = -1;
	connect();
	connection.query("Select id from factura order by id desc", function (err, result, fields) {
      if (err) {
        console.log("Error en la busqueda de id factura", err);
      }
	  id_factura = result[0].id;
	  agregar_productos(req.body.detalle_factura, id_factura);
	  res.send(""+id_factura);
    });
});

function agregar_productos(detalle_factura, id_factura){
	var detalle = detalle_factura.split(","); 
	var productos = [];
	var ids = [];
	var contador = 0;
	detalle.forEach(element => { 
	if(typeof productos[element+"-"] === 'undefined'){
		productos[element+"-"] = 1;
		ids[contador] = element;
		contador++;
	} else {
		productos[element+"-"] += 1;
	}
	}); 
	contador = 0;
	ids.forEach(element => { 
	console.log(element + "-" + productos[element+"-"]);
	connect();
	connection.query("Insert into detalle_factura values ("+id_factura+","+element+","+productos[element+"-"]+")", function (err, result, fields) {
      if (err) {
        console.log("Error en la inserción del detalle_factura", err);
      }
    });
	contador++;
	}); 
}

app.listen(3000,()=>{
  console.log('funciona');
});


