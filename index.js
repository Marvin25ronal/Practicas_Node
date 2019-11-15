const express=require('express')
const app = express();
const mysql = require('mysql');

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


app.listen(3000,()=>{
  console.log('funciona');
});


