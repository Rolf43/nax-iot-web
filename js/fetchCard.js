async function fetchPatientCard() {
    const patientName = document.getElementById('patientName').value;
    
    if (!patientName) {
        alert('Por favor, ingrese el nombre del paciente.');
        return;
    }

    const token = localStorage.getItem('authToken');
    if (!token) {
        alert('No hay token de autenticación. Inicie sesión nuevamente.');
        return;
    }

    const url = `http://192.168.1.4:5001/api/records/data?name=${encodeURIComponent(patientName)}`;

    try {
        const response = await fetch(url, {
            method: 'GET',
            headers: {
                'Authorization': `Bearer ${token}`,
                'Content-Type': 'application/json'
            }
        });
        
        if (!response.ok) {
            throw new Error('Error al obtener los datos del paciente.');
        }

        const data = await response.json();
        updateCards(data);
    } catch (error) {
        console.error('Error:', error);
        alert('Hubo un problema al obtener los datos.');
    }
}

function formatDate(dateString) {
    const date = new Date(dateString);

    // Extraer los valores de fecha y hora
    const day = date.getDate();
    const month = date.getMonth() + 1; // Se suma 1 porque los meses comienzan desde 0
    const year = date.getFullYear();
    const hours = date.getHours();
    const minutes = date.getMinutes();
    const seconds = date.getSeconds();

    // Formatear con dos dígitos si es necesario
    const formattedDay = day.toString().padStart(2, '0');
    const formattedMonth = month.toString().padStart(2, '0');
    const formattedHours = hours.toString().padStart(2, '0');
    const formattedMinutes = minutes.toString().padStart(2, '0');
    const formattedSeconds = seconds.toString().padStart(2, '0');

    return `${formattedDay}/${formattedMonth}/${year} ${formattedHours}:${formattedMinutes}:${formattedSeconds}`;
}

function updateCards(data) {
    if (data.length > 1) {
        data = data.slice(-1); // Obtener el último registro
    }

    document.getElementById("bpm").innerHTML=`${data[0].bpm}<small class="text-muted"> bpm</small>`;
    document.getElementById("Spo2").innerHTML=`${data[0].spo2}<small class="text-muted"> %SpO2</small>`;
    document.getElementById("Temp").innerHTML=`${data[0].temp}<small class="text-muted"> °C</small>`;
    document.getElementById("PresS").innerHTML=`${data[0].p_sys}<small class="text-muted"> %SpO2</small>`;
    document.getElementById("PresD").innerHTML=`${data[0].p_dia}<small class="text-muted"> bpm</small>`;

    document.getElementById("bpmT").innerHTML=`${formatDate(data[0].recordedAt)}`;
    document.getElementById("Spo2T").innerHTML=`${formatDate(data[0].recordedAt)}`;
    document.getElementById("TempT").innerHTML=`${formatDate(data[0].recordedAt)}`;
    document.getElementById("PresST").innerHTML=`${formatDate(data[0].recordedAt)}`;
    document.getElementById("PresDT").innerHTML=`${formatDate(data[0].recordedAt)}`;

    const st = data[0].status;

    if(st === "Normal"){
        document.getElementById("iest").innerHTML='<p class="text-success">Normal</p>';
        document.getElementById("iconST").innerHTML='<i class="fas fa-circle-check fa-3x text-success"></i>';
        document.getElementById("alertType").innerHTML=`<a class="text-success">${data[0].alertType}</a>`;
    } else if (st === "High"){
        document.getElementById("iest").innerHTML='<p class="text-warning">Alterado</p>';
        document.getElementById("iconST").innerHTML='<i class="fas fa-circle-exclamation fa-3x text-warning"></i>';
        document.getElementById("alertType").innerHTML=`<a class="text-warning">${data[0].alertType}</a>`;
    } else if(st === "Critical"){
        document.getElementById("iest").innerHTML='<p class="text-danger">Crítico</p>';
        document.getElementById("iconST").innerHTML='<i class="fas fa-triangle-exclamation fa-3x text-danger"></i>';
        document.getElementById("alertType").innerHTML=`<p class="text-danger">${data[0].alertType}</p>`;
    }

}