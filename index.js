const express=require('express')
const app = express();
const mysql = require('mysql');

app.listen(3000,()=>{
  console.log('funciona');
});

var connection;
function connect() {
  connection = mysql.createConnection({
    host     : 'database-1.copayjq3jxtu.us-east-2.rds.amazonaws.com',
    user     : 'admin',
    password : '12345678',
    database : 'bd_tienda_practicas',
    port: 3306
  });
  console.log("conectado")

  connection.connect(function (err) {
    if (err) {
      throw err;
    }else{
      console.log("connect siuuuu");
    }
  });
}
