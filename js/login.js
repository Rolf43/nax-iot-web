// Selección de elementos
const nameField = document.getElementById('nameField');
const emailField = document.getElementById('emailField');
const confirmPasswordField = document.getElementById('confirmPasswordField');
const submitButton = document.getElementById('submitButton');
const loginTab = document.getElementById('loginTab');
const registerTab = document.getElementById('registerTab');
const authForm = document.getElementById('authForm');
const authEmail = document.getElementById('authEmail');
const authPassword = document.getElementById('authPassword');
const registerName = document.getElementById('registerName');
const registerConfirmPassword = document.getElementById('registerConfirmPassword');
const Inaccion = document.getElementById('accion');

let isLoginMode = true; // Modo inicial: Iniciar Sesión

// Función para alternar entre Registro e Inicio de Sesión
function toggleForm(mode) {
    isLoginMode = (mode === 'login'); // Verificar si es modo Iniciar Sesión

    if (isLoginMode) {
        nameField.classList.add('hidden');
        confirmPasswordField.classList.add('hidden');
        submitButton.textContent = 'Iniciar Sesión';
        loginTab.classList.add('active-tab');
        loginTab.classList.remove('inactive-tab');
        registerTab.classList.add('inactive-tab');
        registerTab.classList.remove('active-tab');
        Inaccion.value = "logear";
    } else {
        nameField.classList.remove('hidden');
        confirmPasswordField.classList.remove('hidden');
        submitButton.textContent = 'Registrarse';
        loginTab.classList.add('inactive-tab');
        loginTab.classList.remove('active-tab');
        registerTab.classList.add('active-tab');
        registerTab.classList.remove('inactive-tab');
        Inaccion.value = "registrar";
    }
}

// Eventos de clic en las cabeceras
loginTab.addEventListener('click', function () {
    toggleForm('login');
});

registerTab.addEventListener('click', function () {
    toggleForm('register');
});

// Manejo del envío del formulario
$(document).ready(function () {
    $(".oculto").hide();
    $("#authForm").on("submit", async function (e) {
        e.preventDefault();

        // Verificar que estamos en el modo registro o login
        if (!isLoginMode) {
            // Obtener los valores de los campos de registro
            const username = registerName.value;
            const email = authEmail.value;
            const password = authPassword.value;
            const confirmPassword = registerConfirmPassword.value;

            // Validar que las contraseñas coincidan
            if (password !== confirmPassword) {
                alert("Las contraseñas no coinciden.");
                return;
            }

            try {
                // Realizar la solicitud POST para registrar al usuario
                const response = await fetch('https://nax-iot-api.onrender.com/api/users/register', {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                    },
                    body: JSON.stringify({
                        username,
                        email,
                        password
                    }),
                    console.log(body);
                });


                // Manejar la respuesta del backend
                const data = await response.json();

                if (response.ok) {
                    console.log('Usuario registrado:', data.msg);
                    // Aquí puedes redirigir al usuario o hacer algo con la respuesta
                } else {
                    console.error('Error:', data.msg);
                    alert(data.msg);
                }
            } catch (error) {
                console.error('Error enviando los datos:', error);
                alert('Hubo un error al procesar tu solicitud. Intenta nuevamente.');
            }

        } else {
            // Lógica de login como antes
            const email = authEmail.value;
            const password = authPassword.value;

            if (!email || !password) {
                alert("Por favor, ingresa tu correo y contraseña.");
                return;
            }

            try {
                const response = await fetch('http://192.168.1.4:5001/api/users/login', {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                    },
                    body: JSON.stringify({
                        email,
                        password
                    }),
                });

                const data = await response.json();

                if (response.ok) {
                    window.location.href = './pages/main.html';
                    console.log('Sesión Iniciada');
                    localStorage.setItem('authToken', data.token);
                } else {
                    console.error('Error:', data.msg);
                    alert(data.msg);
                }
            } catch (error) {
                console.error('Error enviando los datos:', error);
                alert('Hubo un error al procesar tu solicitud. Intenta nuevamente.');
            }
        }
    });
});

