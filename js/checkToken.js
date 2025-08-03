// Función para verificar si el token es válido
function checkToken() {
    const token = localStorage.getItem('authToken');  // O de donde lo tengas almacenado
    //console.log(token);
    if (!token) {
        // Si no hay token, redirige al inicio
        console.log("No hay token");
        window.location.href = '../index.html';  // Cambia la ruta según corresponda
        return;
    }

    // Verifica el token enviando una solicitud al backend para comprobar su validez
    fetch('http://192.168.1.4:5001/api/users/me', {
        method: 'GET',
        headers: {
            'Authorization': `Bearer ${token}`,
        }
    })
    .then(response => {
        if (!response.ok) {
            console.log("Token invalido");
            // Si la respuesta no es exitosa (por ejemplo, token inválido), redirige al inicio
            window.location.href = '../index.html';  // Cambia la ruta según corresponda
        }
    })
    .catch(error => {
        console.error('Error al verificar el token:', error);
        window.location.href = '../index.html';  // En caso de error, también redirige
    });
}
