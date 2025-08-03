let fetchedData = [];

function fetchPatientData() {
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

    fetch(url, {
        method: 'GET',
        headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json'
        }
    })
    .then(response => response.json())
    .then(data => {
        fetchedData = data;
        updateCharts(data);
    })
    .catch(error => {
        console.error('Error:', error);
        alert('Hubo un problema al obtener los datos.');
    });
}

function downloadData(format) {
    if (fetchedData.length === 0) {
        alert('No hay datos para descargar.');
        return;
    }
    
    let fileUrl;
    switch (format) {
        case 'json':
            fileUrl = window.exportToJson(fetchedData);
            break;
        case 'csv':
            fileUrl = window.exportToCsv(fetchedData);
            break;
        case 'xml':
            fileUrl = window.exportToXml(fetchedData);
            break;
        default:
            return;
    }
    
    const a = document.createElement('a');
    a.href = fileUrl;
    a.download = `data.${format}`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
}
