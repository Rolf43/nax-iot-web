$(document).ready(function(){
    $(".hidden").hide();
    let registros;
    const token = localStorage.getItem('authToken');
    $("#btnRegistrarActualizar").html("Registrar");

    function formatDate(dateString) {
        const date = new Date(dateString);
        return `${date.getDate()}/${date.getMonth() + 1}/${date.getFullYear()}`;
    }
    
    // Función para registrar un dispositivo
    $("#deviceForm").on("submit", function (e) {
        e.preventDefault();
        const deviceData = {
            deviceName: $("#deviceName").val(),
            deviceModel: $("#deviceModel").val(),
            patientName: $("#patientId").val(),
            deviceStatus: $("#deviceStatus").val(),
            registrationDate: $("#registrationDate").val(),
            lastCalibration: $("#lastCalibration").val()
        };
        console.log(deviceData);

        const accion = document.getElementById("accion").value;
        //console.log(accion);

        if (accion == "insertar"){
            fetch("https://nax-iot-api.onrender.com/api/devices/register", {
                method: "POST",
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`  // Incluye el token en el encabezado
                },
                body: JSON.stringify(deviceData)
            })
            .then(response => response.json())
            .then(data => {
                if (data.ok) {
                    alert(data.msg);
                    $("#deviceForm").trigger("reset");
                    buscarMostrar("", 10, 0);
                } else {
                    //alert("Ocurrió un problema, intente más tarde");
                }
                if (data.msg === "El dispositivo ya está registrado o el token es duplicado.") {
                    // Aquí podrías mostrar un mensaje de error si es necesario
                    alert('Error: El dispositivo ya está registrado.');
                } else {
                    // Si la respuesta es correcta, recarga la página
                    alert(data.msg);
                    $("#deviceForm").trigger("reset");
                    buscarMostrar("", 10, 0);
                    window.location.reload();
                }
            })
            .catch(error => {
                console.error("Error:", error);
            });
        }else if (accion == "actualizar"){
            console.log("Actualizar datos");
        }

        
    });

    // Función para buscar y mostrar los dispositivos registrados
    function buscarMostrar(dato = "", nroRegistros = 0, inicioRegistros = 0) {
        fetch(`https://nax-iot-api.onrender.com/api/devices/list?buscar=${dato}&nroReg=${nroRegistros}&inicioReg=${inicioRegistros}`, {
            method: "GET",
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${token}`  // Incluye el token en el encabezado
            }
        })
        .then(response => response.json())
        .then(respuesta => {
            registros = respuesta;
            console.log(registros);
            if (registros.ok) {
                let filasTabla = "";
                for (let i = 0; i < registros.data.length; i++) {
                    filasTabla += `
                        <tr>
                            <td class="id-column">${registros.data[i].apiToken}</td>
                            <td class="id-column">${registros.data[i].deviceName}</td>
                            <td class="id-column">${registros.data[i].deviceModel}</td>
                            <td class="id-column">${registros.data[i].patientName}</td>
                            <td class="id-column">${registros.data[i].deviceStatus}</td>
                            <td class="id-column">${formatDate(registros.data[i].registrationDate)}</td>
                            <td class="id-column">${formatDate(registros.data[i].lastCalibration)}</td>
                            <td>
                                <a class="btn btn-primary"><i class="fa-solid fa-pen-to-square edit" data-indice="${i}"></i></a>
                                <a class="btn btn-danger"><i class="fa-solid fa-trash del" data-indice="${i}"></i></a>
                            </td>
                        </tr>
                    `;
                }
                $("#resultados").html(filasTabla);
            } else {
                let filasTabla = `<td colspan= '6'>${registros.msg}</td>`;
                $("#resultados").html(filasTabla);
            }
        })
        .catch(error => {
            console.error("Error:", error);
        });
    }

    // Llamada inicial para mostrar dispositivos
    buscarMostrar("", 10, 0);

    // Función para editar un dispositivo
    $("#resultados").on("click", ".edit", function (e) {
        e.preventDefault();
        let indice = e.target.dataset.indice;
        $("#idDevice").val(registros.data[indice]._id);
        $("#accion").val("actualizar");
        $("#deviceName").val(registros.data[indice].deviceName);
        $("#deviceModel").val(registros.data[indice].deviceModel);
        $("#patientId").val(registros.data[indice].username);
        $("#deviceStatus").val(registros.data[indice].deviceStatus);
        $("#btnRegistrarActualizar").html("Actualizar");
    });

    // Función para eliminar un dispositivo
    $("#resultados").on("click", ".del", function (e) {
        e.preventDefault();
        let indice = e.target.dataset.indice;
        if (confirm("¿Estas seguro de que quieres eliminar este dispositivo?")) {
            console.log(`${registros.data[indice]._id}`);
            fetch(`http://192.168.1.4:5001/api/devices/${registros.data[indice]._id}`, {
                method: "DELETE",
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`  // Incluye el token en el encabezado
                }
            })
            .then(response => response.json())
            .then(respuesta => {
                if (respuesta.ok) {
                    alert(respuesta.msg);
                    buscarMostrar("", 10, 0);
                } else {
                    alert("Ocurrió un problema, intente más tarde");
                }
            })
            .catch(error => {
                console.error("Error:", error);
            });
        }
    });

    // Función de búsqueda de dispositivos
    $("#busqueda").on("submit", function (e) {
        e.preventDefault();
        let srch = $("#busq").val();
        buscarMostrar(srch, 10, 0);
    });
});
