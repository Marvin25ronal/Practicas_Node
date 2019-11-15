const express = require('express')
const app = express();
const mysql = require('mysql');
const bodyParser = require('body-parser');
const cors = require('cors');
app.use(bodyParser.urlencoded({ extended: false }))
app.use(bodyParser.json())
app.use(cors());

var connection;
function connect() {
  connection = mysql.createConnection({
    host: 'database-1.copayjq3jxtu.us-east-2.rds.amazonaws.com',
    user: 'admin',
    password: '12345678',
    database: 'bd_tienda_practicas',
  });
  console.log("conectado a la BD")
}

app.get('/bd', (req, res) => {
  console.log("GET init");
  connect();
  connection.query("SELECT id,nombre,descripcion,cantidad_disponible,CONCAT('assets/',imagen) as imagen,precio FROM producto", function (err, result, fields) {
    if (err) {
      console.log("Error en el select", err);
    }
    return res.json({
      message: result
    }

    );

  });
  console.log("Conectado siuuu");
  connection.end();
});




app.get('/factura', (req, res) => {
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



app.get('/factura2xd', (req, res) => {
  console.log("GET init");

  var ax = [];
  var cantidad = 0;
  var correo = "";
  var html = "";
var nfactura = ""; 
  var total = 0;

  connect();
  connection.query(" select factura.id, producto.nombre as \'nombre_producto\', producto.precio ,  detalle_factura.cantidad   ,correo , factura.nombre as \'nombre_cliente\' , direccion  from detalle_factura , factura , producto where detalle_factura.id_factura = factura.id and detalle_factura.id_producto = producto.id  and id_factura = (select id from factura order by id desc limit 1)  ; ", function (err, result, fields) {
    if (err) {
      console.log("Error en el select", err);
    }
    cantidad = result.length;

    ax = result[0];
    correo = ax["correo"];
    nfactura = ax["id"];
    html = "<h2>Gracias por elegir Cabezonix, su pedido llegara en unos dias. </h2><table border=\"1\">" +
      "<tr>" +
      "	<td colspan=\"2\">Para</td>" +
      "	<td colspan=\"2\">" + ax["nombre_cliente"] + "</td>" +
      "</tr>                " +
      "<tr>                 " +
      "	<td>N</td>   " +
      "	<td>Nombre</td>   " +
      "	<td>Precio</td>   " +
      "	<td>Cantidad</td> " +
      "</tr>                ";
    for (var a = 0; a < cantidad; a++) {
      ax = result[a];
      


      total += ax["precio"] * ax["cantidad"];

      html += "<tr>                 " +
        "	<td>" + (a + 1) + "</td>   " +
        "	<td>" + ax["nombre_producto"] + "</td>   " +
        "	<td>" + ax["precio"] + "</td>   " +
        "	<td>" + ax["cantidad"] + "</td> " +
        "</tr>                ";

    }


    html += "	<tr>                           " +
      "		<td colspan=\"2\">Total</td> " +
      "		<td colspan=\"2\">Q." + total + "</td> " +
      "	                               " +
      "	</tr>                          " +
      "</table>                       <h4>Su numero de factura es "+ nfactura +", el numero de factura le servira para rastrear como va su pedido.</h4>   ";
    //    res.send(result);
    res.send(correo + "     " + "    " + html);

   sendEmail(correo, html);
  });



  console.log("Conectado siuuu");
  connection.end();
});






app.post('/email', (req, res) => {


  console.log("GET init");

  var ax = [];
  var cantidad = 0;
  var correo = "";
  var html = "";
var nfactura = ""; 
  var total = 0;

  connect();
  connection.query(" select factura.id, producto.nombre as \'nombre_producto\', producto.precio ,  detalle_factura.cantidad   ,correo , factura.nombre as \'nombre_cliente\' , direccion  from detalle_factura , factura , producto where detalle_factura.id_factura = factura.id and detalle_factura.id_producto = producto.id  and id_factura = (select id from factura order by id desc limit 1)  ; ", function (err, result, fields) {
    if (err) {
      console.log("Error en el select", err);
    }
    cantidad = result.length;

    ax = result[0];
    correo = ax["correo"];
    nfactura = ax["id"];
    html = "<h2>Gracias por elegir Cabezonix, su pedido llegara en unos dias. </h2><table border=\"1\">" +
      "<tr>" +
      "	<td colspan=\"2\">Para</td>" +
      "	<td colspan=\"2\">" + ax["nombre_cliente"] + "</td>" +
      "</tr>                " +
      "<tr>                 " +
      "	<td>N</td>   " +
      "	<td>Nombre</td>   " +
      "	<td>Precio</td>   " +
      "	<td>Cantidad</td> " +
      "</tr>                ";
    for (var a = 0; a < cantidad; a++) {
      ax = result[a];
      


      total += ax["precio"] * ax["cantidad"];

      html += "<tr>                 " +
        "	<td>" + (a + 1) + "</td>   " +
        "	<td>" + ax["nombre_producto"] + "</td>   " +
        "	<td>" + ax["precio"] + "</td>   " +
        "	<td>" + ax["cantidad"] + "</td> " +
        "</tr>                ";

    }


    html += "	<tr>                           " +
      "		<td colspan=\"2\">Total</td> " +
      "		<td colspan=\"2\">Q." + total + "</td> " +
      "	                               " +
      "	</tr>                          " +
      "</table>                       <h4>Su numero de factura es "+ nfactura +", el numero de factura le servira para rastrear como va su pedido.</h4>   ";
    //    res.send(result);
    res.send(correo + "     " + "    " + html);

   sendEmail(correo, html);
  });



  console.log("Conectado siuuu");
  connection.end();

});




app.get('/detalle_factura', (req, res) => {
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
  var insertar = "INSERT INTO factura (nombre,correo,direccion,nombre_en_la_tarjeta,numero_de_tarjeta,expiracion,cvv) VALUES ('" + req.body.nombre + " " + req.body.apellidos + "','" + req.body.correo + "','" + req.body.direccion + "','" + req.body.nombre_en_la_tarjeta + "'," + req.body.numero_de_tarjeta + ",'" + "1-" + req.body.expiracion + "'," + req.body.cvv + ")";
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
    res.send("" + id_factura);
  });
});

