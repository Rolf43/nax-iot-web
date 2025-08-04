$(document).ready(function(){
    $(".hidden").hide();
    let registros;
    const token = localStorage.getItem('authToken');
    $("#btnRegistrarActualizar").html("Registrar");

    // Función para registrar un paciente
    $("#patientForm").on("submit", function (e) {
        e.preventDefault();
        let formData = new FormData(this);
        let file = $("#patientPic")[0].files[0];

        if (file) {
            let reader = new FileReader();
            reader.readAsDataURL(file);
            reader.onload = function () {
                let patientData = {
                    patientName: $("#patientName").val(),
                    age: $("#patientAge").val(),
                    height: $("#patientHeight").val(),
                    weight: $("#patientWeight").val(),
                    gender: $("#patientGender").val(),
                    imagenBase64: reader.result,
                    imagenName: file.name
                };
                enviarPaciente(patientData);
            };
        } else {
            let patientData = {
                patientName: $("#patientName").val(),
                age: $("#patientAge").val(),
                height: $("#patientHeight").val(),
                weight: $("#patientWeight").val(),
                gender: $("#patientGender").val()
            };
            enviarPaciente(patientData);
        }
    });

    function enviarPaciente(patientData) {
        let accion = $("#accion").val();
        let url = "https://nax-iot-api.onrender.com/api/patients/register";
        let method = "POST";

        if (accion === "actualizar") {
            url = `https://nax-iot-api.onrender.com/api/patients/update/${$("#idPatient").val()}`;
            method = "PUT";
        }

        fetch(url, {
            method: method,
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${token}`
            },
            body: JSON.stringify(patientData)
        })
        .then(response => response.json())
        .then(data => {
            alert(data.msg);
            $("#patientForm").trigger("reset");
            buscarMostrar("", 10, 0);
        })
        .catch(error => {
            console.error("Error:", error);
        });
    }

    // Función para buscar y mostrar los pacientes registrados
    function buscarMostrar(dato = "", nroRegistros = 0, inicioRegistros = 0) {
        fetch(`https://nax-iot-api.onrender.com/api/patients/list?buscar=${dato}&nroReg=${nroRegistros}&inicioReg=${inicioRegistros}`, {
            method: "GET",
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${token}`
            }
        })
        .then(response => response.json())
        .then(respuesta => {
            registros = respuesta;
            console.log(registros);
            let filasTabla = "";
            registros.data.forEach((paciente, i) => {
                let avatar = paciente.imagen.length > 0 ? paciente.imagen[0].imagenBase64 : "../img/default.png";
                filasTabla += `
                    <tr>
                        <td class="id-column">${paciente._id}</td>
                        <td class="id-column">${paciente.patientName}</td>
                        <td class="id-column">${paciente.age}</td>
                        <td class="id-column">${paciente.height}</td>
                        <td class="id-column">${paciente.weight}</td>
                        <td class="id-column">${paciente.gender}</td>
                        <td class="id-column">
                            <img src="${avatar}" class="img-thumbnail" style="width: 80px">
                        </td>
                        <td class="id-column">
                            <a class="btn btn-primary"><i class="fa-solid fa-pen-to-square edit" data-indice="${i}"></i></a>
                            <a class="btn btn-danger"><i class="fa-solid fa-trash del" data-indice="${i}"></i></a>
                        </td>
                    </tr>`;
            });
            $("#resultadosPacientes").html(filasTabla);
        })
        .catch(error => {
            console.error("Error:", error);
        });
    }

    buscarMostrar("", 10, 0);

    // Editar paciente
    $("#resultadosPacientes").on("click", ".edit", function (e) {
        e.preventDefault();
        let indice = e.target.dataset.indice;
        let paciente = registros.data[indice];
        $("#idPatient").val(paciente._id);
        $("#accion").val("actualizar");
        $("#patientName").val(paciente.patientName);
        $("#patientAge").val(paciente.age);
        $("#patientHeight").val(paciente.height);
        $("#patientWeight").val(paciente.weight);
        $("#patientGender").val(paciente.gender);
        $("#btnRegistrarActualizar").html("Actualizar");
    });

    // Eliminar paciente
    $("#resultadosPacientes").on("click", ".del", function (e) {
        e.preventDefault();
        let indice = e.target.dataset.indice;
        let idPaciente = registros.data[indice]._id;

        if (confirm("¿Estás seguro de que quieres eliminar este paciente?")) {
            fetch(`https://nax-iot-api.onrender.com/api/patients/${idPaciente}`, {
                method: "DELETE",
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`
                }
            })
            .then(response => response.json())
            .then(respuesta => {
                alert(respuesta.msg);
                buscarMostrar("", 10, 0);
            })
            .catch(error => {
                console.error("Error:", error);
            });
        }
    });

    $("#busqueda").on("submit", function (e) {
        e.preventDefault();
        let srch = $("#busq").val();
        buscarMostrar(srch, 10, 0);
    });
});
