

document.addEventListener('DOMContentLoaded', function () {



    // Iniciar sesión
    document.getElementById("login").addEventListener("submit", async function (event) {
        event.preventDefault(); // Evita que la página se recargue

        const id_usuario = document.getElementById("rutUsuario").value;
        const pass = document.getElementById("pass").value;

        const response = await fetch("http://localhost:5000/login", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ id_usuario, pass })
        });

        const data = await response.json();
        document.getElementById("responseMessage").innerText = data.message;

        if (response.status === 200) {
            // Guardar el nombre del usuario en localStorage
            localStorage.setItem('userName', data.user.nombre);
            localStorage.setItem('userId', data.user.id_usuario); // Guardar el id_usuario
            localStorage.setItem('userCorreo', data.user.correo); // Guardar el correo del usuario
            window.location.href = "/inicio.html"; // Redirigir solo si el login es exitoso
        } else {
            document.getElementById("responseMessage").innerText = data.message;
        }
    });


    // Mostrar/ocultar contraseña
    document.getElementById("togglePassword").addEventListener("click", function () {
        const passInput = document.getElementById("pass");
        passInput.type = passInput.type === "password" ? "text" : "password";
    });



});