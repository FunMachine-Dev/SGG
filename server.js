const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
const mysql = require('mysql2');

// Crear una instancia de Express
const app = express();
const port = 5000; // Puerto donde correrá el servidor

// Middleware
app.use(express.json()); // Middleware para manejar JSON
app.use(cors()); // Permitir solicitudes desde el frontend
app.use(bodyParser.json()); // Procesar datos JSON en las solicitudes

// Conexión a la base de datos MySQL
const connection = mysql.createConnection({
  host: 'localhost',
  user: 'root',
  password: 'macondo4324',
  database: 'bd_rendicionesiasd'
});

// Conectar a la base de datos
connection.connect((err) => {
  if (err) {
    console.error('Error conectando a la base de datos:', err);
  } else {
    console.log('Conectado a la base de datos MySQL');
  }
});

// Importar la función para enviar correos
const { sendEmail } = require('./scripts/sendMail.js');

app.post('/send-email', async (req, res) => {
  const { content, userCorreo } = req.body;

  try {
    const destinatarios = ['d.arriagadacampos@gmail.com', userCorreo]; // Correos separados por coma
    const response = await sendEmail(destinatarios, 'Información del Modal', content);
    res.json({ message: 'Correo enviado', response });
    window.location.href = 'enviar-reembolso.html';
  } catch (error) {
    res.status(500).json({ error: 'Error al enviar el correo', details: error });
  }
});

// Ruta de prueba para login
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
      const user = results[0];
      return res.status(200).json({
        message: 'Login exitoso',
        user: {
          id_usuario: user.id_usuario,
          nombre: user.nombre,
          correo: user.correo
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
