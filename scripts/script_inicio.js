document.getElementById("logoutButton").addEventListener("click", function () {
    localStorage.removeItem("user"); // Borra datos del usuario almacenado
    sessionStorage.clear(); // Borra toda la sesión (si se usó)
    window.location.href = "index.html"; // Redirige a la pantalla de inicio
    alert("Sesión cerrada exitosamente");
});

//recupera el nombre del usuario luego de iniciar sesión
window.onload = function() {
    const userName = localStorage.getItem('userName'); 
    const userId = localStorage.getItem('userId'); // Recuperamos el nombre del usuario
    if (userName) {
        document.getElementById('userName').innerText = userName;  // Asignamos solo el nombre al span
        document.getElementById('userId').innerText = userId;
    } else {
        window.location.href = "index.html"; // Redirigimos al login si no hay nombre guardado
    }
}

