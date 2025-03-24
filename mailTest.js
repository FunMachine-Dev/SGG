const { sendEmail } = require('./scripts/sendMail.js');

// Capturar el contenido del modal
const modalContent = document.querySelector('.modal-body')?.innerHTML || '<p>No hay contenido en el modal</p>';


// Prueba de la función de envío de correo
sendEmail('fresiavive@gmail.com', 'Correo de prueba', modalContent)
  .then(response => {
    console.log('Correo enviado:', response);
  })
  .catch(error => {
    console.error('Error al enviar el correo:', error);
  });
