// Función para cerrar sesión y añadir token a la blacklist
function logOut() {
    const token = localStorage.getItem('authToken');

    fetch('https://nax-iot-api.onrender.com/api/users/logout', {
        method: 'POST',
        headers: {
            'Authorization': `Bearer ${token}`  // Incluye el token en el encabezado
        }
    })
    .then(response => {
        if (response.ok) {
            console.log("Sesión cerrada");
             // Elimina el token del almacenamiento local
            localStorage.removeItem('authToken');  // O usa sessionStorage si lo guardas ahí
            // Si la respuesta no es exitosa (por ejemplo, token inválido), redirige al inicio
            window.location.href = '../index.html';  // Cambia la ruta según corresponda
        }
    })
    .catch(error => {
        console.error('Error al verificar el token:', error);
        window.location.href = '../index.html';  // En caso de error, también redirige
    });
}
