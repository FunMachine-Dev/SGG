document.addEventListener("DOMContentLoaded", function () {
    document.getElementById("logoutButton").addEventListener("click", function () {
        // Eliminar datos de usuario
        localStorage.clear();
        sessionStorage.clear();

        // Verificar si se eliminaron correctamente
        if (!localStorage.getItem("user") && sessionStorage.length === 0) {
            alert("Sesión cerrada exitosamente");
            window.location.href = "index.html"; // Redirige a la pantalla de inicio
        } else {
            alert("Error al cerrar sesión. Intenta nuevamente.");
        }
    });
});
