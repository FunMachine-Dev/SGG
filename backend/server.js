const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
const mysql = require('mysql2');

// Crear una instancia de Express
const app = express();
const port = 5000; // Puerto donde correrá el servidor

// Middleware
app.use(cors()); // Permitir solicitudes desde el frontend
app.use(bodyParser.json()); // Procesar datos JSON en las solicitudes

// Conexión a la base de datos MySQL
const connection = mysql.createConnection({
  host: 'localhost', // Dirección del servidor de la base de datos
  user: 'root', // Cambia esto por tu usuario de MySQL
  password: 'macondo4324', // Cambia esto por tu contraseña de MySQL
  database: 'bd_rendicionesiasd' // Cambia esto por el nombre de tu base de datos
});

// Conectar a la base de datos
connection.connect((err) => {
  if (err) {
    console.error('Error conectando a la base de datos:', err);
  } else {
    console.log('Conectado a la base de datos MySQL');
  }
});

// Ruta de prueba
app.post('/login', (req, res) => {
  const { id_usuario, pass } = req.body;

  if (!id_usuario || !pass) {
      return res.status(400).json({ message: 'Rut y contraseña son requeridos' });
  }

  const query = 'SELECT * FROM usuario WHERE id_usuario = ? AND pass = ?';
  connection.query(query, [id_usuario, pass], (err, results) => {
      if (err) {
          return res.status(500).json({ message: 'Error en la base de datos' });
      }

      if (results.length > 0) {
          const user = results[0];  // Asumiendo que el primer resultado es el usuario correcto
          return res.status(200).json({
              message: 'Login exitoso',
              user: {
                  id_usuario: user.id_usuario,  // El id_usuario
                  nombre: user.nombre  // El nombre del usuario
              }
          });
      } else {
          return res.status(401).json({ message: 'Credenciales incorrectas' });
      }
  });
});


// Iniciar el servidor
app.listen(port, () => {
  console.log(`Servidor corriendo en http://localhost:${port}`);
});