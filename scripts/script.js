

document.addEventListener('DOMContentLoaded', function () {

    //Mostrar contraseña
    var toggleButton = document.getElementById('togglePassword');
    if (toggleButton) {
        toggleButton.addEventListener('click', function () {
            var passwordInput = document.getElementById('pass');
            if (passwordInput.type === 'password') {
                passwordInput.type = 'text';
                toggleButton.textContent = 'Ocultar';
            } else {
                passwordInput.type = 'password';
                toggleButton.textContent = 'Mostrar';
            }
        });
    }



});