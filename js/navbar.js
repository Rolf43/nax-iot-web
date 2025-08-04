// Función para obtener los detalles del usuario y actualizar la navbar
function actualizarNavbarConUsuario(token) {
    fetch('https://nax-iot-api.onrender.com/api/users/me', {
        method: 'GET',
        headers: {
            'Authorization': `Bearer ${token}`  // Incluye el token en el encabezado
        }
    })
    .then(response => response.json())
    .then(user => {
        // Aquí puedes usar los datos del usuario (por ejemplo, su nombre) en la navbar
        const navbarUserElement = document.getElementById('navbar-user');
        if (navbarUserElement) {
            navbarUserElement.textContent = `${user}`;  // Suponiendo que el nombre está en 'user.name'
        }
    })
    .catch(error => console.error('Error al obtener los datos del usuario:', error));
}