function agregar_productos(detalle_factura, id_factura) {
  var detalle = detalle_factura.split(",");
  var productos = [];
  var ids = [];
  var contador = 0;
  detalle.forEach(element => {
    if (typeof productos[element + "-"] === 'undefined') {
      productos[element + "-"] = 1;
      ids[contador] = element;
      contador++;
    } else {
      productos[element + "-"] += 1;
    }
  });
  contador = 0;
  ids.forEach(element => {
    console.log(element + "-" + productos[element + "-"]);
    connect();
    connection.query("Insert into detalle_factura values (" + id_factura + "," + element + "," + productos[element + "-"] + ")", function (err, result, fields) {
      if (err) {
        console.log("Error en la inserción del detalle_factura", err);
      }
    });
    contador++;
  });
}

app.listen(3000, () => {
  console.log('funciona');
});




const nodemailer = require('nodemailer');

function sendEmail(email, factura) {
  console.log('enviando mail');
  let transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
      user: 'cuenta.practicas.intermedias@gmail.com',
      pass: 'practicas123'
    }
  });

  let mailOptions = {
    from: 'Community USAC',
    to: `${email}`,
    subject: 'Gracias por la compra',
    //text: `La nota obtenida por ${name} fue de ${grade} puntos`


    html: `${factura}`
  };


  transporter.sendMail(mailOptions, function (err, info) {
    if (err)
      console.log(err)
    else
      console.log(info);
  });
}

    //En su correo electronico tendrian que desbloquer una funcion que no permite que terceros usen su servicio
    //hay que descargar un modulo de npm que se llama nodemailer para que esto funcione